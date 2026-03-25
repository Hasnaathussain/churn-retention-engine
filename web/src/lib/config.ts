export const config = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  demoVideoUrl: process.env.NEXT_PUBLIC_DEMO_VIDEO_URL ?? "",
  allowDemoMode: process.env.NEXT_PUBLIC_ALLOW_DEMO_MODE !== "false",
};

export function buildApiUrl(path: string) {
  const suffix = path.startsWith("/") ? path : `/${path}`;
  if (!config.apiBaseUrl) {
    return suffix;
  }

  return `${config.apiBaseUrl.replace(/\/$/, "")}${suffix}`;
}
