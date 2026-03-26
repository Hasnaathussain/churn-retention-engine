import Link from "next/link";
import { contactChannels } from "@/lib/mock-data";

export default function ContactPage() {
  return (
    <main className="page-shell space-y-8 pb-20 pt-6 sm:pt-8">
      <section className="section-shell px-6 py-8 sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <div className="glass-chip text-xs">Contact</div>
            <h1 className="hero-type max-w-4xl text-5xl leading-[0.95] text-[color:var(--text-primary)] sm:text-6xl lg:text-7xl">
              Talk to the team behind the retention workspace.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[color:var(--text-secondary)] sm:text-lg">
              Whether you want a demo, help with setup, or a roadmap conversation, the contact
              path stays direct and useful instead of becoming another shallow marketing page.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/demo" className="pill-link pill-link-accent text-sm">
                Open demo
              </Link>
              <Link href="/signin" className="pill-link text-sm">
                Sign in
              </Link>
            </div>
          </div>
          <div className="grid gap-3">
            {[
              "Demo requests and founder walkthroughs",
              "Deployment help for Vercel, backend hosting, and auth setup",
              "Product feedback, integrations, and roadmap planning",
            ].map((item) => (
              <div key={item} className="metric-tile">
                <p className="text-sm leading-7 text-[color:var(--text-primary)]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {contactChannels.map((channel) => (
          <article key={channel.title} className="surface-card p-6">
            <p className="panel-title text-3xl text-[color:var(--text-primary)]">{channel.title}</p>
            <p className="mt-3 text-sm font-medium text-[color:var(--accent-strong)]">{channel.detail}</p>
            <p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">{channel.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
