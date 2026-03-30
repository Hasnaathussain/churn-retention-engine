"use client";

import { buildPlatformApiUrl } from "@/lib/config";

type AuthRequestOptions = {
  method?: "GET" | "POST";
  body?: Record<string, unknown>;
};

export async function authRequest<T>(
  path: string,
  options: AuthRequestOptions = {}
): Promise<T> {
  const response = await fetch(buildPlatformApiUrl(path), {
    method: options.method ?? "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const payload = (await response.json().catch(() => null)) as
    | { success?: boolean; data?: T; error?: { message?: string } }
    | null;

  if (!response.ok || payload?.success === false) {
    throw new Error(payload?.error?.message ?? "Authentication request failed.");
  }

  return (payload?.data ?? payload) as T;
}
