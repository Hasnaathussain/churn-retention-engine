import { requireWorkspaceSession } from "@/lib/auth";

export default async function SettingsPage() {
  const session = await requireWorkspaceSession("/signin?next=/app/settings");

  return (
    <main className="space-y-6">
      <section className="surface-card p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-[#8f9ab7]">Settings</p>
        <h1 className="panel-title mt-2 text-3xl text-[#f5f2ea]">Workspace and account controls</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#a0abc1]">
          The owner can manage billing and integrations while members stay focused on accounts and
          campaigns. This route gives the app a proper home for those controls.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["Workspace", session.workspaceName],
          ["Role", session.role],
          ["Mode", session.mode],
        ].map(([label, value]) => (
          <article key={label} className="surface-card p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-[#8f9ab7]">{label}</p>
            <p className="hero-type mt-3 text-2xl text-[#f5f2ea]">{value}</p>
          </article>
        ))}
      </section>

      <section className="surface-card p-5">
        <p className="text-xs uppercase tracking-[0.24em] text-[#8f9ab7]">Preferences</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            "Notification cadence for high-risk accounts",
            "Playbook ownership and escalation routing",
            "Default campaign channel and approval flow",
            "Integration sync frequency and alerting",
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-white/8 bg-white/4 p-4 text-sm text-[#dfe6f6]">
              {item}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
