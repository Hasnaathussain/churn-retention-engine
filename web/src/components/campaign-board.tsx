"use client";

import { useState } from "react";
import { ArrowRight, Loader2, WandSparkles } from "lucide-react";
import { createWorkspaceApi } from "@/lib/api";
import type { Account, Campaign, WorkspaceSession } from "@/lib/types";
import { cn } from "@/lib/cn";

type CampaignBoardProps = {
  session: WorkspaceSession;
  accounts: Account[];
  campaigns: Campaign[];
};

export function CampaignBoard({ session, accounts, campaigns }: CampaignBoardProps) {
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id ?? "");
  const [draft, setDraft] = useState<Campaign | null>(campaigns[0] ?? null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    if (!selectedAccountId) {
      return;
    }

    setLoading(true);
    try {
      const api = createWorkspaceApi(session);
      const result = await api.generateCampaign(selectedAccountId);
      setDraft(result);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
      <section className="surface-card p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#8f9ab7]">Campaign drafting</p>
            <h2 className="panel-title mt-2 text-2xl text-[#f5f2ea]">
              Generate a retention message in one click
            </h2>
          </div>
          <WandSparkles className="h-5 w-5 text-[#f6c66f]" />
        </div>

        <label className="block space-y-2">
          <span className="text-sm text-[#dfe6f6]">Account</span>
          <select
            value={selectedAccountId}
            onChange={(event) => setSelectedAccountId(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-[#f5f2ea] outline-none transition focus:border-[#f6c66f]/40 focus:bg-white/6"
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id} className="bg-[#050816]">
                {account.name} - {account.plan}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full bg-[#f6c66f] px-5 py-3 text-sm font-medium text-[#08101f] transition hover:-translate-y-0.5 hover:bg-[#f2b94e] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Generate campaign
          </button>
          <a
            href={`/app/accounts/${selectedAccountId}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-5 py-3 text-sm text-[#f5f2ea] transition hover:border-white/20 hover:bg-white/8"
          >
            Open account detail
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-6 space-y-3">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className={cn(
                "rounded-2xl border p-4",
                draft?.id === campaign.id
                  ? "border-[#f6c66f]/25 bg-[#f6c66f]/8"
                  : "border-white/8 bg-white/4"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-[#f5f2ea]">{campaign.subject}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[#8f9ab7]">
                    {campaign.channel} • {campaign.status}
                  </p>
                </div>
                <p className="text-sm text-[#f6c66f]">{campaign.roiEstimate}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="surface-card p-5">
        {draft ? (
          <>
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#8f9ab7]">Draft preview</p>
                <h2 className="panel-title mt-2 text-2xl text-[#f5f2ea]">
                  {draft.subject}
                </h2>
              </div>
              <span className="glass-chip text-xs text-[#f6c66f]">{draft.status}</span>
            </div>

            <div className="rounded-3xl border border-white/8 bg-[#09101f] p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-[#8f9ab7]">Body</p>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#dfe6f6]">
                {draft.body}
              </p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-[#8f9ab7]">Channel</p>
                <p className="mt-2 text-sm text-[#f5f2ea]">{draft.channel}</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-[#8f9ab7]">ROI estimate</p>
                <p className="mt-2 text-sm text-[#f5f2ea]">{draft.roiEstimate}</p>
              </div>
            </div>
          </>
        ) : (
          <div className="grid h-full place-items-center rounded-3xl border border-dashed border-white/12 bg-white/4 p-10 text-center">
            <div>
              <p className="panel-title text-2xl text-[#f5f2ea]">No draft loaded</p>
              <p className="mt-3 max-w-sm text-sm leading-7 text-[#a0abc1]">
                Generate a campaign to see the AI draft, the channel recommendation, and the ROI
                estimate.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
