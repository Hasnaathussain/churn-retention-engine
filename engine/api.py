from __future__ import annotations

from typing import Any

import stripe
from fastapi import APIRouter, Depends, Header, HTTPException, Request

from config import API_PREFIX, stripe_webhook_secret
from dependencies import (
    get_workspace_context,
    require_owner_context,
    workspace_context_from_metadata,
)
from schemas import (
    Account,
    ApiMessage,
    Campaign,
    CheckoutSessionResponse,
    DashboardSummary,
    IntegrationStatus,
    Playbook,
    PortalSessionResponse,
    RiskAssessment,
    TimelineEvent,
    WorkspaceContext,
)
from services import (
    build_dashboard_summary,
    create_checkout_session,
    create_portal_session,
    deploy_campaign,
    generate_campaign,
    get_account,
    get_account_timeline,
    get_integration_status,
    list_accounts,
    list_playbooks,
    score_account,
    handle_stripe_event,
)

router = APIRouter(prefix=API_PREFIX, tags=["workspace"])


def _event_payload(obj: Any) -> dict[str, Any]:
    if obj is None:
        return {}
    if hasattr(obj, "model_dump"):
        try:
            return obj.model_dump()
        except Exception:
            pass
    if hasattr(obj, "to_dict"):
        try:
            return obj.to_dict()
        except Exception:
            pass

    payload: dict[str, Any] = {}
    for key in (
        "id",
        "customer",
        "subscription",
        "status",
        "current_period_end",
        "metadata",
        "client_reference_id",
    ):
        value = getattr(obj, key, None)
        if value is None:
            continue
        if key == "metadata" and hasattr(value, "items"):
            payload[key] = dict(value)
        else:
            payload[key] = value
    return payload


def _metadata_from_payload(payload: dict[str, Any]) -> dict[str, Any]:
    metadata = payload.get("metadata")
    if isinstance(metadata, dict):
        return metadata
    if isinstance(metadata, str):
        return {"workspace_id": metadata}
    return {}


@router.get("/health")
def health_check() -> dict[str, str]:
    return {
        "status": "healthy",
        "service": "Synapse Churn Retention Engine",
    }


@router.get("/dashboard/summary", response_model=DashboardSummary)
def dashboard_summary(context: WorkspaceContext = Depends(get_workspace_context)):
    return build_dashboard_summary(context)


@router.get("/accounts", response_model=list[Account])
def accounts(context: WorkspaceContext = Depends(get_workspace_context)):
    return list_accounts(context)


@router.get("/accounts/{account_id}", response_model=Account)
def account_detail(account_id: str, context: WorkspaceContext = Depends(get_workspace_context)):
    try:
        return get_account(context, account_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail="Account not found") from exc


@router.get("/accounts/{account_id}/timeline", response_model=list[TimelineEvent])
def account_timeline(
    account_id: str,
    context: WorkspaceContext = Depends(get_workspace_context),
):
    try:
        return get_account_timeline(context, account_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail="Account not found") from exc


@router.post("/accounts/{account_id}/score", response_model=RiskAssessment)
def score_account_route(
    account_id: str,
    context: WorkspaceContext = Depends(get_workspace_context),
):
    try:
        return score_account(context, account_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail="Account not found") from exc


@router.post("/accounts/{account_id}/campaigns/generate", response_model=Campaign)
def generate_campaign_route(
    account_id: str,
    context: WorkspaceContext = Depends(get_workspace_context),
):
    try:
        return generate_campaign(context, account_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail="Account not found") from exc


@router.post("/campaigns/{campaign_id}/deploy", response_model=Campaign)
def deploy_campaign_route(
    campaign_id: str,
    context: WorkspaceContext = Depends(get_workspace_context),
):
    try:
        return deploy_campaign(context, campaign_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail="Campaign not found") from exc


@router.get("/playbooks", response_model=list[Playbook])
def playbooks(context: WorkspaceContext = Depends(get_workspace_context)):
    return list_playbooks(context)


@router.get("/integrations/status", response_model=list[IntegrationStatus])
def integrations_status(context: WorkspaceContext = Depends(get_workspace_context)):
    return get_integration_status(context)


@router.post("/billing/checkout-session", response_model=CheckoutSessionResponse)
def billing_checkout(context: WorkspaceContext = Depends(get_workspace_context)):
    require_owner_context(context)
    return CheckoutSessionResponse(**create_checkout_session(context))


@router.post("/billing/portal-session", response_model=PortalSessionResponse)
def billing_portal(context: WorkspaceContext = Depends(get_workspace_context)):
    require_owner_context(context)
    return PortalSessionResponse(**create_portal_session(context))


async def process_stripe_webhook(request: Request, stripe_signature: str | None = None):
    secret = stripe_webhook_secret()
    if not secret:
        return ApiMessage(status="ignored", reason="No webhook secret configured")

    payload = await request.body()

    try:
        event = stripe.Webhook.construct_event(payload, stripe_signature, secret)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid payload") from exc
    except stripe.error.SignatureVerificationError as exc:
        raise HTTPException(status_code=400, detail="Invalid signature") from exc

    event_payload = _event_payload(getattr(event.data, "object", None))
    context = workspace_context_from_metadata(
        _metadata_from_payload(event_payload)
        | {
            "workspace_id": event_payload.get("workspace_id")
            or event_payload.get("client_reference_id")
            or _metadata_from_payload(event_payload).get("workspace_id"),
            "workspace_name": _metadata_from_payload(event_payload).get("workspace_name"),
        }
    )
    handle_stripe_event(context, event.type, event_payload)

    return ApiMessage(status="success")


@router.post("/webhooks/stripe")
async def stripe_webhook(
    request: Request,
    stripe_signature: str | None = Header(default=None, alias="Stripe-Signature"),
):
    return await process_stripe_webhook(request, stripe_signature)
