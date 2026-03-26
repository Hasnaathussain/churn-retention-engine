import { createWorkspaceApi } from "@/lib/api";
import { requireWorkspaceSession } from "@/lib/auth";

export default async function IntegrationsPage() {
  const session = await requireWorkspaceSession("/signin?next=/app/integrations");
  const api = createWorkspaceApi(session);
  const integrations = await api.getIntegrations();

  return (
    <main className="space-y-6">
      <section className="section-shell px-6 py-6 sm:px-8">
        <p className="eyebrow">Integrations</p>
        <h1 className="panel-title mt-3 text-4xl text-[color:var(--text-primary)]">
          Keep every provider visible, healthy, and trusted
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--text-secondary)]">
          This view is no longer a shallow status wrapper. It is where the team can confirm whether
          the underlying billing, usage, AI, and support signals are safe to rely on.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {integrations.map((integration) => (
          <article key={integration.provider} className="surface-card p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="panel-title text-3xl text-[color:var(--text-primary)]">
                  {integration.displayName}
                </p>
                <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">
                  {integration.description}
                </p>
              </div>
              <span
                className="rounded-full px-3 py-1 text-xs"
                style={
                  integration.connected && integration.healthy
                    ? {
                        color: "var(--success)",
                        background: "color-mix(in srgb, var(--success) 12%, transparent)",
                      }
                    : {
                        color: "var(--danger)",
                        background: "color-mix(in srgb, var(--danger) 12%, transparent)",
                      }
                }
              >
                {integration.connected && integration.healthy ? "Healthy" : "Needs attention"}
              </span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                ["Mode", integration.mode],
                ["Credential", integration.credentialState],
                ["Last sync", integration.lastSync],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-[1.2rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] p-4"
                >
                  <p className="metric-label">{label}</p>
                  <p className="mt-2 text-sm text-[color:var(--text-primary)]">{value}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
