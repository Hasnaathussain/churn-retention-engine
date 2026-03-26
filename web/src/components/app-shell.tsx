"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Building2,
  ChevronDown,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Megaphone,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { cn } from "@/lib/cn";
import type { WorkspaceSession } from "@/lib/types";
import { demoTimeline } from "@/lib/mock-data";
import { config } from "@/lib/config";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  {
    href: "/app/overview",
    label: "Overview",
    description: "Revenue, risk, and recent signals",
    icon: LayoutDashboard,
  },
  {
    href: "/app/accounts",
    label: "Accounts",
    description: "Priority queues and account detail",
    icon: Building2,
  },
  {
    href: "/app/campaigns",
    label: "Campaigns",
    description: "Drafts, playbooks, and deployments",
    icon: Megaphone,
  },
  {
    href: "/app/integrations",
    label: "Integrations",
    description: "Provider health and sync state",
    icon: ShieldCheck,
  },
  {
    href: "/app/settings",
    label: "Settings",
    description: "Workspace, billing, and preferences",
    icon: Settings2,
  },
];

const utilityLinks = [
  {
    href: "/app/campaigns?tab=playbooks",
    label: "Playbooks",
    note: "Open automation playbooks",
  },
  {
    href: "/app/settings?tab=billing",
    label: "Billing",
    note: "Manage plan and portal access",
  },
  {
    href: "/contact",
    label: "Support",
    note: "Reach the team",
  },
];

const pageIntros: Record<string, { eyebrow: string; title: string; summary: string }> = {
  "/app/overview": {
    eyebrow: "Command center",
    title: "Overview",
    summary: "See revenue movement, at-risk accounts, and the operational pulse in one place.",
  },
  "/app/accounts": {
    eyebrow: "Execution queue",
    title: "Accounts",
    summary: "Filter the list, preview risk context, and jump into the right customer without friction.",
  },
  "/app/campaigns": {
    eyebrow: "Action studio",
    title: "Campaigns",
    summary: "Generate retention moves, refine playbooks, and deploy outreach from a single surface.",
  },
  "/app/integrations": {
    eyebrow: "Signal health",
    title: "Integrations",
    summary: "Keep connectors, credentials, and sync confidence visible for the whole workspace.",
  },
  "/app/settings": {
    eyebrow: "Workspace control",
    title: "Settings",
    summary: "Manage workspace identity, billing, members, and notification preferences cleanly.",
  },
};

function matchPage(pathname: string) {
  if (pathname.startsWith("/app/accounts/")) {
    return {
      eyebrow: "Account 360",
      title: "Account detail",
      summary: "Read the drivers, timeline, and recommended move before you act.",
    };
  }

  return pageIntros[pathname] ?? pageIntros["/app/overview"];
}

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

  const intro = useMemo(() => matchPage(pathname), [pathname]);

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-4 sm:px-6 lg:px-8">
      <div className="floating-glow left-[-9rem] top-[3rem] -z-10 h-72 w-72 bg-[color:var(--accent-soft)]" />
      <div className="floating-glow right-[-8rem] top-[10rem] -z-10 h-80 w-80 bg-[color:var(--accent-blue-soft)]" />
      <div className="absolute inset-0 -z-10 soft-grid opacity-40" />

      <div className="mx-auto grid min-h-screen max-w-[1600px] gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="glass-panel-strong flex flex-col gap-5 rounded-[2rem] p-5 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
          <Link
            href="/app/overview"
            className="flex items-center gap-3 rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-4"
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl border border-[color:var(--accent-soft-border)] bg-[color:var(--accent-soft)] text-[color:var(--accent-strong)]">
              <Sparkles className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="hero-type truncate text-2xl text-[color:var(--text-primary)]">
                Synapse
              </p>
              <p className="truncate text-[0.7rem] uppercase tracking-[0.24em] text-[color:var(--text-soft)]">
                Retention operating layer
              </p>
            </div>
          </Link>

          <div className="rounded-[1.6rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4">
            <p className="metric-label">Active workspace</p>
            <button
              type="button"
              className="mt-3 flex w-full items-center justify-between rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-left"
            >
              <div>
                <p className="text-sm font-medium text-[color:var(--text-primary)]">
                  {session.workspaceName}
                </p>
                <p className="mt-1 text-xs text-[color:var(--text-secondary)]">
                  {session.mode === "demo" ? "Seeded workspace preview" : "Live authenticated workspace"}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-[color:var(--text-soft)]" />
            </button>
          </div>

          <nav className="grid gap-2">
            {navItems.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-[1.35rem] border px-4 py-3 transition",
                    active
                      ? "border-[color:var(--accent-soft-border)] bg-[color:var(--accent-soft)] text-[color:var(--text-primary)] shadow-[var(--shadow-soft)]"
                      : "border-[color:var(--border)] bg-[color:var(--surface-soft)] text-[color:var(--text-secondary)] hover:border-[color:var(--accent-soft-border)] hover:bg-[color:var(--surface)] hover:text-[color:var(--text-primary)]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <p className="mt-2 text-xs leading-6 text-[color:var(--text-soft)]">
                    {item.description}
                  </p>
                </Link>
              );
            })}
          </nav>

          <div className="rounded-[1.6rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4">
            <p className="metric-label">Quick links</p>
            <div className="mt-3 grid gap-2">
              {utilityLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 transition hover:border-[color:var(--accent-soft-border)]"
                >
                  <p className="text-sm text-[color:var(--text-primary)]">{link.label}</p>
                  <p className="mt-1 text-xs leading-5 text-[color:var(--text-secondary)]">
                    {link.note}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-auto grid gap-3">
            <Link href="/demo" className="pill-link pill-link-accent text-sm">
              Reopen demo
            </Link>
            <Link href="/contact" className="pill-link text-sm">
              <LifeBuoy className="h-4 w-4" />
              Contact support
            </Link>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col gap-5">
          <header className="glass-panel-strong sticky top-4 z-20 rounded-[2rem] px-5 py-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-3xl">
                <p className="eyebrow">
                  {session.mode === "demo" ? `${intro.eyebrow} / demo` : intro.eyebrow}
                </p>
                <h1 className="panel-title mt-2 text-4xl text-[color:var(--text-primary)]">
                  {intro.title}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--text-secondary)]">
                  {intro.summary}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <ThemeToggle />
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="pill-link text-sm"
                >
                  <Search className="h-4 w-4" />
                  Search
                  <span className="rounded-full border border-[color:var(--border)] px-2 py-0.5 text-[0.64rem] uppercase tracking-[0.18em] text-[color:var(--text-soft)]">
                    Ctrl K
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(true)}
                  className="relative inline-flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface-soft)] text-[color:var(--text-primary)] shadow-[var(--shadow-soft)] transition hover:bg-[color:var(--surface)]"
                  aria-label="Open notifications"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[color:var(--accent)]" />
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="pill-link text-sm disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <LogOut className="h-4 w-4" />
                  {signingOut ? "Signing out..." : session.mode === "demo" ? "Exit demo" : "Sign out"}
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
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/20 px-4 py-16 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: 16, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 16, scale: 0.98 }}
              onClick={(event) => event.stopPropagation()}
              className="glass-panel-strong w-full max-w-3xl overflow-hidden rounded-[2rem]"
            >
              <div className="flex items-center justify-between border-b border-[color:var(--border)] px-5 py-4">
                <div>
                  <p className="metric-label">Quick search</p>
                  <h2 className="panel-title mt-2 text-2xl text-[color:var(--text-primary)]">
                    Jump to the next retention move
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface-soft)]"
                >
                  <X className="h-4 w-4 text-[color:var(--text-primary)]" />
                </button>
              </div>
              <div className="grid gap-3 p-5 sm:grid-cols-2">
                {[...navItems, ...utilityLinks].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSearchOpen(false)}
                    className="rounded-[1.35rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-4 transition hover:border-[color:var(--accent-soft-border)] hover:bg-[color:var(--surface)]"
                  >
                    <p className="text-sm font-medium text-[color:var(--text-primary)]">
                      {item.label}
                    </p>
                    <p className="mt-2 text-xs leading-6 text-[color:var(--text-secondary)]">
                      {"description" in item ? item.description : item.note}
                    </p>
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
            className="fixed inset-0 z-50 flex justify-end bg-black/16 backdrop-blur-sm"
            onClick={() => setNotificationsOpen(false)}
          >
            <motion.aside
              initial={{ x: 30 }}
              animate={{ x: 0 }}
              exit={{ x: 30 }}
              onClick={(event) => event.stopPropagation()}
              className="glass-panel-strong flex h-full w-full max-w-md flex-col rounded-none border-l border-[color:var(--border)]"
            >
              <div className="flex items-center justify-between border-b border-[color:var(--border)] px-5 py-4">
                <div>
                  <p className="metric-label">Notifications</p>
                  <h2 className="panel-title mt-2 text-2xl text-[color:var(--text-primary)]">
                    Recent signals
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(false)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--surface-soft)]"
                >
                  <X className="h-4 w-4 text-[color:var(--text-primary)]" />
                </button>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto p-5">
                {demoTimeline.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-[1.35rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-[color:var(--text-primary)]">
                          {event.title}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[color:var(--text-soft)]">
                          {event.channel} / {event.timestamp}
                        </p>
                      </div>
                      <span className="rounded-full bg-[color:var(--accent-soft)] px-3 py-1 text-xs text-[color:var(--accent-strong)]">
                        {event.kind}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">
                      {event.description}
                    </p>
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
