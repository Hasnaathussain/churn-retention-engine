export default function TermsPage() {
  return (
    <main className="page-shell py-8">
      <section className="section-shell px-6 py-8 sm:px-8 lg:px-10">
        <p className="eyebrow">Terms of service</p>
        <h1 className="panel-title mt-3 text-5xl text-[color:var(--text-primary)]">
          Commercial terms for using Anchoryn
        </h1>
        <div className="mt-6 space-y-4 text-sm leading-7 text-[color:var(--text-secondary)]">
          <p>
            By creating an Anchoryn account, the customer organization agrees to use the service in
            compliance with applicable laws and may only upload or connect data it is authorized to
            process.
          </p>
          <p>
            Subscriptions renew automatically according to the selected billing cycle unless
            cancelled through the billing portal or according to a signed enterprise order form.
          </p>
          <p>
            Availability targets, support channels, usage limits, and custom commitments depend on
            the active plan tier. Enterprise-specific terms are governed by separate commercial
            agreements where applicable.
          </p>
          <p>
            Anchoryn may suspend access for fraud, abuse, non-payment, or material security risk and
            will make reasonable efforts to provide notice when appropriate.
          </p>
        </div>
      </section>
    </main>
  );
}
