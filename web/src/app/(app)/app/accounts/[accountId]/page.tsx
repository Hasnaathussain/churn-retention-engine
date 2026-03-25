import Link from "next/link";
import { ArrowRight, ShieldAlert, Sparkles } from "lucide-react";
import { createWorkspaceApi } from "@/lib/api";
import { requireWorkspaceSession } from "@/lib/auth";
import { cn } from "@/lib/cn";

export default async function AccountDetailPage({
  params,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const { accountId } = await params;
  const session = await requireWorkspaceSession("/signin?next=/app/overview");
  const api = createWorkspaceApi(session);
  const [account, timeline, summary] = await Promise.all([
    api.getAccount(accountId),
    api.getAccountTimeline(accountId),
    api.getDashboardSummary(),
  ]);

  const score = Math.round(account.churnProbability * 100);

  return (
    <main className="space-y-6">
      <section className="surface-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="glass-chip w-fit text-xs text-[#f6c66f]">
              <Sparkles className="h-4 w-4" />
              Account 360
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#8f9ab7]">
                {account.domain} • {account.plan}
              </p>
              <h1 className="panel-title mt-2 text-4xl text-[#f5f2ea]">{account.name}</h1>
              <p className="mt-2 text-sm text-[#a0abc1]">
                {account.owner} • last active {account.lastActive}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/8 bg-white/4 p-5 text-right">
            <p className="text-xs uppercase tracking-[0.22em] text-[#8f9ab7]">Churn risk</p>
            <p className={cn("hero-type mt-2 text-5xl", score >= 75 ? "text-[#f28b82]" : score >= 55 ? "text-[#f6c66f]" : "text-[#8dd6a3]")}>
              {score}%
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[#8f9ab7]">
              Confidence {Math.round(account.healthScore)}%
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="surface-card p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-[#8f9ab7]">Risk drivers</p>
          <div className="mt-4 space-y-3">
            {account.drivers.map((driver) => (
              <div key={driver.label} className="rounded-2xl border border-white/8 bg-white/4 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-[#8f9ab7]">{driver.label}</p>
                <p className="mt-2 text-sm text-[#f5f2ea]">{driver.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-3xl border border-[#f6c66f]/20 bg-[#f6c66f]/8 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-[#f6c66f]">Recommended move</p>
            <p className="mt-2 text-lg text-[#f5f2ea]">{account.recommendedAction}</p>
            <p className="mt-3 text-sm leading-7 text-[#a0abc1]">{account.primaryRisk}</p>
          </div>
        </div>

        <div className="surface-card p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-[#8f9ab7]">Timeline</p>
          <div className="mt-4 space-y-3">
            {timeline.map((event) => (
              <div key={event.id} className="rounded-2xl border border-white/8 bg-white/4 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-[#f5f2ea]">{event.title}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[#8f9ab7]">
                      {event.channel} • {event.timestamp}
                    </p>
                  </div>
                  <ShieldAlert className="h-4 w-4 text-[#f6c66f]" />
                </div>
                <p className="mt-3 text-sm leading-7 text-[#a0abc1]">{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-3">
        {[
          ["Workspace revenue", `$${summary.monthlyRevenue.toLocaleString()}`],
          ["Other at-risk accounts", `${summary.highRiskAccounts}`],
          ["Suggested next step", account.recommendedAction],
        ].map(([label, value]) => (
          <div key={label} className="surface-card p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-[#8f9ab7]">{label}</p>
            <p className="hero-type mt-3 text-2xl text-[#f5f2ea]">{value}</p>
          </div>
        ))}
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          href={`/app/campaigns?account=${account.id}`}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f6c66f] px-5 py-3 text-sm font-medium text-[#08101f]"
        >
          Draft a campaign
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/app/accounts"
          className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/4 px-5 py-3 text-sm text-[#f5f2ea]"
        >
          Back to accounts
        </Link>
      </div>
    </main>
  );
}
