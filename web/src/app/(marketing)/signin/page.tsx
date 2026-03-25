import { SignInPanel } from "@/components/signin-panel";

export default function SignInPage() {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-8rem)] w-full max-w-6xl place-items-center px-5 py-14 sm:px-6 lg:px-8">
      <div className="grid w-full gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <div className="glass-chip w-fit text-[0.68rem] uppercase tracking-[0.3em] text-[#f6c66f]">
            Secure access
          </div>
          <h1 className="hero-type max-w-3xl text-5xl leading-[0.95] text-[#f5f2ea] sm:text-6xl lg:text-7xl">
            Sign in, or step into the demo workspace instantly.
          </h1>
          <p className="max-w-2xl text-base leading-8 text-[#a0abc1] sm:text-lg">
            Supabase magic links unlock the protected app. If you just want to explore, the
            seeded demo session will open the workspace immediately.
          </p>
        </div>
        <SignInPanel />
      </div>
    </main>
  );
}
