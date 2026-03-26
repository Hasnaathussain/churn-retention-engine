"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  Radar,
  Sparkles,
  Waves,
} from "lucide-react";
import type { Account, DashboardSummary, TimelineEvent } from "@/lib/types";
import { cn } from "@/lib/cn";
import { demoTimeline } from "@/lib/mock-data";

const RevenueTrendChart = dynamic(
  () => import("@/components/charts").then((mod) => mod.RevenueTrendChart),
  {
    ssr: false,
    loading: () => <div className="h-[280px] rounded-[1.5rem] bg-[color:var(--surface-soft)]" />,
  }
);

const RiskDistributionChart = dynamic(
  () => import("@/components/charts").then((mod) => mod.RiskDistributionChart),
  {
    ssr: false,
    loading: () => <div className="h-[240px] rounded-[1.5rem] bg-[color:var(--surface-soft)]" />,
  }
);

type WorkspacePreviewProps = {
  summary: DashboardSummary;
  accounts: Account[];
  mode?: "hero" | "full";
  timeline?: TimelineEvent[];
};

function riskColor(probability: number) {
  if (probability >= 0.75) return "var(--danger)";
  if (probability >= 0.55) return "var(--warning)";
  return "var(--success)";
}

export function WorkspacePreview({
  summary,
  accounts,
  mode = "full",
  timeline,
}: WorkspacePreviewProps) {
  const activeAccounts = accounts.length ? accounts : summary.featuredAccounts;
  const [selectedId, setSelectedId] = useState(activeAccounts[0]?.id ?? "");

  const selected = useMemo(
    () => activeAccounts.find((account) => account.id === selectedId) ?? activeAccounts[0] ?? null,
    [activeAccounts, selectedId]
  );
  const signalStream = timeline?.length ? timeline : demoTimeline;
  const compact = mode === "hero";

  return (
    <div className={cn("space-y-5", compact ? "" : "space-y-6")}>
      <div className={cn("grid gap-3", compact ? "sm:grid-cols-2 xl:grid-cols-4" : "md:grid-cols-2 xl:grid-cols-4")}>
        <MetricCard label="Revenue at risk" value={`$${summary.revenueAtRisk.toLocaleString()}`} note="30-day exposure" tone="warning" />
        <MetricCard label="Healthy accounts" value={`${summary.activeAccounts - summary.highRiskAccounts}`} note="stable momentum" tone="success" />
        <MetricCard label="Interventions running" value={`${summary.campaignsRunning}`} note="live or queued actions" />
        <MetricCard label="Retention score" value={`${summary.healthScore}`} note="workspace pulse" />
      </div>

      <div className={cn("grid gap-5", compact ? "xl:grid-cols-[1.2fr_0.8fr]" : "xl:grid-cols-[1.2fr_0.8fr]")}>
        <section className="surface-card p-5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="metric-label">Revenue signal</p>
              <h2 className="panel-title mt-2 text-3xl text-[color:var(--text-primary)]">
                MRR and churn pressure in one view
              </h2>
            </div>
            <span className="glass-chip text-xs">
              <Sparkles className="h-4 w-4" />
              Live-looking analysis
            </span>
          </div>
          <RevenueTrendChart data={summary.trend} />
        </section>

        <section className="surface-card p-5 sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="metric-label">Urgency mix</p>
              <h2 className="panel-title mt-2 text-3xl text-[color:var(--text-primary)]">
                Risk distribution
              </h2>
            </div>
            <Radar className="h-5 w-5 text-[color:var(--accent-strong)]" />
          </div>
          <RiskDistributionChart data={summary.riskBreakdown} />
          <div className="grid gap-2 sm:grid-cols-3">
            {summary.riskBreakdown.map((segment) => (
              <div
                key={segment.label}
                className="rounded-[1.2rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-3 py-3"
              >
                <p className="metric-label">{segment.label}</p>
                <p className="mt-2 text-lg font-semibold text-[color:var(--text-primary)]">
                  {segment.value}%
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
        <section className="surface-card p-5 sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="metric-label">Priority queue</p>
              <h2 className="panel-title mt-2 text-3xl text-[color:var(--text-primary)]">
                Accounts that deserve action first
              </h2>
            </div>
            <span className="glass-chip text-xs">
              <BadgeCheck className="h-4 w-4" />
              triaged
            </span>
          </div>

          <div className="space-y-3">
            {activeAccounts.map((account) => {
              const selectedAccount = selected?.id === account.id;

              return (
                <button
                  key={account.id}
                  type="button"
                  onClick={() => setSelectedId(account.id)}
                  className={cn(
                    "w-full rounded-[1.45rem] border px-4 py-4 text-left transition",
                    selectedAccount
                      ? "border-[color:var(--accent-soft-border)] bg-[color:var(--surface)] shadow-[var(--shadow-soft)]"
                      : "border-[color:var(--border)] bg-[color:var(--surface-soft)] hover:border-[color:var(--accent-soft-border)] hover:bg-[color:var(--surface)]"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="panel-title text-xl text-[color:var(--text-primary)]">
                        {account.name}
                      </p>
                      <p className="mt-1 text-sm text-[color:var(--text-secondary)]">
                        {account.plan} / {account.owner} / {account.lastActive}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[color:var(--accent-strong)]">
                        ${account.mrr.toLocaleString()}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[color:var(--text-soft)]">
                        {Math.round(account.churnProbability * 100)}% risk
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-[color:var(--surface-contrast)]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.round(account.churnProbability * 100)}%`,
                          background: riskColor(account.churnProbability),
                        }}
                      />
                    </div>
                    <ChevronRight className="h-4 w-4 text-[color:var(--text-soft)]" />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="surface-card p-5 sm:p-6">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="metric-label">Account insight</p>
                  <h3 className="panel-title mt-2 text-3xl text-[color:var(--text-primary)]">
                    {selected.name}
                  </h3>
                  <p className="mt-2 text-sm text-[color:var(--text-secondary)]">
                    {selected.primaryRisk}
                  </p>
                </div>
                <div
                  className="rounded-[1.4rem] border px-4 py-3 text-right"
                  style={{
                    borderColor: "var(--accent-soft-border)",
                    background: "var(--accent-soft)",
                  }}
                >
                  <p className="metric-label">Risk</p>
                  <p className="mt-2 text-3xl font-semibold text-[color:var(--text-primary)]">
                    {Math.round(selected.churnProbability * 100)}%
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {selected.drivers.map((driver) => (
                  <div
                    key={driver.label}
                    className="rounded-[1.2rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4"
                  >
                    <p className="metric-label">{driver.label}</p>
                    <p className="mt-2 text-sm text-[color:var(--text-primary)]">{driver.value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-[1.5rem] border border-[color:var(--accent-soft-border)] bg-[color:var(--accent-soft)] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="metric-label">Recommended move</p>
                    <p className="mt-2 text-lg font-semibold text-[color:var(--text-primary)]">
                      {selected.recommendedAction}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-[color:var(--accent-strong)]" />
                </div>
                <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">
                  Owner {selected.owner} should lead here, because the risk is concentrated in
                  engagement and billing momentum rather than a single isolated signal.
                </p>
              </div>

              {!compact ? (
                <div className="grid gap-3 sm:grid-cols-3">
                  <InfoTile label="Support load" value={`${selected.supportTickets} open`} />
                  <InfoTile label="Usage rhythm" value={`${selected.usageFrequency} sessions / wk`} />
                  <InfoTile label="Last login" value={`${selected.lastLoginDaysAgo} days ago`} />
                </div>
              ) : null}
            </motion.div>
          ) : null}
        </section>
      </div>

      {!compact ? (
        <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="surface-card p-5 sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="metric-label">Playbook pulse</p>
                <h2 className="panel-title mt-2 text-3xl text-[color:var(--text-primary)]">
                  Repeatable motions with visible outcomes
                </h2>
              </div>
              <Waves className="h-5 w-5 text-[color:var(--accent-strong)]" />
            </div>
            <div className="space-y-3">
              {summary.playbooks.map((playbook) => (
                <div
                  key={playbook.id}
                  className="rounded-[1.3rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4"
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
                    <InfoTile label="Trigger" value={playbook.trigger} />
                    <InfoTile label="Audience" value={playbook.audience} />
                    <InfoTile label="Success rate" value={`${Math.round(playbook.successRate * 100)}%`} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="surface-card p-5 sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="metric-label">Signal stream</p>
                <h2 className="panel-title mt-2 text-3xl text-[color:var(--text-primary)]">
                  Activity that explains the score
                </h2>
              </div>
              <span className="glass-chip text-xs">{summary.integrations.length} providers</span>
            </div>

            <div className="space-y-3">
              {signalStream.slice(0, 4).map((event) => (
                <div
                  key={event.id}
                  className="rounded-[1.3rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[color:var(--text-primary)]">
                        {event.title}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[color:var(--text-soft)]">
                        {event.channel} / {event.timestamp}
                      </p>
                    </div>
                    <span className="rounded-full bg-[color:var(--surface-contrast)] px-3 py-1 text-xs text-[color:var(--text-secondary)]">
                      {event.kind}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">
                    {event.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : null}
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
  tone?: "warning" | "success";
}) {
  return (
    <div className="metric-tile">
      <p className="metric-label">{label}</p>
      <p
        className={cn(
          "metric-value",
          tone === "warning"
            ? "text-[color:var(--warning)]"
            : tone === "success"
              ? "text-[color:var(--success)]"
              : "text-[color:var(--text-primary)]"
        )}
      >
        {value}
      </p>
      <p className="mt-2 text-sm text-[color:var(--text-secondary)]">{note}</p>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.2rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4">
      <p className="metric-label">{label}</p>
      <p className="mt-2 text-sm text-[color:var(--text-primary)]">{value}</p>
    </div>
  );
}
