import Link from "next/link";
import { WorkspacePreview } from "@/components/workspace-preview";
import { buildDemoSummary, demoAccounts } from "@/lib/mock-data";

export default function DemoPage() {
  return (
    <main className="page-shell space-y-8 pb-20 pt-6 sm:pt-8">
      <section className="section-shell px-6 py-8 sm:px-8 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-5">
            <div className="glass-chip text-xs">Seeded demo workspace</div>
            <h1 className="hero-type max-w-4xl text-5xl leading-[0.95] text-[color:var(--text-primary)] sm:text-6xl lg:text-7xl">
              Walk through the product before you connect live data.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[color:var(--text-secondary)] sm:text-lg">
              This preview uses the seeded demo workspace and mirrors the same account, campaign,
              and integration surfaces you will see in the protected app. It is intentionally one
              coherent preview path rather than a disconnected mini-site.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/auth/demo?next=/app/dashboard" className="pill-link pill-link-accent text-sm">
                Open the demo app
              </Link>
              <Link href="/login" className="pill-link text-sm">
                Log in to the app
              </Link>
              <Link href="/pricing" className="pill-link text-sm">
                Compare plans
              </Link>
            </div>
          </div>

          <div className="surface-card p-5">
            <p className="metric-label">What you will see</p>
            <div className="mt-4 grid gap-3">
              {[
                "Workspace overview with risk trends and revenue at risk",
                "Customer drilldown with timeline, playbook, and campaign drafts",
                "Integrations, billing, API keys, and webhook visibility in the protected shell",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.2rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3 text-sm text-[color:var(--text-primary)]"
                >
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
