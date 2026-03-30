import type {
  Account,
  ApiKeySummary,
  BillingPlan,
  Campaign,
  DashboardSummary,
  FAQ,
  IntegrationStatus,
  Invoice,
  Playbook,
  PricingPlan,
  ReportSummary,
  SessionInfo,
  TeamMember,
  Testimonial,
  TimelineEvent,
  WebhookEndpoint,
  WorkspaceSession,
} from "@/lib/types";

export const marketingStats = [
  { label: "Revenue at risk recovered", value: "$182k", note: "modeled across the last 90 days" },
  { label: "Predictions refreshed", value: "1.4M", note: "signals processed weekly across orgs" },
  { label: "Retention lift", value: "27%", note: "median improvement after playbook rollout" },
  { label: "Customer ops time saved", value: "11 hrs", note: "per analyst each week" },
];

export const valuePillars = [
  {
    title: "Detect hidden churn pressure",
    description:
      "Unify billing failures, product usage decay, support turbulence, and engagement changes into one explainable score.",
  },
  {
    title: "Explain the risk clearly",
    description:
      "Surface the top factors, forecasted churn timing, and what changed, so operators trust the signal before they act.",
  },
  {
    title: "Act with speed",
    description:
      "Turn risk into a playbook, outreach draft, task, or webhook without handoffs across disconnected tools.",
  },
];

export const solutionCards = [
  {
    title: "Retention for founders",
    description:
      "Board-ready revenue exposure, churn summaries, and upgrade prompts with the right level of detail for leadership.",
  },
  {
    title: "Customer success for operators",
    description:
      "A queue-first workflow with customer detail, notes, interventions, and AI-generated next steps in one place.",
  },
  {
    title: "RevOps for scaling teams",
    description:
      "Shared segments, reports, API access, and integrations that keep retention work grounded in actual operational data.",
  },
];

export const featureHighlights = [
  "Customer 360 views with timeline, notes, and intervention history",
  "Manual and scheduled AI churn analysis with explanation layers",
  "Revenue-at-risk, cohort heatmaps, and predictive LTV surfaces",
  "Playbooks, campaign drafting, and conversion performance tracking",
  "Billing control with Stripe checkout, portal, invoices, and limits",
  "Integrations for Stripe, Slack, CSV, REST API, webhooks, and more",
];

export const pricingPlans: PricingPlan[] = [
  {
    name: "Starter",
    priceMonthly: 49,
    priceYearly: 470,
    description: "Launch your retention motion with weekly scoring and no-code onboarding.",
    cta: "Start free trial",
    features: [
      "Up to 500 customers tracked",
      "Basic churn prediction refreshed weekly",
      "CSV import only",
      "Email alerts",
      "1 team member",
      "3 months data history",
    ],
  },
  {
    name: "Growth",
    priceMonthly: 149,
    priceYearly: 1430,
    description: "For teams operationalizing daily retention workflows across CS and RevOps.",
    cta: "Choose Growth",
    featured: true,
    badge: "Most popular",
    features: [
      "Up to 5,000 customers",
      "Advanced AI predictions refreshed daily",
      "Stripe, HubSpot, and Salesforce integrations",
      "Slack and webhook alerts",
      "Up to 5 team members",
      "12 months data history",
      "Up to 10 custom playbooks",
      "Priority email support",
    ],
  },
  {
    name: "Scale",
    priceMonthly: 399,
    priceYearly: 3830,
    description: "Real-time retention operations, APIs, and automation for mature SaaS teams.",
    cta: "Upgrade to Scale",
    features: [
      "Unlimited customers",
      "Real-time AI predictions",
      "All integrations plus Zapier and REST API",
      "Unlimited team members",
      "Unlimited data history",
      "Unlimited custom playbooks",
      "Custom report builder",
      "Dedicated Slack support",
      "SLA guarantee",
    ],
  },
  {
    name: "Enterprise",
    priceMonthly: null,
    priceYearly: null,
    description: "Custom AI, SSO, white-labeling, and deployment models for complex organizations.",
    cta: "Talk to sales",
    features: [
      "Everything in Scale",
      "Custom AI model tuning",
      "SSO / SAML",
      "Custom data retention policies",
      "White-label option",
      "Dedicated account manager",
      "On-premise deployment",
    ],
  },
];

export const docsCards = [
  {
    title: "Authentication and sessions",
    description: "JWT lifecycle, refresh rotation, session revocation, and role enforcement details.",
  },
  {
    title: "Customer and reporting APIs",
    description: "Public `/api/v1` resources, envelopes, auth, rate limits, and response examples.",
  },
  {
    title: "Integrations and deployment",
    description: "Connector setup, Stripe webhooks, production env vars, and cloud deployment steps.",
  },
];

export const contactChannels = [
  {
    title: "Sales",
    detail: "sales@anchoryn.com",
    description: "Pricing, enterprise plans, and rollout planning.",
  },
  {
    title: "Support",
    detail: "support@anchoryn.com",
    description: "Product help, billing questions, and environment issues.",
  },
  {
    title: "Partnerships",
    detail: "partners@anchoryn.com",
    description: "Integrations, agencies, and ecosystem opportunities.",
  },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "Anchoryn gave our CS team one place to see revenue risk, understand it, and actually do something about it before renewals slipped.",
    author: "Melissa Gray",
    role: "VP Customer Success",
    company: "Northlane Cloud",
  },
  {
    quote:
      "The revenue-at-risk lens changed how our leadership team talks about churn. It stopped being anecdotal and became operational.",
    author: "Rahul Kapoor",
    role: "COO",
    company: "OrbitStack",
  },
  {
    quote:
      "We replaced a spreadsheet ritual and three dashboards with one workflow. That alone paid for the rollout.",
    author: "Sofia Mendez",
    role: "Head of RevOps",
    company: "Ledgerline",
  },
];

export const faqs: FAQ[] = [
  {
    question: "How quickly can we get value from Anchoryn?",
    answer:
      "Teams usually start with CSV or Stripe data in under an hour, then layer on alerts, playbooks, and daily prediction refreshes as the workspace matures.",
  },
  {
    question: "Do we need a data team to run it?",
    answer:
      "No. Anchoryn is designed for operators, founders, and CS teams. The setup flow handles thresholds, connectors, and notification defaults without engineering work.",
  },
  {
    question: "Can we control when alerts fire?",
    answer:
      "Yes. Quiet hours, per-channel preferences, deduplication, and threshold tuning all live in the product.",
  },
  {
    question: "What happens if the AI provider is unavailable?",
    answer:
      "The scoring engine falls back to deterministic heuristics, so your queue and reporting stay available even if natural-language explanations are delayed.",
  },
];

export const teamMembers: TeamMember[] = [
  {
    id: "tm_01",
    name: "Maya Chen",
    email: "maya@anchoryn.demo",
    role: "owner",
    status: "active",
    lastActive: "2 minutes ago",
  },
  {
    id: "tm_02",
    name: "Daniel Ruiz",
    email: "daniel@anchoryn.demo",
    role: "admin",
    status: "active",
    lastActive: "12 minutes ago",
  },
  {
    id: "tm_03",
    name: "Sana Shah",
    email: "sana@anchoryn.demo",
    role: "analyst",
    status: "active",
    lastActive: "32 minutes ago",
  },
  {
    id: "tm_04",
    name: "Ava Patel",
    email: "ava@anchoryn.demo",
    role: "viewer",
    status: "invited",
    lastActive: "Invitation pending",
  },
];

export const activeSessions: SessionInfo[] = [
  {
    id: "ses_01",
    device: "Chrome on macOS",
    location: "Lahore, PK",
    lastActive: "Current session",
    current: true,
  },
  {
    id: "ses_02",
    device: "Safari on iPhone",
    location: "Dubai, AE",
    lastActive: "Yesterday at 18:40",
    current: false,
  },
];

export const apiKeys: ApiKeySummary[] = [
  {
    id: "key_01",
    name: "Revenue warehouse sync",
    prefix: "ank_live_51f8",
    scopes: ["customers:write", "events:write", "reports:read"],
    lastUsedAt: "18 minutes ago",
    status: "active",
  },
  {
    id: "key_02",
    name: "Internal dashboard export",
    prefix: "ank_live_08aa",
    scopes: ["reports:read"],
    lastUsedAt: "2 days ago",
    status: "active",
  },
];

export const webhookEndpoints: WebhookEndpoint[] = [
  {
    id: "wh_01",
    url: "https://hooks.slack.com/services/anchoryn-demo",
    events: ["customer.risk_changed", "report.completed"],
    status: "active",
    lastTriggeredAt: "Today, 09:14",
  },
  {
    id: "wh_02",
    url: "https://ops.example.com/retention",
    events: ["playbook.triggered"],
    status: "paused",
    lastTriggeredAt: "Last week",
  },
];

export const invoices: Invoice[] = [
  {
    id: "inv_2026_03",
    issuedAt: "Mar 01, 2026",
    amount: "$149.00",
    status: "paid",
    pdfUrl: "#invoice-2026-03",
  },
  {
    id: "inv_2026_02",
    issuedAt: "Feb 01, 2026",
    amount: "$149.00",
    status: "paid",
    pdfUrl: "#invoice-2026-02",
  },
];

export const demoReports: ReportSummary[] = [
  {
    id: "rep_01",
    name: "Monthly churn summary",
    type: "Executive report",
    cadence: "Monthly",
    lastRun: "Today, 07:30",
    status: "ready",
  },
  {
    id: "rep_02",
    name: "At-risk cohort monitor",
    type: "Operational report",
    cadence: "Weekly",
    lastRun: "Yesterday, 16:10",
    status: "scheduled",
  },
  {
    id: "rep_03",
    name: "Revenue impact rollup",
    type: "Finance report",
    cadence: "Weekly",
    lastRun: "Running now",
    status: "running",
  },
];

export const demoIntegrations: IntegrationStatus[] = [
  {
    provider: "stripe",
    displayName: "Stripe",
    connected: true,
    healthy: true,
    mode: "live",
    credentialState: "ready",
    lastSync: "4 minutes ago",
    description: "Billing events, subscriptions, and failed charges are syncing cleanly.",
  },
  {
    provider: "slack",
    displayName: "Slack",
    connected: true,
    healthy: true,
    mode: "live",
    credentialState: "ready",
    lastSync: "9 minutes ago",
    description: "Alerts and routed escalation notifications are active.",
  },
  {
    provider: "csv",
    displayName: "CSV Import",
    connected: true,
    healthy: true,
    mode: "live",
    credentialState: "ready",
    lastSync: "Yesterday",
    description: "Imports are validated, previewed, and stored for replay.",
  },
  {
    provider: "api",
    displayName: "REST API",
    connected: true,
    healthy: true,
    mode: "live",
    credentialState: "ready",
    lastSync: "18 minutes ago",
    description: "Public API keys are active with rate limits and usage tracking.",
  },
  {
    provider: "webhooks",
    displayName: "Webhooks",
    connected: true,
    healthy: true,
    mode: "live",
    credentialState: "partial",
    lastSync: "32 minutes ago",
    description: "Two destinations registered; one is currently paused.",
  },
  {
    provider: "hubspot",
    displayName: "HubSpot",
    connected: false,
    healthy: false,
    mode: "mock",
    credentialState: "missing",
    lastSync: "Not connected",
    description: "Available next in the connector framework for GTM teams.",
  },
];

export const demoCustomers: Account[] = [
  {
    id: "cus_acme_01",
    organizationId: "org_demo_anchoryn",
    externalId: "acct_1209",
    name: "Acme Robotics",
    email: "ops@acme-robotics.com",
    company: "Acme Robotics",
    domain: "acme-robotics.com",
    segment: "Enterprise",
    plan: "Scale",
    owner: "Maya Chen",
    mrr: 8200,
    churnProbability: 0.89,
    riskLevel: "critical",
    healthScore: 41,
    status: "high_risk",
    lastActive: "2 hours ago",
    lastLoginDaysAgo: 18,
    supportTickets: 7,
    usageFrequency: 3,
    featureUsageScore: 41,
    billingFailures: 2,
    npsScore: 4,
    predictedChurnDate: "Apr 24, 2026",
    primaryRisk: "Usage drop-off, failed retries, and support noise are converging inside the renewal window.",
    recommendedAction: "Founder email with discount backup",
    recommendedActions: [
      {
        id: "act_01",
        title: "Send executive outreach",
        description: "Ask for a 20-minute recovery call and acknowledge the billing friction directly.",
        priority: "urgent",
        channel: "Email",
      },
      {
        id: "act_02",
        title: "Offer short-term discount",
        description: "Use a recovery incentive only if the executive call is accepted.",
        priority: "high",
        channel: "Billing",
      },
    ],
    tags: ["billing", "usage", "high value"],
    drivers: [
      { label: "Last login", value: "18 days ago", score: 0.92 },
      { label: "Support tickets", value: "7 open", score: 0.88 },
      { label: "Feature adoption", value: "Reporting module down 42%", score: 0.81 },
    ],
    trend: [
      { month: "Jan", mrr: 8300, churnPressure: 22, retainedRevenue: 0, riskRate: 0.22 },
      { month: "Feb", mrr: 8280, churnPressure: 26, retainedRevenue: 0, riskRate: 0.26 },
      { month: "Mar", mrr: 8240, churnPressure: 33, retainedRevenue: 0, riskRate: 0.33 },
      { month: "Apr", mrr: 8200, churnPressure: 41, retainedRevenue: 0, riskRate: 0.41 },
    ],
  },
  {
    id: "cus_northstar_02",
    organizationId: "org_demo_anchoryn",
    externalId: "acct_2180",
    name: "Northstar Labs",
    email: "growth@northstar-labs.io",
    company: "Northstar Labs",
    domain: "northstar-labs.io",
    segment: "Growth",
    plan: "Growth",
    owner: "Daniel Ruiz",
    mrr: 4200,
    churnProbability: 0.76,
    riskLevel: "high",
    healthScore: 54,
    status: "high_risk",
    lastActive: "1 day ago",
    lastLoginDaysAgo: 21,
    supportTickets: 4,
    usageFrequency: 4,
    featureUsageScore: 58,
    billingFailures: 0,
    npsScore: 6,
    predictedChurnDate: "May 02, 2026",
    primaryRisk: "Product engagement from the admin cohort has softened during onboarding.",
    recommendedAction: "Success call and onboarding reset",
    recommendedActions: [
      {
        id: "act_03",
        title: "Book a reset call",
        description: "Walk the admin through reporting and activation milestones.",
        priority: "urgent",
        channel: "Call",
      },
    ],
    tags: ["engagement", "renewal"],
    drivers: [
      { label: "Last login", value: "21 days ago", score: 0.74 },
      { label: "Support tickets", value: "4 pending", score: 0.62 },
      { label: "Usage trend", value: "-31% over 30 days", score: 0.78 },
    ],
    trend: [
      { month: "Jan", mrr: 4350, churnPressure: 24, riskRate: 0.24 },
      { month: "Feb", mrr: 4300, churnPressure: 31, riskRate: 0.31 },
      { month: "Mar", mrr: 4240, churnPressure: 39, riskRate: 0.39 },
      { month: "Apr", mrr: 4200, churnPressure: 54, riskRate: 0.54 },
    ],
  },
  {
    id: "cus_orbit_03",
    organizationId: "org_demo_anchoryn",
    externalId: "acct_8821",
    name: "Orbit Logistics",
    email: "ops@orbitlogistics.com",
    company: "Orbit Logistics",
    domain: "orbitlogistics.com",
    segment: "Mid-market",
    plan: "Growth",
    owner: "Sana Shah",
    mrr: 3150,
    churnProbability: 0.61,
    riskLevel: "high",
    healthScore: 67,
    status: "watch",
    lastActive: "3 days ago",
    lastLoginDaysAgo: 11,
    supportTickets: 2,
    usageFrequency: 7,
    featureUsageScore: 64,
    billingFailures: 0,
    npsScore: 7,
    predictedChurnDate: "May 18, 2026",
    primaryRisk: "Feature adoption stalled after launch and usage is concentrating in one team.",
    recommendedAction: "Automated email with usage tips",
    recommendedActions: [
      {
        id: "act_04",
        title: "Send product education",
        description: "Highlight underused workflows and offer a tailored walkthrough.",
        priority: "high",
        channel: "Email",
      },
    ],
    tags: ["adoption", "feature-led"],
    drivers: [
      { label: "Last login", value: "11 days ago", score: 0.51 },
      { label: "Support tickets", value: "2 low severity", score: 0.32 },
      { label: "Feature adoption", value: "Workflow export not used", score: 0.57 },
    ],
    trend: [
      { month: "Jan", mrr: 3110, churnPressure: 18, riskRate: 0.18 },
      { month: "Feb", mrr: 3130, churnPressure: 22, riskRate: 0.22 },
      { month: "Mar", mrr: 3140, churnPressure: 28, riskRate: 0.28 },
      { month: "Apr", mrr: 3150, churnPressure: 33, riskRate: 0.33 },
    ],
  },
  {
    id: "cus_solstice_04",
    organizationId: "org_demo_anchoryn",
    externalId: "acct_7711",
    name: "Solstice Health",
    email: "success@solsticehealth.org",
    company: "Solstice Health",
    domain: "solsticehealth.org",
    segment: "Enterprise",
    plan: "Scale",
    owner: "Ava Patel",
    mrr: 9600,
    churnProbability: 0.52,
    riskLevel: "medium",
    healthScore: 72,
    status: "watch",
    lastActive: "5 hours ago",
    lastLoginDaysAgo: 5,
    supportTickets: 3,
    usageFrequency: 9,
    featureUsageScore: 74,
    billingFailures: 0,
    npsScore: 8,
    predictedChurnDate: "Jun 03, 2026",
    primaryRisk: "A stakeholder change introduces renewal uncertainty despite steady product usage.",
    recommendedAction: "Executive check-in and roadmap alignment",
    recommendedActions: [
      {
        id: "act_05",
        title: "Brief the new champion",
        description: "Send a tailored value summary with roadmap context and SLA coverage.",
        priority: "medium",
        channel: "Email",
      },
    ],
    tags: ["expansion", "stakeholder risk"],
    drivers: [
      { label: "Last login", value: "5 days ago", score: 0.24 },
      { label: "Support tickets", value: "3 open", score: 0.33 },
      { label: "Stakeholder change", value: "Admin champion promoted", score: 0.68 },
    ],
    trend: [
      { month: "Jan", mrr: 9500, churnPressure: 16, riskRate: 0.16 },
      { month: "Feb", mrr: 9550, churnPressure: 20, riskRate: 0.2 },
      { month: "Mar", mrr: 9580, churnPressure: 24, riskRate: 0.24 },
      { month: "Apr", mrr: 9600, churnPressure: 29, riskRate: 0.29 },
    ],
  },
  {
    id: "cus_vector_05",
    organizationId: "org_demo_anchoryn",
    externalId: "acct_1193",
    name: "Vector Retail",
    email: "ops@vectorretail.co",
    company: "Vector Retail",
    domain: "vectorretail.co",
    segment: "SMB",
    plan: "Starter",
    owner: "Nadia Karim",
    mrr: 1800,
    churnProbability: 0.38,
    riskLevel: "medium",
    healthScore: 81,
    status: "stable",
    lastActive: "12 hours ago",
    lastLoginDaysAgo: 2,
    supportTickets: 1,
    usageFrequency: 15,
    featureUsageScore: 88,
    billingFailures: 0,
    npsScore: 9,
    predictedChurnDate: "Jul 20, 2026",
    primaryRisk: "Seasonal softness is visible, but the account is still broadly healthy.",
    recommendedAction: "Keep monitoring",
    recommendedActions: [
      {
        id: "act_06",
        title: "Monitor only",
        description: "No intervention required; keep the account in the healthy segment.",
        priority: "low",
        channel: "In-app",
      },
    ],
    tags: ["healthy", "expansion"],
    drivers: [
      { label: "Last login", value: "2 days ago", score: 0.11 },
      { label: "Support tickets", value: "1 low priority", score: 0.12 },
      { label: "Usage trend", value: "Up 18% after onboarding", score: 0.09 },
    ],
    trend: [
      { month: "Jan", mrr: 1700, churnPressure: 14, riskRate: 0.14 },
      { month: "Feb", mrr: 1730, churnPressure: 16, riskRate: 0.16 },
      { month: "Mar", mrr: 1760, churnPressure: 20, riskRate: 0.2 },
      { month: "Apr", mrr: 1800, churnPressure: 22, riskRate: 0.22 },
    ],
  },
];

export const demoAccounts = demoCustomers;

export const demoPlaybooks: Playbook[] = [
  {
    id: "pb_founder_email",
    name: "Executive rescue outreach",
    trigger: "Risk score above 0.85 and MRR above $5k",
    action: "Send empathetic executive email and open a success-call task",
    audience: "Enterprise accounts",
    status: "active",
    lastRun: "18 minutes ago",
    successRate: 0.74,
  },
  {
    id: "pb_success_call",
    name: "Onboarding reset",
    trigger: "Usage down and support tickets above 3",
    action: "Route to CSM call, then send adoption checklist",
    audience: "Growth accounts",
    status: "active",
    lastRun: "2 hours ago",
    successRate: 0.69,
  },
  {
    id: "pb_feature_email",
    name: "Dormant feature nudge",
    trigger: "Feature has not been used for 14 days",
    action: "Send contextual education and a short walkthrough video",
    audience: "All active accounts",
    status: "draft",
    lastRun: "Not run yet",
    successRate: 0.58,
  },
];

export const demoCampaigns: Campaign[] = [
  {
    id: "cmp_001",
    accountId: "cus_acme_01",
    campaignType: "founder_email",
    status: "deployed",
    subject: "A direct note from the Anchoryn team about Acme Robotics",
    body: "We noticed reporting usage and billing health both weakened this week. We would like to help your team recover value quickly with a short reset plan and temporary retention support.",
    channel: "Email",
    createdAt: "Today, 08:40",
    deployedAt: "Today, 08:48",
    roiEstimate: "$8.2k retained",
  },
  {
    id: "cmp_002",
    accountId: "cus_northstar_02",
    campaignType: "success_call",
    status: "queued",
    subject: "Should we schedule a reset session for Northstar Labs?",
    body: "Your admin users appear to be drifting after onboarding. We recommend a guided reset call and a shorter adoption checklist to regain momentum.",
    channel: "Email + task",
    createdAt: "Today, 10:00",
    deployedAt: null,
    roiEstimate: "$4.2k retained",
  },
];

export const demoTimeline: TimelineEvent[] = [
  {
    id: "evt_001",
    accountId: "cus_acme_01",
    title: "Usage drop detected",
    description: "Seat activity fell 38% after the reporting release.",
    kind: "signal",
    timestamp: "Today, 08:10",
    channel: "Product event",
  },
  {
    id: "evt_002",
    accountId: "cus_acme_01",
    title: "Campaign deployed",
    description: "Executive rescue outreach was deployed with a discount fallback.",
    kind: "campaign",
    timestamp: "Today, 08:48",
    channel: "Email",
  },
  {
    id: "evt_003",
    accountId: "cus_acme_01",
    title: "Billing retry failed",
    description: "The latest card retry failed and the account is at risk of involuntary churn.",
    kind: "billing",
    timestamp: "Yesterday, 16:20",
    channel: "Stripe",
  },
  {
    id: "evt_004",
    accountId: "cus_northstar_02",
    title: "Support ticket spike",
    description: "Adoption questions increased in onboarding and analytics workflows.",
    kind: "support",
    timestamp: "Yesterday, 11:00",
    channel: "Helpdesk",
  },
];

export const currentPlan: BillingPlan = pricingPlans[1];

export const demoSession: WorkspaceSession = {
  organizationId: "org_demo_anchoryn",
  organizationName: "Anchoryn Launch Preview",
  workspaceId: "org_demo_anchoryn",
  workspaceName: "Anchoryn Launch Preview",
  slug: "launch-preview",
  role: "owner",
  mode: "demo",
  plan: "Growth",
  userEmail: "operator@anchoryn.demo",
  userName: "Launch Preview",
  emailVerified: true,
  timezone: "UTC",
  locale: "en",
  organizations: [
    {
      organizationId: "org_demo_anchoryn",
      organizationName: "Anchoryn Launch Preview",
      slug: "launch-preview",
      role: "owner",
      plan: "Growth",
      isActive: true,
    },
  ],
};

export function getDemoAccount(accountId: string) {
  return demoCustomers.find((account) => account.id === accountId) ?? demoCustomers[0];
}

export function getDemoTimeline(accountId: string) {
  return demoTimeline.filter((event) => event.accountId === accountId);
}

export function buildDemoCampaign(accountId: string): Campaign {
  const account = getDemoAccount(accountId);

  return {
    id: `cmp_${account.id}`,
    accountId: account.id,
    campaignType: account.churnProbability > 0.8 ? "founder_email" : "success_call",
    status: "draft",
    subject: `Retention plan for ${account.name}`,
    body: `We spotted a few signals that suggest ${account.name} would benefit from a focused recovery motion, starting with ${account.recommendedAction.toLowerCase()}.`,
    channel: "Email",
    createdAt: "Just now",
    deployedAt: null,
    roiEstimate: `$${Math.round(account.mrr)} retained`,
  };
}

export function buildDemoSummary(): DashboardSummary {
  const monthlyRevenue = demoCustomers.reduce((total, account) => total + account.mrr, 0);
  const revenueAtRisk = demoCustomers
    .filter((account) => account.churnProbability >= 0.6)
    .reduce((total, account) => total + account.mrr, 0);
  const highRiskAccounts = demoCustomers.filter(
    (account) => account.churnProbability >= 0.75
  ).length;

  return {
    organizationId: demoSession.organizationId,
    organizationName: demoSession.organizationName,
    workspaceId: demoSession.organizationId,
    workspaceName: demoSession.organizationName,
    role: demoSession.role,
    monthlyRevenue,
    revenueAtRisk,
    activeAccounts: demoCustomers.length,
    highRiskAccounts,
    campaignsRunning: demoCampaigns.length,
    retentionsSaved: 142,
    healthScore: 78,
    riskBreakdown: [
      { label: "Critical", value: 17, color: "#d66757" },
      { label: "High", value: 23, color: "#e3a23f" },
      { label: "Medium", value: 26, color: "#7da6d9" },
      { label: "Low", value: 34, color: "#2f8b68" },
    ],
    trend: [
      { month: "Jan", mrr: 118000, churnPressure: 22, retainedRevenue: 0, riskRate: 0.22 },
      { month: "Feb", mrr: 128000, churnPressure: 26, retainedRevenue: 14000, riskRate: 0.26 },
      { month: "Mar", mrr: 135000, churnPressure: 29, retainedRevenue: 21000, riskRate: 0.29 },
      { month: "Apr", mrr: 140000, churnPressure: 34, retainedRevenue: 27000, riskRate: 0.34 },
      { month: "May", mrr: 148000, churnPressure: 29, retainedRevenue: 31000, riskRate: 0.29 },
      { month: "Jun", mrr: 156000, churnPressure: 24, retainedRevenue: 36000, riskRate: 0.24 },
    ],
    featuredAccounts: [...demoCustomers]
      .sort((left, right) => right.churnProbability - left.churnProbability)
      .slice(0, 4),
    spotlightCampaigns: demoCampaigns,
    playbooks: demoPlaybooks,
    integrations: demoIntegrations,
    reports: demoReports,
    apiKeys,
    webhooks: webhookEndpoints,
    team: teamMembers,
    sessions: activeSessions,
    invoices,
  };
}
