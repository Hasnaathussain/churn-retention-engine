"use client";

import Link from "next/link";
import { useEffect } from "react";
import { BrandLogo } from "@/components/brand-logo";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
          <div className="page-shell flex min-h-[85vh] items-center">
            <section className="section-shell mx-auto max-w-3xl px-6 py-10 text-center sm:px-10">
              <div className="flex justify-center">
                <BrandLogo />
              </div>
              <p className="eyebrow mt-8">500 / Service interruption</p>
              <h1 className="hero-type mt-4 text-5xl text-[color:var(--text-primary)] sm:text-6xl">
                Anchoryn hit an unexpected fault.
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[color:var(--text-secondary)] sm:text-base">
                The request did not complete safely. Try the action again, head back to the dashboard,
                or contact support if the issue keeps repeating.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button type="button" onClick={reset} className="pill-link pill-link-accent text-sm">
                  Try again
                </button>
                <Link href="/app/dashboard" className="pill-link text-sm">
                  Back to dashboard
                </Link>
                <Link href="/contact" className="pill-link text-sm">
                  Contact support
                </Link>
              </div>
            </section>
          </div>
        </main>
      </body>
    </html>
  );
}
