import Link from "next/link";
import { ArrowRight, BadgeCheck, Layers3, Sparkles, Waypoints } from "lucide-react";
import { WorkspacePreview } from "@/components/workspace-preview";
import { buildDemoSummary, demoAccounts } from "@/lib/mock-data";

const proofPoints = [
  { label: "Revenue at risk recovered", value: "$24.5k", note: "saved across this month's interventions" },
  { label: "Signals scored daily", value: "128", note: "workspace accounts watched continuously" },
  { label: "Operator response speed", value: "2.4x", note: "faster than flat CRM triage" },
];

const capabilityCards = [
  {
    icon: Layers3,
    title: "One surface for the full picture",
    description:
      "Billing, usage, support pressure, AI drafts, and team next steps live in one visual system instead of five disconnected tabs.",
  },
  {
    icon: Waypoints,
    title: "From signal to action without handoff friction",
    description:
      "Every risk state resolves into a recommended move, a playbook, or a campaign draft that operators can push forward immediately.",
  },
  {
    icon: BadgeCheck,
    title: "Polished enough for founders, clear enough for operators",
    description:
      "The storytelling is board-ready, but the workflow still gives CS and RevOps teams the detail they need to act confidently.",
  },
];

const workflow = [
  "Detect the accounts where revenue movement, engagement decay, or support strain are starting to converge.",
  "Diagnose the exact drivers with account detail, timelines, and confidence-backed recommendations.",
  "Act with drafts, playbooks, and billing-aware follow-up without leaving the workspace shell.",
];

export default function HomePage() {
  return (
    <main className="page-shell pb-20 pt-6 sm:pt-8">
      <section className="section-shell animated-rise overflow-hidden px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="grid items-start gap-8 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="space-y-6">
            <div className="glass-chip text-xs">
              <Sparkles className="h-4 w-4" />
              Light-luxe retention operating system
            </div>
            <div className="space-y-4">
              <h1 className="hero-type max-w-3xl text-5xl leading-[0.92] text-[color:var(--text-primary)] sm:text-6xl lg:text-7xl">
                Make churn intelligence feel clear, premium, and immediately actionable.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[color:var(--text-secondary)] sm:text-lg">
                Synapse connects billing, product usage, and support pressure into a refined
                workspace for founders and operators. You can see what is slipping, why it matters,
                and what to do next without wading through ghost links or placeholder dashboards.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/demo" className="pill-link pill-link-accent text-sm">
                Open the demo workspace
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/product" className="pill-link text-sm">
                Explore the product
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {proofPoints.map((item) => (
                <div key={item.label} className="metric-tile">
                  <p className="metric-label">{item.label}</p>
                  <p className="metric-value">{item.value}</p>
                  <p className="mt-2 text-sm text-[color:var(--text-secondary)]">{item.note}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-[color:var(--text-secondary)]">
              <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-2">
                Stripe-aware billing state
              </span>
              <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-2">
                Demo and live workspace modes
              </span>
              <span className="rounded-full border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-2">
                AI campaigns and playbooks
              </span>
            </div>
          </div>

          <div className="min-w-0">
            <WorkspacePreview
              summary={buildDemoSummary()}
              accounts={demoAccounts.slice(0, 4)}
              mode="hero"
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 py-8 md:grid-cols-3">
        {capabilityCards.map((card) => {
          const Icon = card.icon;

          return (
            <article key={card.title} className="surface-card p-6">
              <span className="grid h-12 w-12 place-items-center rounded-2xl border border-[color:var(--accent-soft-border)] bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)]">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="panel-title mt-5 text-3xl text-[color:var(--text-primary)]">
                {card.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">
                {card.description}
              </p>
            </article>
          );
        })}
      </section>

      <section className="section-shell grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
        <div>
          <p className="eyebrow">How the product moves</p>
          <h2 className="panel-title mt-3 max-w-xl text-4xl leading-[0.96] text-[color:var(--text-primary)]">
            Fewer surfaces, stronger workflows, and a cleaner story for every click.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[color:var(--text-secondary)]">
            The redesign keeps the core product rich, but it trims the unnecessary route sprawl.
            What remains is a set of pages that actually guide a user from signal to decision.
          </p>
        </div>
        <div className="grid gap-3">
          {workflow.map((step, index) => (
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
