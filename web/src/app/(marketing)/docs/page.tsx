import { MarketingPage } from "@/components/marketing-page";
import { docsCards } from "@/lib/mock-data";

export default function DocsPage() {
  return (
    <MarketingPage
      eyebrow="Docs"
      title="Documentation for a product that is meant to be used, not just viewed."
      description="The product docs explain setup, routes, and operational flows while the FastAPI docs live on `/api/docs` to avoid colliding with this marketing surface."
      primaryCta={{ label: "Open the demo", href: "/demo" }}
      secondaryCta={{ label: "Sign in", href: "/signin" }}
      stats={[
        { label: "Public docs", value: "1", note: "this site" },
        { label: "API docs", value: "/api/docs", note: "backend OpenAPI" },
        { label: "Routes", value: "15+", note: "public + protected surfaces" },
      ]}
      features={docsCards}
      visual={
        <div className="space-y-3">
          <div className="rounded-3xl border border-white/8 bg-white/4 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-[#8f9ab7]">Setup</p>
            <p className="mt-2 text-sm leading-7 text-[#a0abc1]">
              Configure the API base URL, Supabase keys, and Stripe/OpenAI secrets. Then choose
              between demo mode or live auth.
            </p>
          </div>
          <div className="rounded-3xl border border-white/8 bg-white/4 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-[#8f9ab7]">Workflow</p>
            <p className="mt-2 text-sm leading-7 text-[#a0abc1]">
              Overview, accounts, campaigns, integrations, billing, and settings all live in one workspace shell.
            </p>
          </div>
        </div>
      }
    />
  );
}
