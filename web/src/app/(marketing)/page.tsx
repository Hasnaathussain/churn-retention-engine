import Link from "next/link";
import { ArrowRight, BadgeCheck, Layers3, Sparkles, Waypoints } from "lucide-react";
import { WorkspacePreview } from "@/components/workspace-preview";
import {
  buildDemoSummary,
  demoAccounts,
  faqs,
  featureHighlights,
  marketingStats,
  testimonials,
  valuePillars,
} from "@/lib/mock-data";

const capabilityCards = [
  {
    icon: Layers3,
    title: "One command surface for churn prevention",
    description:
      "Anchoryn keeps billing, product engagement, support noise, and intervention planning inside one coherent operating layer.",
  },
  {
    icon: Waypoints,
    title: "From signal to action without handoff friction",
    description:
      "Every risk state resolves into a next-best move, a playbook, or an outreach draft that operators can use immediately.",
  },
  {
    icon: BadgeCheck,
    title: "Premium enough for leadership, practical enough for operators",
    description:
      "The storytelling is board-ready, but the workflow still gives CS and RevOps teams the detail they need to act confidently.",
  },
];

export default function HomePage() {
  return (
    <main className="page-shell space-y-8 pb-20 pt-6 sm:pt-8">
      <section className="section-shell animated-rise overflow-hidden px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="grid items-start gap-8 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="space-y-6">
            <div className="glass-chip text-xs">
              <Sparkles className="h-4 w-4" />
              Anchoryn production launch
            </div>
            <div className="space-y-4">
              <h1 className="hero-type max-w-3xl text-5xl leading-[0.92] text-[color:var(--text-primary)] sm:text-6xl lg:text-7xl">
                Make churn intelligence feel clear, premium, and immediately actionable.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[color:var(--text-secondary)] sm:text-lg">
                Anchoryn connects billing, product usage, support pressure, and AI recommendations
                into a refined retention workspace. You can see what is slipping, why it matters,
                and what to do next before the revenue line breaks.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/signup" className="pill-link pill-link-accent text-sm">
                Start free trial
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/demo" className="pill-link text-sm">
                Open the launch preview
              </Link>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {marketingStats.map((item) => (
                <div key={item.label} className="metric-tile">
                  <p className="metric-label">{item.label}</p>
                  <p className="metric-value">{item.value}</p>
                  <p className="mt-2 text-sm text-[color:var(--text-secondary)]">{item.note}</p>
                </div>
              ))}
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

      <section className="grid gap-4 py-2 md:grid-cols-3">
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
          <p className="eyebrow">How it works</p>
          <h2 className="panel-title mt-3 max-w-xl text-4xl leading-[0.96] text-[color:var(--text-primary)]">
            Detect the risk, explain it clearly, and move before churn lands.
          </h2>
        </div>
        <div className="grid gap-3">
          {valuePillars.map((step, index) => (
            <div
              key={step.title}
              className="rounded-[1.45rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-5 py-5"
            >
              <p className="metric-label">Step 0{index + 1}</p>
              <p className="mt-3 text-base font-semibold text-[color:var(--text-primary)]">
                {step.title}
              </p>
              <p className="mt-2 text-sm leading-7 text-[color:var(--text-secondary)]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell px-6 py-8 sm:px-8 lg:px-10">
        <p className="eyebrow">Feature highlights</p>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {featureHighlights.map((item) => (
            <div
              key={item}
              className="rounded-[1.35rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-4 text-sm text-[color:var(--text-primary)]"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <article className="surface-card p-6">
          <p className="eyebrow">Customer proof</p>
          <div className="mt-4 space-y-4">
            {testimonials.map((item) => (
              <div key={item.author} className="rounded-[1.35rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4">
                <p className="text-sm leading-7 text-[color:var(--text-primary)]">“{item.quote}”</p>
                <p className="mt-3 text-sm font-semibold text-[color:var(--text-primary)]">
                  {item.author}
                </p>
                <p className="text-sm text-[color:var(--text-secondary)]">
                  {item.role} / {item.company}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="surface-card p-6">
          <p className="eyebrow">FAQ</p>
          <div className="mt-4 space-y-4">
            {faqs.map((item) => (
              <div key={item.question} className="rounded-[1.35rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4">
                <p className="text-sm font-semibold text-[color:var(--text-primary)]">{item.question}</p>
                <p className="mt-2 text-sm leading-7 text-[color:var(--text-secondary)]">{item.answer}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
