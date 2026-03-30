import Link from "next/link";
import { WorkspacePreview } from "@/components/workspace-preview";
import { createWorkspaceApi } from "@/lib/api";
import { requireWorkspaceSession } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await requireWorkspaceSession("/login?next=/app/dashboard");
  const api = createWorkspaceApi(session);
  const [summary, accounts] = await Promise.all([api.getDashboardSummary(), api.getAccounts()]);

  return (
    <main className="space-y-6">
      <section className="section-shell px-6 py-6 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Executive pulse</p>
            <h2 className="panel-title mt-3 text-4xl text-[color:var(--text-primary)]">
              Revenue control for {summary.organizationName}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--text-secondary)]">
              Keep churn pressure, retained revenue, high-risk customers, and queued interventions
              in one view so the team can move from signal to action without opening five tools.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/app/analysis" className="pill-link">
              Run analysis
            </Link>
            <Link href="/app/reports" className="pill-link pill-link-accent">
              Export report
            </Link>
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Tracked customers", `${summary.activeAccounts}`],
            ["High risk", `${summary.highRiskAccounts}`],
            ["Revenue at risk", `$${summary.revenueAtRisk.toLocaleString()}`],
            ["Retention score", `${summary.healthScore}`],
          ].map(([label, value]) => (
            <article key={label} className="metric-tile">
              <p className="metric-label">{label}</p>
              <p className="metric-value">{value}</p>
            </article>
          ))}
        </div>
      </section>

      <WorkspacePreview summary={summary} accounts={accounts.slice(0, 5)} />

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <article className="surface-card p-5 sm:p-6">
          <p className="metric-label">Scheduled reports</p>
          <div className="mt-4 space-y-3">
            {summary.reports?.map((report) => (
              <div
                key={report.id}
                className="rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[color:var(--text-primary)]">
                      {report.name}
                    </p>
                    <p className="mt-1 text-sm text-[color:var(--text-secondary)]">
                      {report.type} / {report.cadence}
                    </p>
                  </div>
                  <span className="glass-chip text-xs">{report.status}</span>
                </div>
                <p className="mt-3 text-sm text-[color:var(--text-secondary)]">
                  Last run {report.lastRun}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="surface-card p-5 sm:p-6">
          <p className="metric-label">API and delivery</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {summary.apiKeys?.map((item) => (
              <div
                key={item.id}
                className="rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4"
              >
                <p className="text-sm font-semibold text-[color:var(--text-primary)]">
                  {item.name}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[color:var(--text-soft)]">
                  {item.prefix}
                </p>
                <p className="mt-3 text-sm text-[color:var(--text-secondary)]">
                  Last used {item.lastUsedAt}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
