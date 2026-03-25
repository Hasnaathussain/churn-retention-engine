"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BadgeCheck, ChevronRight, Sparkles, X } from "lucide-react";
import type { DashboardSummary, Account } from "@/lib/types";
import { cn } from "@/lib/cn";

const RevenueTrendChart = dynamic(
  () => import("@/components/charts").then((mod) => mod.RevenueTrendChart),
  {
    ssr: false,
    loading: () => <div className="h-[260px] rounded-3xl border border-white/8 bg-white/4" />,
  }
);

const RiskDistributionChart = dynamic(
  () => import("@/components/charts").then((mod) => mod.RiskDistributionChart),
  {
    ssr: false,
    loading: () => <div className="h-[240px] rounded-3xl border border-white/8 bg-white/4" />,
  }
);

type WorkspacePreviewProps = {
  summary: DashboardSummary;
  accounts: Account[];
};

function riskColor(probability: number) {
  if (probability >= 0.75) return "#f28b82";
  if (probability >= 0.55) return "#f6c66f";
  return "#8dd6a3";
}

export function WorkspacePreview({ summary, accounts }: WorkspacePreviewProps) {
  const [selected, setSelected] = useState<Account | null>(accounts[0] ?? null);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Monthly revenue" value={`$${summary.monthlyRevenue.toLocaleString()}`} note="workspace-wide" />
        <MetricCard label="Revenue at risk" value={`$${summary.revenueAtRisk.toLocaleString()}`} note="next 30 days" tone="danger" />
        <MetricCard label="Active accounts" value={`${summary.activeAccounts}`} note="monitored continuously" />
        <MetricCard label="Health score" value={`${summary.healthScore}`} note="AI-assisted view" tone="success" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="surface-card p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#8f9ab7]">Revenue velocity</p>
              <h2 className="panel-title mt-2 text-2xl text-[#f5f2ea]">
                MRR vs churn pressure
              </h2>
            </div>
            <div className="glass-chip text-xs text-[#f6c66f]">
              <Sparkles className="h-4 w-4" />
              Live analysis
            </div>
          </div>
          <RevenueTrendChart data={summary.trend} />
        </section>

        <section className="surface-card p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#8f9ab7]">
                Risk distribution
              </p>
              <h2 className="panel-title mt-2 text-2xl text-[#f5f2ea]">
                Accounts by urgency
              </h2>
            </div>
          </div>
          <RiskDistributionChart data={summary.riskBreakdown} />
          <div className="grid gap-2 sm:grid-cols-3">
            {summary.riskBreakdown.map((segment) => (
              <div key={segment.label} className="rounded-2xl border border-white/8 bg-white/4 px-3 py-2">
                <p className="text-xs uppercase tracking-[0.22em] text-[#8f9ab7]">
                  {segment.label}
                </p>
                <p className="mt-1 text-lg text-[#f5f2ea]">{segment.value}%</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="surface-card p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#8f9ab7]">
                Priority accounts
              </p>
              <h2 className="panel-title mt-2 text-2xl text-[#f5f2ea]">
                Click into the highest-risk customers
              </h2>
            </div>
            <div className="glass-chip text-xs text-[#8dd6a3]">
              <BadgeCheck className="h-4 w-4" />
              workspace ready
            </div>
          </div>

          <div className="space-y-3">
            {accounts.map((account) => {
              const selectedAccount = selected?.id === account.id;
              const fill = riskColor(account.churnProbability);

              return (
                <button
                  key={account.id}
                  type="button"
                  onClick={() => setSelected(account)}
                  className={cn(
                    "grid w-full gap-3 rounded-2xl border px-4 py-4 text-left transition",
                    selectedAccount
                      ? "border-white/16 bg-white/8"
                      : "border-white/8 bg-white/4 hover:border-white/12 hover:bg-white/6"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="panel-title text-lg text-[#f5f2ea]">{account.name}</p>
                      <p className="text-sm text-[#8f9ab7]">
                        {account.plan} • {account.owner} • {account.lastActive}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[#f6c66f]">${account.mrr.toLocaleString()}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-[#8f9ab7]">
                        {Math.round(account.churnProbability * 100)}% risk
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/8">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.round(account.churnProbability * 100)}%`,
                          background: fill,
                        }}
                      />
                    </div>
                    <ChevronRight className="h-4 w-4 text-[#8f9ab7]" />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="surface-card p-5">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[#8f9ab7]">
                    Account detail
                  </p>
                  <h3 className="panel-title mt-2 text-3xl text-[#f5f2ea]">
                    {selected.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="rounded-full border border-white/8 bg-white/4 p-2 text-[#f5f2ea] transition hover:bg-white/8"
                  aria-label="Close account detail"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {selected.drivers.map((driver) => (
                  <div key={driver.label} className="rounded-2xl border border-white/8 bg-white/4 p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-[#8f9ab7]">
                      {driver.label}
                    </p>
                    <p className="mt-2 text-sm text-[#f5f2ea]">{driver.value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-3xl border border-white/8 bg-[#09101f] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-[#8f9ab7]">
                      Recommended action
                    </p>
                    <p className="mt-2 text-lg text-[#f5f2ea]">{selected.recommendedAction}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-[#f6c66f]" />
                </div>
                <p className="mt-3 text-sm leading-7 text-[#a0abc1]">{selected.primaryRisk}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-[#8f9ab7]">Last login</p>
                  <p className="mt-2 text-sm text-[#f5f2ea]">{selected.lastActive}</p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-[#8f9ab7]">Support tickets</p>
                  <p className="mt-2 text-sm text-[#f5f2ea]">{selected.supportTickets} open</p>
                </div>
              </div>
            </motion.div>
          ) : null}
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="surface-card p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#8f9ab7]">
                Campaign queue
              </p>
              <h2 className="panel-title mt-2 text-2xl text-[#f5f2ea]">
                Drafts and deployed actions
              </h2>
            </div>
          </div>
          <div className="space-y-3">
            {summary.spotlightCampaigns.map((campaign) => (
              <div key={campaign.id} className="rounded-2xl border border-white/8 bg-white/4 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-[#f5f2ea]">{campaign.subject}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[#8f9ab7]">
                      {campaign.channel} • {campaign.status}
                    </p>
                  </div>
                  <p className="text-sm text-[#f6c66f]">{campaign.roiEstimate}</p>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#a0abc1]">{campaign.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="surface-card p-5">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.24em] text-[#8f9ab7]">
              Integration health
            </p>
            <h2 className="panel-title mt-2 text-2xl text-[#f5f2ea]">
              Connected providers
            </h2>
          </div>
          <div className="space-y-3">
            {summary.integrations.map((integration) => (
              <div key={integration.provider} className="rounded-2xl border border-white/8 bg-white/4 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-[#f5f2ea]">{integration.displayName}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[#8f9ab7]">
                      {integration.mode} • {integration.credentialState}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs",
                      integration.connected && integration.healthy
                        ? "bg-[#8dd6a3]/15 text-[#8dd6a3]"
                        : "bg-[#f28b82]/15 text-[#f28b82]"
                    )}
                  >
                    {integration.connected && integration.healthy ? "Healthy" : "Needs attention"}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#a0abc1]">
                  {integration.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  note,
  tone,
}: {
  label: string;
  value: string;
  note: string;
  tone?: "danger" | "success";
}) {
  return (
    <div className="rounded-3xl border border-white/8 bg-white/4 p-4">
      <p className="text-xs uppercase tracking-[0.24em] text-[#8f9ab7]">{label}</p>
      <p
        className={cn(
          "hero-type mt-3 text-3xl",
          tone === "danger"
            ? "text-[#f28b82]"
            : tone === "success"
              ? "text-[#8dd6a3]"
              : "text-[#f5f2ea]"
        )}
      >
        {value}
      </p>
      <p className="mt-2 text-sm text-[#a0abc1]">{note}</p>
    </div>
  );
}
