"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/product", label: "Product" },
  { href: "/pricing", label: "Pricing" },
  { href: "/demo", label: "Demo" },
  { href: "/docs/api", label: "API Docs" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="page-shell">
        <div className="glass-panel-strong flex items-center justify-between gap-4 rounded-[1.65rem] px-4 py-4 sm:px-5">
          <BrandLogo />

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
            <Link href="/login" className="pill-link text-sm">
              Log in
            </Link>
            <Link href="/signup" className="pill-link pill-link-accent text-sm">
              Start free trial
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
                Commercial site, docs, and product access
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
                href="/login"
                onClick={() => setOpen(false)}
                className="pill-link text-sm"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="pill-link pill-link-accent text-sm"
              >
                Start free trial
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
