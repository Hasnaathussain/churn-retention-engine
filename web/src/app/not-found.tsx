import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";

export default function NotFound() {
  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="page-shell flex min-h-[85vh] items-center">
        <section className="section-shell mx-auto max-w-3xl px-6 py-10 text-center sm:px-10">
          <div className="flex justify-center">
            <BrandLogo />
          </div>
          <p className="eyebrow mt-8">404 / Page not found</p>
          <h1 className="hero-type mt-4 text-5xl text-[color:var(--text-primary)] sm:text-6xl">
            This page drifted outside the retention map.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[color:var(--text-secondary)] sm:text-base">
            The destination may have moved during the Anchoryn platform cutover. Head back to the
            main site, open the live product preview, or jump into the dashboard if you are already signed in.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/" className="pill-link pill-link-accent text-sm">
              Return home
            </Link>
            <Link href="/demo" className="pill-link text-sm">
              Open product demo
            </Link>
            <Link href="/app/dashboard" className="pill-link text-sm">
              Go to dashboard
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
