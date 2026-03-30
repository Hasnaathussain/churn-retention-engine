import { createWorkspaceApi } from "@/lib/api";
import { requireWorkspaceSession } from "@/lib/auth";

export default async function TeamPage() {
  const session = await requireWorkspaceSession("/login?next=/app/team");
  const api = createWorkspaceApi(session);
  const summary = await api.getDashboardSummary();

  return (
    <main className="space-y-6">
      <section className="section-shell px-6 py-6 sm:px-8">
        <p className="eyebrow">Team settings</p>
        <h1 className="panel-title mt-3 text-4xl text-[color:var(--text-primary)]">
          Invite operators, adjust roles, and keep access tight
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--text-secondary)]">
          Owners and admins can invite members, set permissions, and keep organization access aligned
          with how retention work actually gets done.
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="surface-card p-5 sm:p-6">
          <p className="metric-label">Active members</p>
          <div className="mt-4 space-y-3">
            {summary.team?.map((member) => (
              <div
                key={member.id}
                className="rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[color:var(--text-primary)]">
                      {member.name}
                    </p>
                    <p className="mt-1 text-sm text-[color:var(--text-secondary)]">{member.email}</p>
                  </div>
                  <span className="glass-chip text-xs">{member.role}</span>
                </div>
                <p className="mt-3 text-sm text-[color:var(--text-secondary)]">
                  {member.status === "active"
                    ? `Last active ${member.lastActive}`
                    : "Invitation sent and awaiting acceptance"}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="surface-card p-5 sm:p-6">
          <p className="metric-label">Invite teammate</p>
          <div className="mt-4 grid gap-4">
            <input
              type="email"
              placeholder="teammate@company.com"
              className="focus-ring rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3 outline-none placeholder:text-[color:var(--text-soft)]"
            />
            <select className="focus-ring rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3 outline-none">
              <option>Admin</option>
              <option>Analyst</option>
              <option>Viewer</option>
            </select>
            <button type="button" className="pill-link pill-link-accent text-sm">
              Send invitation
            </button>
          </div>
        </article>
      </section>
    </main>
  );
}
