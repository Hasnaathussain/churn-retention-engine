import { CampaignBoard } from "@/components/campaign-board";
import { createWorkspaceApi } from "@/lib/api";
import { requireWorkspaceSession } from "@/lib/auth";

export default async function CampaignsPage() {
  const session = await requireWorkspaceSession("/signin?next=/app/campaigns");
  const api = createWorkspaceApi(session);
  const [accounts, summary] = await Promise.all([api.getAccounts(), api.getDashboardSummary()]);

  return (
    <main className="space-y-6">
      <section className="surface-card p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-[#8f9ab7]">Campaigns</p>
        <h1 className="panel-title mt-2 text-3xl text-[#f5f2ea]">Draft, queue, and deploy the next intervention</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#a0abc1]">
          Campaigns translate the score into real outreach. This board can sit on top of live
          integrations or the seeded workspace without changing the UI contract.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-4">
          {[
            ["Running", `${summary.campaignsRunning}`],
            ["High risk", `${summary.highRiskAccounts}`],
            ["Saved", `${summary.retentionsSaved}`],
            ["Workspace", summary.workspaceName],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/8 bg-white/4 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[#8f9ab7]">{label}</p>
              <p className="hero-type mt-2 text-2xl text-[#f5f2ea]">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <CampaignBoard session={session} accounts={accounts} campaigns={summary.spotlightCampaigns} />
    </main>
  );
}
