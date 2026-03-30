export default function CookiePolicyPage() {
  return (
    <main className="page-shell py-8">
      <section className="section-shell px-6 py-8 sm:px-8 lg:px-10">
        <p className="eyebrow">Cookie policy</p>
        <h1 className="panel-title mt-3 text-5xl text-[color:var(--text-primary)]">
          Cookies and local storage used by Anchoryn
        </h1>
        <div className="mt-6 space-y-4 text-sm leading-7 text-[color:var(--text-secondary)]">
          <p>
            Anchoryn uses essential cookies for authentication, refresh sessions, security, and
            product preference persistence, including theme preference and onboarding state.
          </p>
          <p>
            We may also use analytics and monitoring cookies to understand performance, diagnose
            errors, and improve the user experience. Organizations can manage optional tracking in
            their settings where applicable.
          </p>
          <p>
            Users who disable cookies may lose access to secure sessions, API docs previews, and
            portions of the authenticated application.
          </p>
        </div>
      </section>
    </main>
  );
}
