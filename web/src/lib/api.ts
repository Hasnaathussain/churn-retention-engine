import { buildWorkspaceApiUrl, config } from "@/lib/config";
import {
  buildDemoCampaign,
  buildDemoSummary,
  demoAccounts,
  demoCampaigns,
  demoIntegrations,
  demoPlaybooks,
  demoSession,
  demoTimeline,
} from "@/lib/mock-data";
import type {
  Account,
  Campaign,
  DashboardSummary,
  IntegrationStatus,
  Playbook,
  TimelineEvent,
  WorkspaceSession,
} from "@/lib/types";

async function requestJson<T>(
  path: string,
  fallback: T,
  session: WorkspaceSession = demoSession,
  init?: RequestInit
) {
  if (!config.apiBaseUrl) {
    return fallback;
  }

  try {
    const response = await fetch(buildWorkspaceApiUrl(path), {
      cache: "no-store",
      ...init,
      headers: {
        "Content-Type": "application/json",
        "X-Workspace-ID": session.workspaceId,
        "X-Workspace-Name": session.workspaceName,
        "X-Workspace-Role": session.role,
        "X-Workspace-Mode": session.mode,
        ...(init?.headers ?? {}),
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

function resolveSession(session?: WorkspaceSession) {
  return session ?? demoSession;
}

export function createWorkspaceApi(session?: WorkspaceSession) {
  const activeSession = resolveSession(session);

  return {
    async getDashboardSummary() {
      return requestJson<DashboardSummary>(
        "/dashboard/summary",
        buildDemoSummary(),
        activeSession
      );
    },
    async getAccounts() {
      return requestJson<Account[]>("/accounts", demoAccounts, activeSession);
    },
    async getAccount(accountId: string) {
      const fallback =
        demoAccounts.find((account) => account.id === accountId) ??
        demoAccounts[0];

      return requestJson<Account>(
        `/accounts/${accountId}`,
        fallback,
        activeSession
      );
    },
    async getAccountTimeline(accountId: string) {
      const fallback = demoTimeline.filter((event) => event.accountId === accountId);

      return requestJson<TimelineEvent[]>(
        `/accounts/${accountId}/timeline`,
        fallback,
        activeSession
      );
    },
    async scoreAccount(accountId: string) {
      return requestJson(`/accounts/${accountId}/score`, {}, activeSession, {
        method: "POST",
      });
    },
    async generateCampaign(accountId: string) {
      return requestJson<Campaign>(
        `/accounts/${accountId}/campaigns/generate`,
        buildDemoCampaign(accountId),
        activeSession,
        { method: "POST" }
      );
    },
    async deployCampaign(campaignId: string) {
      return requestJson<Campaign>(
        `/campaigns/${campaignId}/deploy`,
        {
          ...demoCampaigns[0],
          id: campaignId,
          status: "deployed",
          deployedAt: "Just now",
        },
        activeSession,
        { method: "POST" }
      );
    },
    async getPlaybooks() {
      return requestJson<Playbook[]>("/playbooks", demoPlaybooks, activeSession);
    },
    async getIntegrations() {
      return requestJson<IntegrationStatus[]>(
        "/integrations/status",
        demoIntegrations,
        activeSession
      );
    },
    async createCheckoutSession() {
      return requestJson<{ url: string }>(
        "/billing/checkout-session",
        { url: "/demo?billing=preview" },
        activeSession,
        { method: "POST" }
      );
    },
    async createPortalSession() {
      return requestJson<{ url: string }>(
        "/billing/portal-session",
        { url: "/login" },
        activeSession,
        { method: "POST" }
      );
    },
  };
}
