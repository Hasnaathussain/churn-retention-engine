from __future__ import annotations

import uvicorn
from dotenv import load_dotenv
from fastapi import BackgroundTasks, FastAPI, Header, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from api import process_stripe_webhook, router as v1_router
from config import API_PREFIX, DOCS_URL, OPENAPI_URL, REDOC_URL, app_url, cors_origins
from database import db
from dependencies import workspace_context_from_metadata
from integrations import OpenAIGenerator
from model import ChurnPredictor
from schemas import WorkspaceContext
from services import create_checkout_session

load_dotenv()


app = FastAPI(
    title="Synapse Churn Retention Engine",
    version="2.0.0",
    docs_url=DOCS_URL,
    redoc_url=REDOC_URL,
    openapi_url=OPENAPI_URL,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(v1_router)


class CustomerData(BaseModel):
    customer_id: str
    mrr: float
    usage_frequency: int
    support_tickets: int
    last_login_days_ago: int
    plan_tier: str


def _legacy_workspace_context() -> WorkspaceContext:
    return workspace_context_from_metadata(
        {
            "workspace_id": "legacy-demo",
            "workspace_name": "Legacy Demo Workspace",
        }
    )


@app.get("/")
def root_health():
    return {
        "status": "healthy",
        "service": "Synapse Churn Retention Engine",
        "apiPrefix": API_PREFIX,
        "docs": DOCS_URL,
        "frontend": app_url(),
    }


@app.get("/health")
def health():
    return root_health()


@app.post("/webhooks/stripe")
async def legacy_stripe_webhook(
    request: Request,
    stripe_signature: str | None = Header(default=None, alias="Stripe-Signature"),
):
    return await process_stripe_webhook(request, stripe_signature)


@app.post("/create-checkout-session")
def legacy_checkout_session():
    context = _legacy_workspace_context()
    return create_checkout_session(context)


@app.post("/train")
def trigger_training(background_tasks: BackgroundTasks):
    def train_task():
        db_customers = db.get_all_customers()

        if db_customers and len(db_customers) > 5:
            training_data = db_customers
        else:
            training_data = [
                {"mrr": 100, "usage_frequency": 10, "support_tickets": 0, "last_login_days_ago": 2, "churned": 0},
                {"mrr": 50, "usage_frequency": 2, "support_tickets": 3, "last_login_days_ago": 20, "churned": 1},
                {"mrr": 200, "usage_frequency": 20, "support_tickets": 1, "last_login_days_ago": 1, "churned": 0},
                {"mrr": 20, "usage_frequency": 1, "support_tickets": 5, "last_login_days_ago": 40, "churned": 1},
                {"mrr": 150, "usage_frequency": 15, "support_tickets": 0, "last_login_days_ago": 3, "churned": 0},
                {"mrr": 30, "usage_frequency": 0, "support_tickets": 2, "last_login_days_ago": 60, "churned": 1},
            ]

        predictor = ChurnPredictor()
        predictor.train(training_data)

    background_tasks.add_task(train_task)
    return {"message": "Model retraining job initiated."}


@app.post("/predict")
def predict_churn(customer: CustomerData):
    predictor = ChurnPredictor()
    db.upsert_customer(
        customer.customer_id,
        {
            "mrr": customer.mrr,
            "usage_frequency": customer.usage_frequency,
            "support_tickets": customer.support_tickets,
            "last_login_days_ago": customer.last_login_days_ago,
            "plan_tier": customer.plan_tier,
        },
    )

    probability = predictor.predict(
        {
            "mrr": customer.mrr,
            "usage_frequency": customer.usage_frequency,
            "support_tickets": customer.support_tickets,
            "last_login_days_ago": customer.last_login_days_ago,
        }
    )
    is_at_risk = probability > 0.70

    if is_at_risk:
        db.log_event(customer.customer_id, "high_churn_risk_flagged", {"probability": probability})

    return {
        "customer_id": customer.customer_id,
        "churn_probability": probability,
        "is_at_risk": is_at_risk,
    }


@app.post("/generate-retention-campaign")
def generate_campaign(customer: CustomerData):
    generator = OpenAIGenerator()
    campaign = generator.create_campaign(
        customer_id=customer.customer_id,
        customer_data=customer.model_dump(),
        retention_goal="Reduce churn risk by offering a success call or discount",
    )

    db.log_event(customer.customer_id, "campaign_generated", {"campaign": campaign})

    return {
        "customer_id": customer.customer_id,
        "campaign": campaign,
    }


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
