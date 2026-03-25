import { createWorkspaceApi } from "@/lib/api";
import { requireWorkspaceSession } from "@/lib/auth";
import { cn } from "@/lib/cn";

export default async function IntegrationsPage() {
  const session = await requireWorkspaceSession("/signin?next=/app/integrations");
  const api = createWorkspaceApi(session);
  const integrations = await api.getIntegrations();

  return (
    <main className="space-y-6">
      <section className="surface-card p-6">
        <p className="text-xs uppercase tracking-[0.24em] text-[#8f9ab7]">Integrations</p>
        <h1 className="panel-title mt-2 text-3xl text-[#f5f2ea]">Keep every source in view</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-[#a0abc1]">
          Connection state, sync timing, and credential health stay visible so the workspace can
          safely rely on live Stripe, Mixpanel, OpenAI, and support data.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {integrations.map((integration) => (
          <article key={integration.provider} className="surface-card p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="panel-title text-2xl text-[#f5f2ea]">{integration.displayName}</p>
                <p className="mt-2 text-sm leading-7 text-[#a0abc1]">{integration.description}</p>
              </div>
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-xs",
                  integration.connected && integration.healthy
                    ? "bg-[#8dd6a3]/15 text-[#8dd6a3]"
                    : "bg-[#f28b82]/15 text-[#f28b82]"
                )}
              >
                {integration.connected && integration.healthy ? "Healthy" : "Needs attention"}
              </span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                ["Mode", integration.mode],
                ["Credential", integration.credentialState],
                ["Last sync", integration.lastSync],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-white/8 bg-white/4 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-[#8f9ab7]">{label}</p>
                  <p className="mt-2 text-sm text-[#f5f2ea]">{value}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
