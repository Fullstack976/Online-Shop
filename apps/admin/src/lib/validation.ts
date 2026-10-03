/** Small server-side form parsing helpers (FormData is untrusted input). */

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function checkbox(formData: FormData, key: string): boolean {
  const value = formData.get(key);
  return value === "on" || value === "true" || value === "1";
}

/** Parses a money/number field. Returns NaN for anything that is not a plain number. */
export function parseNumber(raw: string): number {
  const cleaned = raw.replace(/[$,\s]/g, "");
  if (!/^-?\d*(\.\d+)?$/.test(cleaned) || cleaned === "" || cleaned === "-") return Number.NaN;
  return Number(cleaned);
}

export const round2 = (n: number) => Math.round(n * 100) / 100;

const CYRILLIC = /[\u0400-\u04FF]/;

/**
 * `@shop/db` and Supabase report errors in English; map the ones admins can
 * hit to Mongolian. Messages that are already Mongolian pass through.
 */
const KNOWN_ERRORS: [RegExp, string][] = [
  [
    /move or delete this category's products|still referenced by other records/i,
    "Энэ ангилалд бүтээгдэхүүн байна. Эхлээд тэдгээрийг шилжүүлэх эсвэл устгана уу.",
  ],
  [/slug.*(already|in use)|already (exists|in use)/i, "Энэ slug аль хэдийн ашиглагдаж байна."],
  [/product not found/i, "Бүтээгдэхүүн олдсонгүй."],
  [/category not found/i, "Ангилал олдсонгүй."],
  [/order not found/i, "Захиалга олдсонгүй."],
  [/permission denied|row-level security/i, "Зөвшөөрөл алга. Энэ хэрэглэгч админ эрхтэй эсэхийг шалгана уу."],
  [
    /fetch failed|network|ECONNREFUSED|ENOTFOUND/i,
    "Supabase-тэй холбогдож чадсангүй. Холболтоо шалгаад дахин оролдоно уу.",
  ],
  [/JWT|session/i, "Нэвтрэлтийн хугацаа дууссан байна. Дахин нэвтэрнэ үү."],
];

export function errorMessage(error: unknown, fallback = "Алдаа гарлаа. Дахин оролдоно уу."): string {
  const raw = error instanceof Error ? error.message : "";
  if (!raw) return fallback;
  if (CYRILLIC.test(raw)) return raw;
  for (const [pattern, message] of KNOWN_ERRORS) if (pattern.test(raw)) return message;
  return `${fallback} (${raw})`;
}
