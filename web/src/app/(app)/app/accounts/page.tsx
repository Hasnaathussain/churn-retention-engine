import Link from "next/link";
import { AccountTable } from "@/components/account-table";
import { createWorkspaceApi } from "@/lib/api";
import { requireWorkspaceSession } from "@/lib/auth";

export default async function AccountsPage() {
  const session = await requireWorkspaceSession("/signin?next=/app/accounts");
  const api = createWorkspaceApi(session);
  const [summary, accounts] = await Promise.all([api.getDashboardSummary(), api.getAccounts()]);

  return (
    <main className="space-y-6">
      <section className="section-shell px-6 py-6 sm:px-8">
        <p className="eyebrow">Accounts</p>
        <h1 className="panel-title mt-3 text-4xl text-[color:var(--text-primary)]">
          Prioritize the right customer at the right moment
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--text-secondary)]">
          This queue is sorted around churn pressure, but the layout is dense enough to help a team
          act instead of hopping between weak pages to gather context.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-4">
          {[
            ["At risk", `${summary.highRiskAccounts}`],
            ["Revenue at risk", `$${summary.revenueAtRisk.toLocaleString()}`],
            ["Monitored", `${summary.activeAccounts}`],
            ["Saved", `${summary.retentionsSaved}`],
          ].map(([label, value]) => (
            <div key={label} className="metric-tile">
              <p className="metric-label">{label}</p>
              <p className="metric-value">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/app/campaigns" className="pill-link pill-link-accent text-sm">
            Open campaign studio
          </Link>
          <Link href="/app/overview" className="pill-link text-sm">
            Back to overview
          </Link>
        </div>
      </section>

      <AccountTable accounts={accounts} />
    </main>
  );
}
