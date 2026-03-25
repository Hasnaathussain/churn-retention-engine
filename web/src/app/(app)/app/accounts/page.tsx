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
      <section className="surface-card p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-[#8f9ab7]">Accounts</p>
        <h1 className="panel-title mt-2 text-3xl text-[#f5f2ea]">Prioritize the right customer at the right moment</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#a0abc1]">
          The list below is workspace-aware and sorted around churn pressure so the CS team can
          move quickly without hunting through a flat CRM export.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-4">
          {[
            ["At risk", `${summary.highRiskAccounts}`],
            ["Revenue at risk", `$${summary.revenueAtRisk.toLocaleString()}`],
            ["Monitored", `${summary.activeAccounts}`],
            ["Saved", `${summary.retentionsSaved}`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/8 bg-white/4 p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-[#8f9ab7]">{label}</p>
              <p className="hero-type mt-2 text-2xl text-[#f5f2ea]">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/app/campaigns"
            className="inline-flex items-center justify-center rounded-full bg-[#f6c66f] px-5 py-3 text-sm font-medium text-[#08101f]"
          >
            Open campaign board
          </Link>
          <Link
            href="/app/overview"
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/4 px-5 py-3 text-sm text-[#f5f2ea]"
          >
            Back to overview
          </Link>
        </div>
      </section>

      <AccountTable accounts={accounts} />
    </main>
  );
}
