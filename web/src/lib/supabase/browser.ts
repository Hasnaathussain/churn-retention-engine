import { createBrowserClient } from "@supabase/ssr";
import { config } from "@/lib/config";

function ensureSupabaseConfig() {
  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    throw new Error("Supabase environment variables are not configured.");
  }
}

export function createSupabaseBrowserClient() {
  ensureSupabaseConfig();
  return createBrowserClient(config.supabaseUrl, config.supabaseAnonKey);
}
