import { WorkspacePreview } from "@/components/workspace-preview";
import { createWorkspaceApi } from "@/lib/api";
import { requireWorkspaceSession } from "@/lib/auth";

export default async function OverviewPage() {
  const session = await requireWorkspaceSession("/signin?next=/app/overview");
  const api = createWorkspaceApi(session);
  const [summary, accounts] = await Promise.all([api.getDashboardSummary(), api.getAccounts()]);

  return (
    <main className="space-y-6">
      <section className="surface-card p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-[#8f9ab7]">Workspace overview</p>
        <h2 className="panel-title mt-2 text-3xl text-[#f5f2ea]">
          Revenue control for {summary.workspaceName}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#a0abc1]">
          The overview consolidates the live signal layer, the seeded demo workspace, and the
          operational surfaces into one calm, cinematic command center.
        </p>
      </section>

      <WorkspacePreview summary={summary} accounts={accounts.slice(0, 4)} />
    </main>
  );
}
