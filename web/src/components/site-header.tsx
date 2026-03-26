"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/product", label: "Product" },
  { href: "/pricing", label: "Pricing" },
  { href: "/demo", label: "Demo" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="page-shell">
        <div className="glass-panel-strong flex items-center justify-between gap-4 rounded-[1.65rem] px-4 py-4 sm:px-5">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl border border-[color:var(--accent-soft-border)] bg-[color:var(--accent-soft)] shadow-[var(--shadow-soft)]">
              <Sparkles className="h-5 w-5 text-[color:var(--accent-strong)]" />
            </span>
            <span className="min-w-0">
              <span className="hero-type block truncate text-[1.25rem] leading-none text-[color:var(--text-primary)]">
                Synapse
              </span>
              <span className="truncate text-[0.68rem] uppercase tracking-[0.28em] text-[color:var(--text-soft)]">
                Retention Atelier
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-1 lg:flex">
            {links.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm transition",
                    active
                      ? "bg-[color:var(--surface-strong)] text-[color:var(--text-primary)] shadow-[var(--shadow-soft)]"
                      : "text-[color:var(--text-secondary)] hover:bg-[color:var(--surface)] hover:text-[color:var(--text-primary)]"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 sm:flex">
            <ThemeToggle />
            <Link
              href="/signin"
              className="pill-link text-sm"
            >
              Sign in
            </Link>
            <Link
              href="/demo"
              className="pill-link pill-link-accent text-sm"
            >
              Explore demo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--border-strong)] bg-[color:var(--surface-soft)] text-[color:var(--text-primary)] transition hover:bg-[color:var(--surface)] lg:hidden"
            aria-label="Toggle navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="page-shell mt-3 lg:hidden">
          <div className="glass-panel-strong rounded-[1.65rem] px-4 py-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm text-[color:var(--text-secondary)]">
                Product surfaces and quick access
              </p>
              <ThemeToggle compact />
            </div>
            <nav className="grid gap-2">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3 text-sm text-[color:var(--text-primary)]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <Link
                href="/signin"
                onClick={() => setOpen(false)}
                className="pill-link text-sm"
              >
                Sign in
              </Link>
              <Link
                href="/demo"
                onClick={() => setOpen(false)}
                className="pill-link pill-link-accent text-sm"
              >
                Open demo
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
