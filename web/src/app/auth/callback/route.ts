import { NextRequest, NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const nextPath = url.searchParams.get("next") ?? "/app/overview";
  const code = url.searchParams.get("code");

  const response = NextResponse.redirect(new URL(nextPath, url.origin));

  if (code) {
    const supabase = createSupabaseRouteClient(request, response);
    await supabase.auth.exchangeCodeForSession(code);
  }

  return response;
}
