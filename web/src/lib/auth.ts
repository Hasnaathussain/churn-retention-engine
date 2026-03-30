import "server-only";

import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { config } from "@/lib/config";
import type { MemberRole, WorkspaceSession } from "@/lib/types";

export const DEMO_SESSION_COOKIE = "anchoryn_preview_session";
export const ACCESS_TOKEN_COOKIE = "anchoryn_access_token";

type DemoCookie = {
  organizationId?: string;
  organizationName?: string;
  slug?: string;
  role?: MemberRole;
  userEmail?: string;
  userName?: string;
  plan?: string;
  mode?: "demo";
};

type AuthPayload = {
  sub: string;
  email?: string;
  name?: string;
  organization_id?: string;
  organization_name?: string;
  organization_slug?: string;
  role?: MemberRole;
  plan?: string;
  email_verified?: boolean;
  timezone?: string;
  locale?: string;
  mode?: "live" | "demo";
};

const defaultDemoSession: WorkspaceSession = {
  organizationId: "org_demo_anchoryn",
  organizationName: "Anchoryn Launch Preview",
  workspaceId: "org_demo_anchoryn",
  workspaceName: "Anchoryn Launch Preview",
  slug: "launch-preview",
  role: "owner",
  mode: "demo",
  plan: "Growth",
  userEmail: "operator@anchoryn.demo",
  userName: "Launch Preview",
  emailVerified: true,
  timezone: "UTC",
  locale: "en",
  organizations: [
    {
      organizationId: "org_demo_anchoryn",
      organizationName: "Anchoryn Launch Preview",
      slug: "launch-preview",
      role: "owner",
      plan: "Growth",
      isActive: true,
    },
  ],
};

async function decodeAccessToken(token: string): Promise<AuthPayload | null> {
  try {
    const secret = new TextEncoder().encode(
      process.env.AUTH_JWT_SECRET ?? "anchoryn-development-secret"
    );
    const { payload } = await jwtVerify(token, secret);

    return payload as unknown as AuthPayload;
  } catch {
    return null;
  }
}

export function buildDemoSession(
  session?: Partial<WorkspaceSession>
) {
  return JSON.stringify({
    organizationId: session?.organizationId ?? defaultDemoSession.organizationId,
    organizationName:
      session?.organizationName ?? defaultDemoSession.organizationName,
    slug: session?.slug ?? defaultDemoSession.slug,
    role: session?.role ?? defaultDemoSession.role,
    userEmail: session?.userEmail ?? defaultDemoSession.userEmail,
    userName: session?.userName ?? defaultDemoSession.userName,
    plan: session?.plan ?? defaultDemoSession.plan,
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
        organizationId: parsed.organizationId ?? defaultDemoSession.organizationId,
        organizationName:
          parsed.organizationName ?? defaultDemoSession.organizationName,
        workspaceId: parsed.organizationId ?? defaultDemoSession.workspaceId,
        workspaceName: parsed.organizationName ?? defaultDemoSession.workspaceName,
        slug: parsed.slug ?? defaultDemoSession.slug,
        role: parsed.role ?? defaultDemoSession.role,
        mode: "demo",
        plan: parsed.plan ?? defaultDemoSession.plan,
        userEmail: parsed.userEmail ?? defaultDemoSession.userEmail,
        userName: parsed.userName ?? defaultDemoSession.userName,
        emailVerified: true,
        timezone: defaultDemoSession.timezone,
        locale: defaultDemoSession.locale,
        organizations: defaultDemoSession.organizations,
      };
    } catch {
      // Fall through.
    }
  }

  const accessToken =
    cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ??
    cookieStore.get(config.authCookieName)?.value;

  if (accessToken) {
    const payload = await decodeAccessToken(accessToken);

    if (payload?.organization_id && payload.organization_name) {
      return {
        organizationId: payload.organization_id,
        organizationName: payload.organization_name,
        workspaceId: payload.organization_id,
        workspaceName: payload.organization_name,
        slug: payload.organization_slug ?? "organization",
        role: payload.role ?? "viewer",
        mode: payload.mode ?? "live",
        plan: payload.plan ?? "Starter",
        userEmail: payload.email,
        userName: payload.name,
        emailVerified: payload.email_verified ?? false,
        timezone: payload.timezone,
        locale: payload.locale ?? "en",
        organizations: [
          {
            organizationId: payload.organization_id,
            organizationName: payload.organization_name,
            slug: payload.organization_slug ?? "organization",
            role: payload.role ?? "viewer",
            plan: payload.plan ?? "Starter",
            isActive: true,
          },
        ],
      };
    }
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      return null;
    }

    return {
      organizationId:
        (data.user.user_metadata?.workspace_id as string) ?? "org_live_workspace",
      organizationName:
        (data.user.user_metadata?.workspace_name as string) ??
        "Anchoryn Live Workspace",
      workspaceId:
        (data.user.user_metadata?.workspace_id as string) ?? "org_live_workspace",
      workspaceName:
        (data.user.user_metadata?.workspace_name as string) ??
        "Anchoryn Live Workspace",
      slug: "live-workspace",
      role:
        ((data.user.user_metadata?.workspace_role as MemberRole) ??
          "owner") as MemberRole,
      mode: "live",
      plan: "Growth",
      userEmail: data.user.email ?? undefined,
      userName:
        (data.user.user_metadata?.full_name as string) ??
        data.user.email?.split("@")[0],
      emailVerified: Boolean(data.user.email_confirmed_at),
      locale: "en",
      timezone: "UTC",
      organizations: [
        {
          organizationId:
            (data.user.user_metadata?.workspace_id as string) ??
            "org_live_workspace",
          organizationName:
            (data.user.user_metadata?.workspace_name as string) ??
            "Anchoryn Live Workspace",
          slug: "live-workspace",
          role:
            ((data.user.user_metadata?.workspace_role as MemberRole) ??
              "owner") as MemberRole,
          plan: "Growth",
          isActive: true,
        },
      ],
    };
  } catch {
    return null;
  }
}

export async function requireWorkspaceSession(
  redirectTo = "/login?next=/app/dashboard"
) {
  const session = await getWorkspaceSession();

  if (!session) {
    redirect(redirectTo);
  }

  return session;
}
