import Link from "next/link";
import { AccountTable } from "@/components/account-table";
import { createWorkspaceApi } from "@/lib/api";
import { requireWorkspaceSession } from "@/lib/auth";

export default async function CustomersPage() {
  const session = await requireWorkspaceSession("/login?next=/app/customers");
  const api = createWorkspaceApi(session);
  const [summary, accounts] = await Promise.all([api.getDashboardSummary(), api.getAccounts()]);

  return (
    <main className="space-y-6">
      <section className="section-shell px-6 py-6 sm:px-8">
        <p className="eyebrow">Customers</p>
        <h1 className="panel-title mt-3 text-4xl text-[color:var(--text-primary)]">
          Prioritize the right customer at the right moment
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--text-secondary)]">
          This queue is optimized for the operators who need to find the next high-leverage move
          quickly while still keeping company context, risk detail, and revenue value visible.
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
          <Link href="/app/playbooks" className="pill-link pill-link-accent text-sm">
            Open playbooks
          </Link>
          <Link href="/app/dashboard" className="pill-link text-sm">
            Back to dashboard
          </Link>
        </div>
      </section>

      <AccountTable accounts={accounts} />
    </main>
  );
}
