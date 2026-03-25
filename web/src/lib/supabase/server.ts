import { createServerClient } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { config } from "@/lib/config";

type CookieOptions = Parameters<NextResponse["cookies"]["set"]>[2];

function ensureSupabaseConfig() {
  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    throw new Error("Supabase environment variables are not configured.");
  }
}

export async function createSupabaseServerClient() {
  ensureSupabaseConfig();
  const cookieStore = await cookies();

  return createServerClient(config.supabaseUrl, config.supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {
        // Server Components can read cookies but should not mutate them.
      },
    },
  });
}

export function createSupabaseRouteClient(
  request: NextRequest,
  response: NextResponse
) {
  ensureSupabaseConfig();

  return createServerClient(config.supabaseUrl, config.supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });
}
