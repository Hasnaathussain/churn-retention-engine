import { createWorkspaceApi } from "@/lib/api";
import { requireWorkspaceSession } from "@/lib/auth";

export default async function AdminPage() {
  const session = await requireWorkspaceSession("/login?next=/app/admin");
  const api = createWorkspaceApi(session);
  const summary = await api.getDashboardSummary();

  return (
    <main className="space-y-6">
      <section className="section-shell px-6 py-6 sm:px-8">
        <p className="eyebrow">Admin panel</p>
        <h1 className="panel-title mt-3 text-4xl text-[color:var(--text-primary)]">
          Organization health, feature flags, and launch controls
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--text-secondary)]">
          Owners and admins can use this surface to review cross-account usage, billing posture,
          system health, and rollout controls without touching the database directly.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          ["Tracked customers", `${summary.activeAccounts}`],
          ["Retention saves", `${summary.retentionsSaved}`],
          ["API keys", `${summary.apiKeys?.length ?? 0}`],
          ["Webhooks", `${summary.webhooks?.length ?? 0}`],
        ].map(([label, value]) => (
          <article key={label} className="metric-tile">
            <p className="metric-label">{label}</p>
            <p className="metric-value">{value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <article className="surface-card p-5 sm:p-6">
          <p className="metric-label">System health</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              ["API latency", "142 ms"],
              ["DB connections", "Healthy"],
              ["Queue backlog", "3 jobs"],
              ["Error rate", "0.12%"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4"
              >
                <p className="metric-label">{label}</p>
                <p className="mt-2 text-base font-semibold text-[color:var(--text-primary)]">{value}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="surface-card p-5 sm:p-6">
          <p className="metric-label">Announcement banner</p>
          <textarea
            defaultValue="Scale plan customers now have access to the launch preview for public API keys and scheduled churn digests."
            className="focus-ring mt-4 min-h-40 w-full rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-4 outline-none"
          />
          <button type="button" className="pill-link pill-link-accent mt-4 text-sm">
            Publish banner
          </button>
        </article>
      </section>
    </main>
  );
}
