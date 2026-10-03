/**
 * Public Supabase credentials, or null when not configured (apps then run on mock data).
 * Accepts the new publishable key name and the legacy anon key name.
 * Property access stays literal so Next.js can inline the values in client bundles.
 */
export function getSupabaseEnv(): { url: string; key: string } | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && key ? { url, key } : null;
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseEnv() !== null;
}

/** Storage bucket for every shop image (products, categories and site artwork). */
export const IMAGE_BUCKET = "product-images";

export function storagePublicUrl(supabaseUrl: string, path: string): string {
  return `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/${IMAGE_BUCKET}/${path}`;
}
