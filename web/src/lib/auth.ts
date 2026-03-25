import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { WorkspaceRole, WorkspaceSession } from "@/lib/types";

export const DEMO_SESSION_COOKIE = "synapse-demo-session";

type DemoCookie = {
  workspaceId?: string;
  workspaceName?: string;
  role?: WorkspaceRole;
  userEmail?: string;
  mode?: "demo";
};

export function buildDemoSession(session?: Partial<WorkspaceSession>) {
  return JSON.stringify({
    workspaceId: session?.workspaceId ?? "demo-synapse",
    workspaceName: session?.workspaceName ?? "Synapse Demo Workspace",
    role: session?.role ?? "owner",
    userEmail: session?.userEmail ?? "founder@synapse.demo",
    mode: "demo",
  });
}

export async function getWorkspaceSession(): Promise<WorkspaceSession | null> {
  const cookieStore = await cookies();
  const demoCookie = cookieStore.get(DEMO_SESSION_COOKIE)?.value;

  if (demoCookie) {
    try {
      const parsed = JSON.parse(demoCookie) as DemoCookie;

      return {
        workspaceId: parsed.workspaceId ?? "demo-synapse",
        workspaceName: parsed.workspaceName ?? "Synapse Demo Workspace",
        role: parsed.role ?? "owner",
        mode: "demo",
        userEmail: parsed.userEmail ?? "founder@synapse.demo",
      };
    } catch {
      // Fall through to the authenticated session lookup.
    }
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      return null;
    }

    return {
      workspaceId:
        (data.user.user_metadata?.workspace_id as string) ?? "live-workspace",
      workspaceName:
        (data.user.user_metadata?.workspace_name as string) ??
        "Synapse Workspace",
      role:
        ((data.user.user_metadata?.workspace_role as WorkspaceRole) ??
          "owner") as WorkspaceRole,
      mode: "live",
      userEmail: data.user.email ?? undefined,
    };
  } catch {
    return null;
  }
}

export async function requireWorkspaceSession(
  redirectTo = "/signin?next=/app/overview"
) {
  const session = await getWorkspaceSession();

  if (!session) {
    redirect(redirectTo);
  }

  return session;
}
