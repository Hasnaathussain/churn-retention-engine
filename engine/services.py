from __future__ import annotations

import os
from copy import deepcopy
from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

from config import app_url, stripe_api_key, stripe_live_enabled, stripe_price_id
from database import db
from integrations import OpenAIGenerator
from model import HeuristicChurnScorer
from schemas import (
    Account,
    AccountMetricPoint,
    Campaign,
    DashboardSummary,
    IntegrationStatus,
    Playbook,
    RiskAssessment,
    RiskSegment,
    TimelineEvent,
    WorkspaceContext,
    WorkspaceState,
)
from state import get_workspace_state

scorer = HeuristicChurnScorer()


def _timestamp() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def _workspace_state(context: WorkspaceContext) -> WorkspaceState:
    return get_workspace_state(context.workspaceId, context.workspaceName, context.mode)


def _score_band(probability: float) -> str:
    if probability >= 0.75:
        return "high"
    if probability >= 0.55:
        return "medium"
    return "low"


def _campaign_type_from_account(account: Account, probability: float) -> str:
    if probability >= 0.85:
        return "founder_email"
    if account.supportTickets > 3 or account.lastLoginDaysAgo > 14:
        return "success_call"
    if account.usageFrequency < 5:
        return "automated_email"
    return "discount_offer"


def _campaign_label(campaign_type: str, account: Account) -> str:
    labels = {
        "founder_email": "Founder email with discount backup",
        "automated_email": "Automated email with usage tips",
        "discount_offer": "Discount offer with success follow-up",
        "success_call": "Success call and onboarding reset",
    }
    if campaign_type in labels:
        return labels[campaign_type]
    return account.recommendedAction


def _build_risk_assessment(account: Account, probability: float) -> RiskAssessment:
    return RiskAssessment(
        accountId=account.id,
        churnProbability=round(probability, 4),
        band=_score_band(probability),
        confidence=round(min(0.98, 0.58 + probability * 0.35), 2),
        recommendedAction=_campaign_type_from_account(account, probability),
        drivers=deepcopy(account.drivers),
        generatedAt=_timestamp(),
    )


def _account_ref(state: WorkspaceState, account_id: str) -> Account:
    for account in state.accounts:
        if account.id == account_id:
            return account
    raise KeyError(account_id)


def _append_timeline_event(
    state: WorkspaceState,
    account_id: str,
    title: str,
    description: str,
    kind: str,
    channel: str,
) -> None:
    state.timeline.setdefault(account_id, []).insert(
        0,
        TimelineEvent(
            id=f"evt_{uuid4().hex[:10]}",
            accountId=account_id,
            title=title,
            description=description,
            kind=kind,  # type: ignore[arg-type]
            timestamp=_timestamp(),
            channel=channel,
        ),
    )


def _refresh_account_from_assessment(account: Account, assessment: RiskAssessment) -> None:
    account.churnProbability = assessment.churnProbability
    account.recommendedAction = _campaign_label(assessment.recommendedAction, account)
    account.healthScore = max(10, min(100, int(round(100 - assessment.churnProbability * 60))))
    if assessment.band == "high":
        account.status = "high_risk"
    elif assessment.band == "medium":
        account.status = "watch"
    else:
        account.status = "stable"


def build_dashboard_summary(context: WorkspaceContext) -> DashboardSummary:
    state = _workspace_state(context)
    accounts = state.accounts

    if not accounts:
        return DashboardSummary(
            organizationId=state.workspace.workspaceId,
            organizationName=state.workspace.workspaceName,
            workspaceId=state.workspace.workspaceId,
            workspaceName=state.workspace.workspaceName,
            role=context.role,
            monthlyRevenue=0,
            revenueAtRisk=0,
            activeAccounts=0,
            highRiskAccounts=0,
            campaignsRunning=0,
            retentionsSaved=0,
            healthScore=0,
            riskBreakdown=[],
            trend=[],
            featuredAccounts=[],
            spotlightCampaigns=[],
            playbooks=[],
            integrations=[],
        )

    monthly_revenue = round(sum(account.mrr for account in accounts), 2)
    revenue_at_risk = round(
        sum(account.mrr for account in accounts if account.churnProbability >= 0.6), 2
    )
    high_risk_accounts = sum(account.churnProbability >= 0.75 for account in accounts)
    health_score = round(sum(account.healthScore for account in accounts) / len(accounts))

    risk_breakdown = [
        RiskSegment(
            label="High risk",
            value=round(
                sum(account.churnProbability >= 0.75 for account in accounts)
                / len(accounts)
                * 100
            ),
            color="#f28b82",
        ),
        RiskSegment(
            label="Watchlist",
            value=round(
                sum(0.55 <= account.churnProbability < 0.75 for account in accounts)
                / len(accounts)
                * 100
            ),
            color="#f6c66f",
        ),
        RiskSegment(
            label="Healthy",
            value=round(
                sum(account.churnProbability < 0.55 for account in accounts) / len(accounts) * 100
            ),
            color="#8dd6a3",
        ),
    ]

    trend = [
        AccountMetricPoint(month="Jan", mrr=118000, churnPressure=22),
        AccountMetricPoint(month="Feb", mrr=128000, churnPressure=26),
        AccountMetricPoint(month="Mar", mrr=135000, churnPressure=29),
        AccountMetricPoint(month="Apr", mrr=140000, churnPressure=34),
        AccountMetricPoint(month="May", mrr=148000, churnPressure=29),
        AccountMetricPoint(month="Jun", mrr=156000, churnPressure=24),
    ]

    featured_accounts = sorted(
        accounts,
        key=lambda account: account.churnProbability,
        reverse=True,
    )[:4]
    spotlight_campaigns = list(state.campaigns.values())

    return DashboardSummary(
        organizationId=state.workspace.workspaceId,
        organizationName=state.workspace.workspaceName,
        workspaceId=state.workspace.workspaceId,
        workspaceName=state.workspace.workspaceName,
        role=context.role,
        monthlyRevenue=monthly_revenue,
        revenueAtRisk=revenue_at_risk,
        activeAccounts=len(accounts),
        highRiskAccounts=high_risk_accounts,
        campaignsRunning=len(state.campaigns),
        retentionsSaved=142
        + len([campaign for campaign in state.campaigns.values() if campaign.status == "deployed"]) * 3,
        healthScore=health_score,
        riskBreakdown=risk_breakdown,
        trend=trend,
        featuredAccounts=featured_accounts,
        spotlightCampaigns=spotlight_campaigns,
        playbooks=deepcopy(state.playbooks),
        integrations=get_integration_status(context),
    )


def list_accounts(context: WorkspaceContext) -> list[Account]:
    return deepcopy(_workspace_state(context).accounts)


def get_account(context: WorkspaceContext, account_id: str) -> Account:
    state = _workspace_state(context)
    account = _account_ref(state, account_id)
    return deepcopy(account)


def get_account_timeline(context: WorkspaceContext, account_id: str) -> list[TimelineEvent]:
    state = _workspace_state(context)
    _account_ref(state, account_id)
    return deepcopy(state.timeline.get(account_id, []))


def score_account(context: WorkspaceContext, account_id: str) -> RiskAssessment:
    state = _workspace_state(context)
    account = _account_ref(state, account_id)

    probability = scorer.predict(
        {
            "mrr": account.mrr,
            "usage_frequency": account.usageFrequency,
            "support_tickets": account.supportTickets,
            "last_login_days_ago": account.lastLoginDaysAgo,
        }
    )
    assessment = _build_risk_assessment(account, probability)
    state.riskAssessments[account.id] = assessment
    _refresh_account_from_assessment(account, assessment)
    _append_timeline_event(
        state,
        account.id,
        "Risk assessment refreshed",
        f"Churn probability updated to {round(assessment.churnProbability * 100)}%.",
        "signal",
        "Retention engine",
    )
    db.upsert_account(context.workspaceId, account.model_dump())
    db.upsert_risk_assessment(context.workspaceId, assessment.model_dump())
    db.log_event(context.workspaceId, account.id, "risk_assessment_updated", assessment.model_dump())
    return deepcopy(assessment)


def generate_campaign(context: WorkspaceContext, account_id: str) -> Campaign:
    state = _workspace_state(context)
    account = _account_ref(state, account_id)
    assessment = state.riskAssessments.get(account.id) or score_account(context, account.id)

    generator = OpenAIGenerator()
    campaign_payload = generator.create_campaign(
        customer_id=account.id,
        customer_data=account.model_dump(),
        retention_goal="Reduce churn risk with empathetic and specific retention outreach",
    )

    campaign = Campaign(
        id=f"cmp_{uuid4().hex[:10]}",
        accountId=account.id,
        campaignType=campaign_payload.get("campaign_type")
        or _campaign_type_from_account(account, assessment.churnProbability),
        status="draft",
        subject=campaign_payload.get("subject")
        or f"Retention check-in for {account.name}",
        body=campaign_payload.get("body")
        or f"We noticed {account.name} could benefit from a quick success check-in.",
        channel=campaign_payload.get("channel", "Email"),
        createdAt=_timestamp(),
        deployedAt=None,
        roiEstimate=f"${round(account.mrr):,} retained",
    )

    state.campaigns[campaign.id] = campaign
    _append_timeline_event(
        state,
        account.id,
        "Campaign drafted",
        f"{campaign.subject} is ready for review.",
        "campaign",
        campaign.channel,
    )
    db.upsert_campaign(context.workspaceId, campaign.model_dump())
    db.log_event(context.workspaceId, account.id, "campaign_generated", campaign.model_dump())
    return deepcopy(campaign)


def deploy_campaign(context: WorkspaceContext, campaign_id: str) -> Campaign:
    state = _workspace_state(context)
    if campaign_id not in state.campaigns:
        raise KeyError(campaign_id)

    campaign = state.campaigns[campaign_id]
    campaign.status = "deployed"
    campaign.deployedAt = _timestamp()
    state.campaigns[campaign_id] = campaign
    _append_timeline_event(
        state,
        campaign.accountId,
        "Campaign deployed",
        f"{campaign.subject} was deployed through the workspace shell.",
        "campaign",
        campaign.channel,
    )
    db.upsert_campaign(context.workspaceId, campaign.model_dump())
    db.log_event(context.workspaceId, campaign.accountId, "campaign_deployed", campaign.model_dump())
    return deepcopy(campaign)


def list_playbooks(context: WorkspaceContext) -> list[Playbook]:
    return deepcopy(_workspace_state(context).playbooks)


def get_integration_status(context: WorkspaceContext) -> list[IntegrationStatus]:
    state = _workspace_state(context)
    status_map = {integration.provider: deepcopy(integration) for integration in state.integrations}

    if context.mode == "demo":
        for integration in status_map.values():
            integration.mode = "mock"
    else:
        stripe_connected = bool(stripe_api_key())
        mixpanel_connected = bool(os.getenv("MIXPANEL_PROJECT_TOKEN"))
        openai_connected = bool(os.getenv("OPENAI_API_KEY"))
        intercom_connected = bool(os.getenv("INTERCOM_ACCESS_TOKEN"))
        resend_connected = bool(os.getenv("RESEND_API_KEY"))

        status_map["stripe"].connected = stripe_connected
        status_map["stripe"].healthy = stripe_connected
        status_map["stripe"].credentialState = "ready" if stripe_connected else "missing"
        status_map["stripe"].mode = "live" if stripe_connected else "mock"
        if not stripe_connected:
            status_map["stripe"].lastSync = "Not connected"

        status_map["mixpanel"].connected = mixpanel_connected
        status_map["mixpanel"].healthy = mixpanel_connected
        status_map["mixpanel"].credentialState = "ready" if mixpanel_connected else "missing"
        status_map["mixpanel"].mode = "live" if mixpanel_connected else "mock"

        status_map["openai"].connected = openai_connected
        status_map["openai"].healthy = openai_connected
        status_map["openai"].credentialState = "ready" if openai_connected else "missing"
        status_map["openai"].mode = "live" if openai_connected else "mock"

        status_map["intercom"].connected = intercom_connected
        status_map["intercom"].healthy = intercom_connected
        status_map["intercom"].credentialState = "ready" if intercom_connected else "missing"
        status_map["intercom"].mode = "live" if intercom_connected else "mock"

        if "resend" in status_map:
            status_map["resend"].connected = resend_connected
            status_map["resend"].healthy = resend_connected
            status_map["resend"].credentialState = "ready" if resend_connected else "missing"
            status_map["resend"].mode = "live" if resend_connected else "mock"
            if not resend_connected:
                status_map["resend"].lastSync = "Not connected"
        else:
            status_map["resend"] = IntegrationStatus(
                provider="resend",
                displayName="Resend",
                connected=resend_connected,
                healthy=resend_connected,
                mode="live" if resend_connected else "mock",
                credentialState="ready" if resend_connected else "missing",
                lastSync="Just now" if resend_connected else "Not connected",
                description="Email delivery can be connected to automate retention campaigns.",
            )

    integrations = list(status_map.values())
    state.integrations = integrations
    db.upsert_integrations(context.workspaceId, [integration.model_dump() for integration in integrations])
    return integrations


def create_checkout_session(context: WorkspaceContext) -> dict[str, str]:
    api_key = stripe_api_key()
    if not api_key or not stripe_live_enabled():
        return {"url": f"{app_url()}/pricing?checkout=demo"}

    import stripe

    stripe.api_key = api_key
    success_url = f"{app_url()}/app/billing?checkout=success"
    cancel_url = f"{app_url()}/pricing?checkout=cancelled"
    metadata = {
        "workspace_id": context.workspaceId,
        "workspace_name": context.workspaceName,
    }

    session_params: dict[str, Any] = {
        "mode": "subscription",
        "success_url": success_url,
        "cancel_url": cancel_url,
        "client_reference_id": context.workspaceId,
        "metadata": metadata,
        "subscription_data": {"metadata": metadata},
    }

    price_id = stripe_price_id()
    if price_id:
        session_params["line_items"] = [{"price": price_id, "quantity": 1}]
    else:
        session_params["line_items"] = [
            {
                "price_data": {
                    "currency": "usd",
                    "product_data": {
                        "name": "Anchoryn Growth Plan",
                        "description": "Workspace-based churn retention engine with AI campaigns.",
                    },
                    "unit_amount": 49900,
                    "recurring": {"interval": "month"},
                },
                "quantity": 1,
            }
        ]

    session = stripe.checkout.Session.create(**session_params)
    return {"url": session.url}


def create_portal_session(context: WorkspaceContext) -> dict[str, str]:
    api_key = stripe_api_key()
    if not api_key or not stripe_live_enabled():
        return {"url": f"{app_url()}/app/billing?portal=demo"}

    import stripe

    state = _workspace_state(context)
    customer_id = (
        state.workspace.billingProviderCustomerId
        or os.getenv("STRIPE_CUSTOMER_ID")
        or ""
    )
    if not customer_id:
        return {"url": f"{app_url()}/app/billing?portal=missing-customer"}

    stripe.api_key = api_key
    portal_session = stripe.billing_portal.Session.create(
        customer=customer_id,
        return_url=f"{app_url()}/app/billing",
    )
    return {"url": portal_session.url}


def handle_stripe_event(context: WorkspaceContext, event_type: str, payload: dict[str, Any]) -> None:
    state = _workspace_state(context)
    db.log_event(context.workspaceId, context.workspaceId, event_type, payload)

    if event_type in {
        "customer.subscription.created",
        "customer.subscription.updated",
        "customer.subscription.deleted",
    }:
        state.workspace.mode = "live"
        state.workspace.subscriptionStatus = {
            "customer.subscription.created": "active",
            "customer.subscription.updated": "active",
            "customer.subscription.deleted": "canceled",
        }[event_type]
        state.workspace.billingProviderCustomerId = (
            payload.get("customer")
            or payload.get("customer_id")
            or state.workspace.billingProviderCustomerId
        )
        state.workspace.subscriptionId = payload.get("id") or state.workspace.subscriptionId
        current_period_end = payload.get("current_period_end")
        if isinstance(current_period_end, int):
            state.workspace.currentPeriodEnd = datetime.fromtimestamp(
                current_period_end,
                tz=timezone.utc,
            ).isoformat(timespec="seconds")
        elif isinstance(current_period_end, str):
            state.workspace.currentPeriodEnd = current_period_end
        db.upsert_workspace(context.workspaceId, state.workspace.model_dump())
