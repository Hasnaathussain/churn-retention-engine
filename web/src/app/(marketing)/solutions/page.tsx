import { MarketingPage } from "@/components/marketing-page";
import { solutionCards } from "@/lib/mock-data";

export default function SolutionsPage() {
  return (
    <MarketingPage
      eyebrow="Solutions"
      title="Built for founders, customer success, and RevOps."
      description="The product is designed to feel premium for executives while still giving operators the tooling they need to act on churn signals every day."
      primaryCta={{ label: "Try the demo", href: "/demo" }}
      secondaryCta={{ label: "See pricing", href: "/pricing" }}
      stats={[
        { label: "Founder lens", value: "Board-ready", note: "revenue at risk, saved revenue, and trend velocity" },
        { label: "CS lens", value: "Action-first", note: "account detail, playbooks, and campaign drafts" },
        { label: "RevOps lens", value: "Integrated", note: "sync health, data sources, and credential state" },
      ]}
      features={solutionCards}
      visual={
        <div className="grid gap-3">
          {[
            ["Founder", "Use the dashboard to see revenue at risk and where intervention has the highest return."],
            ["Customer success", "Prioritize the accounts that need outreach, with ready-made campaign drafts."],
            ["RevOps", "Monitor integrations, sync state, and workspace scope from a single control panel."],
          ].map(([title, description]) => (
            <div key={title} className="rounded-3xl border border-white/8 bg-white/4 p-4">
              <p className="text-lg text-[#f5f2ea]">{title}</p>
              <p className="mt-2 text-sm leading-7 text-[#a0abc1]">{description}</p>
            </div>
          ))}
        </div>
      }
    />
  );
}
