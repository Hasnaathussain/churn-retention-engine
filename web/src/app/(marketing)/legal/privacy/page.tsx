export default function PrivacyPolicyPage() {
  return (
    <main className="page-shell py-8">
      <section className="section-shell px-6 py-8 sm:px-8 lg:px-10">
        <p className="eyebrow">Privacy policy</p>
        <h1 className="panel-title mt-3 text-5xl text-[color:var(--text-primary)]">
          How Anchoryn collects, uses, and protects customer data
        </h1>
        <div className="mt-6 space-y-4 text-sm leading-7 text-[color:var(--text-secondary)]">
          <p>
            Anchoryn processes account, billing, product usage, support, and organization metadata
            to generate churn predictions, alerts, reports, and retention recommendations.
          </p>
          <p>
            We collect organization profile information, user account information, session and
            security activity, uploaded customer records, connected integration data, and billing
            events needed to operate the service.
          </p>
          <p>
            We do not sell personal data. We use service providers for payments, email delivery,
            infrastructure, monitoring, and AI processing, and we require them to protect data in
            transit and at rest.
          </p>
          <p>
            Organizations can request data export or deletion, manage retention preferences, and
            revoke integrations or API keys from within the product settings and support channels.
          </p>
        </div>
      </section>
    </main>
  );
}
