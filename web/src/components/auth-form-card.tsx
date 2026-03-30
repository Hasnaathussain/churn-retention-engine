"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowRight, Github, Loader2, MailCheck } from "lucide-react";
import { authRequest } from "@/lib/client-auth";
import { buildPlatformApiUrl } from "@/lib/config";

type AuthMode = "login" | "signup" | "forgot" | "reset" | "verify";
type AuthFormValues = {
  name?: string;
  company?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  rememberMe?: boolean;
};

function passwordSchema() {
  return z
    .string()
    .min(8, "Use at least 8 characters.")
    .regex(/[A-Z]/, "Add an uppercase letter.")
    .regex(/[a-z]/, "Add a lowercase letter.")
    .regex(/[0-9]/, "Add a number.")
    .regex(/[^A-Za-z0-9]/, "Add a special character.");
}

function schemaFor(mode: AuthMode) {
  switch (mode) {
    case "signup":
      return z
        .object({
          name: z.string().min(2, "Tell us your name."),
          company: z.string().min(2, "Tell us your company."),
          email: z.string().email("Enter a valid email."),
          password: passwordSchema(),
          confirmPassword: z.string(),
        })
        .refine((values) => values.password === values.confirmPassword, {
          message: "Passwords do not match.",
          path: ["confirmPassword"],
        });
    case "login":
      return z.object({
        email: z.string().email("Enter a valid email."),
        password: z.string().min(1, "Enter your password."),
        rememberMe: z.boolean().optional(),
      });
    case "forgot":
      return z.object({
        email: z.string().email("Enter a valid email."),
      });
    case "reset":
      return z
        .object({
          password: passwordSchema(),
          confirmPassword: z.string(),
        })
        .refine((values) => values.password === values.confirmPassword, {
          message: "Passwords do not match.",
          path: ["confirmPassword"],
        });
    case "verify":
      return z.object({
        email: z.string().email("Enter a valid email."),
      });
  }
}

function titleFor(mode: AuthMode) {
  switch (mode) {
    case "login":
      return "Log in to Anchoryn";
    case "signup":
      return "Start your Anchoryn trial";
    case "forgot":
      return "Reset your password";
    case "reset":
      return "Choose a new password";
    case "verify":
      return "Verify your email";
  }
}

function buttonFor(mode: AuthMode) {
  switch (mode) {
    case "login":
      return "Log in";
    case "signup":
      return "Create account";
    case "forgot":
      return "Send reset link";
    case "reset":
      return "Update password";
    case "verify":
      return "Resend verification";
  }
}

export function AuthFormCard({
  mode,
  nextPath = "/app/dashboard",
  token,
}: {
  mode: AuthMode;
  nextPath?: string;
  token?: string;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const schema = useMemo(() => schemaFor(mode), [mode]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(schema as never) as never,
    defaultValues: {
      rememberMe: true,
    },
  });

  async function onSubmit(values: AuthFormValues) {
    setSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      if (mode === "login") {
        await authRequest("/auth/login", {
          body: values as Record<string, unknown>,
        });
        router.push(nextPath);
        router.refresh();
        return;
      }

      if (mode === "signup") {
        await authRequest("/auth/signup", {
          body: values as Record<string, unknown>,
        });
        router.push(`/verify-email?email=${encodeURIComponent((values as { email: string }).email)}`);
        return;
      }

      if (mode === "forgot") {
        await authRequest("/auth/forgot-password", {
          body: values as Record<string, unknown>,
        });
        setMessage("Reset link sent. Check your inbox for the next step.");
        return;
      }

      if (mode === "reset") {
        await authRequest("/auth/reset-password", {
          body: {
            ...(values as Record<string, unknown>),
            token,
          },
        });
        setMessage("Password updated. You can log in now.");
        router.push("/login");
        return;
      }

      await authRequest("/auth/resend-verification", {
        body: values as Record<string, unknown>,
      });
      setMessage("Verification email sent again.");
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Unable to complete the request.");
    } finally {
      setSubmitting(false);
    }
  }

  function oauthSignIn(provider: "google" | "github") {
    window.location.href = `${buildPlatformApiUrl(`/auth/oauth/${provider}`)}?next=${encodeURIComponent(nextPath)}`;
  }

  return (
    <div className="surface-card p-6 sm:p-8">
      <div className="mb-6">
        <p className="metric-label">Secure access</p>
        <h2 className="panel-title mt-2 text-3xl text-[color:var(--text-primary)]">
          {titleFor(mode)}
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {mode === "signup" ? (
          <>
            <Field label="Full name" error={errors.name?.message}>
              <input
                {...register("name")}
                className="field-input"
                placeholder="Amina Khan"
              />
            </Field>
            <Field label="Company" error={errors.company?.message}>
              <input
                {...register("company")}
                className="field-input"
                placeholder="Northlane Cloud"
              />
            </Field>
          </>
        ) : null}

        {mode !== "reset" ? (
          <Field label="Work email" error={errors.email?.message}>
            <input
              {...register("email")}
              type="email"
              className="field-input"
              placeholder="team@company.com"
            />
          </Field>
        ) : null}

        {mode === "login" || mode === "signup" || mode === "reset" ? (
          <Field label="Password" error={errors.password?.message}>
            <input
              {...register("password")}
              type="password"
              className="field-input"
              placeholder="Strong password"
            />
          </Field>
        ) : null}

        {mode === "signup" || mode === "reset" ? (
          <Field label="Confirm password" error={errors.confirmPassword?.message}>
            <input
              {...register("confirmPassword")}
              type="password"
              className="field-input"
              placeholder="Repeat password"
            />
          </Field>
        ) : null}

        {mode === "login" ? (
          <label className="flex items-center gap-3 text-sm text-[color:var(--text-secondary)]">
            <input type="checkbox" {...register("rememberMe")} />
            Remember me for 30 days
          </label>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="pill-link pill-link-accent inline-flex w-full text-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          {buttonFor(mode)}
        </button>
      </form>

      {mode === "login" || mode === "signup" ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={() => oauthSignIn("google")} className="pill-link text-sm">
            <MailCheck className="h-4 w-4" />
            Continue with Google
          </button>
          <button type="button" onClick={() => oauthSignIn("github")} className="pill-link text-sm">
            <Github className="h-4 w-4" />
            Continue with GitHub
          </button>
        </div>
      ) : null}

      {mode === "login" ? (
        <div className="mt-5 flex flex-wrap gap-3 text-sm text-[color:var(--text-secondary)]">
          <Link href="/forgot-password" className="underline-offset-4 hover:underline">
            Forgot password?
          </Link>
          <Link href="/signup" className="underline-offset-4 hover:underline">
            Need an account?
          </Link>
          <Link href="/auth/demo?next=/app/dashboard" className="underline-offset-4 hover:underline">
            Open the launch preview
          </Link>
        </div>
      ) : null}

      {mode === "signup" ? (
        <div className="mt-5 text-sm text-[color:var(--text-secondary)]">
          Already registered?{" "}
          <Link href="/login" className="underline-offset-4 hover:underline">
            Log in
          </Link>
        </div>
      ) : null}

      {message ? (
        <p
          className="mt-4 rounded-2xl px-4 py-3 text-sm text-[color:var(--success)]"
          style={{
            border: "1px solid color-mix(in srgb, var(--success) 24%, transparent)",
            background: "color-mix(in srgb, var(--success) 10%, transparent)",
          }}
        >
          {message}
        </p>
      ) : null}

      {error ? (
        <p
          className="mt-4 rounded-2xl px-4 py-3 text-sm text-[color:var(--danger)]"
          style={{
            border: "1px solid color-mix(in srgb, var(--danger) 24%, transparent)",
            background: "color-mix(in srgb, var(--danger) 10%, transparent)",
          }}
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm text-[color:var(--text-primary)]">{label}</span>
      {children}
      {error ? <span className="text-xs text-[color:var(--danger)]">{error}</span> : null}
    </label>
  );
}
