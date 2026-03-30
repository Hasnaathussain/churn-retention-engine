const endpointGroups = [
  {
    title: "Authentication",
    items: [
      "POST /api/v1/auth/signup",
      "POST /api/v1/auth/login",
      "POST /api/v1/auth/logout",
      "POST /api/v1/auth/refresh",
      "GET /api/v1/auth/sessions",
    ],
  },
  {
    title: "Customers",
    items: [
      "POST /api/v1/customers",
      "GET /api/v1/customers",
      "GET /api/v1/customers/:id",
      "PATCH /api/v1/customers/:id",
      "DELETE /api/v1/customers/:id",
    ],
  },
  {
    title: "Events and predictions",
    items: [
      "POST /api/v1/customers/:id/events",
      "GET /api/v1/customers/:id/events",
      "GET /api/v1/customers/:id/prediction",
      "POST /api/v1/customers/:id/predict",
    ],
  },
  {
    title: "Reports and webhooks",
    items: [
      "GET /api/v1/reports/churn-summary",
      "GET /api/v1/reports/at-risk",
      "GET /api/v1/reports/revenue-impact",
      "POST /api/v1/webhooks",
      "GET /api/v1/webhooks",
      "DELETE /api/v1/webhooks/:id",
    ],
  },
];

export default function ApiDocsPage() {
  return (
    <main className="page-shell space-y-6 py-8">
      <section className="section-shell px-6 py-8 sm:px-8 lg:px-10">
        <p className="eyebrow">API playground</p>
        <h1 className="panel-title mt-3 text-5xl text-[color:var(--text-primary)]">
          Public API for Scale plans and integration partners
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[color:var(--text-secondary)]">
          Anchoryn exposes a versioned REST API with bearer-token auth, response envelopes, rate
          limiting, and OpenAPI docs. This page is the human-friendly overview of the same surface.
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {endpointGroups.map((group) => (
          <article key={group.title} className="surface-card p-5 sm:p-6">
            <p className="metric-label">{group.title}</p>
            <div className="mt-4 space-y-3">
              {group.items.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.25rem] border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3 mono-type text-sm text-[color:var(--text-primary)]"
                >
                  {item}
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
