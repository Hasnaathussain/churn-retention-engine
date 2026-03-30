from __future__ import annotations

from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from fastapi import APIRouter, Cookie, Depends, Header, HTTPException, Query, Request, Response
from pydantic import BaseModel, Field

from auth_store import (
    authenticate_user,
    decode_access_token,
    issue_email_verification,
    issue_password_reset,
    list_user_sessions,
    memberships_for_user,
    refresh_access,
    resend_email_verification,
    revoke_all_sessions,
    revoke_session,
    seed_auth_store,
    signup_user,
    switch_organization,
    validate_api_key,
    verify_email_token,
    reset_password as perform_password_reset,
)
from config import PUBLIC_API_PREFIX, app_env, secure_cookies
from schemas import Account, TimelineEvent, WorkspaceContext
from services import (
    build_dashboard_summary,
    get_account,
    get_account_timeline,
    list_accounts,
    score_account,
)
from state import get_workspace_state

router = APIRouter(prefix=PUBLIC_API_PREFIX, tags=["platform"])
seed_auth_store()

REGISTERED_WEBHOOKS: dict[str, list[dict[str, Any]]] = {
    "org_demo_anchoryn": [
        {
            "id": "wh_01",
            "url": "https://hooks.slack.com/services/anchoryn-demo",
            "events": ["customer.risk_changed", "report.completed"],
            "status": "active",
            "last_triggered_at": "Today, 09:14",
        }
    ]
}
RATE_LIMIT_BUCKETS: dict[str, dict[str, Any]] = {}


class AuthLoginRequest(BaseModel):
    email: str
    password: str
    rememberMe: bool = True


class AuthSignupRequest(BaseModel):
    name: str
    company: str
    email: str
    password: str
    confirmPassword: str


class EmailRequest(BaseModel):
    email: str


class PasswordResetRequest(BaseModel):
    token: str
    password: str
    confirmPassword: str


class VerificationRequest(BaseModel):
    token: str


class SwitchOrganizationRequest(BaseModel):
    organizationId: str


class CustomerUpsertRequest(BaseModel):
    external_id: str | None = None
    name: str
    email: str
    company: str
    plan: str
    mrr: float = 0
    status: str = "active"
    tags: list[str] = Field(default_factory=list)


class EventCreateRequest(BaseModel):
    event_type: str
    event_data: dict[str, Any] = Field(default_factory=dict)


class WebhookCreateRequest(BaseModel):
    url: str
    events: list[str]


def envelope(data: Any, meta: dict[str, Any] | None = None) -> dict[str, Any]:
    return {
        "success": True,
        "data": data,
        "meta": meta or {},
    }


def _token_preview_payload(status: str, token: str, key: str) -> dict[str, Any]:
    payload: dict[str, Any] = {"status": status}
    if app_env() != "production":
        payload[key] = token
    return payload


def set_auth_cookies(response: Response, access_token: str, refresh_token: str, expires_at: datetime) -> None:
    response.set_cookie(
        "anchoryn_access_token",
        access_token,
        httponly=True,
        samesite="lax",
        secure=secure_cookies(),
        path="/",
        expires=expires_at,
    )
    response.set_cookie(
        "anchoryn_refresh_token",
        refresh_token,
        httponly=True,
        samesite="lax",
        secure=secure_cookies(),
        path="/",
        expires=expires_at,
    )


def clear_auth_cookies(response: Response) -> None:
    for name in ("anchoryn_access_token", "anchoryn_refresh_token"):
        response.set_cookie(
            name,
            "",
            httponly=True,
            samesite="lax",
            secure=secure_cookies(),
            path="/",
            max_age=0,
        )


def _workspace_context_from_claims(claims: dict[str, Any]) -> WorkspaceContext:
    role = "owner" if claims.get("role") in {"owner", "admin"} else "member"
    return WorkspaceContext(
        workspaceId=claims["organization_id"],
        workspaceName=claims["organization_name"],
        role=role,
        mode=claims.get("mode", "live"),
        userEmail=claims.get("email"),
    )


def _current_claims(
    authorization: str | None = Header(default=None, alias="Authorization"),
    access_cookie: str | None = Cookie(default=None, alias="anchoryn_access_token"),
) -> dict[str, Any]:
    token = access_cookie
    if authorization and authorization.startswith("Bearer "):
        bearer = authorization.split(" ", 1)[1]
        if bearer.startswith("ank_"):
            api_key = validate_api_key(bearer)
            return {
                "sub": "api-key",
                "organization_id": api_key["organization_id"],
                "organization_name": "Anchoryn Launch Preview",
                "role": "owner",
                "mode": "live",
                "email": None,
                "plan": api_key["plan"],
            }
        token = bearer

    if not token:
        raise HTTPException(status_code=401, detail="Authentication required.")

    return decode_access_token(token)


def _rate_limit(response: Response, bucket_id: str, limit: int, window_seconds: int) -> None:
    now = datetime.now(timezone.utc).timestamp()
    bucket = RATE_LIMIT_BUCKETS.get(bucket_id)
    if not bucket or now >= bucket["reset"]:
        bucket = {"count": 0, "reset": now + window_seconds}
    if bucket["count"] >= limit:
        raise HTTPException(status_code=429, detail="Rate limit exceeded.")
    bucket["count"] += 1
    RATE_LIMIT_BUCKETS[bucket_id] = bucket
    response.headers["X-RateLimit-Limit"] = str(limit)
    response.headers["X-RateLimit-Remaining"] = str(max(0, limit - bucket["count"]))
    response.headers["X-RateLimit-Reset"] = str(int(bucket["reset"]))


@router.post("/auth/signup")
def auth_signup(payload: AuthSignupRequest):
    if payload.password != payload.confirmPassword:
        raise HTTPException(status_code=422, detail="Passwords do not match.")
    data = signup_user(payload.name, payload.company, payload.email, payload.password)
    return envelope(data)


@router.post("/auth/login")
def auth_login(payload: AuthLoginRequest, request: Request, response: Response):
    data = authenticate_user(
        payload.email,
        payload.password,
        request.client.host if request.client else "unknown",
        request.headers.get("user-agent", "Browser"),
        payload.rememberMe,
    )
    set_auth_cookies(response, data["access_token"], data["refresh_token"], data["expires_at"])
    memberships = memberships_for_user(data["user"].id)
    primary_membership = memberships[0] if memberships else None
    return envelope(
        {
            "organizationId": data["membership"].organization_id,
            "organizationName": primary_membership["organizationName"]
            if primary_membership
            else data["membership"].organization_id,
            "role": data["membership"].role,
            "email": data["user"].email,
            "memberships": memberships,
        }
    )


@router.post("/auth/logout")
def auth_logout(response: Response):
    clear_auth_cookies(response)
    return envelope({"status": "logged_out"})


@router.post("/auth/refresh")
def auth_refresh(
    response: Response,
    refresh_cookie: str | None = Cookie(default=None, alias="anchoryn_refresh_token"),
):
    if not refresh_cookie:
        raise HTTPException(status_code=401, detail="Refresh token is missing.")
    data = refresh_access(refresh_cookie)
    set_auth_cookies(response, data["access_token"], data["refresh_token"], data["expires_at"])
    return envelope({"status": "refreshed"})


@router.post("/auth/forgot-password")
def auth_forgot_password(payload: EmailRequest):
    token = issue_password_reset(payload.email)
    return envelope(_token_preview_payload("sent", token, "previewToken"))


@router.post("/auth/reset-password")
def auth_reset_password(payload: PasswordResetRequest):
    if payload.password != payload.confirmPassword:
        raise HTTPException(status_code=422, detail="Passwords do not match.")
    perform_password_reset(payload.token, payload.password)
    return envelope({"status": "password_updated"})


@router.post("/auth/verify-email")
def auth_verify_email(payload: VerificationRequest):
    verify_email_token(payload.token)
    return envelope({"status": "verified"})


@router.post("/auth/resend-verification")
def auth_resend_verification(payload: EmailRequest):
    token = resend_email_verification(payload.email)
    return envelope(_token_preview_payload("resent", token, "previewToken"))


@router.get("/auth/oauth/{provider}")
def auth_oauth(provider: str, next: str = Query(default="/app/dashboard")):
    return envelope(
        {
            "status": "unconfigured",
            "provider": provider,
            "next": next,
            "message": f"{provider.capitalize()} OAuth is ready for environment-specific credentials.",
        }
    )


@router.get("/auth/oauth/{provider}/callback")
def auth_oauth_callback(provider: str):
    return envelope({"status": "callback_received", "provider": provider})


@router.get("/auth/sessions")
def auth_sessions(claims: dict[str, Any] = Depends(_current_claims)):
    return envelope(list_user_sessions(claims["sub"]))


@router.delete("/auth/sessions/{session_id}")
def auth_revoke_session(session_id: str, claims: dict[str, Any] = Depends(_current_claims)):
    revoke_session(claims["sub"], session_id)
    return envelope({"status": "revoked"})


@router.post("/auth/sessions/revoke-all")
def auth_revoke_all(claims: dict[str, Any] = Depends(_current_claims)):
    revoke_all_sessions(claims["sub"])
    return envelope({"status": "revoked_all"})


@router.post("/organizations/switch")
def organization_switch(
    payload: SwitchOrganizationRequest,
    response: Response,
    claims: dict[str, Any] = Depends(_current_claims),
):
    data = switch_organization(claims["sub"], payload.organizationId)
    response.set_cookie(
        "anchoryn_access_token",
        data["access_token"],
        httponly=True,
        samesite="lax",
        secure=secure_cookies(),
        path="/",
    )
    return envelope({"organizationId": payload.organizationId})


@router.post("/customers")
def create_customer(
    payload: CustomerUpsertRequest,
    claims: dict[str, Any] = Depends(_current_claims),
):
    context = _workspace_context_from_claims(claims)
    state = get_workspace_state(context.workspaceId, context.workspaceName, context.mode)
    new_customer = Account(
        id=f"cus_{uuid4().hex[:10]}",
        workspaceId=context.workspaceId,
        name=payload.name,
        domain=payload.company.lower().replace(" ", "-") + ".com",
        plan=payload.plan,
        owner=claims.get("name") or "Anchoryn Operator",
        mrr=payload.mrr,
        churnProbability=0.18,
        healthScore=88,
        status="stable",
        lastActive="Just now",
        lastLoginDaysAgo=0,
        supportTickets=0,
        usageFrequency=12,
        primaryRisk="New account awaiting richer signal history.",
        recommendedAction="Monitor initial activation",
        tags=payload.tags,
        drivers=[{"label": "New account", "value": "No risk history yet"}],
        trend=[],
    )
    state.accounts.append(new_customer)
    return envelope(new_customer.model_dump())


@router.get("/customers")
def customers_list(
    response: Response,
    claims: dict[str, Any] = Depends(_current_claims),
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
):
    _rate_limit(response, f"customers:{claims['organization_id']}", 1000, 3600)
    context = _workspace_context_from_claims(claims)
    rows = [customer.model_dump() for customer in list_accounts(context)]
    sliced = rows[offset : offset + limit]
    return envelope(sliced, {"page": offset // limit + 1, "limit": limit, "total": len(rows)})


@router.get("/customers/{customer_id}")
def customer_detail(customer_id: str, claims: dict[str, Any] = Depends(_current_claims)):
    context = _workspace_context_from_claims(claims)
    account = get_account(context, customer_id)
    return envelope(account.model_dump())


@router.patch("/customers/{customer_id}")
def customer_update(
    customer_id: str,
    payload: dict[str, Any],
    claims: dict[str, Any] = Depends(_current_claims),
):
    context = _workspace_context_from_claims(claims)
    state = get_workspace_state(context.workspaceId, context.workspaceName, context.mode)
    target = next((account for account in state.accounts if account.id == customer_id), None)
    if not target:
        raise HTTPException(status_code=404, detail="Customer not found.")
    for field, value in payload.items():
        if hasattr(target, field):
            setattr(target, field, value)
    return envelope(target.model_dump())


@router.delete("/customers/{customer_id}")
def customer_delete(customer_id: str, claims: dict[str, Any] = Depends(_current_claims)):
    context = _workspace_context_from_claims(claims)
    state = get_workspace_state(context.workspaceId, context.workspaceName, context.mode)
    state.accounts = [account for account in state.accounts if account.id != customer_id]
    return envelope({"status": "deleted"})


@router.post("/customers/{customer_id}/events")
def customer_event_create(
    customer_id: str,
    payload: EventCreateRequest,
    claims: dict[str, Any] = Depends(_current_claims),
):
    context = _workspace_context_from_claims(claims)
    state = get_workspace_state(context.workspaceId, context.workspaceName, context.mode)
    state.timeline.setdefault(customer_id, []).insert(
        0,
        TimelineEvent(
            id=f"evt_{uuid4().hex[:10]}",
            accountId=customer_id,
            title=payload.event_type.replace("_", " ").title(),
            description=str(payload.event_data or "Event recorded"),
            kind="product",
            timestamp=datetime.now(timezone.utc).isoformat(timespec="seconds"),
            channel="API",
        ),
    )
    return envelope({"status": "recorded"})


@router.get("/customers/{customer_id}/events")
def customer_event_list(customer_id: str, claims: dict[str, Any] = Depends(_current_claims)):
    context = _workspace_context_from_claims(claims)
    events = get_account_timeline(context, customer_id)
    return envelope([event.model_dump() for event in events])


@router.get("/customers/{customer_id}/prediction")
def customer_prediction(customer_id: str, claims: dict[str, Any] = Depends(_current_claims)):
    context = _workspace_context_from_claims(claims)
    assessment = score_account(context, customer_id)
    return envelope(assessment.model_dump())


@router.post("/customers/{customer_id}/predict")
def customer_predict(customer_id: str, claims: dict[str, Any] = Depends(_current_claims)):
    context = _workspace_context_from_claims(claims)
    assessment = score_account(context, customer_id)
    return envelope(assessment.model_dump())


@router.get("/reports/churn-summary")
def report_churn_summary(claims: dict[str, Any] = Depends(_current_claims)):
    context = _workspace_context_from_claims(claims)
    summary = build_dashboard_summary(context)
    return envelope(
        {
            "monthlyRevenue": summary.monthlyRevenue,
            "revenueAtRisk": summary.revenueAtRisk,
            "highRiskAccounts": summary.highRiskAccounts,
            "retentionsSaved": summary.retentionsSaved,
        }
    )


@router.get("/reports/at-risk")
def report_at_risk(claims: dict[str, Any] = Depends(_current_claims)):
    context = _workspace_context_from_claims(claims)
    rows = [account.model_dump() for account in list_accounts(context) if account.churnProbability >= 0.6]
    return envelope(rows, {"total": len(rows)})


@router.get("/reports/revenue-impact")
def report_revenue_impact(claims: dict[str, Any] = Depends(_current_claims)):
    context = _workspace_context_from_claims(claims)
    summary = build_dashboard_summary(context)
    return envelope({"revenueAtRisk": summary.revenueAtRisk})


@router.post("/webhooks")
def create_webhook(payload: WebhookCreateRequest, claims: dict[str, Any] = Depends(_current_claims)):
    org_id = claims["organization_id"]
    entry = {
        "id": f"wh_{uuid4().hex[:10]}",
        "url": payload.url,
        "events": payload.events,
        "status": "active",
        "last_triggered_at": "Never",
    }
    REGISTERED_WEBHOOKS.setdefault(org_id, []).append(entry)
    return envelope(entry)


@router.get("/webhooks")
def list_webhooks(claims: dict[str, Any] = Depends(_current_claims)):
    org_id = claims["organization_id"]
    return envelope(REGISTERED_WEBHOOKS.get(org_id, []))


@router.delete("/webhooks/{webhook_id}")
def delete_webhook(webhook_id: str, claims: dict[str, Any] = Depends(_current_claims)):
    org_id = claims["organization_id"]
    REGISTERED_WEBHOOKS[org_id] = [
        webhook for webhook in REGISTERED_WEBHOOKS.get(org_id, []) if webhook["id"] != webhook_id
    ]
    return envelope({"status": "deleted"})
