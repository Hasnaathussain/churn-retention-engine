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
        <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/8 bg-white/5">
          <Sparkles className="h-5 w-5 text-[#f6c66f]" />
        </span>
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[#8f9ab7]">Secure entry</p>
          <h1 className="panel-title text-3xl text-[#f5f2ea]">Sign in to your workspace</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block space-y-2">
          <span className="text-sm text-[#dfe6f6]">Work email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="founder@company.com"
            className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3 text-[#f5f2ea] outline-none transition placeholder:text-[#6f7b95] focus:border-[#f6c66f]/40 focus:bg-white/6"
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading || !config.supabaseUrl || !config.supabaseAnonKey}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#f6c66f] px-5 py-3 text-sm font-medium text-[#08101f] transition hover:-translate-y-0.5 hover:bg-[#f2b94e] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Send magic link
          <ArrowRight className="h-4 w-4" />
        </button>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/auth/demo?next=/app/overview"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/4 px-5 py-3 text-sm text-[#f5f2ea] transition hover:border-white/20 hover:bg-white/8"
          >
            Use demo workspace
          </Link>
          <Link
            href="/demo"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/4 px-5 py-3 text-sm text-[#f5f2ea] transition hover:border-white/20 hover:bg-white/8"
          >
            Preview first
          </Link>
        </div>
      </form>

      {message ? (
        <p className="mt-4 rounded-2xl border border-[#8dd6a3]/20 bg-[#8dd6a3]/10 px-4 py-3 text-sm text-[#baf0c6]">
          {message}
        </p>
      ) : null}

      {error ? (
        <p className="mt-4 rounded-2xl border border-[#f28b82]/20 bg-[#f28b82]/10 px-4 py-3 text-sm text-[#ffc9c4]">
          {error}
        </p>
      ) : null}

      <p className="mt-5 text-sm leading-7 text-[#8f9ab7]">
        Demo mode does not require Supabase credentials. For the real auth flow, configure
        your Supabase URL and anon key in the frontend environment.
      </p>
    </div>
  );
}
