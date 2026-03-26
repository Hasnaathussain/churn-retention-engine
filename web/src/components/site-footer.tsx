import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="px-4 pb-6 pt-10 sm:px-6 lg:px-8">
      <div className="page-shell">
        <div className="section-shell grid gap-8 px-6 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div className="space-y-4">
            <p className="eyebrow">Synapse platform</p>
            <p className="hero-type max-w-2xl text-4xl leading-[0.95] text-[color:var(--text-primary)]">
              Revenue survives when the signal becomes a workflow.
            </p>
            <p className="max-w-2xl text-sm leading-7 text-[color:var(--text-secondary)]">
              Synapse turns billing, product usage, and support pressure into a polished
              retention workspace for founders, success teams, and operators.
            </p>
          </div>

          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <Link href="/product" className="pill-link">
              Product
            </Link>
            <Link href="/pricing" className="pill-link">
              Pricing
            </Link>
            <Link href="/product#solutions" className="pill-link">
              Solutions
            </Link>
            <Link href="/product#setup" className="pill-link">
              Setup
            </Link>
            <Link href="/demo" className="pill-link">
              Demo
            </Link>
            <Link href="/contact" className="pill-link">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
