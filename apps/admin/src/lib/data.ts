import { createDataSource, type DataSource } from "@shop/db";
import { connection } from "next/server";
import { getSupabase } from "@/lib/supabase/server";

/**
 * Data access for the admin. Supabase-backed (as the signed-in user, RLS enforced)
 * when configured, otherwise the in-memory mock store.
 *
 * `connection()` keeps every page that reads data request-time rendered, so the
 * mock store's in-memory edits show up immediately instead of being frozen at build.
 */
export async function getData(): Promise<DataSource> {
  await connection();
  return createDataSource(await getSupabase());
}
