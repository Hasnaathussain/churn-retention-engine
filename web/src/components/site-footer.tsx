import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

const footerLinks = [
  { href: "/product", label: "Product" },
  { href: "/pricing", label: "Pricing" },
  { href: "/demo", label: "Demo" },
  { href: "/docs/api", label: "API Docs" },
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/terms", label: "Terms of Service" },
  { href: "/legal/cookies", label: "Cookie Policy" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="px-4 pb-6 pt-10 sm:px-6 lg:px-8">
      <div className="page-shell">
        <div className="section-shell grid gap-8 px-6 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div className="space-y-4">
            <BrandLogo />
            <p className="hero-type max-w-2xl text-4xl leading-[0.95] text-[color:var(--text-primary)]">
              Keep the revenue base anchored before churn becomes visible on the board deck.
            </p>
            <p className="max-w-2xl text-sm leading-7 text-[color:var(--text-secondary)]">
              Anchoryn combines product usage, support pressure, billing health, and AI-guided
              playbooks into one retention operating system for SaaS teams.
            </p>
            <form className="flex flex-col gap-3 sm:flex-row" action="#">
              <input
                type="email"
                aria-label="Newsletter email"
                placeholder="Get launch notes and retention tactics"
                className="focus-ring rounded-full border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3 text-sm text-[color:var(--text-primary)] outline-none placeholder:text-[color:var(--text-soft)]"
              />
              <button type="submit" className="pill-link pill-link-accent text-sm">
                Subscribe
              </button>
            </form>
          </div>

          <div className="grid gap-3 text-sm sm:grid-cols-2">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="pill-link">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
