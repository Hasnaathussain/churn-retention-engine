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
      <section className="surface-card p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#8f9ab7]">Billing</p>
            <h2 className="panel-title mt-2 text-2xl text-[#f5f2ea]">Workspace subscription</h2>
          </div>
          <CreditCard className="h-5 w-5 text-[#f6c66f]" />
        </div>
        <div className="rounded-3xl border border-white/8 bg-white/4 p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[#8f9ab7]">Current plan</p>
          <p className="hero-type mt-3 text-4xl text-[#f5f2ea]">$499</p>
          <p className="mt-2 text-sm text-[#a0abc1]">Growth plan with AI retention workflows and workspace controls.</p>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={launchCheckout}
            disabled={loading !== null}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f6c66f] px-5 py-3 text-sm font-medium text-[#08101f] transition hover:-translate-y-0.5 hover:bg-[#f2b94e] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading === "checkout" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Checkout session
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={openPortal}
            disabled={loading !== null}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/4 px-5 py-3 text-sm text-[#f5f2ea] transition hover:border-white/20 hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading === "portal" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Billing portal
            <ShieldCheck className="h-4 w-4" />
          </button>
        </div>
      </section>

      <section className="surface-card p-5">
        <p className="text-xs uppercase tracking-[0.24em] text-[#8f9ab7]">Workspace scope</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            ["Owner only", "Billing, integrations, and security settings"],
            ["Member safe", "Accounts, campaigns, and playbooks"],
            ["Demo mode", "Seeded workspace preview without live auth"],
            ["Live mode", "Supabase-backed session and workspace context"],
          ].map(([title, description]) => (
            <div key={title} className="rounded-2xl border border-white/8 bg-white/4 p-4">
              <p className="text-sm text-[#f5f2ea]">{title}</p>
              <p className="mt-2 text-sm leading-7 text-[#a0abc1]">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
