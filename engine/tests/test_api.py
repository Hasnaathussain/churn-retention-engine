from __future__ import annotations

from types import SimpleNamespace
from unittest import TestCase
from unittest.mock import patch

from fastapi.testclient import TestClient

import main
from state import get_workspace_state, reset_workspace_state


class ApiSmokeTests(TestCase):
    def setUp(self):
        self.client = TestClient(main.app)
        reset_workspace_state("org_demo_anchoryn")
        reset_workspace_state("billing-workspace")
        reset_workspace_state("webhook-workspace")

    def _headers(self, workspace_id: str = "org_demo_anchoryn", role: str = "owner", mode: str = "demo"):
        return {
            "X-Workspace-ID": workspace_id,
            "X-Workspace-Name": f"{workspace_id} Workspace",
            "X-Workspace-Role": role,
            "X-Workspace-Mode": mode,
        }

    def test_root_health(self):
        response = self.client.get("/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "healthy")

    def test_dashboard_and_accounts(self):
        response = self.client.get("/v1/dashboard/summary", headers=self._headers())

        self.assertEqual(response.status_code, 200)
        body = response.json()
        self.assertEqual(body["workspaceId"], "org_demo_anchoryn")
        self.assertGreaterEqual(len(body["featuredAccounts"]), 1)

        accounts = self.client.get("/v1/accounts", headers=self._headers("billing-workspace", mode="live"))
        self.assertEqual(accounts.status_code, 200)
        self.assertGreaterEqual(len(accounts.json()), 1)

    def test_score_campaign_and_deploy(self):
        headers = self._headers("workflow-workspace", mode="live")
        accounts = self.client.get("/v1/accounts", headers=headers).json()
        account_id = accounts[0]["id"]

        score_response = self.client.post(f"/v1/accounts/{account_id}/score", headers=headers)
        self.assertEqual(score_response.status_code, 200)
        self.assertEqual(score_response.json()["accountId"], account_id)

        campaign_response = self.client.post(
            f"/v1/accounts/{account_id}/campaigns/generate",
            headers=headers,
        )
        self.assertEqual(campaign_response.status_code, 200)
        campaign = campaign_response.json()
        self.assertEqual(campaign["accountId"], account_id)

        deploy_response = self.client.post(
            f"/v1/campaigns/{campaign['id']}/deploy",
            headers=headers,
        )
        self.assertEqual(deploy_response.status_code, 200)
        self.assertEqual(deploy_response.json()["status"], "deployed")

    def test_billing_is_owner_only(self):
        owner_response = self.client.post(
            "/v1/billing/checkout-session",
            headers=self._headers("billing-workspace", role="owner", mode="live"),
        )
        self.assertEqual(owner_response.status_code, 200)
        self.assertIn("url", owner_response.json())

        member_response = self.client.post(
            "/v1/billing/checkout-session",
            headers=self._headers("billing-workspace", role="member", mode="live"),
        )
        self.assertEqual(member_response.status_code, 403)

    def test_integrations_status(self):
        response = self.client.get("/v1/integrations/status", headers=self._headers())

        self.assertEqual(response.status_code, 200)
        providers = {item["provider"] for item in response.json()}
        self.assertIn("stripe", providers)
        self.assertIn("openai", providers)

    def test_stripe_webhook_updates_workspace(self):
        event = SimpleNamespace(
            type="customer.subscription.updated",
            data=SimpleNamespace(
                object=SimpleNamespace(
                    id="sub_123",
                    customer="cus_123",
                    current_period_end=1893456000,
                    metadata={
                        "workspace_id": "webhook-workspace",
                        "workspace_name": "Webhook Workspace",
                    },
                )
            ),
        )

        with patch("api.stripe.Webhook.construct_event", return_value=event):
            response = self.client.post(
                "/v1/webhooks/stripe",
                headers={"Stripe-Signature": "sig_test"},
                content=b"{}",
            )

        self.assertEqual(response.status_code, 200)
        state = get_workspace_state("webhook-workspace", "Webhook Workspace", "live")
        self.assertEqual(state.workspace.subscriptionStatus, "active")
        self.assertEqual(state.workspace.billingProviderCustomerId, "cus_123")
