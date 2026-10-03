import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { supabaseEnv } from "@/lib/env";

/**
 * Supabase client bound to the current request's auth cookies, or `null` when
 * the Supabase env vars are missing (the app then runs on mock data).
 *
 * Uses the public publishable/anon key only (never a service-role key): every query runs as the signed-in user, so
 * Row Level Security (`public.is_admin()`) is the real permission boundary.
 */
export async function getSupabase(): Promise<SupabaseClient | null> {
  const env = supabaseEnv();
  if (!env) return null;

  const cookieStore = await cookies();
  return createServerClient(env.url, env.key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) cookieStore.set(name, value, options);
        } catch {
          // Called from a Server Component, where cookies are read-only.
          // Safe to ignore: the proxy refreshes the session on every request.
        }
      },
    },
  });
}
