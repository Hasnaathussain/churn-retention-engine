import Link from "next/link";
import { pricingPlans } from "@/lib/mock-data";

export default function PricingPage() {
  return (
    <main className="page-shell space-y-8 pb-20 pt-6 sm:pt-8">
      <section className="section-shell grid gap-10 px-6 py-8 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
        <div className="space-y-6">
          <div className="glass-chip text-xs">Pricing</div>
          <h1 className="hero-type max-w-4xl text-5xl leading-[0.95] text-[color:var(--text-primary)] sm:text-6xl lg:text-7xl">
            Premium pricing for a premium retention engine.
          </h1>
          <p className="max-w-2xl text-base leading-8 text-[color:var(--text-secondary)] sm:text-lg">
            Start with a seeded workspace, then graduate to live auth, billing, and integrations
            as the team is ready. Every plan keeps the product cohesive instead of splitting
            capability across half-finished pages.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/demo" className="pill-link pill-link-accent text-sm">
              Try the seeded demo
            </Link>
            <Link href="/signin" className="pill-link text-sm">
              Sign in to the app
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["Demo-ready", "Seeded workspace with polished data story"],
              ["Live-ready", "Supabase, Stripe, and provider hooks stay intact"],
              ["Operator-friendly", "Campaigns, accounts, settings, and integrations stay connected"],
            ].map(([title, description]) => (
              <div key={title} className="metric-tile">
                <p className="text-sm font-semibold text-[color:var(--text-primary)]">{title}</p>
                <p className="mt-2 text-sm leading-7 text-[color:var(--text-secondary)]">{description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          {pricingPlans.map((plan) => (
            <article
              key={plan.name}
              className={
                plan.featured
                  ? "surface-card border-[color:var(--accent-soft-border)] p-6"
                  : "surface-card p-6"
              }
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="panel-title text-3xl text-[color:var(--text-primary)]">{plan.name}</p>
                  <p className="mt-2 text-sm leading-7 text-[color:var(--text-secondary)]">{plan.description}</p>
                </div>
                {plan.featured ? (
                  <span className="glass-chip text-xs">Most popular</span>
                ) : null}
              </div>
              <div className="mt-5 flex items-end gap-2">
                <p className="hero-type text-4xl text-[color:var(--text-primary)]">{plan.price}</p>
                <p className="pb-1 text-sm text-[color:var(--text-soft)]">{plan.cadence}</p>
              </div>
              <ul className="mt-5 space-y-2 text-sm text-[color:var(--text-primary)]">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[color:var(--accent)]" />
                    {feature}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
