"use client";

import { useMemo, useState } from "react";
import { ArrowRight, CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { createWorkspaceApi } from "@/lib/api";
import { currentPlan, invoices, pricingPlans } from "@/lib/mock-data";
import type { WorkspaceSession } from "@/lib/types";

export function BillingPanel({ session }: { session: WorkspaceSession }) {
  const [loading, setLoading] = useState<"checkout" | "portal" | null>(null);
  const usage = useMemo(() => ({ customers: 342, limit: 500 }), []);

  async function launchCheckout() {
    setLoading("checkout");
    try {
      const api = createWorkspaceApi(session);
      const { url } = await api.createCheckoutSession();
      window.location.href = url;
    } finally {
      setLoading(null);
    }
  }

  async function openPortal() {
    setLoading("portal");
    try {
      const api = createWorkspaceApi(session);
      const { url } = await api.createPortalSession();
      window.location.href = url;
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="grid gap-5">
      <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <article className="surface-card p-5 sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="metric-label">Billing</p>
              <h2 className="panel-title mt-2 text-3xl text-[color:var(--text-primary)]">
                Current subscription
              </h2>
            </div>
            <CreditCard className="h-5 w-5 text-[color:var(--accent-strong)]" />
          </div>

          <div className="rounded-[1.6rem] border border-[color:var(--accent-soft-border)] bg-[color:var(--accent-soft)] p-5">
            <p className="metric-label">Current plan</p>
            <p className="hero-type mt-3 text-4xl text-[color:var(--text-primary)]">
              {currentPlan.name}
            </p>
            <p className="mt-2 text-sm text-[color:var(--text-secondary)]">
              {currentPlan.description}
            </p>
          </div>

          <div className="mt-5 rounded-[1.4rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-[color:var(--text-primary)]">
                Customer usage
              </p>
              <p className="text-sm text-[color:var(--text-secondary)]">
                {usage.customers} / {usage.limit}
              </p>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-[color:var(--surface-contrast)]">
              <div
                className="h-full rounded-full bg-[color:var(--accent)]"
                style={{ width: `${(usage.customers / usage.limit) * 100}%` }}
              />
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={launchCheckout}
              disabled={loading !== null}
              className="pill-link pill-link-accent text-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading === "checkout" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Upgrade or downgrade
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={openPortal}
              disabled={loading !== null}
              className="pill-link text-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading === "portal" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Billing portal
              <ShieldCheck className="h-4 w-4" />
            </button>
          </div>
        </article>

        <article className="surface-card p-5 sm:p-6">
          <p className="metric-label">Plan comparison</p>
          <div className="mt-4 grid gap-3">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className="rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[color:var(--text-primary)]">
                      {plan.name}
                    </p>
                    <p className="mt-1 text-sm text-[color:var(--text-secondary)]">
                      {plan.priceMonthly === null
                        ? "Custom pricing"
                        : `$${plan.priceMonthly}/mo or $${plan.priceYearly}/yr`}
                    </p>
                  </div>
                  {plan.featured ? <span className="glass-chip text-xs">{plan.badge}</span> : null}
                </div>
                <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">
                  {plan.description}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <article className="surface-card p-5 sm:p-6">
          <p className="metric-label">Invoices</p>
          <div className="mt-4 space-y-3">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[color:var(--text-primary)]">
                      {invoice.issuedAt}
                    </p>
                    <p className="mt-1 text-sm text-[color:var(--text-secondary)]">
                      {invoice.amount} / {invoice.status}
                    </p>
                  </div>
                  <a href={invoice.pdfUrl} className="pill-link text-sm">
                    Download PDF
                  </a>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="surface-card p-5 sm:p-6">
          <p className="metric-label">Cancel flow</p>
          <div className="mt-4 rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-5">
            <p className="text-base font-semibold text-[color:var(--text-primary)]">
              Save the account before it churns
            </p>
            <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">
              The launch flow asks for a reason, offers a temporary discount, and lets the user
              request an export before cancellation is finalized.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {["Reason selection", "Offer prompt", "Export reminder"].map((item) => (
                <div
                  key={item}
                  className="rounded-[1.2rem] border border-[color:var(--border)] bg-[color:var(--surface)] p-4 text-sm text-[color:var(--text-primary)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
