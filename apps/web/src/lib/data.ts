import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createDataSource, getSupabaseEnv, type DataSource } from "@shop/db";

let client: SupabaseClient | null | undefined;

/**
 * Storefront data access. Uses the public (publishable/anon) key — RLS limits it to the catalog,
 * newsletter sign-ups and the `place_order` RPC. Falls back to mock data without env vars.
 */
export function getData(): DataSource {
  if (client === undefined) {
    const env = getSupabaseEnv();
    client = env
      ? createClient(env.url, env.key, { auth: { persistSession: false, autoRefreshToken: false } })
      : null;
  }
  return createDataSource(client);
}
