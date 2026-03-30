import Link from "next/link";
import { requireWorkspaceSession } from "@/lib/auth";

const steps = [
  "Welcome and company details",
  "Connect Stripe, CSV, or API data",
  "Tune AI sensitivity and thresholds",
  "Choose notification channels",
  "Celebrate launch and open dashboard",
];

export default async function OnboardingPage() {
  await requireWorkspaceSession("/login?next=/onboarding");

  return (
    <main className="page-shell py-10">
      <section className="section-shell px-6 py-8 sm:px-8 lg:px-10">
        <p className="eyebrow">Onboarding</p>
        <h1 className="panel-title mt-3 text-5xl text-[color:var(--text-primary)]">
          Launch Anchoryn in five clear steps
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[color:var(--text-secondary)]">
          The production onboarding flow collects organization basics, connects data, tunes risk
          settings, configures alerts, and then lands the user directly in the dashboard.
        </p>
        <div className="mt-8 grid gap-4 lg:grid-cols-5">
          {steps.map((step, index) => (
            <article key={step} className="surface-card p-5">
              <p className="metric-label">Step 0{index + 1}</p>
              <p className="mt-3 text-base font-semibold text-[color:var(--text-primary)]">
                {step}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/app/dashboard" className="pill-link pill-link-accent">
            Open dashboard
          </Link>
          <Link href="/app/integrations" className="pill-link">
            Configure integrations
          </Link>
        </div>
      </section>
    </main>
  );
}
