import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell";
import { requireWorkspaceSession } from "@/lib/auth";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await requireWorkspaceSession("/signin?next=/app/overview");

  return <AppShell session={session}>{children}</AppShell>;
}
