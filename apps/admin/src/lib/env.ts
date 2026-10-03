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

/**
 * The only accounts allowed into the dashboard (comma-separated ADMIN_EMAILS env var).
 * Everyone else is refused at login even if their profile says "admin".
 */
export const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "tsstark1@icloud.com")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  return Boolean(email) && ADMIN_EMAILS.includes(email!.trim().toLowerCase());
}
