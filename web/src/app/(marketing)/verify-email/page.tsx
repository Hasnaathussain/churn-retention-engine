import { AuthFormCard } from "@/components/auth-form-card";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="page-shell grid min-h-[calc(100vh-7rem)] place-items-center py-8">
      <div className="grid w-full gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <div className="glass-chip text-xs">Email verification</div>
          <h1 className="hero-type max-w-3xl text-5xl leading-[0.95] text-[color:var(--text-primary)] sm:text-6xl lg:text-7xl">
            Confirm the email before the organization goes live.
          </h1>
          <p className="max-w-2xl text-base leading-8 text-[color:var(--text-secondary)] sm:text-lg">
            Verification gates access to the authenticated app and lets the team resend the token
            safely if it expires.
          </p>
        </div>
        <AuthFormCard mode="verify" nextPath="/onboarding" token={params.email} />
      </div>
    </main>
  );
}
