from __future__ import annotations

import os
from typing import Iterable

from dotenv import load_dotenv

load_dotenv()

API_PREFIX = "/v1"
PUBLIC_API_PREFIX = "/api/v1"
OPENAPI_URL = "/api/openapi.json"
DOCS_URL = "/api/docs"
REDOC_URL = "/api/redoc"


def _normalize_url(url: str) -> str:
    return url.rstrip("/")


def _first_non_empty(*values: str | None, default: str = "") -> str:
    for value in values:
        if value:
            return value
    return default


def _unique(values: Iterable[str]) -> list[str]:
    seen: set[str] = set()
    ordered: list[str] = []
    for value in values:
        if value and value not in seen:
            ordered.append(value)
            seen.add(value)
    return ordered


def app_url() -> str:
    return _normalize_url(
        _first_non_empty(
            os.getenv("APP_URL"),
            os.getenv("NEXT_PUBLIC_APP_URL"),
            default="http://localhost:3000",
        )
    )


def app_env() -> str:
    return os.getenv("APP_ENV") or os.getenv("NODE_ENV") or "development"


def frontend_url() -> str:
    return app_url()


def api_url() -> str:
    return _normalize_url(
        _first_non_empty(
            os.getenv("API_URL"),
            os.getenv("NEXT_PUBLIC_API_BASE_URL"),
            default="http://localhost:8000/v1",
        )
    )


def cors_origins() -> list[str]:
    configured = os.getenv("CORS_ORIGINS")
    if configured:
        return _unique(_normalize_url(value.strip()) for value in configured.split(","))

    return _unique(
        [
            _normalize_url(
                _first_non_empty(
                    os.getenv("NEXT_PUBLIC_APP_URL"),
                    os.getenv("APP_URL"),
                    default="http://localhost:3000",
                )
            ),
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ]
    )


def stripe_price_id() -> str | None:
    return os.getenv("STRIPE_PRICE_ID") or None


def auth_jwt_secret() -> str:
    return os.getenv("AUTH_JWT_SECRET", "anchoryn-development-secret")


def access_token_minutes() -> int:
    return int(os.getenv("ACCESS_TOKEN_MINUTES", "15"))


def refresh_token_days() -> int:
    return int(os.getenv("REFRESH_TOKEN_DAYS", "7"))


def remember_me_days() -> int:
    return int(os.getenv("REMEMBER_ME_DAYS", "30"))


def secure_cookies() -> bool:
    return app_env() == "production"


def openai_model() -> str:
    return os.getenv("OPENAI_MODEL", "gpt-4o-mini")


def allow_demo_mode() -> bool:
    return os.getenv("ALLOW_DEMO_MODE", "true").lower() != "false"


def openai_live_enabled() -> bool:
    return os.getenv("OPENAI_LIVE_ENABLED", "false").lower() == "true"


def stripe_live_enabled() -> bool:
    return os.getenv("STRIPE_LIVE_ENABLED", "false").lower() == "true"


def supabase_live_enabled() -> bool:
    return os.getenv("SUPABASE_LIVE_ENABLED", "false").lower() == "true"


def demo_workspace_id() -> str:
    return os.getenv("DEMO_WORKSPACE_ID", "org_demo_anchoryn")


def demo_workspace_name() -> str:
    return os.getenv("DEMO_WORKSPACE_NAME", "Anchoryn Launch Preview")


def supabase_url() -> str | None:
    return os.getenv("SUPABASE_URL") or None


def supabase_anon_key() -> str | None:
    return os.getenv("SUPABASE_ANON_KEY") or None


def supabase_service_role_key() -> str | None:
    return os.getenv("SUPABASE_SERVICE_ROLE_KEY") or None


def stripe_api_key() -> str | None:
    return os.getenv("STRIPE_API_KEY") or None


def stripe_webhook_secret() -> str | None:
    return os.getenv("STRIPE_WEBHOOK_SECRET") or None


def mixpanel_project_token() -> str | None:
    return os.getenv("MIXPANEL_PROJECT_TOKEN") or None


def intercom_access_token() -> str | None:
    return os.getenv("INTERCOM_ACCESS_TOKEN") or None


def resend_api_key() -> str | None:
    return os.getenv("RESEND_API_KEY") or None
