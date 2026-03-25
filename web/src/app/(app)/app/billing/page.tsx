import { BillingPanel } from "@/components/billing-panel";
import { requireWorkspaceSession } from "@/lib/auth";

export default async function BillingPage() {
  const session = await requireWorkspaceSession("/signin?next=/app/billing");

  return (
    <main className="space-y-6">
      <section className="surface-card p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-[#8f9ab7]">Billing</p>
        <h1 className="panel-title mt-2 text-3xl text-[#f5f2ea]">Checkout, portal, and workspace billing state</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#a0abc1]">
          The app already knows how to create Stripe checkout and portal sessions, and the billing
          surface keeps the subscription state visible to the owner.
        </p>
      </section>

      <BillingPanel session={session} />
    </main>
  );
}
