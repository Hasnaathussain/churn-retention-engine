import { createWorkspaceApi } from "@/lib/api";
import { requireWorkspaceSession } from "@/lib/auth";

export default async function PlaybooksPage() {
  const session = await requireWorkspaceSession("/signin?next=/app/playbooks");
  const api = createWorkspaceApi(session);
  const [playbooks, summary] = await Promise.all([api.getPlaybooks(), api.getDashboardSummary()]);

  return (
    <main className="space-y-6">
      <section className="surface-card p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-[#8f9ab7]">Playbooks</p>
        <h1 className="panel-title mt-2 text-3xl text-[#f5f2ea]">Codify the retention motions that work</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#a0abc1]">
          Playbooks keep the team aligned on which trigger should produce which intervention.
          They make the response pattern repeatable and measurable.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {summary.playbooks.map((playbook) => (
            <div key={playbook.id} className="rounded-2xl border border-white/8 bg-white/4 p-4">
              <p className="text-sm text-[#f5f2ea]">{playbook.name}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.22em] text-[#8f9ab7]">
                {playbook.status}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {playbooks.map((playbook) => (
          <article key={playbook.id} className="surface-card p-5">
            <p className="panel-title text-2xl text-[#f5f2ea]">{playbook.name}</p>
            <p className="mt-3 text-sm leading-7 text-[#a0abc1]">{playbook.action}</p>
            <div className="mt-4 space-y-2 text-sm text-[#dfe6f6]">
              <p>Trigger: {playbook.trigger}</p>
              <p>Audience: {playbook.audience}</p>
              <p>Last run: {playbook.lastRun}</p>
              <p>Success rate: {Math.round(playbook.successRate * 100)}%</p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
