import Link from "next/link";

export default function MaintenancePage() {
  return (
    <section className="page-shell px-4 py-10 sm:px-6 lg:px-8">
      <div className="section-shell mx-auto max-w-3xl px-6 py-10 text-center sm:px-10">
        <p className="eyebrow">Maintenance window</p>
        <h1 className="hero-type mt-4 text-5xl text-[color:var(--text-primary)] sm:text-6xl">
          Anchoryn is receiving a platform update.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[color:var(--text-secondary)] sm:text-base">
          We are rolling out infrastructure or model changes and will reopen access shortly. Your
          data remains intact, and the latest status will always be shared by the support team.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="pill-link pill-link-accent text-sm">
            Return home
          </Link>
          <Link href="/contact" className="pill-link text-sm">
            Contact support
          </Link>
        </div>
      </div>
    </section>
  );
}
