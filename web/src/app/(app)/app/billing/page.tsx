import { BillingPanel } from "@/components/billing-panel";
import { requireWorkspaceSession } from "@/lib/auth";

export default async function BillingPage() {
  const session = await requireWorkspaceSession("/login?next=/app/billing");

  return (
    <main className="space-y-6">
      <section className="section-shell px-6 py-6 sm:px-8">
        <p className="eyebrow">Billing and subscription</p>
        <h1 className="panel-title mt-3 text-4xl text-[color:var(--text-primary)]">
          Upgrade confidently, track usage, and keep invoices in one place
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--text-secondary)]">
          Anchoryn uses hosted checkout, the Stripe customer portal, metered limits, and clear
          upgrade prompts so billing stays visible instead of becoming a support issue.
        </p>
      </section>

      <BillingPanel session={session} />
    </main>
  );
}
