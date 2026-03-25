export type WorkspaceRole = "owner" | "member";

export type WorkspaceMode = "demo" | "live";

export type CampaignType =
  | "founder_email"
  | "automated_email"
  | "discount_offer"
  | "success_call";

export type CampaignStatus = "draft" | "queued" | "sent" | "deployed";

export type IntegrationProvider =
  | "stripe"
  | "mixpanel"
  | "openai"
  | "intercom"
  | "resend";

export interface WorkspaceSession {
  workspaceId: string;
  workspaceName: string;
  role: WorkspaceRole;
  mode: WorkspaceMode;
  userEmail?: string;
}

export interface RiskDriver {
  label: string;
  value: string;
}

export interface AccountMetricPoint {
  month: string;
  mrr: number;
  churnPressure: number;
}

export interface Account {
  id: string;
  workspaceId: string;
  name: string;
  domain: string;
  plan: string;
  owner: string;
  mrr: number;
  churnProbability: number;
  healthScore: number;
  status: "stable" | "watch" | "high_risk";
  lastActive: string;
  lastLoginDaysAgo: number;
  supportTickets: number;
  usageFrequency: number;
  primaryRisk: string;
  recommendedAction: string;
  tags: string[];
  drivers: RiskDriver[];
  trend: AccountMetricPoint[];
}

export interface TimelineEvent {
  id: string;
  accountId: string;
  title: string;
  description: string;
  kind: "signal" | "campaign" | "billing" | "support" | "product";
  timestamp: string;
  channel: string;
}

export interface RiskAssessment {
  accountId: string;
  churnProbability: number;
  band: "low" | "medium" | "high";
  confidence: number;
  recommendedAction: CampaignType;
  drivers: RiskDriver[];
  generatedAt: string;
}

export interface Campaign {
  id: string;
  accountId: string;
  campaignType: CampaignType;
  status: CampaignStatus;
  subject: string;
  body: string;
  channel: string;
  createdAt: string;
  deployedAt?: string | null;
  roiEstimate: string;
}

export interface Playbook {
  id: string;
  name: string;
  trigger: string;
  action: string;
  audience: string;
  status: "active" | "paused" | "draft";
  lastRun: string;
  successRate: number;
}

export interface IntegrationStatus {
  provider: IntegrationProvider;
  displayName: string;
  connected: boolean;
  healthy: boolean;
  mode: "mock" | "live";
  credentialState: "ready" | "missing" | "partial";
  lastSync: string;
  description: string;
}

export interface DashboardSummary {
  workspaceId: string;
  workspaceName: string;
  role: WorkspaceRole;
  monthlyRevenue: number;
  revenueAtRisk: number;
  activeAccounts: number;
  highRiskAccounts: number;
  campaignsRunning: number;
  retentionsSaved: number;
  healthScore: number;
  riskBreakdown: { label: string; value: number; color: string }[];
  trend: AccountMetricPoint[];
  featuredAccounts: Account[];
  spotlightCampaigns: Campaign[];
  playbooks: Playbook[];
  integrations: IntegrationStatus[];
}
