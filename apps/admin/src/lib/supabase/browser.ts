import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseEnv } from "@/lib/env";

/**
 * Browser Supabase client (session kept in the same cookies the server reads),
 * or `null` in demo mode. URL detection is off: the set-password page handles
 * every link format itself (hash tokens, `?code=`, `?token_hash=`), because the
 * built-in PKCE detector rejects the implicit `#access_token` links that
 * Supabase invite emails use.
 */
export function getBrowserSupabase(): SupabaseClient | null {
  const env = supabaseEnv();
  if (!env) return null;
  return createBrowserClient(env.url, env.key, { auth: { detectSessionInUrl: false } });
}
