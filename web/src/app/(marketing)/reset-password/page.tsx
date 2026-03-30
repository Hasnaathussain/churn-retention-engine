import { AuthFormCard } from "@/components/auth-form-card";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="page-shell grid min-h-[calc(100vh-7rem)] place-items-center py-8">
      <div className="grid w-full gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <div className="glass-chip text-xs">Choose a new password</div>
          <h1 className="hero-type max-w-3xl text-5xl leading-[0.95] text-[color:var(--text-primary)] sm:text-6xl lg:text-7xl">
            Set a strong password and reopen the workspace.
          </h1>
          <p className="max-w-2xl text-base leading-8 text-[color:var(--text-secondary)] sm:text-lg">
            Anchoryn enforces strong passwords and expires reset tokens after a short recovery window.
          </p>
        </div>
        <AuthFormCard mode="reset" token={params.token} />
      </div>
    </main>
  );
}
