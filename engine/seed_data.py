from __future__ import annotations

from copy import deepcopy

from schemas import (
    Account,
    AccountMetricPoint,
    Campaign,
    IntegrationStatus,
    Playbook,
    RiskDriver,
    TimelineEvent,
    Workspace,
    WorkspaceMode,
    WorkspaceState,
)


def _base_accounts(workspace_id: str) -> list[Account]:
    return [
        Account(
            id="acc_acme_01",
            workspaceId=workspace_id,
            name="Acme Robotics",
            domain="acme-robotics.com",
            plan="Enterprise",
            owner="Maya Chen",
            mrr=8200,
            churnProbability=0.89,
            healthScore=41,
            status="high_risk",
            lastActive="2 hours ago",
            lastLoginDaysAgo=18,
            supportTickets=7,
            usageFrequency=3,
            primaryRisk="Usage drop-off and repeated billing failures",
            recommendedAction="Founder email with discount backup",
            tags=["billing", "usage", "high value"],
            drivers=[
                RiskDriver(label="Last login", value="18 days ago"),
                RiskDriver(label="Support tickets", value="7 open"),
                RiskDriver(label="Feature adoption", value="Reporting module down 42%"),
            ],
            trend=[
                AccountMetricPoint(month="Jan", mrr=8300, churnPressure=22),
                AccountMetricPoint(month="Feb", mrr=8280, churnPressure=26),
                AccountMetricPoint(month="Mar", mrr=8240, churnPressure=33),
                AccountMetricPoint(month="Apr", mrr=8200, churnPressure=41),
            ],
        ),
        Account(
            id="acc_northstar_02",
            workspaceId=workspace_id,
            name="Northstar Labs",
            domain="northstar-labs.io",
            plan="Growth",
            owner="Daniel Ruiz",
            mrr=4200,
            churnProbability=0.76,
            healthScore=54,
            status="high_risk",
            lastActive="1 day ago",
            lastLoginDaysAgo=21,
            supportTickets=4,
            usageFrequency=4,
            primaryRisk="No product engagement from the admin cohort",
            recommendedAction="Success call and onboarding reset",
            tags=["engagement", "renewal"],
            drivers=[
                RiskDriver(label="Last login", value="21 days ago"),
                RiskDriver(label="Support tickets", value="4 pending"),
                RiskDriver(label="Usage trend", value="-31% over 30 days"),
            ],
            trend=[
                AccountMetricPoint(month="Jan", mrr=4350, churnPressure=24),
                AccountMetricPoint(month="Feb", mrr=4300, churnPressure=31),
                AccountMetricPoint(month="Mar", mrr=4240, churnPressure=39),
                AccountMetricPoint(month="Apr", mrr=4200, churnPressure=54),
            ],
        ),
        Account(
            id="acc_orbit_03",
            workspaceId=workspace_id,
            name="Orbit Logistics",
            domain="orbitlogistics.com",
            plan="Growth",
            owner="Sana Shah",
            mrr=3150,
            churnProbability=0.61,
            healthScore=67,
            status="watch",
            lastActive="3 days ago",
            lastLoginDaysAgo=11,
            supportTickets=2,
            usageFrequency=7,
            primaryRisk="Feature adoption stalled after launch",
            recommendedAction="Automated email with usage tips",
            tags=["adoption", "feature-led"],
            drivers=[
                RiskDriver(label="Last login", value="11 days ago"),
                RiskDriver(label="Support tickets", value="2 low severity"),
                RiskDriver(label="Feature adoption", value="Workflow export not used"),
            ],
            trend=[
                AccountMetricPoint(month="Jan", mrr=3110, churnPressure=18),
                AccountMetricPoint(month="Feb", mrr=3130, churnPressure=22),
                AccountMetricPoint(month="Mar", mrr=3140, churnPressure=28),
                AccountMetricPoint(month="Apr", mrr=3150, churnPressure=33),
            ],
        ),
        Account(
            id="acc_solstice_04",
            workspaceId=workspace_id,
            name="Solstice Health",
            domain="solsticehealth.org",
            plan="Enterprise",
            owner="Ava Patel",
            mrr=9600,
            churnProbability=0.52,
            healthScore=72,
            status="watch",
            lastActive="5 hours ago",
            lastLoginDaysAgo=5,
            supportTickets=3,
            usageFrequency=9,
            primaryRisk="Champion changing roles inside the account",
            recommendedAction="Executive check-in and roadmap alignment",
            tags=["expansion", "stakeholder risk"],
            drivers=[
                RiskDriver(label="Last login", value="5 days ago"),
                RiskDriver(label="Support tickets", value="3 open"),
                RiskDriver(label="Stakeholder change", value="Admin champion promoted"),
            ],
            trend=[
                AccountMetricPoint(month="Jan", mrr=9500, churnPressure=16),
                AccountMetricPoint(month="Feb", mrr=9550, churnPressure=20),
                AccountMetricPoint(month="Mar", mrr=9580, churnPressure=24),
                AccountMetricPoint(month="Apr", mrr=9600, churnPressure=29),
            ],
        ),
        Account(
            id="acc_vector_05",
            workspaceId=workspace_id,
            name="Vector Retail",
            domain="vectorretail.co",
            plan="Pro",
            owner="Nadia Karim",
            mrr=1800,
            churnProbability=0.38,
            healthScore=81,
            status="stable",
            lastActive="12 hours ago",
            lastLoginDaysAgo=2,
            supportTickets=1,
            usageFrequency=15,
            primaryRisk="Mild seasonal slowdown",
            recommendedAction="Keep monitoring",
            tags=["healthy", "expansion"],
            drivers=[
                RiskDriver(label="Last login", value="2 days ago"),
                RiskDriver(label="Support tickets", value="1 low priority"),
                RiskDriver(label="Usage trend", value="Up 18% after onboarding"),
            ],
            trend=[
                AccountMetricPoint(month="Jan", mrr=1700, churnPressure=14),
                AccountMetricPoint(month="Feb", mrr=1730, churnPressure=16),
                AccountMetricPoint(month="Mar", mrr=1760, churnPressure=20),
                AccountMetricPoint(month="Apr", mrr=1800, churnPressure=22),
            ],
        ),
    ]


def _base_campaigns() -> dict[str, Campaign]:
    campaigns = [
        Campaign(
            id="cmp_001",
            accountId="acc_acme_01",
            campaignType="founder_email",
            status="deployed",
            subject="A quick note about Acme Robotics",
            body="We noticed the reporting workflow has slowed down and wanted to help you recover the ROI quickly.",
            channel="Email",
            createdAt="Today, 08:40",
            deployedAt="Today, 08:48",
            roiEstimate="$8.2k retained",
        ),
        Campaign(
            id="cmp_002",
            accountId="acc_northstar_02",
            campaignType="success_call",
            status="queued",
            subject="Should we schedule a reset call?",
            body="Your product champion would likely benefit from a 20-minute success call and a tighter onboarding map.",
            channel="Email + task",
            createdAt="Today, 10:00",
            deployedAt=None,
            roiEstimate="$4.2k retained",
        ),
    ]

    return {campaign.id: campaign for campaign in campaigns}


def _base_playbooks() -> list[Playbook]:
    return [
        Playbook(
            id="pb_founder_email",
            name="Founder escalation",
            trigger="Probability above 0.85",
            action="Send empathetic founder email with a retention offer",
            audience="Enterprise accounts",
            status="active",
            lastRun="18 minutes ago",
            successRate=0.74,
        ),
        Playbook(
            id="pb_success_call",
            name="Success call route",
            trigger="Multiple support tickets and usage drop-off",
            action="Book a success call and attach a next-step checklist",
            audience="Growth accounts",
            status="active",
            lastRun="2 hours ago",
            successRate=0.69,
        ),
        Playbook(
            id="pb_feature_email",
            name="Feature adoption nudges",
            trigger="A feature has not been used for 14 days",
            action="Send contextual product education and a short video",
            audience="All active accounts",
            status="draft",
            lastRun="Not run yet",
            successRate=0.58,
        ),
    ]


def _base_integrations() -> list[IntegrationStatus]:
    return [
        IntegrationStatus(
            provider="stripe",
            displayName="Stripe",
            connected=True,
            healthy=True,
            mode="live",
            credentialState="ready",
            lastSync="4 minutes ago",
            description="Billing events and subscription changes are syncing cleanly.",
        ),
        IntegrationStatus(
            provider="mixpanel",
            displayName="Mixpanel",
            connected=True,
            healthy=True,
            mode="live",
            credentialState="ready",
            lastSync="9 minutes ago",
            description="Product usage signals are available for scoring and attribution.",
        ),
        IntegrationStatus(
            provider="openai",
            displayName="OpenAI",
            connected=True,
            healthy=True,
            mode="live",
            credentialState="ready",
            lastSync="12 minutes ago",
            description="Campaign generation is available for founder emails and playbooks.",
        ),
        IntegrationStatus(
            provider="intercom",
            displayName="Intercom",
            connected=False,
            healthy=False,
            mode="mock",
            credentialState="missing",
            lastSync="Not connected",
            description="Support events can be added once the token is configured.",
        ),
    ]


def _base_timeline() -> dict[str, list[TimelineEvent]]:
    return {
        "acc_acme_01": [
            TimelineEvent(
                id="evt_001",
                accountId="acc_acme_01",
                title="Usage drop detected",
                description="Seat activity fell 38% after the reporting release.",
                kind="signal",
                timestamp="Today, 08:10",
                channel="Product event",
            ),
            TimelineEvent(
                id="evt_002",
                accountId="acc_acme_01",
                title="Campaign deployed",
                description="Founder escalation email was queued with a discount fallback.",
                kind="campaign",
                timestamp="Today, 08:48",
                channel="Email",
            ),
            TimelineEvent(
                id="evt_003",
                accountId="acc_acme_01",
                title="Billing retry failed",
                description="Latest card retry failed and the card-on-file needs a replacement.",
                kind="billing",
                timestamp="Yesterday, 16:20",
                channel="Stripe",
            ),
        ],
        "acc_northstar_02": [
            TimelineEvent(
                id="evt_004",
                accountId="acc_northstar_02",
                title="Support ticket spike",
                description="Product adoption questions appeared in onboarding and analytics.",
                kind="support",
                timestamp="Yesterday, 11:00",
                channel="Helpdesk",
            )
        ],
    }


def create_demo_workspace(
    workspace_id: str = "org_demo_anchoryn",
    workspace_name: str = "Anchoryn Launch Preview",
    mode: WorkspaceMode = "demo",
) -> WorkspaceState:
    workspace = Workspace(
        workspaceId=workspace_id,
        workspaceName=workspace_name,
        plan="Growth",
        role="owner",
        mode=mode,
        ownerEmail="founder@anchoryn.demo",
        subscriptionStatus="trialing" if mode == "demo" else "active",
    )

    return WorkspaceState(
        workspace=workspace,
        accounts=_base_accounts(workspace_id),
        campaigns=_base_campaigns(),
        playbooks=_base_playbooks(),
        integrations=_base_integrations(),
        timeline=_base_timeline(),
    )


def clone_workspace_state(state: WorkspaceState, workspace_id: str, workspace_name: str) -> WorkspaceState:
    clone = deepcopy(state)
    clone.workspace.workspaceId = workspace_id
    clone.workspace.workspaceName = workspace_name
    for account in clone.accounts:
        account.workspaceId = workspace_id
    return clone
