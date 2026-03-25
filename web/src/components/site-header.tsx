"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/cn";

const links = [
  { href: "/product", label: "Product" },
  { href: "/solutions", label: "Solutions" },
  { href: "/pricing", label: "Pricing" },
  { href: "/demo", label: "Demo" },
  { href: "/docs", label: "Docs" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[#060b18]/75 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5 shadow-[0_0_60px_rgba(246,198,111,0.12)]">
            <Sparkles className="h-5 w-5 text-[#f6c66f]" />
          </span>
          <span>
            <span className="hero-type block text-[1.15rem] leading-none text-[#f5f2ea]">
              Synapse
            </span>
            <span className="text-[0.68rem] uppercase tracking-[0.28em] text-[#9aa6be]">
              AI Retention Engine
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-white/8 bg-white/4 p-1 lg:flex">
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
                    ? "bg-white/10 text-[#f5f2ea]"
                    : "text-[#a0abc1] hover:bg-white/6 hover:text-[#f5f2ea]"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <Link
            href="/signin"
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-[#e9edff] transition hover:border-white/20 hover:bg-white/6"
          >
            Sign in
          </Link>
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 rounded-full bg-[#f6c66f] px-4 py-2 text-sm font-medium text-[#08101f] transition hover:-translate-y-0.5 hover:bg-[#f2b94e]"
          >
            Open demo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#f5f2ea] transition hover:bg-white/10 lg:hidden"
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/8 bg-[#060b18]/95 px-5 py-4 lg:hidden">
          <nav className="grid gap-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-[#f5f2ea]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
