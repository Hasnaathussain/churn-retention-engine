"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, SlidersHorizontal } from "lucide-react";
import type { Account } from "@/lib/types";
import { cn } from "@/lib/cn";

const filters = [
  { key: "all", label: "All accounts" },
  { key: "high_risk", label: "High risk" },
  { key: "watch", label: "Watchlist" },
  { key: "stable", label: "Healthy" },
] as const;

type FilterKey = (typeof filters)[number]["key"];

export function AccountTable({ accounts }: { accounts: Account[] }) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [selectedId, setSelectedId] = useState(accounts[0]?.id ?? "");
  const deferredQuery = useDeferredValue(query);

  const filteredAccounts = useMemo(() => {
    const normalized = deferredQuery.trim().toLowerCase();

    return accounts.filter((account) => {
      const matchesFilter = activeFilter === "all" ? true : account.status === activeFilter;
      const matchesQuery = normalized
        ? [account.name, account.owner, account.domain, account.plan]
            .join(" ")
            .toLowerCase()
            .includes(normalized)
        : true;

      return matchesFilter && matchesQuery;
    });
  }, [accounts, activeFilter, deferredQuery]);

  const resolvedSelectedId = filteredAccounts.some((account) => account.id === selectedId)
    ? selectedId
    : filteredAccounts[0]?.id ?? "";

  const selected =
    filteredAccounts.find((account) => account.id === resolvedSelectedId) ??
    filteredAccounts[0] ??
    null;

  return (
    <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <section className="surface-card p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="metric-label">Account workspace</p>
            <h2 className="panel-title mt-2 text-3xl text-[color:var(--text-primary)]">
              Sort the queue by risk, owner, or intent
            </h2>
          </div>
          <Link href="/app/campaigns" className="pill-link text-sm">
            Open campaign studio
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
          <label className="rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3 shadow-[var(--shadow-soft)]">
            <span className="flex items-center gap-3">
              <Search className="h-4 w-4 text-[color:var(--text-soft)]" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search account, owner, plan, or domain"
                className="w-full bg-transparent text-sm text-[color:var(--text-primary)] outline-none placeholder:text-[color:var(--text-soft)]"
              />
            </span>
          </label>

          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.key}
                type="button"
                onClick={() => setActiveFilter(filter.key)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition",
                  activeFilter === filter.key
                    ? "border-[color:var(--accent-soft-border)] bg-[color:var(--accent-soft)] text-[color:var(--text-primary)]"
                    : "border-[color:var(--border)] bg-[color:var(--surface-soft)] text-[color:var(--text-secondary)] hover:border-[color:var(--accent-soft-border)]"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-[1.6rem] border border-[color:var(--border)]">
          <div className="grid grid-cols-[1.3fr_0.6fr_0.75fr_0.95fr] gap-3 border-b border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3 text-xs uppercase tracking-[0.18em] text-[color:var(--text-soft)]">
            <span>Customer</span>
            <span>MRR</span>
            <span>Risk</span>
            <span>Move</span>
          </div>
          <div className="divide-y divide-[color:var(--border)]">
            {filteredAccounts.length ? (
              filteredAccounts.map((account) => (
                <button
                  key={account.id}
                  type="button"
                  onClick={() => setSelectedId(account.id)}
                  className={cn(
                    "grid w-full grid-cols-[1.3fr_0.6fr_0.75fr_0.95fr] items-center gap-3 px-4 py-4 text-left transition",
                    selected?.id === account.id
                      ? "bg-[color:var(--surface)]"
                      : "bg-[color:var(--surface-soft)] hover:bg-[color:var(--surface)]"
                  )}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[color:var(--text-primary)]">
                      {account.name}
                    </p>
                    <p className="mt-1 truncate text-xs text-[color:var(--text-secondary)]">
                      {account.plan} / {account.owner}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-[color:var(--accent-strong)]">
                    ${account.mrr.toLocaleString()}
                  </p>
                  <div className="space-y-1">
                    <div className="h-2 overflow-hidden rounded-full bg-[color:var(--surface-contrast)]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.round(account.churnProbability * 100)}%`,
                          background:
                            account.churnProbability >= 0.75
                              ? "var(--danger)"
                              : account.churnProbability >= 0.55
                                ? "var(--warning)"
                                : "var(--success)",
                        }}
                      />
                    </div>
                    <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--text-soft)]">
                      {Math.round(account.churnProbability * 100)}%
                    </p>
                  </div>
                  <p className="text-sm text-[color:var(--text-secondary)]">
                    {account.recommendedAction}
                  </p>
                </button>
              ))
            ) : (
              <div className="grid place-items-center bg-[color:var(--surface-soft)] px-4 py-12 text-center">
                <div>
                  <SlidersHorizontal className="mx-auto h-5 w-5 text-[color:var(--text-soft)]" />
                  <p className="mt-3 text-sm font-medium text-[color:var(--text-primary)]">
                    No accounts match this view
                  </p>
                  <p className="mt-2 text-sm text-[color:var(--text-secondary)]">
                    Adjust the filter or search for another customer, owner, or plan.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="surface-card p-5 sm:p-6">
        {selected ? (
          <div className="space-y-5">
            <div>
              <p className="metric-label">Focused preview</p>
              <h3 className="panel-title mt-2 text-3xl text-[color:var(--text-primary)]">
                {selected.name}
              </h3>
              <p className="mt-2 text-sm text-[color:var(--text-secondary)]">
                {selected.primaryRisk}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {selected.drivers.map((driver) => (
                <div
                  key={driver.label}
                  className="rounded-[1.2rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4"
                >
                  <p className="metric-label">{driver.label}</p>
                  <p className="mt-2 text-sm text-[color:var(--text-primary)]">{driver.value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-[1.5rem] border border-[color:var(--accent-soft-border)] bg-[color:var(--accent-soft)] p-5">
              <p className="metric-label">Recommended move</p>
              <p className="mt-2 text-lg font-semibold text-[color:var(--text-primary)]">
                {selected.recommendedAction}
              </p>
              <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">
                Last active {selected.lastActive}. Support load is {selected.supportTickets}, and the
                current health score is {selected.healthScore}.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <PreviewStat label="MRR" value={`$${selected.mrr.toLocaleString()}`} />
              <PreviewStat label="Usage" value={`${selected.usageFrequency} / wk`} />
              <PreviewStat label="Status" value={selected.status.replace("_", " ")} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href={`/app/accounts/${selected.id}`}
                className="pill-link pill-link-accent text-sm"
              >
                Open account detail
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={`/app/campaigns?account=${selected.id}`}
                className="pill-link text-sm"
              >
                Draft campaign
              </Link>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function PreviewStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.2rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4">
      <p className="metric-label">{label}</p>
      <p className="mt-2 text-sm text-[color:var(--text-primary)]">{value}</p>
    </div>
  );
}
