"use client";

import { useEffect, useState } from "react";
import { MoonStar, SunMedium } from "lucide-react";
import { cn } from "@/lib/cn";

const STORAGE_KEY = "anchoryn-theme";

type Theme = "light" | "dark";

function resolveTheme(): Theme {
  if (typeof document === "undefined") {
    return "light";
  }

  const current = document.documentElement.dataset.theme;
  return current === "dark" ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  window.localStorage.setItem(STORAGE_KEY, theme);
}

export function ThemeToggle({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const [theme, setTheme] = useState<Theme>(() =>
    typeof document === "undefined" ? "light" : resolveTheme()
  );

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setTheme(resolveTheme());
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    applyTheme(nextTheme);
    setTheme(nextTheme);
  }

  const label = `${theme === "light" ? "Light" : "Dark"} mode`;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--border-strong)] bg-[color:var(--surface-soft)] text-[color:var(--text-primary)] shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:border-[color:var(--accent-soft-border)] hover:bg-[color:var(--surface)]",
        compact ? "h-10 w-10" : "px-4 py-2.5 text-sm",
        className
      )}
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {theme === "light" ? (
        <MoonStar className="h-4 w-4" />
      ) : (
        <SunMedium className="h-4 w-4" />
      )}
      {compact ? null : <span>{label}</span>}
    </button>
  );
}
