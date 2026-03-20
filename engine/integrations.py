import os
from openai import OpenAI
import json

class OpenAIGenerator:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    def create_campaign(self, customer_id: str, customer_data: dict, retention_goal: str = "Re-engage with premium features") -> dict:
        """
        Uses GPT-4o to generate a highly personalized email and a recommended action
        based on the customer's specific usage data and churn risk factors.
        """
        if not os.getenv("OPENAI_API_KEY"):
            # Dummy response for local testing without API key
            return {
                "campaign_type": "automated_email",
                "subject": f"Hey from Founder (Testing mode for {customer_id})",
                "body": "Hi, we saw you haven't logged in recently. We'd love to help you get more value."
            }

        prompt = f"""
        You are an expert Customer Success Manager. We have a customer at high risk of churning.
        Here is their recent data:
        {json.dumps(customer_data, indent=2)}

        The goal is: {retention_goal}

        Generate a JSON response with:
        1. 'campaign_type': Enum [founder_email, automated_email, discount_offer, success_call]
        2. 'subject': The email subject line
        3. 'body': The personalized body of the email. Keep it empathetic, concise, and focused on value.

        JSON Only:
        """

        response = self.client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            response_format={ "type": "json_object" }
        )

        return json.loads(response.choices[0].message.content)

class StripeIntegration:
    def __init__(self):
        import stripe
        self.api_key = os.getenv("STRIPE_API_KEY")
        stripe.api_key = self.api_key

    def get_customer_mrr(self, stripe_customer_id: str) -> float:
        if not self.api_key: return 0.0
        import stripe
        try:
            subscriptions = stripe.Subscription.list(customer=stripe_customer_id, status="active")
            mrr = 0.0
            for sub in subscriptions.data:
                for item in sub.items.data:
                    if item.price.recurring:
                        interval = item.price.recurring.interval
                        amount = item.price.unit_amount / 100.0  # cents to dollars
                        if interval == "month":
                            mrr += amount
                        elif interval == "year":
                            mrr += amount / 12
            return mrr
        except Exception as e:
            print(f"Stripe error: {e}")
            return 0.0

class MixpanelIntegration:
    def __init__(self):
        self.project_token = os.getenv("MIXPANEL_PROJECT_TOKEN")
    
    def get_recent_usage(self, customer_id: str) -> dict:
        if not self.project_token: 
            return {"usage_frequency": 5, "last_login_days_ago": 3}
        # In a production app, you would use Mixpanel's export API or JQL to calculate this
        # Stub returning dummy values if token exists but no logic is hooked
        return {"usage_frequency": 12, "last_login_days_ago": 1}
