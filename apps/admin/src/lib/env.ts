/**
 * Public Supabase settings. Kept free of `@shop/db` imports so the proxy
 * bundle stays small. Mirrors `getSupabaseEnv()` from `@shop/db`: the new
 * publishable key wins, the legacy anon key is a fallback.
 */
export function supabaseEnv(): { url: string; key: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && key ? { url, key } : null;
}

export const STORE_URL = process.env.NEXT_PUBLIC_STORE_URL || "http://localhost:3000";

export const PRODUCT_IMAGES_BUCKET = "product-images";
