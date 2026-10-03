/**
 * Hosts allowed by `images.remotePatterns` in next.config.ts. Other URLs are
 * rendered unoptimised so an arbitrary pasted image URL never crashes next/image.
 */
export function isOptimizableImage(src: string): boolean {
  try {
    const { protocol, hostname } = new URL(src);
    return protocol === "https:" && (hostname === "images.unsplash.com" || hostname.endsWith(".supabase.co"));
  } catch {
    return false;
  }
}

export function isHttpUrl(value: string): boolean {
  try {
    const { protocol } = new URL(value);
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}
