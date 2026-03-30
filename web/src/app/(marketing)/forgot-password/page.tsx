import { AuthFormCard } from "@/components/auth-form-card";

export default function ForgotPasswordPage() {
  return (
    <main className="page-shell grid min-h-[calc(100vh-7rem)] place-items-center py-8">
      <div className="grid w-full gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <div className="glass-chip text-xs">Password recovery</div>
          <h1 className="hero-type max-w-3xl text-5xl leading-[0.95] text-[color:var(--text-primary)] sm:text-6xl lg:text-7xl">
            Request a secure reset link and keep your organization protected.
          </h1>
          <p className="max-w-2xl text-base leading-8 text-[color:var(--text-secondary)] sm:text-lg">
            Reset links are time-limited, single-use, and paired with audit logging in the backend.
          </p>
        </div>
        <AuthFormCard mode="forgot" />
      </div>
    </main>
  );
}
