import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="floating-glow animated-float left-[-8rem] top-[4rem] -z-10 h-64 w-64 bg-[color:var(--accent-soft)]" />
      <div className="floating-glow right-[-10rem] top-[9rem] -z-10 h-80 w-80 bg-[color:var(--accent-blue-soft)]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[24rem] bg-gradient-to-b from-[color:var(--surface-soft)] to-transparent" />
      <div className="absolute inset-0 -z-10 soft-grid opacity-35" />
      <SiteHeader />
      {children}
      <SiteFooter />
    </div>
  );
}
