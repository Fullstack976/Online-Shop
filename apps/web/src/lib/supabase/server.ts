import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getSupabaseEnv } from "@shop/db/env";

/**
 * Supabase client bound to the shopper's auth cookies, or null without env vars (mock mode).
 * Use it for anything tied to the signed-in customer: checkout, order history, sign-in.
 */
export async function getSupabase(): Promise<SupabaseClient | null> {
  const env = getSupabaseEnv();
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
          // Server Components can't set cookies; the proxy refreshes the session instead.
        }
      },
    },
  });
}

export async function getUser(): Promise<User | null> {
  const supabase = await getSupabase();
  if (!supabase) return null;
  const { data } = await supabase.auth.getUser();
  return data.user;
}

/** Whether the Google provider is switched on in Supabase Auth (checked at most every 5 minutes). */
export async function isGoogleEnabled(): Promise<boolean> {
  const env = getSupabaseEnv();
  if (!env) return false;
  try {
    const res = await fetch(`${env.url}/auth/v1/settings`, {
      headers: { apikey: env.key },
      next: { revalidate: 300 },
    });
    if (!res.ok) return false;
    const settings = (await res.json()) as { external?: Record<string, boolean> };
    return Boolean(settings.external?.google);
  } catch {
    return false;
  }
}

/** Only allow same-site relative redirects after sign-in. */
export function safeNext(value: unknown, fallback = "/account"): string {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}
