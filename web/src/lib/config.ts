export const config = {
  brandName: "Anchoryn",
  brandTagline: "Retention intelligence that keeps revenue anchored.",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "",
  authCookieName: process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME ?? "anchoryn_access_token",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  demoVideoUrl: process.env.NEXT_PUBLIC_DEMO_VIDEO_URL ?? "",
  allowDemoMode: process.env.NEXT_PUBLIC_ALLOW_DEMO_MODE !== "false",
};

function joinBaseUrl(baseUrl: string, path: string) {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const suffix = path.startsWith("/") ? path : `/${path}`;
  if (!baseUrl) {
    return suffix;
  }

  return `${baseUrl.replace(/\/$/, "")}${suffix}`;
}

export function buildWorkspaceApiUrl(path: string) {
  return joinBaseUrl(config.apiBaseUrl, path);
}

export function buildPlatformApiUrl(path: string) {
  const base = config.apiBaseUrl.replace(/\/v1\/?$/, "");
  return joinBaseUrl(base, `/api/v1${path.startsWith("/") ? path : `/${path}`}`);
}
