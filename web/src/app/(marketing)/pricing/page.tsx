import Link from "next/link";
import { pricingPlans } from "@/lib/mock-data";

export default function PricingPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-5 pb-20 pt-14 sm:px-6 lg:px-8">
      <section className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <div className="glass-chip w-fit text-[0.68rem] uppercase tracking-[0.3em] text-[#f6c66f]">
            Pricing
          </div>
          <h1 className="hero-type max-w-4xl text-5xl leading-[0.95] text-[#f5f2ea] sm:text-6xl lg:text-7xl">
            Premium pricing for a premium retention engine.
          </h1>
          <p className="max-w-2xl text-base leading-8 text-[#a0abc1] sm:text-lg">
            Start with a seeded workspace, then graduate to live auth, billing, and integrations
            as the team is ready. Every plan is built to feel like a modern SaaS product.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/demo"
              className="inline-flex items-center justify-center rounded-full bg-[#f6c66f] px-5 py-3 text-sm font-medium text-[#08101f] transition hover:-translate-y-0.5 hover:bg-[#f2b94e]"
            >
              Try the seeded demo
            </Link>
            <Link
              href="/signin"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/4 px-5 py-3 text-sm text-[#f5f2ea] transition hover:border-white/20 hover:bg-white/8"
            >
              Sign in to the app
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          {pricingPlans.map((plan) => (
            <article
              key={plan.name}
              className={
                plan.featured
                  ? "surface-card border-[#f6c66f]/25 p-6"
                  : "surface-card p-6"
              }
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="panel-title text-2xl text-[#f5f2ea]">{plan.name}</p>
                  <p className="mt-2 text-sm leading-7 text-[#a0abc1]">{plan.description}</p>
                </div>
                {plan.featured ? (
                  <span className="glass-chip text-xs text-[#f6c66f]">Most popular</span>
                ) : null}
              </div>
              <div className="mt-5 flex items-end gap-2">
                <p className="hero-type text-4xl text-[#f5f2ea]">{plan.price}</p>
                <p className="pb-1 text-sm text-[#8f9ab7]">{plan.cadence}</p>
              </div>
              <ul className="mt-5 space-y-2 text-sm text-[#dfe6f6]">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#f6c66f]" />
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
