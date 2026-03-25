import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/8 bg-[#050816]/80">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div className="space-y-4">
          <p className="hero-type text-3xl text-[#f5f2ea]">Revenue survives when signals become action.</p>
          <p className="max-w-2xl text-sm leading-7 text-[#a0abc1]">
            Synapse turns billing, product usage, and support pressure into a premium
            retention workspace for founders and customer success teams.
          </p>
        </div>
        <div className="grid gap-4 text-sm text-[#a0abc1] sm:grid-cols-2">
          <Link href="/product" className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 transition hover:bg-white/8">
            Product
          </Link>
          <Link href="/pricing" className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 transition hover:bg-white/8">
            Pricing
          </Link>
          <Link href="/docs" className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 transition hover:bg-white/8">
            Docs
          </Link>
          <Link href="/contact" className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 transition hover:bg-white/8">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
