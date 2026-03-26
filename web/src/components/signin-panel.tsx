"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { config } from "@/lib/config";

export function SignInPanel() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const redirectTo = new URL(
        "/auth/callback?next=/app/overview",
        window.location.origin
      ).toString();
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
        },
      });

      if (signInError) {
        throw signInError;
      }

      setMessage("Magic link sent. Check your inbox to finish signing in.");
    } catch (formError) {
      setError(formError instanceof Error ? formError.message : "Unable to send magic link.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="surface-card p-6 sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl border border-[color:var(--accent-soft-border)] bg-[color:var(--accent-soft)]">
          <Sparkles className="h-5 w-5 text-[color:var(--accent-strong)]" />
        </span>
        <div>
          <p className="metric-label">Secure entry</p>
          <h1 className="panel-title text-3xl text-[color:var(--text-primary)]">Sign in to your workspace</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block space-y-2">
          <span className="text-sm text-[color:var(--text-primary)]">Work email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="founder@company.com"
            className="w-full rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface-soft)] px-4 py-3 text-[color:var(--text-primary)] outline-none transition placeholder:text-[color:var(--text-soft)] focus:border-[color:var(--accent-soft-border)] focus:bg-[color:var(--surface)]"
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading || !config.supabaseUrl || !config.supabaseAnonKey}
          className="pill-link pill-link-accent inline-flex w-full text-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Send magic link
          <ArrowRight className="h-4 w-4" />
        </button>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/auth/demo?next=/app/overview"
            className="pill-link text-sm"
          >
            Use demo workspace
          </Link>
          <Link
            href="/demo"
            className="pill-link text-sm"
          >
            Preview first
          </Link>
        </div>
      </form>

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

      <p className="mt-5 text-sm leading-7 text-[color:var(--text-secondary)]">
        Demo mode does not require Supabase credentials. For the real auth flow, configure
        your Supabase URL and anon key in the frontend environment.
      </p>
    </div>
  );
}
