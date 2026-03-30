export type MemberRole = "owner" | "admin" | "analyst" | "viewer";

export type WorkspaceRole = MemberRole;

export type AppMode = "demo" | "live";

export type WorkspaceMode = AppMode;

export type RiskLevel = "low" | "medium" | "high" | "critical";

export type CampaignType =
  | "founder_email"
  | "automated_email"
  | "discount_offer"
  | "success_call"
  | "slack_alert"
  | "task";

export type CampaignStatus =
  | "draft"
  | "queued"
  | "sent"
  | "deployed"
  | "paused"
  | "completed";

export type IntegrationProvider =
  | "stripe"
  | "slack"
  | "hubspot"
  | "salesforce"
  | "intercom"
  | "segment"
  | "mixpanel"
  | "zapier"
  | "csv"
  | "api"
  | "webhooks"
  | "openai"
  | "resend";

export interface OrganizationOption {
  organizationId: string;
  organizationName: string;
  slug: string;
  role: MemberRole;
  plan: string;
  isActive?: boolean;
}

export interface OrganizationSession {
  organizationId: string;
  organizationName: string;
  workspaceId: string;
  workspaceName: string;
  slug: string;
  role: MemberRole;
  mode: AppMode;
  plan: string;
  userEmail?: string;
  userName?: string;
  emailVerified?: boolean;
  locale?: string;
  timezone?: string;
  organizations?: OrganizationOption[];
}

export type WorkspaceSession = OrganizationSession;

export interface RiskFactor {
  label: string;
  value: string;
  score?: number;
}

export type RiskDriver = RiskFactor;

export interface MetricPoint {
  month: string;
  mrr: number;
  churnPressure: number;
  retainedRevenue?: number;
  riskRate?: number;
}

export type AccountMetricPoint = MetricPoint;

export interface RetentionAction {
  id: string;
  title: string;
  description: string;
  priority: "urgent" | "high" | "medium" | "low";
  channel: string;
}

export interface Customer {
  id: string;
  organizationId: string;
  externalId?: string;
  name: string;
  email: string;
  company: string;
  domain: string;
  segment: string;
  plan: string;
  owner: string;
  mrr: number;
  churnProbability: number;
  riskLevel: RiskLevel;
  healthScore: number;
  status: "stable" | "watch" | "high_risk";
  lastActive: string;
  lastLoginDaysAgo: number;
  supportTickets: number;
  usageFrequency: number;
  featureUsageScore: number;
  billingFailures: number;
  npsScore: number | null;
  predictedChurnDate: string;
  primaryRisk: string;
  recommendedAction: string;
  recommendedActions: RetentionAction[];
  tags: string[];
  drivers: RiskFactor[];
  trend: MetricPoint[];
}

export type Account = Customer;

export interface TimelineEvent {
  id: string;
  accountId: string;
  title: string;
  description: string;
  kind: "signal" | "campaign" | "billing" | "support" | "product" | "note";
  timestamp: string;
  channel: string;
}

export interface RiskAssessment {
  accountId: string;
  churnProbability: number;
  riskLevel: RiskLevel;
  band?: "low" | "medium" | "high";
  confidence: number;
  recommendedAction: CampaignType;
  drivers: RiskFactor[];
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

export interface ReportSummary {
  id: string;
  name: string;
  type: string;
  cadence: string;
  lastRun: string;
  status: "ready" | "scheduled" | "running";
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  status: "active" | "invited";
  lastActive: string;
}

export interface SessionInfo {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
}

export interface ApiKeySummary {
  id: string;
  name: string;
  prefix: string;
  scopes: string[];
  lastUsedAt: string;
  status: "active" | "revoked";
}

export interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  status: "active" | "paused";
  lastTriggeredAt: string;
}

export interface BillingPlan {
  name: string;
  priceMonthly: number | null;
  priceYearly: number | null;
  description: string;
  featured?: boolean;
  cta: string;
  features: string[];
}

export interface Invoice {
  id: string;
  issuedAt: string;
  amount: string;
  status: "paid" | "open" | "failed";
  pdfUrl: string;
}

export interface DashboardSummary {
  organizationId: string;
  organizationName: string;
  workspaceId: string;
  workspaceName: string;
  role: MemberRole;
  monthlyRevenue: number;
  revenueAtRisk: number;
  activeAccounts: number;
  highRiskAccounts: number;
  campaignsRunning: number;
  retentionsSaved: number;
  healthScore: number;
  riskBreakdown: { label: string; value: number; color: string }[];
  trend: MetricPoint[];
  featuredAccounts: Customer[];
  spotlightCampaigns: Campaign[];
  playbooks: Playbook[];
  integrations: IntegrationStatus[];
  reports?: ReportSummary[];
  apiKeys?: ApiKeySummary[];
  webhooks?: WebhookEndpoint[];
  team?: TeamMember[];
  sessions?: SessionInfo[];
  invoices?: Invoice[];
}

export interface MarketingStat {
  label: string;
  value: string;
  note: string;
}

export interface PricingPlan extends BillingPlan {
  badge?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}
