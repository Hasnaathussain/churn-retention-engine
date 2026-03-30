import { NextRequest, NextResponse } from "next/server";
import { buildDemoSession, DEMO_SESSION_COOKIE } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const nextPath = url.searchParams.get("next") ?? "/app/dashboard";
  const response = NextResponse.redirect(new URL(nextPath, url.origin));

  response.cookies.set(DEMO_SESSION_COOKIE, buildDemoSession(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
