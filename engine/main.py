import os
from fastapi import FastAPI, BackgroundTasks, HTTPException, Request, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from dotenv import load_dotenv
import stripe

from model import ChurnPredictor
from integrations import OpenAIGenerator, StripeIntegration, MixpanelIntegration
from database import db

load_dotenv()

app = FastAPI(title="Churn Retention ML Engine", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CustomerData(BaseModel):
    customer_id: str
    mrr: float
    usage_frequency: int
    support_tickets: int
    last_login_days_ago: int
    plan_tier: str

@app.get("/")
def health_check():
    return {"status": "healthy", "service": "ML Churn Prediction Engine"}

@app.post("/webhooks/stripe")
async def stripe_webhook(request: Request, stripe_signature: str = Header(None)):
    webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
    payload = await request.body()
    
    if not webhook_secret:
        return {"status": "ignored", "reason": "No webhook secret configured"}

    try:
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, webhook_secret
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Handle the event
    if event.type in ['customer.subscription.updated', 'customer.subscription.deleted', 'customer.subscription.created']:
        sub = event.data.object
        customer_id = sub.customer
        # Trigger an update of the MRR for this customer in our DB
        stripe_integ = StripeIntegration()
        new_mrr = stripe_integ.get_customer_mrr(customer_id)
        db.upsert_customer(customer_id, {"mrr": new_mrr})
        db.log_event(customer_id, event.type, {"mrr": new_mrr})

    return {"status": "success"}

@app.post("/train")
def trigger_training(background_tasks: BackgroundTasks):
    """
    Triggers the automated XGBoost model retraining pipeline.
    """
    def train_task():
        print("Training model in background...")
        # Try fetching from DB first
        db_customers = db.get_all_customers()
        
        if db_customers and len(db_customers) > 5:
            # We have real data
            dummy_data = db_customers
        else:
            print("Using fallback dummy data for training (Not enough DB rows)")
            dummy_data = [
                {"mrr": 100, "usage_frequency": 10, "support_tickets": 0, "last_login_days_ago": 2, "churned": 0},
                {"mrr": 50, "usage_frequency": 2, "support_tickets": 3, "last_login_days_ago": 20, "churned": 1},
                {"mrr": 200, "usage_frequency": 20, "support_tickets": 1, "last_login_days_ago": 1, "churned": 0},
                {"mrr": 20, "usage_frequency": 1, "support_tickets": 5, "last_login_days_ago": 40, "churned": 1},
                {"mrr": 150, "usage_frequency": 15, "support_tickets": 0, "last_login_days_ago": 3, "churned": 0},
                {"mrr": 30, "usage_frequency": 0, "support_tickets": 2, "last_login_days_ago": 60, "churned": 1},
            ]
        
        predictor = ChurnPredictor()
        predictor.train(dummy_data)

    background_tasks.add_task(train_task)
    return {"message": "Model retraining job initiated."}

@app.post("/predict")
def predict_churn(customer: CustomerData):
    """
    Predicts churn probability for a given customer profile.
    """
    predictor = ChurnPredictor()
    
    # Save the data state
    db.upsert_customer(customer.customer_id, {
        "mrr": customer.mrr,
        "usage_frequency": customer.usage_frequency,
        "support_tickets": customer.support_tickets,
        "last_login_days_ago": customer.last_login_days_ago
    })

    # Extract features matching the model
    features = {
        "mrr": customer.mrr,
        "usage_frequency": customer.usage_frequency,
        "support_tickets": customer.support_tickets,
        "last_login_days_ago": customer.last_login_days_ago
    }
    
    try:
        probability = predictor.predict(features)
    except Exception as e:
        print(f"Prediction error (fallback to dummy): {e}")
        probability = 0.5

    is_at_risk = probability > 0.70

    if is_at_risk:
        db.log_event(customer.customer_id, "high_churn_risk_flagged", {"probability": probability})

    return {
        "customer_id": customer.customer_id,
        "churn_probability": probability,
        "is_at_risk": is_at_risk
    }

@app.post("/generate-retention-campaign")
def generate_campaign(customer: CustomerData):
    """
    Uses GPT-4o to analyze the customer's data and generate a personalized email.
    """
    generator = OpenAIGenerator()
    campaign = generator.create_campaign(
        customer_id=customer.customer_id,
        customer_data=customer.model_dump(),
        retention_goal="Reduce churn risk by offering a success call or discount"
    )
    
    db.log_event(customer.customer_id, "campaign_generated", {"campaign": campaign})
    
    return {
        "customer_id": customer.customer_id,
        "campaign": campaign
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)