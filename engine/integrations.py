from __future__ import annotations

import json
import os

from config import openai_live_enabled, openai_model


class OpenAIGenerator:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.model = openai_model()
        self.client = None

        if self.api_key and openai_live_enabled():
            from openai import OpenAI

            self.client = OpenAI(api_key=self.api_key)

    def create_campaign(
        self,
        customer_id: str,
        customer_data: dict,
        retention_goal: str = "Re-engage with premium features",
    ) -> dict:
        """
        Uses OpenAI to generate a retention draft when credentials are available.
        Falls back to an editorial placeholder so the workspace remains useful in demo mode.
        """
        if not self.client:
            risk_label = customer_data.get("primaryRisk", "recent inactivity")
            return {
                "campaign_type": "automated_email",
                "channel": "Email",
                "subject": f"Quick support note for {customer_data.get('name', customer_id)}",
                "body": (
                    f"Hi {customer_data.get('owner', 'there')}, we noticed {risk_label}. "
                    "We put together a short plan to help your team get back on track."
                ),
            }

        prompt = f"""
You are an expert Customer Success Manager. We have a customer at high risk of churning.
Here is their recent data:
{json.dumps(customer_data, indent=2)}

The goal is: {retention_goal}

Generate a JSON response with:
1. 'campaign_type': Enum [founder_email, automated_email, discount_offer, success_call]
2. 'channel': A short channel label like Email or Email + task
3. 'subject': The email subject line
4. 'body': The personalized body of the email. Keep it empathetic, concise, and focused on value.

JSON only:
""".strip()

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
        )

        return json.loads(response.choices[0].message.content)


class StripeIntegration:
    def __init__(self):
        import stripe

        self.api_key = os.getenv("STRIPE_API_KEY")
        if self.api_key:
            stripe.api_key = self.api_key

    def get_customer_mrr(self, stripe_customer_id: str) -> float:
        if not self.api_key:
            return 0.0

        import stripe

        try:
            subscriptions = stripe.Subscription.list(customer=stripe_customer_id, status="active")
            mrr = 0.0
            for sub in subscriptions.data:
                for item in sub.items.data:
                    if item.price.recurring:
                        interval = item.price.recurring.interval
                        amount = item.price.unit_amount / 100.0
                        if interval == "month":
                            mrr += amount
                        elif interval == "year":
                            mrr += amount / 12
            return mrr
        except Exception as exc:
            print(f"Stripe error: {exc}")
            return 0.0


class MixpanelIntegration:
    def __init__(self):
        self.project_token = os.getenv("MIXPANEL_PROJECT_TOKEN")

    def get_recent_usage(self, customer_id: str) -> dict:
        if not self.project_token:
            return {"usage_frequency": 5, "last_login_days_ago": 3}

        return {"usage_frequency": 12, "last_login_days_ago": 1}
