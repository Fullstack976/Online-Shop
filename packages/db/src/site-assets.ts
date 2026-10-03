import { getSupabaseEnv, storagePublicUrl } from "./env.ts";

/**
 * Artwork used by the storefront outside the product catalog. `pnpm db:seed` uploads each
 * one to Supabase Storage as `site/<key>.jpg`; without Supabase the Unsplash original is used.
 */
export const siteAssets = {
  "hero-backpack": { photo: "1622560480605-d83c853bc5c3", w: 1000 },
  "hero-bottle": { photo: "1602143407151-7111542de6e8", w: 400 },
  "hero-sneakers": { photo: "1560769629-975ec94e6a86", w: 500 },
  "hero-sunglasses": { photo: "1511499767150-a48a237f0083", w: 500 },
  "hero-fashion": { photo: "1490481651871-ab68de25d43d", w: 1200 },
  "hero-tech": { photo: "1498049794561-7780e7231661", w: 1200 },
  "about-store": { photo: "1441986300917-64674bd600d8", w: 1200 },
  "blog-home": { photo: "1586023492125-27b2c045efd7", w: 1200 },
  "blog-fashion": { photo: "1445205170230-053b83016050", w: 1200 },
  "blog-tech": { photo: "1468495244123-6c6c332eeece", w: 1200 },
  "blog-workout": { photo: "1517836357463-d25dfeac3438", w: 1200 },
  "avatar-1": { photo: "1494790108377-be9c29b29330", w: 160, faces: true },
  "avatar-2": { photo: "1507003211169-0a1dd7228f2d", w: 160, faces: true },
  "avatar-3": { photo: "1438761681033-6461ffad8d80", w: 160, faces: true },
  "avatar-4": { photo: "1500648767791-00dcc994a43e", w: 160, faces: true },
} as const satisfies Record<string, { photo: string; w: number; faces?: boolean }>;

export type SiteAssetKey = keyof typeof siteAssets;

/** Source URL on Unsplash (used for mock mode and as the seed script's download source). */
export function siteAssetSource(key: SiteAssetKey): string {
  const a: { photo: string; w: number; faces?: boolean } = siteAssets[key];
  const crop = a.faces ? `&h=${a.w}&crop=faces` : "";
  return `https://images.unsplash.com/photo-${a.photo}?w=${a.w}&q=80&fm=jpg&fit=crop${crop}`;
}

export function siteImage(key: SiteAssetKey): string {
  const env = getSupabaseEnv();
  return env ? storagePublicUrl(env.url, `site/${key}.jpg`) : siteAssetSource(key);
}
