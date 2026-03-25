from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from dotenv import load_dotenv
from supabase import Client, create_client

from config import supabase_live_enabled, supabase_service_role_key, supabase_url

load_dotenv()


class Database:
    def __init__(self):
        self.client: Client | None = None
        url = supabase_url()
        key = supabase_service_role_key()

        if url and key and supabase_live_enabled():
            try:
                self.client = create_client(url, key)
            except Exception as exc:
                print(f"Warning: Supabase client unavailable. Running in memory mode. ({exc})")
                self.client = None
        else:
            self.client = None

    def _safe_execute(self, action, fallback=None):
        try:
            return action.execute()
        except Exception as exc:
            print(f"Database operation failed: {exc}")
            return fallback

    def _table(self, name: str):
        if not self.client:
            return None
        return self.client.table(name)

    def _upsert(self, table: str, payload: dict[str, Any]):
        table_client = self._table(table)
        if not table_client:
            return None
        return self._safe_execute(table_client.upsert(payload))

    def _insert(self, table: str, payload: dict[str, Any]):
        table_client = self._table(table)
        if not table_client:
            return None
        return self._safe_execute(table_client.insert(payload))

    def upsert_workspace(self, workspace_id: str, data: dict[str, Any]):
        payload = {"workspace_id": workspace_id, **data}
        return self._upsert("workspaces", payload)

    def upsert_account(self, workspace_id: str, data: dict[str, Any]):
        payload = {
            "workspace_id": workspace_id,
            **data,
        }
        if "id" not in payload and "accountId" in payload:
            payload["id"] = payload.pop("accountId")
        return self._upsert("accounts", payload)

    def upsert_customer(self, customer_id: str, data: dict[str, Any]):
        payload = {"id": customer_id, **data}
        workspace_id = str(data.get("workspace_id") or data.get("workspaceId") or "legacy-demo")
        return self.upsert_account(workspace_id, payload)

    def upsert_risk_assessment(self, workspace_id: str, data: dict[str, Any]):
        payload = {
            "workspace_id": workspace_id,
            "account_id": data.get("accountId") or data.get("account_id"),
            **data,
        }
        return self._upsert("risk_assessments", payload)

    def upsert_campaign(self, workspace_id: str, data: dict[str, Any]):
        payload = {
            "workspace_id": workspace_id,
            "account_id": data.get("accountId") or data.get("account_id"),
            **data,
        }
        return self._upsert("campaigns", payload)

    def upsert_playbooks(self, workspace_id: str, playbooks: list[dict[str, Any]]):
        if not self.client:
            return None
        rows = [{"workspace_id": workspace_id, **playbook} for playbook in playbooks]
        return self._safe_execute(self.client.table("playbooks").upsert(rows))

    def upsert_integrations(self, workspace_id: str, integrations: list[dict[str, Any]]):
        if not self.client:
            return None
        rows = [{"workspace_id": workspace_id, **integration} for integration in integrations]
        return self._safe_execute(self.client.table("integration_connections").upsert(rows))

    def log_event(self, workspace_id: str, *args: Any):
        if len(args) == 2:
            event_type, metadata = args
            subject_id = workspace_id
        elif len(args) == 3:
            subject_id, event_type, metadata = args
        else:
            raise TypeError("log_event expects workspace_id plus 2 or 3 additional arguments")

        payload = {
            "workspace_id": workspace_id,
            "subject_id": subject_id,
            "event_type": event_type,
            "metadata": metadata or {},
            "created_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        }
        return self._insert("activity_events", payload)

    def _select_one(self, table: str, column: str, value: Any):
        table_client = self._table(table)
        if not table_client:
            return None
        response = self._safe_execute(
            table_client.select("*").eq(column, value).limit(1),
            fallback=None,
        )
        if response and getattr(response, "data", None):
            return response.data[0]
        return None

    def get_customer(self, customer_id: str):
        return self._select_one("accounts", "id", customer_id)

    def get_all_customers(self):
        table_client = self._table("accounts")
        if not table_client:
            return []

        response = self._safe_execute(table_client.select("*"), fallback=None)
        if not response or not getattr(response, "data", None):
            return []

        return [
            {
                "customer_id": row.get("id"),
                "mrr": row.get("mrr", 0),
                "usage_frequency": row.get("usage_frequency", 0),
                "support_tickets": row.get("support_tickets", 0),
                "last_login_days_ago": row.get("last_login_days_ago", 0),
                "churned": row.get("churned", 0),
            }
            for row in response.data
        ]


db = Database()
