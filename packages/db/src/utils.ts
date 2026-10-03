/** Pure helpers that are safe to import from client components. */

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

/** Percentage saved vs. compare-at price, rounded, or null when not on sale. */
export function discountPercent(price: number, compareAtPrice: number | null): number | null {
  if (!compareAtPrice || compareAtPrice <= price) return null;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/["']/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const FREE_SHIPPING_THRESHOLD = 50;
export const SHIPPING_FEE = 5.99;

export function shippingFor(subtotal: number): number {
  return subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
}

/** Unsplash CDN URL for a photo id (mock catalog images). */
export const unsplash = (id: string, w = 1000) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;
