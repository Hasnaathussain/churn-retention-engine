import { SignInPanel } from "@/components/signin-panel";

export default function SignInPage() {
  return (
    <main className="page-shell grid min-h-[calc(100vh-7rem)] place-items-center py-8">
      <div className="grid w-full gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <div className="glass-chip text-xs">Secure access</div>
          <h1 className="hero-type max-w-3xl text-5xl leading-[0.95] text-[color:var(--text-primary)] sm:text-6xl lg:text-7xl">
            Sign in, or step into the demo workspace instantly.
          </h1>
          <p className="max-w-2xl text-base leading-8 text-[color:var(--text-secondary)] sm:text-lg">
            Supabase magic links unlock the protected app. If you just want to explore, the
            seeded demo session opens the same refined product flow without asking for setup first.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Light and dark themes stay consistent across marketing and app routes",
              "Demo mode previews the real workspace structure instead of a disconnected mock",
            ].map((item) => (
              <div key={item} className="metric-tile">
                <p className="text-sm leading-7 text-[color:var(--text-primary)]">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <SignInPanel />
      </div>
    </main>
  );
}
