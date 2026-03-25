"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import type { Account } from "@/lib/types";
import { cn } from "@/lib/cn";

export function AccountTable({ accounts }: { accounts: Account[] }) {
  const [selected, setSelected] = useState<Account | null>(accounts[0] ?? null);

  return (
    <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
      <section className="surface-card p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#8f9ab7]">Accounts</p>
            <h2 className="panel-title mt-2 text-2xl text-[#f5f2ea]">
              Prioritized account list
            </h2>
          </div>
          <Link
            href="/app/campaigns"
            className="glass-chip text-xs text-[#f6c66f]"
          >
            Open campaign board
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/8">
          <div className="grid grid-cols-[1.25fr_0.65fr_0.7fr_0.9fr] border-b border-white/8 bg-white/4 px-4 py-3 text-xs uppercase tracking-[0.2em] text-[#8f9ab7]">
            <span>Customer</span>
            <span>MRR</span>
            <span>Risk</span>
            <span>Action</span>
          </div>
          <div className="divide-y divide-white/8">
            {accounts.map((account) => (
              <button
                key={account.id}
                type="button"
                onClick={() => setSelected(account)}
                className={cn(
                  "grid w-full grid-cols-[1.25fr_0.65fr_0.7fr_0.9fr] items-center px-4 py-4 text-left transition",
                  selected?.id === account.id
                    ? "bg-white/8"
                    : "bg-white/3 hover:bg-white/6"
                )}
              >
                <div>
                  <p className="text-sm text-[#f5f2ea]">{account.name}</p>
                  <p className="mt-1 text-xs text-[#8f9ab7]">
                    {account.plan} • {account.owner}
                  </p>
                </div>
                <p className="text-sm text-[#f6c66f]">${account.mrr.toLocaleString()}</p>
                <div className="space-y-1">
                  <div className="h-2 overflow-hidden rounded-full bg-white/8">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.round(account.churnProbability * 100)}%`,
                        background:
                          account.churnProbability >= 0.75
                            ? "linear-gradient(90deg, #f28b82, #e55f63)"
                            : account.churnProbability >= 0.55
                              ? "linear-gradient(90deg, #f6c66f, #e79f3a)"
                              : "linear-gradient(90deg, #8dd6a3, #59b87a)",
                      }}
                    />
                  </div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#8f9ab7]">
                    {Math.round(account.churnProbability * 100)}%
                  </p>
                </div>
                <p className="text-sm text-[#dfe6f6]">{account.recommendedAction}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="surface-card p-5">
        {selected ? (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="space-y-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#8f9ab7]">
                  Account detail
                </p>
                <h3 className="panel-title mt-2 text-3xl text-[#f5f2ea]">{selected.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-full border border-white/8 bg-white/4 p-2 text-[#f5f2ea]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {selected.drivers.map((driver) => (
                <div key={driver.label} className="rounded-2xl border border-white/8 bg-white/4 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-[#8f9ab7]">
                    {driver.label}
                  </p>
                  <p className="mt-2 text-sm text-[#f5f2ea]">{driver.value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-white/8 bg-[#09101f] p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-[#8f9ab7]">
                Recommended action
              </p>
              <p className="mt-2 text-lg text-[#f5f2ea]">{selected.recommendedAction}</p>
              <p className="mt-3 text-sm leading-7 text-[#a0abc1]">{selected.primaryRisk}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href={`/app/accounts/${selected.id}`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f6c66f] px-5 py-3 text-sm font-medium text-[#08101f] transition hover:-translate-y-0.5 hover:bg-[#f2b94e]"
              >
                Open detail page
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={`/app/campaigns?account=${selected.id}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/4 px-5 py-3 text-sm text-[#f5f2ea] transition hover:border-white/20 hover:bg-white/8"
              >
                Draft campaign
              </Link>
            </div>
          </motion.div>
        ) : null}
      </section>
    </div>
  );
}
