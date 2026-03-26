import { Activity, CircleGauge, Radar, ShieldCheck } from "lucide-react";
import { WorkspacePreview } from "@/components/workspace-preview";
import { createWorkspaceApi } from "@/lib/api";
import { requireWorkspaceSession } from "@/lib/auth";

const quickLenses = [
  {
    icon: CircleGauge,
    title: "Revenue control",
    description: "Monthly revenue, at-risk revenue, and health score stay in one frame.",
  },
  {
    icon: Radar,
    title: "High-risk queue",
    description: "The most urgent accounts stay close to the trend and the action surfaces.",
  },
  {
    icon: Activity,
    title: "Playbook pulse",
    description: "Successful interventions remain visible so teams repeat what is working.",
  },
  {
    icon: ShieldCheck,
    title: "Provider trust",
    description: "Integration health stays visible so the score always has operational context.",
  },
];

export default async function OverviewPage() {
  const session = await requireWorkspaceSession("/signin?next=/app/overview");
  const api = createWorkspaceApi(session);
  const [summary, accounts] = await Promise.all([api.getDashboardSummary(), api.getAccounts()]);

  return (
    <main className="space-y-6">
      <section className="section-shell px-6 py-6 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Workspace overview</p>
            <h2 className="panel-title mt-3 text-4xl text-[color:var(--text-primary)]">
              Revenue control for {summary.workspaceName}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--text-secondary)]">
              The overview is the densest version of the product story: revenue movement, risk
              pressure, account urgency, playbook momentum, and signal trust all live here.
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {quickLenses.map((lens) => {
            const Icon = lens.icon;

            return (
              <article key={lens.title} className="metric-tile">
                <Icon className="h-5 w-5 text-[color:var(--accent-strong)]" />
                <p className="mt-4 text-sm font-semibold text-[color:var(--text-primary)]">
                  {lens.title}
                </p>
                <p className="mt-2 text-sm leading-7 text-[color:var(--text-secondary)]">
                  {lens.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <WorkspacePreview summary={summary} accounts={accounts.slice(0, 5)} />
    </main>
  );
}
