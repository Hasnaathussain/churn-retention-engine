import { WorkspacePreview } from "@/components/workspace-preview";
import { buildDemoSummary, demoAccounts } from "@/lib/mock-data";
import Link from "next/link";

export default function DemoPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 pb-20 pt-14 sm:px-6 lg:px-8">
      <section className="space-y-6">
        <div className="glass-chip w-fit text-[0.68rem] uppercase tracking-[0.3em] text-[#f6c66f]">
          Seeded demo workspace
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-5">
            <h1 className="hero-type max-w-4xl text-5xl leading-[0.95] text-[#f5f2ea] sm:text-6xl lg:text-7xl">
              Walk through the product before connecting live data.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[#a0abc1] sm:text-lg">
              This preview uses the seeded demo workspace and mirrors the same account, campaign,
              and integration surfaces you will see in the protected app.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/signin"
                className="inline-flex items-center justify-center rounded-full bg-[#f6c66f] px-5 py-3 text-sm font-medium text-[#08101f] transition hover:-translate-y-0.5 hover:bg-[#f2b94e]"
              >
                Sign in to the app
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/4 px-5 py-3 text-sm text-[#f5f2ea] transition hover:border-white/20 hover:bg-white/8"
              >
                Compare plans
              </Link>
            </div>
          </div>

          <div className="surface-card p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[#8f9ab7]">What you will see</p>
            <div className="mt-4 grid gap-3">
              {[
                "Workspace overview with risk trends and revenue at risk",
                "Account drilldown with timeline, playbook, and campaign drafts",
                "Integrations, billing, and settings in the protected shell",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-[#dfe6f6]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <WorkspacePreview summary={buildDemoSummary()} accounts={demoAccounts} />
    </main>
  );
}
