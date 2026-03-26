import Link from "next/link";
import { ArrowRight, Radar, Workflow } from "lucide-react";

const architectureLayers = [
  {
    title: "Signal layer",
    description:
      "Billing, usage, support, and account events flow into a single risk-aware lens instead of fragmented reporting.",
  },
  {
    title: "Decision layer",
    description:
      "Scoring remains explainable, workspace-aware, and consistent across demo and live modes so operators trust what they see.",
  },
  {
    title: "Action layer",
    description:
      "Campaigns, playbooks, and follow-up motion live beside the score, so the product never stops at insight alone.",
  },
];

const solutionRows = [
  {
    title: "For founders",
    description:
      "See at-risk revenue, retained revenue, and the accounts that deserve executive attention without relying on a stitched-together deck.",
  },
  {
    title: "For customer success",
    description:
      "Work from a queue that already understands urgency, next-best move, timeline context, and outreach options.",
  },
  {
    title: "For RevOps",
    description:
      "Keep sync state, credential health, automation readiness, and workspace control inside one operational surface.",
  },
];

const setupSteps = [
  "Connect the frontend to the `/v1` backend and choose whether the workspace starts in demo or live mode.",
  "Configure Supabase auth, Stripe billing state, and provider keys without changing the frontend contract.",
  "Open the workspace and move from overview to accounts, campaigns, integrations, and settings without route clutter.",
];

export default function ProductPage() {
  return (
    <main className="page-shell space-y-8 pb-20 pt-6 sm:pt-8">
      <section className="section-shell overflow-hidden px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <p className="eyebrow">Product architecture</p>
            <h1 className="hero-type max-w-3xl text-5xl leading-[0.94] text-[color:var(--text-primary)] sm:text-6xl lg:text-7xl">
              A retention product built around detect, diagnose, and act.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[color:var(--text-secondary)] sm:text-lg">
              Synapse keeps the public website lean and the product workflow dense. That means a
              cleaner path from first impression to daily retention work, without dead-end routes or
              repeated placeholder pages.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/demo" className="pill-link pill-link-accent text-sm">
                Open the demo
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/signin" className="pill-link text-sm">
                Sign in to the app
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {architectureLayers.map((layer, index) => (
              <article key={layer.title} className="surface-card flex flex-col p-5">
                <p className="metric-label">Layer 0{index + 1}</p>
                <h2 className="panel-title mt-4 text-3xl text-[color:var(--text-primary)]">
                  {layer.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">
                  {layer.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="solutions" className="section-shell px-6 py-8 sm:px-8 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Solutions</p>
            <h2 className="panel-title mt-3 text-4xl text-[color:var(--text-primary)]">
              Built for the people who actually own retention
            </h2>
          </div>
          <span className="glass-chip text-xs">
            <Radar className="h-4 w-4" />
            audience-aware workflow
          </span>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {solutionRows.map((row) => (
            <article key={row.title} className="surface-card p-6">
              <h3 className="panel-title text-3xl text-[color:var(--text-primary)]">
                {row.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">
                {row.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="setup" className="section-shell px-6 py-8 sm:px-8 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Setup</p>
            <h2 className="panel-title mt-3 text-4xl text-[color:var(--text-primary)]">
              Launch cleanly without changing the product contract
            </h2>
          </div>
          <span className="glass-chip text-xs">
            <Workflow className="h-4 w-4" />
            demo and live ready
          </span>
        </div>
        <div className="mt-6 grid gap-3">
          {setupSteps.map((step, index) => (
            <div
              key={step}
              className="rounded-[1.45rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-5 py-5"
            >
              <p className="metric-label">Step 0{index + 1}</p>
              <p className="mt-3 text-base leading-8 text-[color:var(--text-primary)]">{step}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
