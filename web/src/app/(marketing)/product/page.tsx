import { MarketingPage } from "@/components/marketing-page";
import { valuePillars } from "@/lib/mock-data";

export default function ProductPage() {
  return (
    <MarketingPage
      eyebrow="Product architecture"
      title="A multi-surface product built around detect, diagnose, and act."
      description="The public website, seeded demo workspace, and protected app each serve a different part of the retention journey. Together they create one coherent product motion, from first impression to daily retention execution."
      primaryCta={{ label: "Open demo", href: "/demo" }}
      secondaryCta={{ label: "Sign in", href: "/signin" }}
      stats={[
        { label: "Workspace surfaces", value: "8", note: "overview, accounts, playbooks, campaigns, billing, and more" },
        { label: "Data streams", value: "4+", note: "billing, usage, support, and campaign events" },
        { label: "Launch modes", value: "Demo + live", note: "seeded now, live-ready later" },
        { label: "Roles", value: "2", note: "owner and member access" },
      ]}
      features={valuePillars}
      visual={
        <div className="grid gap-3">
          <div className="rounded-3xl border border-white/8 bg-white/4 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-[#8f9ab7]">Layer 01</p>
            <p className="mt-2 text-lg text-[#f5f2ea]">Signal layer</p>
            <p className="mt-2 text-sm leading-7 text-[#a0abc1]">
              Stripe, Mixpanel, support, and email data feed the workspace with a single rhythm.
            </p>
          </div>
          <div className="rounded-3xl border border-white/8 bg-white/4 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-[#8f9ab7]">Layer 02</p>
            <p className="mt-2 text-lg text-[#f5f2ea]">Decision layer</p>
            <p className="mt-2 text-sm leading-7 text-[#a0abc1]">
              Heuristic scoring keeps the product deterministic, explainable, and easy to replace later.
            </p>
          </div>
          <div className="rounded-3xl border border-white/8 bg-white/4 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-[#8f9ab7]">Layer 03</p>
            <p className="mt-2 text-lg text-[#f5f2ea]">Action layer</p>
            <p className="mt-2 text-sm leading-7 text-[#a0abc1]">
              AI campaigns, playbooks, and billing flows turn the score into measurable retention work.
            </p>
          </div>
        </div>
      }
      tone="Every surface is linked so users can move from overview to detail without losing context."
    />
  );
}
