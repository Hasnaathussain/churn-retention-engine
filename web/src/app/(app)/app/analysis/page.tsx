import Link from "next/link";
import { createWorkspaceApi } from "@/lib/api";
import { requireWorkspaceSession } from "@/lib/auth";

export default async function AnalysisPage() {
  const session = await requireWorkspaceSession("/login?next=/app/analysis");
  const api = createWorkspaceApi(session);
  const [summary, accounts] = await Promise.all([api.getDashboardSummary(), api.getAccounts()]);
  const highRisk = accounts.filter((account) => account.churnProbability >= 0.6);

  return (
    <main className="space-y-6">
      <section className="section-shell px-6 py-6 sm:px-8">
        <p className="eyebrow">Manual prediction run</p>
        <h1 className="panel-title mt-3 text-4xl text-[color:var(--text-primary)]">
          Re-run the churn model with segment filters and explanation depth
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--text-secondary)]">
          This page packages the scoring engine, forecast summaries, and explanation panel into one
          operator workflow. The production API will back these controls; the seeded workspace keeps
          the surface immediately reviewable in the meantime.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-4">
          {[
            ["Analysis cadence", session.plan === "Starter" ? "Weekly" : "Daily"],
            ["High-risk cohort", `${highRisk.length}`],
            ["Revenue at risk", `$${summary.revenueAtRisk.toLocaleString()}`],
            ["Predicted saves", `${summary.retentionsSaved}`],
          ].map(([label, value]) => (
            <div key={label} className="metric-tile">
              <p className="metric-label">{label}</p>
              <p className="mt-3 text-base font-semibold text-[color:var(--text-primary)]">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="surface-card p-5 sm:p-6">
          <p className="metric-label">Run configuration</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-[color:var(--text-primary)]">
              <span>Segment</span>
              <select className="focus-ring w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3 outline-none">
                <option>All customers</option>
                <option>Enterprise</option>
                <option>Growth</option>
                <option>Starter</option>
              </select>
            </label>
            <label className="space-y-2 text-sm text-[color:var(--text-primary)]">
              <span>Window</span>
              <select className="focus-ring w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3 outline-none">
                <option>Last 30 days</option>
                <option>Last 60 days</option>
                <option>Last 90 days</option>
              </select>
            </label>
          </div>
          <div className="mt-5 rounded-[1.5rem] border border-[color:var(--accent-soft-border)] bg-[color:var(--accent-soft)] p-5">
            <p className="metric-label">Model explanation</p>
            <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">
              Predictions weigh recency of activity, product depth, support pressure, billing
              health, and trend shifts. When the language model is available, Anchoryn turns that
              signal stack into human-readable reasons and retention actions for each customer.
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/app/reports" className="pill-link pill-link-accent text-sm">
              Export PDF / CSV
            </Link>
            <Link href="/docs/api" className="pill-link text-sm">
              View API contract
            </Link>
          </div>
        </article>

        <article className="surface-card p-5 sm:p-6">
          <p className="metric-label">Predicted churn queue</p>
          <div className="mt-4 space-y-3">
            {highRisk.map((customer) => (
              <div
                key={customer.id}
                className="rounded-[1.3rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[color:var(--text-primary)]">
                      {customer.name}
                    </p>
                    <p className="mt-1 text-sm text-[color:var(--text-secondary)]">
                      {customer.primaryRisk}
                    </p>
                  </div>
                  <span className="glass-chip text-xs">
                    {Math.round(customer.churnProbability * 100)}% risk
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">
                  Predicted churn date: {customer.predictedChurnDate}. Recommended move:{" "}
                  {customer.recommendedAction}.
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
