import { requireWorkspaceSession } from "@/lib/auth";

export default async function AccountPage() {
  const session = await requireWorkspaceSession("/login?next=/app/account");

  return (
    <main className="space-y-6">
      <section className="section-shell px-6 py-6 sm:px-8">
        <p className="eyebrow">Account settings</p>
        <h1 className="panel-title mt-3 text-4xl text-[color:var(--text-primary)]">
          Manage profile, notifications, and recovery options
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--text-secondary)]">
          This is the personal settings surface for profile metadata, password changes, alert
          preferences, language, timezone, and account recovery.
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <article className="surface-card p-5 sm:p-6">
          <p className="metric-label">Profile</p>
          <div className="mt-4 grid gap-4">
            <input
              defaultValue={session.userName}
              className="focus-ring rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3 outline-none"
            />
            <input
              defaultValue={session.userEmail}
              className="focus-ring rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3 outline-none"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                defaultValue={session.timezone}
                className="focus-ring rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3 outline-none"
              />
              <input
                defaultValue={session.locale}
                className="focus-ring rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3 outline-none"
              />
            </div>
            <button type="button" className="pill-link pill-link-accent text-sm">
              Save changes
            </button>
          </div>
        </article>

        <article className="surface-card p-5 sm:p-6">
          <p className="metric-label">Danger zone</p>
          <div className="mt-4 rounded-[1.5rem] border border-[color:var(--danger)]/30 bg-[color:var(--surface-soft)] p-5">
            <p className="text-base font-semibold text-[color:var(--text-primary)]">
              Delete account
            </p>
            <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">
              Production flow requires password confirmation, email verification, and a final export
              reminder before account deletion is processed.
            </p>
            <button type="button" className="pill-link mt-4 text-sm">
              Request deletion
            </button>
          </div>
        </article>
      </section>
    </main>
  );
}
