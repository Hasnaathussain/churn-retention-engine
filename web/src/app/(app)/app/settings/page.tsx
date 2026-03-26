import Link from "next/link";
import { BillingPanel } from "@/components/billing-panel";
import { requireWorkspaceSession } from "@/lib/auth";
import { cn } from "@/lib/cn";

const tabs = [
  { key: "workspace", label: "Workspace" },
  { key: "billing", label: "Billing" },
  { key: "members", label: "Members" },
  { key: "preferences", label: "Preferences" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await requireWorkspaceSession("/signin?next=/app/settings");
  const { tab } = await searchParams;
  const activeTab = tabs.some((item) => item.key === tab) ? (tab as TabKey) : "workspace";

  return (
    <main className="space-y-6">
      <section className="section-shell px-6 py-6 sm:px-8">
        <p className="eyebrow">Settings</p>
        <h1 className="panel-title mt-3 text-4xl text-[color:var(--text-primary)]">
          Workspace controls without separate dead-end pages
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--text-secondary)]">
          Billing, member visibility, workspace identity, and preferences now live in one place,
          which keeps the control layer simple while preserving the capability depth.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {tabs.map((item) => (
            <Link
              key={item.key}
              href={`/app/settings?tab=${item.key}`}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition",
                activeTab === item.key
                  ? "border-[color:var(--accent-soft-border)] bg-[color:var(--accent-soft)] text-[color:var(--text-primary)]"
                  : "border-[color:var(--border)] bg-[color:var(--surface-soft)] text-[color:var(--text-secondary)]"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      {activeTab === "workspace" ? (
        <section className="grid gap-4 md:grid-cols-3">
          {[
            ["Workspace", session.workspaceName],
            ["Role", session.role],
            ["Mode", session.mode],
          ].map(([label, value]) => (
            <article key={label} className="surface-card p-5">
              <p className="metric-label">{label}</p>
              <p className="hero-type mt-3 text-3xl text-[color:var(--text-primary)]">{value}</p>
            </article>
          ))}
        </section>
      ) : null}

      {activeTab === "billing" ? <BillingPanel session={session} /> : null}

      {activeTab === "members" ? (
        <section className="grid gap-4 md:grid-cols-2">
          {[
            ["Maya Chen", "Owner / workspace controls / founder@synapse.demo"],
            ["Daniel Ruiz", "Member / campaigns and accounts / daniel@synapse.demo"],
            ["Sana Shah", "Member / integrations visibility / sana@synapse.demo"],
            ["Ava Patel", "Member / success operations / ava@synapse.demo"],
          ].map(([name, description]) => (
            <article key={name} className="surface-card p-5">
              <p className="panel-title text-3xl text-[color:var(--text-primary)]">{name}</p>
              <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">{description}</p>
            </article>
          ))}
        </section>
      ) : null}

      {activeTab === "preferences" ? (
        <section className="grid gap-4 md:grid-cols-2">
          {[
            "Notification cadence for high-risk accounts",
            "Default campaign channel and approval flow",
            "Theme preference and operator density defaults",
            "Integration sync alerting and escalation routing",
          ].map((item) => (
            <div
              key={item}
              className="surface-card p-5 text-sm leading-7 text-[color:var(--text-primary)]"
            >
              {item}
            </div>
          ))}
        </section>
      ) : null}
    </main>
  );
}
