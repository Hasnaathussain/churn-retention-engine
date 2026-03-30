from __future__ import annotations

import hashlib
import re
import secrets
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Any
from uuid import uuid4

import jwt
from argon2 import PasswordHasher
from fastapi import HTTPException

from config import (
    access_token_minutes,
    auth_jwt_secret,
    refresh_token_days,
    remember_me_days,
)

UTC = timezone.utc
hasher = PasswordHasher()


@dataclass
class OrganizationRecord:
    id: str
    name: str
    slug: str
    plan: str


@dataclass
class UserRecord:
    id: str
    email: str
    password_hash: str
    name: str
    email_verified: bool
    created_at: datetime
    timezone: str = "UTC"
    locale: str = "en"


@dataclass
class MembershipRecord:
    id: str
    user_id: str
    organization_id: str
    role: str
    is_default: bool = False


@dataclass
class SessionRecord:
    id: str
    user_id: str
    organization_id: str
    role: str
    refresh_token_hash: str
    device: str
    ip_address: str
    created_at: datetime
    expires_at: datetime
    revoked_at: datetime | None = None


ORGANIZATIONS: dict[str, OrganizationRecord] = {}
USERS: dict[str, UserRecord] = {}
MEMBERSHIPS: dict[str, list[MembershipRecord]] = {}
SESSIONS: dict[str, SessionRecord] = {}
RESET_TOKENS: dict[str, dict[str, Any]] = {}
VERIFICATION_TOKENS: dict[str, dict[str, Any]] = {}
API_KEYS: dict[str, dict[str, Any]] = {}
FAILED_LOGINS: dict[str, dict[str, Any]] = {}


def _now() -> datetime:
    return datetime.now(UTC)


def _slugify(value: str) -> str:
    return value.lower().replace(" ", "-")


def _hash_value(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def _lockout_key(email: str, ip_address: str) -> str:
    return f"{email.lower()}::{ip_address}"


def _validate_password_strength(password: str) -> None:
    checks = [
        (len(password) >= 8, "Use at least 8 characters."),
        (re.search(r"[A-Z]", password) is not None, "Add an uppercase letter."),
        (re.search(r"[a-z]", password) is not None, "Add a lowercase letter."),
        (re.search(r"[0-9]", password) is not None, "Add a number."),
        (re.search(r"[^A-Za-z0-9]", password) is not None, "Add a special character."),
    ]

    for passed, message in checks:
        if not passed:
            raise HTTPException(status_code=422, detail=message)


def _membership_payload(user: UserRecord, membership: MembershipRecord) -> dict[str, Any]:
    organization = ORGANIZATIONS[membership.organization_id]
    return {
      "sub": user.id,
      "email": user.email,
      "name": user.name,
      "organization_id": organization.id,
      "organization_name": organization.name,
      "organization_slug": organization.slug,
      "role": membership.role,
      "plan": organization.plan,
      "email_verified": user.email_verified,
      "timezone": user.timezone,
      "locale": user.locale,
      "mode": "live",
    }


def _encode_access_token(user: UserRecord, membership: MembershipRecord) -> str:
    payload = _membership_payload(user, membership)
    payload["exp"] = _now() + timedelta(minutes=access_token_minutes())
    return jwt.encode(payload, auth_jwt_secret(), algorithm="HS256")


def _create_session_tokens(
    user: UserRecord,
    membership: MembershipRecord,
    ip_address: str,
    user_agent: str,
    remember_me: bool,
) -> dict[str, Any]:
    access_token = _encode_access_token(user, membership)
    refresh_plain = secrets.token_urlsafe(48)
    session = SessionRecord(
        id=f"ses_{uuid4().hex[:12]}",
        user_id=user.id,
        organization_id=membership.organization_id,
        role=membership.role,
        refresh_token_hash=_hash_value(refresh_plain),
        device=user_agent or "Browser",
        ip_address=ip_address,
        created_at=_now(),
        expires_at=_now()
        + timedelta(days=remember_me_days() if remember_me else refresh_token_days()),
    )
    SESSIONS[session.id] = session
    return {
        "access_token": access_token,
        "refresh_token": refresh_plain,
        "user": user,
        "membership": membership,
        "expires_at": session.expires_at,
    }


def _default_membership(user_id: str) -> MembershipRecord:
    memberships = MEMBERSHIPS.get(user_id, [])
    if not memberships:
        raise HTTPException(status_code=403, detail="No organization memberships available.")

    default = next((membership for membership in memberships if membership.is_default), None)
    return default or memberships[0]


def seed_auth_store() -> None:
    if USERS:
        return

    org = OrganizationRecord(
        id="org_demo_anchoryn",
        name="Anchoryn Launch Preview",
        slug="launch-preview",
        plan="Growth",
    )
    ORGANIZATIONS[org.id] = org

    user = UserRecord(
        id="usr_demo_owner",
        email="operator@anchoryn.demo",
        password_hash=hasher.hash("Anchoryn!123"),
        name="Launch Preview",
        email_verified=True,
        created_at=_now(),
    )
    USERS[user.id] = user
    MEMBERSHIPS[user.id] = [
        MembershipRecord(
            id="mem_demo_owner",
            user_id=user.id,
            organization_id=org.id,
            role="owner",
            is_default=True,
        )
    ]

    api_key = "ank_live_demo_51f8b9c1"
    API_KEYS[_hash_value(api_key)] = {
        "id": "key_01",
        "name": "Launch preview public API key",
        "organization_id": org.id,
        "plan": "Scale",
        "raw": api_key,
    }


def signup_user(name: str, company: str, email: str, password: str) -> dict[str, Any]:
    seed_auth_store()
    _validate_password_strength(password)
    normalized = email.lower()
    if any(user.email.lower() == normalized for user in USERS.values()):
        raise HTTPException(
            status_code=409,
            detail="That email is already registered. Try signing in, or reset your password.",
        )

    organization = OrganizationRecord(
        id=f"org_{uuid4().hex[:12]}",
        name=company,
        slug=_slugify(company),
        plan="Starter",
    )
    ORGANIZATIONS[organization.id] = organization

    user = UserRecord(
        id=f"usr_{uuid4().hex[:12]}",
        email=normalized,
        password_hash=hasher.hash(password),
        name=name,
        email_verified=False,
        created_at=_now(),
    )
    USERS[user.id] = user
    MEMBERSHIPS[user.id] = [
        MembershipRecord(
            id=f"mem_{uuid4().hex[:12]}",
            user_id=user.id,
            organization_id=organization.id,
            role="owner",
            is_default=True,
        )
    ]

    issue_email_verification(user.id)
    return {"user_id": user.id, "organization_id": organization.id, "email": user.email}


def _enforce_lockout(email: str, ip_address: str) -> None:
    key = _lockout_key(email, ip_address)
    state = FAILED_LOGINS.get(key)
    if not state:
        return
    locked_until = state.get("locked_until")
    if locked_until and locked_until > _now():
        raise HTTPException(
            status_code=429,
            detail="Too many failed login attempts. Try again in 15 minutes.",
        )


def authenticate_user(
    email: str,
    password: str,
    ip_address: str,
    user_agent: str,
    remember_me: bool,
) -> dict[str, Any]:
    seed_auth_store()
    normalized = email.lower()
    _enforce_lockout(normalized, ip_address)

    user = next((item for item in USERS.values() if item.email.lower() == normalized), None)
    key = _lockout_key(normalized, ip_address)

    if not user:
        FAILED_LOGINS[key] = {"count": FAILED_LOGINS.get(key, {}).get("count", 0) + 1}
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    try:
        hasher.verify(user.password_hash, password)
    except Exception as exc:
        state = FAILED_LOGINS.get(key, {"count": 0})
        state["count"] += 1
        if state["count"] >= 5:
            state["locked_until"] = _now() + timedelta(minutes=15)
        FAILED_LOGINS[key] = state
        raise HTTPException(status_code=401, detail="Invalid email or password.") from exc

    if not user.email_verified:
        raise HTTPException(
            status_code=403,
            detail="Verify your email before accessing the workspace.",
        )

    FAILED_LOGINS.pop(key, None)
    membership = _default_membership(user.id)
    return _create_session_tokens(user, membership, ip_address, user_agent, remember_me)


def list_user_sessions(user_id: str) -> list[dict[str, Any]]:
    seed_auth_store()
    rows = []
    for session in SESSIONS.values():
        if session.user_id != user_id or session.revoked_at is not None:
            continue
        rows.append(
            {
                "id": session.id,
                "device": session.device,
                "location": session.ip_address,
                "last_active": session.created_at.isoformat(timespec="seconds"),
                "current": False,
            }
        )
    return rows


def revoke_session(user_id: str, session_id: str) -> None:
    session = SESSIONS.get(session_id)
    if not session or session.user_id != user_id:
        raise HTTPException(status_code=404, detail="Session not found.")
    session.revoked_at = _now()


def revoke_all_sessions(user_id: str) -> None:
    for session in SESSIONS.values():
        if session.user_id == user_id:
            session.revoked_at = _now()


def issue_password_reset(email: str) -> str:
    seed_auth_store()
    user = next((item for item in USERS.values() if item.email.lower() == email.lower()), None)
    if not user:
        return "ignored"
    token = secrets.token_urlsafe(32)
    RESET_TOKENS[user.id] = {
        "hash": _hash_value(token),
        "expires_at": _now() + timedelta(hours=1),
        "used": False,
    }
    return token


def reset_password(token: str, password: str) -> None:
    _validate_password_strength(password)
    token_hash = _hash_value(token)
    for user_id, entry in RESET_TOKENS.items():
        if entry["hash"] == token_hash and entry["expires_at"] > _now() and not entry["used"]:
            USERS[user_id].password_hash = hasher.hash(password)
            entry["used"] = True
            return
    raise HTTPException(status_code=400, detail="Reset link is invalid or expired.")


def issue_email_verification(user_id: str) -> str:
    token = secrets.token_urlsafe(32)
    VERIFICATION_TOKENS[user_id] = {
        "hash": _hash_value(token),
        "expires_at": _now() + timedelta(hours=24),
        "used": False,
    }
    return token


def resend_email_verification(email: str) -> str:
    user = next((item for item in USERS.values() if item.email.lower() == email.lower()), None)
    if not user:
        return "ignored"
    return issue_email_verification(user.id)


def verify_email_token(token: str) -> None:
    token_hash = _hash_value(token)
    for user_id, entry in VERIFICATION_TOKENS.items():
        if entry["hash"] == token_hash and entry["expires_at"] > _now() and not entry["used"]:
            USERS[user_id].email_verified = True
            entry["used"] = True
            return
    raise HTTPException(status_code=400, detail="Verification link is invalid or expired.")


def switch_organization(user_id: str, organization_id: str) -> dict[str, Any]:
    memberships = MEMBERSHIPS.get(user_id, [])
    membership = next(
        (item for item in memberships if item.organization_id == organization_id),
        None,
    )
    if not membership:
        raise HTTPException(status_code=404, detail="Organization not found for current user.")
    user = USERS[user_id]
    return {
        "access_token": _encode_access_token(user, membership),
        "membership": membership,
        "user": user,
    }


def decode_access_token(token: str) -> dict[str, Any]:
    try:
        return jwt.decode(token, auth_jwt_secret(), algorithms=["HS256"])
    except Exception as exc:
        raise HTTPException(status_code=401, detail="Invalid access token.") from exc


def session_from_refresh_token(refresh_token: str) -> SessionRecord:
    hashed = _hash_value(refresh_token)
    for session in SESSIONS.values():
        if session.refresh_token_hash == hashed and session.revoked_at is None and session.expires_at > _now():
            return session
    raise HTTPException(status_code=401, detail="Refresh token is invalid or expired.")


def refresh_access(refresh_token: str) -> dict[str, Any]:
    session = session_from_refresh_token(refresh_token)
    user = USERS[session.user_id]
    memberships = MEMBERSHIPS.get(user.id, [])
    membership = next(
        (item for item in memberships if item.organization_id == session.organization_id),
        None,
    )
    if not membership:
        raise HTTPException(status_code=404, detail="Organization membership not found.")
    session.revoked_at = _now()
    return _create_session_tokens(user, membership, session.ip_address, session.device, True)


def memberships_for_user(user_id: str) -> list[dict[str, Any]]:
    rows = []
    for membership in MEMBERSHIPS.get(user_id, []):
        organization = ORGANIZATIONS[membership.organization_id]
        rows.append(
            {
                "organizationId": organization.id,
                "organizationName": organization.name,
                "slug": organization.slug,
                "role": membership.role,
                "plan": organization.plan,
            }
        )
    return rows


def validate_api_key(raw_key: str) -> dict[str, Any]:
    seed_auth_store()
    entry = API_KEYS.get(_hash_value(raw_key))
    if not entry:
        raise HTTPException(status_code=401, detail="Invalid API key.")
    return entry
