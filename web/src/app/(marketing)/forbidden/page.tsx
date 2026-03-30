import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <section className="page-shell px-4 py-10 sm:px-6 lg:px-8">
      <div className="section-shell mx-auto max-w-3xl px-6 py-10 text-center sm:px-10">
        <p className="eyebrow">403 / Access restricted</p>
        <h1 className="hero-type mt-4 text-5xl text-[color:var(--text-primary)] sm:text-6xl">
          You do not have permission to open this surface.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[color:var(--text-secondary)] sm:text-base">
          Some Anchoryn areas are role-gated for owners and admins. Switch organizations, request a
          higher role, or head back to a page your current membership can access.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/app/dashboard" className="pill-link pill-link-accent text-sm">
            Back to dashboard
          </Link>
          <Link href="/contact" className="pill-link text-sm">
            Contact support
          </Link>
        </div>
      </div>
    </section>
  );
}
