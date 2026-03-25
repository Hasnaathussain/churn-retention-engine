"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Building2,
  ChevronDown,
  FolderKanban,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Megaphone,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Workflow,
  X,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/cn";
import type { WorkspaceSession } from "@/lib/types";
import { demoTimeline } from "@/lib/mock-data";
import { config } from "@/lib/config";

const navItems = [
  { href: "/app/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/app/accounts", label: "Accounts", icon: Building2 },
  { href: "/app/playbooks", label: "Playbooks", icon: Workflow },
  { href: "/app/campaigns", label: "Campaigns", icon: Megaphone },
  { href: "/app/integrations", label: "Integrations", icon: ShieldCheck },
  { href: "/app/billing", label: "Billing", icon: FolderKanban },
  { href: "/app/settings", label: "Settings", icon: SlidersHorizontal },
];

export function AppShell({
  session,
  children,
}: {
  session: WorkspaceSession;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") {
        setSearchOpen(false);
        setNotificationsOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  async function handleSignOut() {
    setSigningOut(true);

    try {
      if (session.mode === "live" && config.supabaseUrl && config.supabaseAnonKey) {
        const supabase = createSupabaseBrowserClient();
        await supabase.auth.signOut();
      }
    } finally {
      window.location.href = "/signin";
    }
  }

  const title =
    navItems.find((item) => pathname.startsWith(item.href))?.label ?? "Overview";

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10 soft-grid opacity-25" />
      <div className="absolute left-[-10%] top-[-8%] -z-10 h-72 w-72 rounded-full bg-[#f6c66f]/10 blur-3xl" />
      <div className="absolute right-[-8%] top-[22%] -z-10 h-80 w-80 rounded-full bg-[#5b8fe8]/12 blur-3xl" />

      <div className="mx-auto grid min-h-screen max-w-[1600px] gap-6 px-4 py-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6">
        <aside className="surface-card flex flex-col gap-5 p-4 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
          <Link href="/app/overview" className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/4 px-4 py-4">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#f6c66f]/14 text-[#f6c66f]">
              <Sparkles className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="hero-type truncate text-xl text-[#f5f2ea]">Synapse Workspace</p>
              <p className="truncate text-xs uppercase tracking-[0.22em] text-[#8f9ab7]">
                {session.workspaceName}
              </p>
            </div>
          </Link>

          <div className="rounded-3xl border border-white/8 bg-[#08101f]/85 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-[#8f9ab7]">Active workspace</p>
            <button
              type="button"
              className="mt-3 flex w-full items-center justify-between rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-left transition hover:bg-white/8"
            >
              <div>
                <p className="text-sm text-[#f5f2ea]">{session.workspaceName}</p>
                <p className="text-xs text-[#8f9ab7]">
                  {session.mode === "demo" ? "Seeded demo workspace" : "Live authenticated workspace"}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-[#8f9ab7]" />
            </button>
          </div>

          <nav className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {navItems.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex min-w-[170px] items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition lg:min-w-0",
                    active
                      ? "border-[#f6c66f]/25 bg-[#f6c66f]/10 text-[#f5f2ea]"
                      : "border-white/8 bg-white/4 text-[#a0abc1] hover:border-white/12 hover:bg-white/6 hover:text-[#f5f2ea]"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto grid gap-3">
            <Link
              href="/demo"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f6c66f] px-4 py-3 text-sm font-medium text-[#08101f] transition hover:-translate-y-0.5 hover:bg-[#f2b94e]"
            >
              Open demo
              <Sparkles className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-3 text-sm text-[#f5f2ea] transition hover:border-white/20 hover:bg-white/8"
            >
              <LifeBuoy className="h-4 w-4" />
              Support
            </Link>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col gap-5">
          <header className="surface-card sticky top-4 z-20 flex flex-col gap-4 px-5 py-4 backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#8f9ab7]">
                  {session.mode === "demo" ? "Demo workspace" : "Protected workspace"}
                </p>
                <h1 className="panel-title mt-1 text-3xl text-[#f5f2ea]">{title}</h1>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-3 text-sm text-[#dfe6f6] transition hover:border-white/20 hover:bg-white/8"
                >
                  <Search className="h-4 w-4" />
                  <span className="hidden sm:inline">Search</span>
                  <span className="hidden rounded-full border border-white/8 px-2 py-0.5 text-[0.65rem] uppercase tracking-[0.18em] text-[#8f9ab7] md:inline">
                    Ctrl K
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(true)}
                  className="relative inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/4 text-[#dfe6f6] transition hover:border-white/20 hover:bg-white/8"
                  aria-label="Open notifications"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#f6c66f]" />
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-4 py-3 text-sm text-[#f5f2ea] transition hover:border-white/20 hover:bg-white/8 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <LogOut className="h-4 w-4" />
                  {signingOut ? "Signing out..." : session.mode === "demo" ? "Demo sign-out" : "Sign out"}
                </button>
              </div>
            </div>
          </header>

          <main className="min-w-0">{children}</main>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-[#04050c]/78 px-4 py-16 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: 14, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 14, scale: 0.98 }}
              onClick={(event) => event.stopPropagation()}
              className="surface-card w-full max-w-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[#8f9ab7]">Quick search</p>
                  <h2 className="panel-title mt-1 text-2xl text-[#f5f2ea]">Jump to a workspace surface</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="rounded-full border border-white/8 bg-white/4 p-2 text-[#f5f2ea]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-3 p-5 sm:grid-cols-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSearchOpen(false)}
                    className="rounded-2xl border border-white/8 bg-white/4 px-4 py-4 transition hover:bg-white/8"
                  >
                    <p className="text-sm text-[#f5f2ea]">{item.label}</p>
                    <p className="mt-1 text-xs text-[#8f9ab7]">{item.href}</p>
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {notificationsOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex justify-end bg-[#04050c]/72 backdrop-blur-sm"
            onClick={() => setNotificationsOpen(false)}
          >
            <motion.aside
              initial={{ x: 24 }}
              animate={{ x: 0 }}
              exit={{ x: 24 }}
              onClick={(event) => event.stopPropagation()}
              className="surface-card flex h-full w-full max-w-md flex-col rounded-none border-l border-white/8"
            >
              <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[#8f9ab7]">Notifications</p>
                  <h2 className="panel-title mt-1 text-2xl text-[#f5f2ea]">Recent signals</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(false)}
                  className="rounded-full border border-white/8 bg-white/4 p-2 text-[#f5f2ea]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto p-5">
                {demoTimeline.map((event) => (
                  <div key={event.id} className="rounded-2xl border border-white/8 bg-white/4 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm text-[#f5f2ea]">{event.title}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.22em] text-[#8f9ab7]">
                          {event.channel} • {event.timestamp}
                        </p>
                      </div>
                      <span className="rounded-full bg-[#f6c66f]/12 px-3 py-1 text-xs text-[#f6c66f]">
                        {event.kind}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-[#a0abc1]">{event.description}</p>
                  </div>
                ))}
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
