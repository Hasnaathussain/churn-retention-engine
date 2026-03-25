import Link from "next/link";
import { contactChannels } from "@/lib/mock-data";

export default function ContactPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-5 pb-20 pt-14 sm:px-6 lg:px-8">
      <section className="space-y-6">
        <div className="glass-chip w-fit text-[0.68rem] uppercase tracking-[0.3em] text-[#f6c66f]">
          Contact
        </div>
        <h1 className="hero-type max-w-4xl text-5xl leading-[0.95] text-[#f5f2ea] sm:text-6xl lg:text-7xl">
          Talk to the team behind the retention workspace.
        </h1>
        <p className="max-w-2xl text-base leading-8 text-[#a0abc1] sm:text-lg">
          Whether you want a demo, help with setup, or a roadmap conversation, we keep the
          contact experience simple and direct.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/demo"
            className="inline-flex items-center justify-center rounded-full bg-[#f6c66f] px-5 py-3 text-sm font-medium text-[#08101f] transition hover:-translate-y-0.5 hover:bg-[#f2b94e]"
          >
            Open demo
          </Link>
          <Link
            href="/signin"
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/4 px-5 py-3 text-sm text-[#f5f2ea] transition hover:border-white/20 hover:bg-white/8"
          >
            Sign in
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {contactChannels.map((channel) => (
          <article key={channel.title} className="surface-card p-6">
            <p className="panel-title text-2xl text-[#f5f2ea]">{channel.title}</p>
            <p className="mt-3 text-sm text-[#f6c66f]">{channel.detail}</p>
            <p className="mt-3 text-sm leading-7 text-[#a0abc1]">{channel.description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
