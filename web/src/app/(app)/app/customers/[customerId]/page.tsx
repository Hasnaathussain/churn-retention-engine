import Link from "next/link";
import { ArrowRight, ShieldAlert, Sparkles } from "lucide-react";
import { AccountTrendChart } from "@/components/charts";
import { createWorkspaceApi } from "@/lib/api";
import { requireWorkspaceSession } from "@/lib/auth";
import { cn } from "@/lib/cn";

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  const { customerId } = await params;
  const session = await requireWorkspaceSession("/login?next=/app/dashboard");
  const api = createWorkspaceApi(session);
  const [account, timeline, summary] = await Promise.all([
    api.getAccount(customerId),
    api.getAccountTimeline(customerId),
    api.getDashboardSummary(),
  ]);

  const score = Math.round(account.churnProbability * 100);

  return (
    <main className="space-y-6">
      <section className="section-shell px-6 py-6 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="glass-chip w-fit text-xs">
              <Sparkles className="h-4 w-4" />
              Customer 360
            </div>
            <div>
              <p className="metric-label">
                {account.domain} / {account.plan}
              </p>
              <h1 className="panel-title mt-2 text-4xl text-[color:var(--text-primary)]">
                {account.name}
              </h1>
              <p className="mt-2 text-sm text-[color:var(--text-secondary)]">
                {account.owner} / last active {account.lastActive}
              </p>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-[color:var(--accent-soft-border)] bg-[color:var(--accent-soft)] p-5 text-right">
            <p className="metric-label">Churn risk</p>
            <p
              className={cn(
                "hero-type mt-2 text-5xl",
                score >= 75
                  ? "text-[color:var(--danger)]"
                  : score >= 55
                    ? "text-[color:var(--warning)]"
                    : "text-[color:var(--success)]"
              )}
            >
              {score}%
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[color:var(--text-soft)]">
              Health score {Math.round(account.healthScore)}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="surface-card p-5 sm:p-6">
          <p className="metric-label">Top risk factors</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {account.drivers.map((driver) => (
              <div
                key={driver.label}
                className="rounded-[1.2rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4"
              >
                <p className="metric-label">{driver.label}</p>
                <p className="mt-2 text-sm text-[color:var(--text-primary)]">{driver.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-[1.5rem] border border-[color:var(--accent-soft-border)] bg-[color:var(--accent-soft)] p-5">
            <p className="metric-label">Recommended move</p>
            <p className="mt-2 text-lg font-semibold text-[color:var(--text-primary)]">
              {account.recommendedAction}
            </p>
            <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">
              {account.primaryRisk}
            </p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Metric label="MRR" value={`$${account.mrr.toLocaleString()}`} />
            <Metric label="Usage" value={`${account.usageFrequency} / wk`} />
            <Metric label="Tickets" value={`${account.supportTickets} open`} />
          </div>
        </div>

        <div className="space-y-5">
          <section className="surface-card p-5 sm:p-6">
            <p className="metric-label">Risk movement</p>
            <h2 className="panel-title mt-2 text-3xl text-[color:var(--text-primary)]">
              Customer pressure over time
            </h2>
            <div className="mt-4">
              <AccountTrendChart data={account.trend} />
            </div>
          </section>

          <section className="surface-card p-5 sm:p-6">
            <p className="metric-label">Timeline</p>
            <div className="mt-4 space-y-3">
              {timeline.map((event) => (
                <div
                  key={event.id}
                  className="rounded-[1.3rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-[color:var(--text-primary)]">
                        {event.title}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[color:var(--text-soft)]">
                        {event.channel} / {event.timestamp}
                      </p>
                    </div>
                    <ShieldAlert className="h-4 w-4 text-[color:var(--accent-strong)]" />
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">
                    {event.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          ["Organization revenue", `$${summary.monthlyRevenue.toLocaleString()}`],
          ["Other at-risk customers", `${summary.highRiskAccounts}`],
          ["Suggested next step", account.recommendedAction],
        ].map(([label, value]) => (
          <div key={label} className="surface-card p-5">
            <p className="metric-label">{label}</p>
            <p className="mt-3 text-base font-semibold text-[color:var(--text-primary)]">{value}</p>
          </div>
        ))}
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href={`/app/playbooks?account=${account.id}`} className="pill-link pill-link-accent text-sm">
          Draft intervention
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/app/customers" className="pill-link text-sm">
          Back to customers
        </Link>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.2rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4">
      <p className="metric-label">{label}</p>
      <p className="mt-2 text-sm text-[color:var(--text-primary)]">{value}</p>
    </div>
  );
}
