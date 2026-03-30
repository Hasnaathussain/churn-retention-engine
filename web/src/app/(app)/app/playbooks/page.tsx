import { CampaignBoard } from "@/components/campaign-board";
import { createWorkspaceApi } from "@/lib/api";
import { requireWorkspaceSession } from "@/lib/auth";

export default async function PlaybooksPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; account?: string }>;
}) {
  const { tab, account } = await searchParams;
  const session = await requireWorkspaceSession("/login?next=/app/playbooks");
  const api = createWorkspaceApi(session);
  const [accounts, summary, playbooks] = await Promise.all([
    api.getAccounts(),
    api.getDashboardSummary(),
    api.getPlaybooks(),
  ]);

  const initialTab = tab === "playbooks" ? "playbooks" : "drafts";

  return (
    <main className="space-y-6">
      <section className="section-shell px-6 py-6 sm:px-8">
        <p className="eyebrow">Playbooks and interventions</p>
        <h1 className="panel-title mt-3 text-4xl text-[color:var(--text-primary)]">
          Draft, refine, and deploy the next retention motion
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--text-secondary)]">
          Campaign generation, playbook review, and deployment stay in the same surface so the team
          can operate quickly without losing strategic context.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-4">
          {[
            ["Running", `${summary.campaignsRunning}`],
            ["High risk", `${summary.highRiskAccounts}`],
            ["Playbooks", `${playbooks.length}`],
            ["Organization", summary.organizationName],
          ].map(([label, value]) => (
            <div key={label} className="metric-tile">
              <p className="metric-label">{label}</p>
              <p className="mt-3 text-base font-semibold text-[color:var(--text-primary)]">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <CampaignBoard
        session={session}
        accounts={accounts}
        campaigns={summary.spotlightCampaigns}
        playbooks={playbooks}
        initialTab={initialTab}
        initialAccountId={account}
      />
    </main>
  );
}
