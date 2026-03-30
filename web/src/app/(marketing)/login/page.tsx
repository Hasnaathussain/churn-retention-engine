import { AuthFormCard } from "@/components/auth-form-card";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  return (
    <AuthWrapper
      title="Log in and pick up the retention workflow where you left it."
      subtitle="Use email and password, or continue with Google or GitHub. Demo preview still exists, but the primary flow now reflects the production auth architecture."
    >
      <ResolvedAuthForm mode="login" searchParams={searchParams} />
    </AuthWrapper>
  );
}

async function ResolvedAuthForm({
  mode,
  searchParams,
}: {
  mode: "login";
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  return <AuthFormCard mode={mode} nextPath={params.next ?? "/app/dashboard"} />;
}

function AuthWrapper({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <main className="page-shell grid min-h-[calc(100vh-7rem)] place-items-center py-8">
      <div className="grid w-full gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <div className="glass-chip text-xs">Anchoryn access</div>
          <h1 className="hero-type max-w-3xl text-5xl leading-[0.95] text-[color:var(--text-primary)] sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="max-w-2xl text-base leading-8 text-[color:var(--text-secondary)] sm:text-lg">
            {subtitle}
          </p>
        </div>
        {children}
      </div>
    </main>
  );
}
