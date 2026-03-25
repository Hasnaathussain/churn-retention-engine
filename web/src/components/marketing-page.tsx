import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type MarketingFeature = {
  title: string;
  description: string;
};

type MarketingStat = {
  label: string;
  value: string;
  note?: string;
};

type MarketingPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  stats?: MarketingStat[];
  features: MarketingFeature[];
  visual?: ReactNode;
  quote?: string;
  tone?: string;
};

export function MarketingPage({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  stats,
  features,
  visual,
  quote,
  tone,
}: MarketingPageProps) {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-5 pb-20 pt-14 sm:px-6 lg:px-8">
      <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-7">
          <div className="glass-chip w-fit text-[0.68rem] uppercase tracking-[0.3em] text-[#f6c66f]">
            {eyebrow}
          </div>
          <div className="space-y-5">
            <h1 className="hero-type max-w-4xl text-5xl leading-[0.95] text-[#f5f2ea] sm:text-6xl lg:text-7xl">
              {title}
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[#a0abc1] sm:text-lg">
              {description}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={primaryCta.href}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f6c66f] px-5 py-3 text-sm font-medium text-[#08101f] transition hover:-translate-y-0.5 hover:bg-[#f2b94e]"
            >
              {primaryCta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
            {secondaryCta ? (
              <Link
                href={secondaryCta.href}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/4 px-5 py-3 text-sm text-[#f5f2ea] transition hover:border-white/20 hover:bg-white/8"
              >
                {secondaryCta.label}
              </Link>
            ) : null}
          </div>
          {tone ? (
            <p className="max-w-xl text-sm uppercase tracking-[0.26em] text-[#7886a6]">
              {tone}
            </p>
          ) : null}
        </div>

        <div className="surface-card overflow-hidden p-4">
          <div className="rounded-[1.1rem] border border-white/8 bg-[#08101f]/90 p-4">
            {visual}
          </div>
        </div>
      </section>

      {stats?.length ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="surface-card-soft p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-[#8f9ab7]">
                {stat.label}
              </p>
              <p className="hero-type mt-3 text-4xl text-[#f5f2ea]">{stat.value}</p>
              {stat.note ? (
                <p className="mt-2 text-sm text-[#a0abc1]">{stat.note}</p>
              ) : null}
            </div>
          ))}
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.title}
            className={cn(
              "surface-card p-6",
              "transition duration-300 hover:-translate-y-1 hover:border-white/16"
            )}
          >
            <h2 className="panel-title text-2xl text-[#f5f2ea]">{feature.title}</h2>
            <p className="mt-3 text-sm leading-7 text-[#a0abc1]">{feature.description}</p>
          </article>
        ))}
      </section>

      {quote ? (
        <section className="surface-card p-8 text-center">
          <p className="hero-type text-3xl text-[#f5f2ea]">{quote}</p>
        </section>
      ) : null}
    </main>
  );
}
