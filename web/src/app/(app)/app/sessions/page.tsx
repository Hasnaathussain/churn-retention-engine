import { createWorkspaceApi } from "@/lib/api";
import { requireWorkspaceSession } from "@/lib/auth";

export default async function SessionsPage() {
  const session = await requireWorkspaceSession("/login?next=/app/sessions");
  const api = createWorkspaceApi(session);
  const summary = await api.getDashboardSummary();

  return (
    <main className="space-y-6">
      <section className="section-shell px-6 py-6 sm:px-8">
        <p className="eyebrow">Session security</p>
        <h1 className="panel-title mt-3 text-4xl text-[color:var(--text-primary)]">
          Review active devices and revoke anything suspicious
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--text-secondary)]">
          The production auth layer tracks refresh sessions per device so users can see current
          activity, revoke old devices, and log out of all sessions when needed.
        </p>
      </section>

      <section className="grid gap-4">
        {summary.sessions?.map((item) => (
          <article key={item.id} className="surface-card p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="panel-title text-3xl text-[color:var(--text-primary)]">{item.device}</p>
                <p className="mt-2 text-sm text-[color:var(--text-secondary)]">{item.location}</p>
                <p className="mt-1 text-sm text-[color:var(--text-secondary)]">
                  {item.current ? "Current session" : `Last active ${item.lastActive}`}
                </p>
              </div>
              <button type="button" className="pill-link text-sm">
                {item.current ? "Current" : "Revoke session"}
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
