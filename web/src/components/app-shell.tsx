"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Search,
  ShieldCheck,
  Users,
  Workflow,
  FileText,
  BrainCircuit,
  Building2,
  CreditCard,
  MonitorCheck,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { buildPlatformApiUrl, config } from "@/lib/config";
import type { WorkspaceSession } from "@/lib/types";
import { demoTimeline } from "@/lib/mock-data";
import { BrandLogo } from "@/components/brand-logo";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  {
    href: "/app/dashboard",
    label: "Dashboard",
    description: "Revenue, risk, and AI activity",
    icon: LayoutDashboard,
  },
  {
    href: "/app/customers",
    label: "Customers",
    description: "Account list, segments, and detail views",
    icon: Building2,
  },
  {
    href: "/app/analysis",
    label: "Analysis",
    description: "Manual runs, cohorts, and explanations",
    icon: BrainCircuit,
  },
  {
    href: "/app/playbooks",
    label: "Playbooks",
    description: "Automations, campaigns, and interventions",
    icon: Workflow,
  },
  {
    href: "/app/reports",
    label: "Reports",
    description: "Scheduled exports and executive summaries",
    icon: FileText,
  },
  {
    href: "/app/integrations",
    label: "Integrations",
    description: "Provider health, API keys, and webhooks",
    icon: ShieldCheck,
  },
  {
    href: "/app/team",
    label: "Team",
    description: "Members, invitations, and roles",
    icon: Users,
  },
];

const utilityLinks = [
  {
    href: "/app/account",
    label: "Account settings",
    note: "Profile, password, and preferences",
  },
  {
    href: "/app/billing",
    label: "Billing",
    note: "Plans, invoices, and usage",
  },
  {
    href: "/app/sessions",
    label: "Sessions",
    note: "Device activity and revocation",
  },
];

const pageIntros: Record<string, { eyebrow: string; title: string; summary: string }> = {
  "/app/dashboard": {
    eyebrow: "Retention command",
    title: "Dashboard",
    summary: "Track churn pressure, revenue exposure, and the actions the team should take next.",
  },
  "/app/customers": {
    eyebrow: "Customer intelligence",
    title: "Customers",
    summary: "Sort the queue by risk, segment, revenue, or recent activity without losing detail.",
  },
  "/app/analysis": {
    eyebrow: "Prediction engine",
    title: "AI analysis",
    summary: "Run manual predictions, inspect explanation quality, and compare cohorts over time.",
  },
  "/app/playbooks": {
    eyebrow: "Automation studio",
    title: "Playbooks",
    summary: "Draft campaigns, manage repeatable interventions, and watch conversion performance.",
  },
  "/app/reports": {
    eyebrow: "Executive reporting",
    title: "Reports",
    summary: "Package churn summaries, cohort heatmaps, and revenue-impact views for stakeholders.",
  },
  "/app/integrations": {
    eyebrow: "System signal health",
    title: "Integrations",
    summary: "Keep providers, webhooks, API keys, and sync confidence visible across the workspace.",
  },
  "/app/team": {
    eyebrow: "Organization access",
    title: "Team",
    summary: "Invite members, adjust roles, and manage the human side of the workspace safely.",
  },
  "/app/account": {
    eyebrow: "Personal settings",
    title: "Account",
    summary: "Manage profile details, alert preferences, and password/security choices.",
  },
  "/app/billing": {
    eyebrow: "Subscription control",
    title: "Billing",
    summary: "Review plan usage, invoices, cards on file, and upgrade options before limits bite.",
  },
  "/app/admin": {
    eyebrow: "Internal control",
    title: "Admin",
    summary: "Monitor global usage, feature flags, system health, and operator announcements.",
  },
  "/app/sessions": {
    eyebrow: "Session security",
    title: "Sessions",
    summary: "Inspect active devices and revoke access when something looks unfamiliar.",
  },
};

function matchPage(pathname: string) {
  if (pathname.startsWith("/app/customers/")) {
    return {
      eyebrow: "Customer 360",
      title: "Customer detail",
      summary: "Read the risk explanation, timeline, playbook history, and recommended outreach in one view.",
    };
  }

  return pageIntros[pathname] ?? pageIntros["/app/dashboard"];
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
      if (session.mode === "live" && config.apiBaseUrl) {
        await fetch(buildPlatformApiUrl("/auth/logout"), {
          method: "POST",
          credentials: "include",
        });
      }
    } catch {
      // Fall back to client-side cookie clearing route.
    } finally {
      window.location.href = "/auth/logout?next=/login";
    }
  }

  const intro = useMemo(() => matchPage(pathname), [pathname]);
  const showAdmin = session.role === "owner" || session.role === "admin";

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-4 sm:px-6 lg:px-8">
      <div className="floating-glow left-[-9rem] top-[3rem] -z-10 h-72 w-72 bg-[color:var(--accent-soft)]" />
      <div className="floating-glow right-[-8rem] top-[10rem] -z-10 h-80 w-80 bg-[color:var(--accent-blue-soft)]" />
      <div className="absolute inset-0 -z-10 soft-grid opacity-40" />

      <div className="mx-auto grid min-h-screen max-w-[1600px] gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="glass-panel-strong flex flex-col gap-5 rounded-[2rem] p-5 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
          <div className="rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-4">
            <BrandLogo href="/app/dashboard" />
          </div>

          <div className="rounded-[1.6rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4">
            <p className="metric-label">Active organization</p>
            <button
              type="button"
              className="mt-3 flex w-full items-center justify-between rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 text-left"
            >
              <div>
                <p className="text-sm font-medium text-[color:var(--text-primary)]">
                  {session.organizationName}
                </p>
                <p className="mt-1 text-xs text-[color:var(--text-secondary)]">
                  {session.plan} / {session.role} / {session.mode}
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
            <p className="metric-label">Workspace utilities</p>
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
              {showAdmin ? (
                <Link
                  href="/app/admin"
                  className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-3 transition hover:border-[color:var(--accent-soft-border)]"
                >
                  <p className="flex items-center gap-2 text-sm text-[color:var(--text-primary)]">
                    <MonitorCheck className="h-4 w-4" />
                    Admin console
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[color:var(--text-secondary)]">
                    Flags, health, and org-wide operations
                  </p>
                </Link>
              ) : null}
            </div>
          </div>

          <div className="mt-auto grid gap-3">
            <Link href="/demo" className="pill-link pill-link-accent text-sm">
              View launch preview
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
                  {session.mode === "demo" ? `${intro.eyebrow} / preview` : intro.eyebrow}
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
                <Link href="/app/billing" className="pill-link text-sm">
                  <CreditCard className="h-4 w-4" />
                  Plan
                </Link>
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
                  {signingOut ? "Signing out..." : session.mode === "demo" ? "Exit preview" : "Sign out"}
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
                    Jump across retention surfaces
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
                    Recent risk signals
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
