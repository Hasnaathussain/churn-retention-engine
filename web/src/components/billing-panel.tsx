"use client";

import { useState } from "react";
import { ArrowRight, CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { createWorkspaceApi } from "@/lib/api";
import type { WorkspaceSession } from "@/lib/types";

export function BillingPanel({ session }: { session: WorkspaceSession }) {
  const [loading, setLoading] = useState<"checkout" | "portal" | null>(null);

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
    <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
      <section className="surface-card p-5 sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="metric-label">Billing</p>
            <h2 className="panel-title mt-2 text-3xl text-[color:var(--text-primary)]">
              Workspace subscription
            </h2>
          </div>
          <CreditCard className="h-5 w-5 text-[color:var(--accent-strong)]" />
        </div>

        <div className="rounded-[1.6rem] border border-[color:var(--accent-soft-border)] bg-[color:var(--accent-soft)] p-5">
          <p className="metric-label">Current plan</p>
          <p className="hero-type mt-3 text-4xl text-[color:var(--text-primary)]">$499</p>
          <p className="mt-2 text-sm text-[color:var(--text-secondary)]">
            Growth plan with AI retention workflows, operator tooling, and workspace controls.
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={launchCheckout}
            disabled={loading !== null}
            className="pill-link pill-link-accent text-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading === "checkout" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Checkout session
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
      </section>

      <section className="surface-card p-5 sm:p-6">
        <p className="metric-label">Scope and access</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            ["Owner only", "Billing, integrations, and security settings"],
            ["Member safe", "Accounts, campaigns, and playbook actions"],
            ["Demo mode", "Seeded workspace preview without live auth"],
            ["Live mode", "Supabase-backed session and workspace context"],
          ].map(([title, description]) => (
            <div
              key={title}
              className="rounded-[1.2rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4"
            >
              <p className="text-sm font-semibold text-[color:var(--text-primary)]">{title}</p>
              <p className="mt-2 text-sm leading-7 text-[color:var(--text-secondary)]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
