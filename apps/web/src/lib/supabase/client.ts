"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@shop/db/env";

export function getBrowserSupabase() {
  const env = getSupabaseEnv();
  return env ? createBrowserClient(env.url, env.key) : null;
}
