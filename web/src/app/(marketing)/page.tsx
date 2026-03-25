import { MarketingPage } from "@/components/marketing-page";
import { WorkspacePreview } from "@/components/workspace-preview";
import { buildDemoSummary, demoAccounts, marketingStats, valuePillars } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <MarketingPage
      eyebrow="Flagship AI retention platform"
      title="Turn churn signals into a cinematic, revenue-saving workspace."
      description="Synapse connects billing, product, and support data into a premium AI control plane for founders and customer success teams. See what is at risk, understand why it is happening, and launch the right intervention without leaving the workspace."
      primaryCta={{ label: "Open the demo workspace", href: "/demo" }}
      secondaryCta={{ label: "View pricing", href: "/pricing" }}
      stats={marketingStats}
      features={valuePillars}
      visual={<WorkspacePreview summary={buildDemoSummary()} accounts={demoAccounts} />}
      quote="When the signal is clear, the intervention should feel inevitable."
      tone="Built for teams that want premium visuals, real operational depth, and a product that feels fully alive."
    />
  );
}
