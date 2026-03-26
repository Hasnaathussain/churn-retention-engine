"use client";

import { startTransition, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Send, WandSparkles, Workflow } from "lucide-react";
import { createWorkspaceApi } from "@/lib/api";
import type { Account, Campaign, Playbook, WorkspaceSession } from "@/lib/types";
import { cn } from "@/lib/cn";

type CampaignBoardProps = {
  session: WorkspaceSession;
  accounts: Account[];
  campaigns: Campaign[];
  playbooks: Playbook[];
  initialTab?: "drafts" | "playbooks";
  initialAccountId?: string;
};

export function CampaignBoard({
  session,
  accounts,
  campaigns,
  playbooks,
  initialTab = "drafts",
  initialAccountId,
}: CampaignBoardProps) {
  const [selectedAccountId, setSelectedAccountId] = useState(
    initialAccountId && accounts.some((account) => account.id === initialAccountId)
      ? initialAccountId
      : accounts[0]?.id ?? ""
  );
  const [activeTab, setActiveTab] = useState<"drafts" | "playbooks">(initialTab);
  const [campaignList, setCampaignList] = useState(campaigns);
  const [draft, setDraft] = useState<Campaign | null>(campaigns[0] ?? null);
  const [loading, setLoading] = useState<"generate" | "deploy" | null>(null);

  const selectedAccount = useMemo(
    () => accounts.find((account) => account.id === selectedAccountId) ?? accounts[0] ?? null,
    [accounts, selectedAccountId]
  );

  async function handleGenerate() {
    if (!selectedAccountId) {
      return;
    }

    setLoading("generate");
    try {
      const api = createWorkspaceApi(session);
      const result = await api.generateCampaign(selectedAccountId);
      startTransition(() => {
        setDraft(result);
        setCampaignList((current) => [result, ...current.filter((campaign) => campaign.id !== result.id)]);
        setActiveTab("drafts");
      });
    } finally {
      setLoading(null);
    }
  }

  async function handleDeploy() {
    if (!draft) {
      return;
    }

    setLoading("deploy");
    try {
      const api = createWorkspaceApi(session);
      const deployed = await api.deployCampaign(draft.id);
      startTransition(() => {
        setDraft(deployed);
        setCampaignList((current) =>
          current.map((campaign) => (campaign.id === deployed.id ? deployed : campaign))
        );
      });
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
      <section className="surface-card p-5 sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="metric-label">Retention studio</p>
            <h2 className="panel-title mt-2 text-3xl text-[color:var(--text-primary)]">
              Generate, queue, and refine the next move
            </h2>
          </div>
          <div className="flex rounded-full border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-1">
            {[
              { key: "drafts", label: "Drafts" },
              { key: "playbooks", label: "Playbooks" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as "drafts" | "playbooks")}
                className={cn(
                  "rounded-full px-4 py-2 text-sm transition",
                  activeTab === tab.key
                    ? "bg-[color:var(--surface-strong)] text-[color:var(--text-primary)] shadow-[var(--shadow-soft)]"
                    : "text-[color:var(--text-secondary)]"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4">
          <label className="block space-y-2">
            <span className="metric-label">Account</span>
            <select
              value={selectedAccountId}
              onChange={(event) => setSelectedAccountId(event.target.value)}
              className="w-full rounded-[1rem] border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-[color:var(--text-primary)] outline-none"
            >
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name} - {account.plan}
                </option>
              ))}
            </select>
          </label>
          {selectedAccount ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <PanelStat label="Owner" value={selectedAccount.owner} />
              <PanelStat
                label="Risk"
                value={`${Math.round(selectedAccount.churnProbability * 100)}%`}
              />
              <PanelStat label="MRR" value={`$${selectedAccount.mrr.toLocaleString()}`} />
            </div>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading !== null}
              className="pill-link pill-link-accent text-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading === "generate" ? <Loader2 className="h-4 w-4 animate-spin" /> : <WandSparkles className="h-4 w-4" />}
              Generate campaign
            </button>
            <Link
              href={`/app/accounts/${selectedAccountId}`}
              className="pill-link text-sm"
            >
              Open account detail
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {activeTab === "drafts" ? (
          <div className="mt-5 space-y-3">
            {campaignList.map((campaign) => (
              <button
                key={campaign.id}
                type="button"
                onClick={() => setDraft(campaign)}
                className={cn(
                  "w-full rounded-[1.35rem] border p-4 text-left transition",
                  draft?.id === campaign.id
                    ? "border-[color:var(--accent-soft-border)] bg-[color:var(--accent-soft)]"
                    : "border-[color:var(--border)] bg-[color:var(--surface-soft)] hover:border-[color:var(--accent-soft-border)]"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[color:var(--text-primary)]">
                      {campaign.subject}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[color:var(--text-soft)]">
                      {campaign.channel} / {campaign.status}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-[color:var(--accent-strong)]">
                    {campaign.roiEstimate}
                  </p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {playbooks.map((playbook) => (
              <div
                key={playbook.id}
                className="rounded-[1.35rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[color:var(--text-primary)]">
                      {playbook.name}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[color:var(--text-secondary)]">
                      {playbook.action}
                    </p>
                  </div>
                  <span className="glass-chip text-xs">{playbook.status}</span>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <PanelStat label="Trigger" value={playbook.trigger} />
                  <PanelStat label="Audience" value={playbook.audience} />
                  <PanelStat label="Success" value={`${Math.round(playbook.successRate * 100)}%`} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="surface-card p-5 sm:p-6">
        {activeTab === "drafts" && draft ? (
          <>
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="metric-label">Draft preview</p>
                <h2 className="panel-title mt-2 text-3xl text-[color:var(--text-primary)]">
                  {draft.subject}
                </h2>
              </div>
              <span className="glass-chip text-xs">{draft.status}</span>
            </div>

            <div className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-5">
              <p className="metric-label">Message body</p>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[color:var(--text-primary)]">
                {draft.body}
              </p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <PanelStat label="Channel" value={draft.channel} />
              <PanelStat label="ROI estimate" value={draft.roiEstimate} />
              <PanelStat label="Created" value={draft.createdAt} />
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleDeploy}
                disabled={loading !== null || draft.status === "deployed"}
                className="pill-link pill-link-accent text-sm disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading === "deploy" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {draft.status === "deployed" ? "Already deployed" : "Deploy campaign"}
              </button>
              <Link
                href={`/app/accounts/${draft.accountId}`}
                className="pill-link text-sm"
              >
                Review account context
              </Link>
            </div>
          </>
        ) : activeTab === "playbooks" ? (
          <div className="grid h-full place-items-center rounded-[1.6rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-10 text-center">
            <div>
              <Workflow className="mx-auto h-6 w-6 text-[color:var(--accent-strong)]" />
              <p className="panel-title mt-4 text-3xl text-[color:var(--text-primary)]">
                Playbooks stay visible here
              </p>
              <p className="mt-3 max-w-md text-sm leading-7 text-[color:var(--text-secondary)]">
                Keep drafting and deployment in the same surface, while the repeatable motions stay
                one click away instead of living on a thin standalone page.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid h-full place-items-center rounded-[1.6rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-10 text-center">
            <div>
              <WandSparkles className="mx-auto h-6 w-6 text-[color:var(--accent-strong)]" />
              <p className="panel-title mt-4 text-3xl text-[color:var(--text-primary)]">
                No draft loaded
              </p>
              <p className="mt-3 max-w-md text-sm leading-7 text-[color:var(--text-secondary)]">
                Generate a campaign to preview the draft, the deployment status, and the expected
                retention lift.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function PanelStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.2rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-4">
      <p className="metric-label">{label}</p>
      <p className="mt-2 text-sm text-[color:var(--text-primary)]">{value}</p>
    </div>
  );
}
