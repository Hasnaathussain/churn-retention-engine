from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


WorkspaceRole = Literal["owner", "member"]
WorkspaceMode = Literal["demo", "live"]
WorkspaceSubscriptionStatus = Literal["trialing", "active", "past_due", "canceled", "unknown"]
CampaignType = Literal[
    "founder_email",
    "automated_email",
    "discount_offer",
    "success_call",
]
CampaignStatus = Literal["draft", "queued", "sent", "deployed"]
IntegrationProvider = Literal[
    "stripe",
    "mixpanel",
    "openai",
    "intercom",
    "resend",
]


class WorkspaceContext(BaseModel):
    workspaceId: str
    workspaceName: str
    role: WorkspaceRole
    mode: WorkspaceMode
    userEmail: str | None = None


class RiskDriver(BaseModel):
    label: str
    value: str


class AccountMetricPoint(BaseModel):
    month: str
    mrr: float
    churnPressure: float


class Workspace(BaseModel):
    workspaceId: str
    workspaceName: str
    plan: str
    role: WorkspaceRole
    mode: WorkspaceMode = "demo"
    ownerEmail: str | None = None
    subscriptionStatus: WorkspaceSubscriptionStatus = "unknown"
    billingProviderCustomerId: str | None = None
    subscriptionId: str | None = None
    currentPeriodEnd: str | None = None


class Account(BaseModel):
    id: str
    workspaceId: str
    name: str
    domain: str
    plan: str
    owner: str
    mrr: float
    churnProbability: float
    healthScore: int
    status: Literal["stable", "watch", "high_risk"]
    lastActive: str
    lastLoginDaysAgo: int
    supportTickets: int
    usageFrequency: int
    primaryRisk: str
    recommendedAction: str
    tags: list[str]
    drivers: list[RiskDriver]
    trend: list[AccountMetricPoint]


class TimelineEvent(BaseModel):
    id: str
    accountId: str
    title: str
    description: str
    kind: Literal["signal", "campaign", "billing", "support", "product"]
    timestamp: str
    channel: str


class RiskAssessment(BaseModel):
    accountId: str
    churnProbability: float
    band: Literal["low", "medium", "high"]
    confidence: float
    recommendedAction: CampaignType
    drivers: list[RiskDriver]
    generatedAt: str


class Campaign(BaseModel):
    id: str
    accountId: str
    campaignType: CampaignType
    status: CampaignStatus
    subject: str
    body: str
    channel: str
    createdAt: str
    deployedAt: str | None = None
    roiEstimate: str


class Playbook(BaseModel):
    id: str
    name: str
    trigger: str
    action: str
    audience: str
    status: Literal["active", "paused", "draft"]
    lastRun: str
    successRate: float


class IntegrationStatus(BaseModel):
    provider: IntegrationProvider
    displayName: str
    connected: bool
    healthy: bool
    mode: Literal["mock", "live"]
    credentialState: Literal["ready", "missing", "partial"]
    lastSync: str
    description: str


class RiskSegment(BaseModel):
    label: str
    value: int
    color: str


class DashboardSummary(BaseModel):
    organizationId: str | None = None
    organizationName: str | None = None
    workspaceId: str
    workspaceName: str
    role: WorkspaceRole
    monthlyRevenue: float
    revenueAtRisk: float
    activeAccounts: int
    highRiskAccounts: int
    campaignsRunning: int
    retentionsSaved: int
    healthScore: int
    riskBreakdown: list[RiskSegment]
    trend: list[AccountMetricPoint]
    featuredAccounts: list[Account]
    spotlightCampaigns: list[Campaign]
    playbooks: list[Playbook]
    integrations: list[IntegrationStatus]


class CheckoutSessionResponse(BaseModel):
    url: str


class PortalSessionResponse(BaseModel):
    url: str


class ApiMessage(BaseModel):
    status: str
    reason: str | None = None


class WorkspaceState(BaseModel):
    workspace: Workspace
    accounts: list[Account] = Field(default_factory=list)
    riskAssessments: dict[str, RiskAssessment] = Field(default_factory=dict)
    campaigns: dict[str, Campaign] = Field(default_factory=dict)
    playbooks: list[Playbook] = Field(default_factory=list)
    integrations: list[IntegrationStatus] = Field(default_factory=list)
    timeline: dict[str, list[TimelineEvent]] = Field(default_factory=dict)
