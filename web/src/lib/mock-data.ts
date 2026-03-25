import type {
  Account,
  Campaign,
  DashboardSummary,
  IntegrationStatus,
  Playbook,
  TimelineEvent,
  WorkspaceSession,
} from "@/lib/types";

export const marketingStats = [
  { label: "Revenue at risk", value: "$24.5k", note: "saved this month" },
  { label: "Active interventions", value: "18", note: "across 7 playbooks" },
  { label: "Accounts monitored", value: "128", note: "demo workspace ready" },
  { label: "Churn reduction", value: "27%", note: "against last quarter" },
];

export const valuePillars = [
  {
    title: "Detect",
    description:
      "Stream billing, usage, support, and sentiment signals into a single workspace score.",
  },
  {
    title: "Diagnose",
    description:
      "Surface the exact drivers behind churn risk with account-level explanations and timelines.",
  },
  {
    title: "Act",
    description:
      "Turn every insight into a campaign, playbook, or revenue-saving intervention in one click.",
  },
];

export const solutionCards = [
  {
    title: "Founder dashboard",
    description:
      "A board-ready view of revenue at risk, retained revenue, and the highest leverage accounts.",
  },
  {
    title: "Customer success cockpit",
    description:
      "Prioritized action queues, account timelines, and campaign drafting for daily retention work.",
  },
  {
    title: "RevOps control plane",
    description:
      "Integrations, segments, and automations that keep the workspace aligned to operational data.",
  },
];

export const pricingPlans = [
  {
    name: "Starter",
    price: "$149",
    cadence: "/month",
    description: "For founders who want a polished signal layer and seeded demo workspace.",
    features: ["Dashboard, account detail, and demo workspace", "3 playbooks", "Email support"],
  },
  {
    name: "Growth",
    price: "$499",
    cadence: "/month",
    description: "For teams ready to operationalize interventions and billing alerts.",
    features: ["Auth, integrations hub, and billing portal", "Unlimited campaigns", "Workspace roles"],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "",
    description: "For multi-team SaaS companies with advanced routing and custom controls.",
    features: ["Multi-workspace architecture", "Custom playbooks and SLAs", "Dedicated onboarding"],
  },
];

export const docsCards = [
  {
    title: "Getting started",
    description: "How to run the app locally, connect the backend, and seed a workspace.",
  },
  {
    title: "API reference",
    description: "The `/v1` endpoints used by the dashboard, campaigns, billing, and integrations.",
  },
  {
    title: "Deployment",
    description: "How to point the frontend at the API and ship a production build safely.",
  },
];

export const contactChannels = [
  {
    title: "Sales",
    detail: "sales@synapse.ai",
    description: "For demos, pricing, and customer success workflows.",
  },
  {
    title: "Product",
    detail: "product@synapse.ai",
    description: "For roadmap, integrations, and custom workflow questions.",
  },
  {
    title: "Support",
    detail: "support@synapse.ai",
    description: "For environment setup, billing, and workspace access.",
  },
];

export const demoAccounts: Account[] = [
  {
    id: "acc_acme_01",
    workspaceId: "demo-synapse",
    name: "Acme Robotics",
    domain: "acme-robotics.com",
    plan: "Enterprise",
    owner: "Maya Chen",
    mrr: 8200,
    churnProbability: 0.89,
    healthScore: 41,
    status: "high_risk",
    lastActive: "2 hours ago",
    lastLoginDaysAgo: 18,
    supportTickets: 7,
    usageFrequency: 3,
    primaryRisk: "Usage drop-off and repeated billing failures",
    recommendedAction: "Founder email with discount backup",
    tags: ["billing", "usage", "high value"],
    drivers: [
      { label: "Last login", value: "18 days ago" },
      { label: "Support tickets", value: "7 open" },
      { label: "Feature adoption", value: "Reporting module down 42%" },
    ],
    trend: [
      { month: "Jan", mrr: 8300, churnPressure: 22 },
      { month: "Feb", mrr: 8280, churnPressure: 26 },
      { month: "Mar", mrr: 8240, churnPressure: 33 },
      { month: "Apr", mrr: 8200, churnPressure: 41 },
    ],
  },
  {
    id: "acc_northstar_02",
    workspaceId: "demo-synapse",
    name: "Northstar Labs",
    domain: "northstar-labs.io",
    plan: "Growth",
    owner: "Daniel Ruiz",
    mrr: 4200,
    churnProbability: 0.76,
    healthScore: 54,
    status: "high_risk",
    lastActive: "1 day ago",
    lastLoginDaysAgo: 21,
    supportTickets: 4,
    usageFrequency: 4,
    primaryRisk: "No product engagement from the admin cohort",
    recommendedAction: "Success call and onboarding reset",
    tags: ["engagement", "renewal"],
    drivers: [
      { label: "Last login", value: "21 days ago" },
      { label: "Support tickets", value: "4 pending" },
      { label: "Usage trend", value: "-31% over 30 days" },
    ],
    trend: [
      { month: "Jan", mrr: 4350, churnPressure: 24 },
      { month: "Feb", mrr: 4300, churnPressure: 31 },
      { month: "Mar", mrr: 4240, churnPressure: 39 },
      { month: "Apr", mrr: 4200, churnPressure: 54 },
    ],
  },
  {
    id: "acc_orbit_03",
    workspaceId: "demo-synapse",
    name: "Orbit Logistics",
    domain: "orbitlogistics.com",
    plan: "Growth",
    owner: "Sana Shah",
    mrr: 3150,
    churnProbability: 0.61,
    healthScore: 67,
    status: "watch",
    lastActive: "3 days ago",
    lastLoginDaysAgo: 11,
    supportTickets: 2,
    usageFrequency: 7,
    primaryRisk: "Feature adoption stalled after launch",
    recommendedAction: "Automated email with usage tips",
    tags: ["adoption", "feature-led"],
    drivers: [
      { label: "Last login", value: "11 days ago" },
      { label: "Support tickets", value: "2 low severity" },
      { label: "Feature adoption", value: "Workflow export not used" },
    ],
    trend: [
      { month: "Jan", mrr: 3110, churnPressure: 18 },
      { month: "Feb", mrr: 3130, churnPressure: 22 },
      { month: "Mar", mrr: 3140, churnPressure: 28 },
      { month: "Apr", mrr: 3150, churnPressure: 33 },
    ],
  },
  {
    id: "acc_solstice_04",
    workspaceId: "demo-synapse",
    name: "Solstice Health",
    domain: "solsticehealth.org",
    plan: "Enterprise",
    owner: "Ava Patel",
    mrr: 9600,
    churnProbability: 0.52,
    healthScore: 72,
    status: "watch",
    lastActive: "5 hours ago",
    lastLoginDaysAgo: 5,
    supportTickets: 3,
    usageFrequency: 9,
    primaryRisk: "Champion changing roles inside the account",
    recommendedAction: "Executive check-in and roadmap alignment",
    tags: ["expansion", "stakeholder risk"],
    drivers: [
      { label: "Last login", value: "5 days ago" },
      { label: "Support tickets", value: "3 open" },
      { label: "Stakeholder change", value: "Admin champion promoted" },
    ],
    trend: [
      { month: "Jan", mrr: 9500, churnPressure: 16 },
      { month: "Feb", mrr: 9550, churnPressure: 20 },
      { month: "Mar", mrr: 9580, churnPressure: 24 },
      { month: "Apr", mrr: 9600, churnPressure: 29 },
    ],
  },
  {
    id: "acc_vector_05",
    workspaceId: "demo-synapse",
    name: "Vector Retail",
    domain: "vectorretail.co",
    plan: "Pro",
    owner: "Nadia Karim",
    mrr: 1800,
    churnProbability: 0.38,
    healthScore: 81,
    status: "stable",
    lastActive: "12 hours ago",
    lastLoginDaysAgo: 2,
    supportTickets: 1,
    usageFrequency: 15,
    primaryRisk: "Mild seasonal slowdown",
    recommendedAction: "Keep monitoring",
    tags: ["healthy", "expansion"],
    drivers: [
      { label: "Last login", value: "2 days ago" },
      { label: "Support tickets", value: "1 low priority" },
      { label: "Usage trend", value: "Up 18% after onboarding" },
    ],
    trend: [
      { month: "Jan", mrr: 1700, churnPressure: 14 },
      { month: "Feb", mrr: 1730, churnPressure: 16 },
      { month: "Mar", mrr: 1760, churnPressure: 20 },
      { month: "Apr", mrr: 1800, churnPressure: 22 },
    ],
  },
];

export const demoPlaybooks: Playbook[] = [
  {
    id: "pb_founder_email",
    name: "Founder escalation",
    trigger: "Probability above 0.85",
    action: "Send empathetic founder email with a retention offer",
    audience: "Enterprise accounts",
    status: "active",
    lastRun: "18 minutes ago",
    successRate: 0.74,
  },
  {
    id: "pb_success_call",
    name: "Success call route",
    trigger: "Multiple support tickets and usage drop-off",
    action: "Book a success call and attach a next-step checklist",
    audience: "Growth accounts",
    status: "active",
    lastRun: "2 hours ago",
    successRate: 0.69,
  },
  {
    id: "pb_feature_email",
    name: "Feature adoption nudges",
    trigger: "A feature has not been used for 14 days",
    action: "Send contextual product education and a short video",
    audience: "All active accounts",
    status: "draft",
    lastRun: "Not run yet",
    successRate: 0.58,
  },
];

export const demoCampaigns: Campaign[] = [
  {
    id: "cmp_001",
    accountId: "acc_acme_01",
    campaignType: "founder_email",
    status: "deployed",
    subject: "A quick note about Acme Robotics",
    body: "We noticed the reporting workflow has slowed down and wanted to help you recover the ROI quickly.",
    channel: "Email",
    createdAt: "Today, 08:40",
    deployedAt: "Today, 08:48",
    roiEstimate: "$8.2k retained",
  },
  {
    id: "cmp_002",
    accountId: "acc_northstar_02",
    campaignType: "success_call",
    status: "queued",
    subject: "Should we schedule a reset call?",
    body: "Your product champion would likely benefit from a 20-minute success call and a tighter onboarding map.",
    channel: "Email + task",
    createdAt: "Today, 10:00",
    deployedAt: null,
    roiEstimate: "$4.2k retained",
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
    description: "Billing events and subscription changes are syncing cleanly.",
  },
  {
    provider: "mixpanel",
    displayName: "Mixpanel",
    connected: true,
    healthy: true,
    mode: "live",
    credentialState: "ready",
    lastSync: "9 minutes ago",
    description: "Product usage signals are available for scoring and attribution.",
  },
  {
    provider: "openai",
    displayName: "OpenAI",
    connected: true,
    healthy: true,
    mode: "live",
    credentialState: "ready",
    lastSync: "12 minutes ago",
    description: "Campaign generation is available for founder emails and playbooks.",
  },
  {
    provider: "intercom",
    displayName: "Intercom",
    connected: false,
    healthy: false,
    mode: "mock",
    credentialState: "missing",
    lastSync: "Not connected",
    description: "Support events can be added once the token is configured.",
  },
];

export const demoTimeline: TimelineEvent[] = [
  {
    id: "evt_001",
    accountId: "acc_acme_01",
    title: "Usage drop detected",
    description: "Seat activity fell 38% after the reporting release.",
    kind: "signal",
    timestamp: "Today, 08:10",
    channel: "Product event",
  },
  {
    id: "evt_002",
    accountId: "acc_acme_01",
    title: "Campaign deployed",
    description: "Founder escalation email was queued with a discount fallback.",
    kind: "campaign",
    timestamp: "Today, 08:48",
    channel: "Email",
  },
  {
    id: "evt_003",
    accountId: "acc_acme_01",
    title: "Billing retry failed",
    description: "Latest card retry failed and the card-on-file needs a replacement.",
    kind: "billing",
    timestamp: "Yesterday, 16:20",
    channel: "Stripe",
  },
  {
    id: "evt_004",
    accountId: "acc_northstar_02",
    title: "Support ticket spike",
    description: "Product adoption questions appeared in onboarding and analytics.",
    kind: "support",
    timestamp: "Yesterday, 11:00",
    channel: "Helpdesk",
  },
];

export const demoSession: WorkspaceSession = {
  workspaceId: "demo-synapse",
  workspaceName: "Synapse Demo Workspace",
  role: "owner",
  mode: "demo",
  userEmail: "founder@synapse.demo",
};

export function getDemoAccount(accountId: string) {
  return demoAccounts.find((account) => account.id === accountId) ?? demoAccounts[0];
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
    status: "draft" as const,
    subject: `A personal note for ${account.name}`,
    body: `We spotted a few signals that suggest ${account.name} would benefit from a quick check-in and a focused retention plan.`,
    channel: "Email",
    createdAt: "Just now",
    deployedAt: null,
    roiEstimate: `$${Math.round(account.mrr)} retained`,
  };
}

export function buildDemoSummary(): DashboardSummary {
  const monthlyRevenue = demoAccounts.reduce((total, account) => total + account.mrr, 0);
  const revenueAtRisk = demoAccounts
    .filter((account) => account.churnProbability >= 0.6)
    .reduce((total, account) => total + account.mrr, 0);
  const highRiskAccounts = demoAccounts.filter(
    (account) => account.churnProbability >= 0.75
  ).length;

  return {
    workspaceId: demoSession.workspaceId,
    workspaceName: demoSession.workspaceName,
    role: demoSession.role,
    monthlyRevenue,
    revenueAtRisk,
    activeAccounts: demoAccounts.length,
    highRiskAccounts,
    campaignsRunning: demoCampaigns.length,
    retentionsSaved: 142,
    healthScore: 78,
    riskBreakdown: [
      { label: "High risk", value: 23, color: "#f28b82" },
      { label: "Watchlist", value: 37, color: "#f6c66f" },
      { label: "Healthy", value: 40, color: "#8dd6a3" },
    ],
    trend: [
      { month: "Jan", mrr: 118000, churnPressure: 22 },
      { month: "Feb", mrr: 128000, churnPressure: 26 },
      { month: "Mar", mrr: 135000, churnPressure: 29 },
      { month: "Apr", mrr: 140000, churnPressure: 34 },
      { month: "May", mrr: 148000, churnPressure: 29 },
      { month: "Jun", mrr: 156000, churnPressure: 24 },
    ],
    featuredAccounts: [...demoAccounts]
      .sort((left, right) => right.churnProbability - left.churnProbability)
      .slice(0, 4),
    spotlightCampaigns: demoCampaigns,
    playbooks: demoPlaybooks,
    integrations: demoIntegrations,
  };
}
