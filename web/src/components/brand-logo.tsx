"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";

export function BrandLogo({
  href = "/",
  className,
  compact = false,
}: {
  href?: string;
  className?: string;
  compact?: boolean;
}) {
  const content = (
    <span className={cn("flex min-w-0 items-center gap-3", className)}>
      <span className="grid h-11 w-11 place-items-center rounded-2xl border border-[color:var(--accent-soft-border)] bg-[color:var(--surface-soft)] shadow-[var(--shadow-soft)]">
        <AnchorynMark className="h-6 w-6 text-[color:var(--accent-strong)]" />
      </span>
      {compact ? null : (
        <span className="min-w-0">
          <span className="hero-type block truncate text-[1.25rem] leading-none text-[color:var(--text-primary)]">
            Anchoryn
          </span>
          <span className="truncate text-[0.68rem] uppercase tracking-[0.28em] text-[color:var(--text-soft)]">
            Retention intelligence
          </span>
        </span>
      )}
    </span>
  );

  if (!href) {
    return content;
  }

  return <Link href={href}>{content}</Link>;
}

export function AnchorynMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M31.999 8c6.33 0 11.46 5.13 11.46 11.46 0 4.37-2.45 8.16-6.06 10.09v12.42l9.61 7.54c1.9 1.5.84 4.55-1.58 4.55h-8.03l-5.39 6.39-5.39-6.39h-8.03c-2.42 0-3.48-3.05-1.58-4.55l9.61-7.54V29.55a11.44 11.44 0 0 1-6.06-10.09C20.539 13.13 25.669 8 31.999 8Z"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path
        d="M24 23.5c2.2 2.05 5.08 3.08 8 3.08s5.8-1.03 8-3.08"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <circle cx="32" cy="19.46" r="3.25" fill="currentColor" />
    </svg>
  );
}
