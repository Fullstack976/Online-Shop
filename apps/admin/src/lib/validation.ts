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

export function errorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  return error instanceof Error && error.message ? error.message : fallback;
}
