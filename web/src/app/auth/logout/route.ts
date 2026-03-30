import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE, DEMO_SESSION_COOKIE } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const nextPath = url.searchParams.get("next") ?? "/login";
  const response = NextResponse.redirect(new URL(nextPath, url.origin));

  response.cookies.set(DEMO_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  response.cookies.set(ACCESS_TOKEN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
