import { createWorkspaceApi } from "@/lib/api";
import { requireWorkspaceSession } from "@/lib/auth";

export default async function ReportsPage() {
  const session = await requireWorkspaceSession("/login?next=/app/reports");
  const api = createWorkspaceApi(session);
  const summary = await api.getDashboardSummary();

  return (
    <main className="space-y-6">
      <section className="section-shell px-6 py-6 sm:px-8">
        <p className="eyebrow">Reports</p>
        <h1 className="panel-title mt-3 text-4xl text-[color:var(--text-primary)]">
          Deliver churn, cohort, and revenue insights without leaving the workspace
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--text-secondary)]">
          The launch release ships monthly churn summaries, at-risk cohort monitoring, and revenue
          impact rollups with PDF, CSV, and JSON export paths.
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        {summary.reports?.map((report) => (
          <article key={report.id} className="surface-card p-5 sm:p-6">
            <p className="metric-label">{report.type}</p>
            <h2 className="panel-title mt-3 text-3xl text-[color:var(--text-primary)]">
              {report.name}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">
              Delivery cadence: {report.cadence}. Last run: {report.lastRun}.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <span className="glass-chip text-xs">{report.status}</span>
              <span className="pill-link text-sm">Export PDF</span>
              <span className="pill-link text-sm">Export CSV</span>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
