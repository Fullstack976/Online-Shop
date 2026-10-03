/** Client-safe formatting helpers. Only imports `@shop/db/utils` (no data layer). */
export { formatPrice } from "@shop/db/utils";

const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
const dateTimeFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});
const shortDateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
const compactCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});
const integerFmt = new Intl.NumberFormat("en-US");

export const formatDate = (iso: string) => dateFmt.format(new Date(iso));
export const formatDateTime = (iso: string) => dateTimeFmt.format(new Date(iso));
const wholeCurrency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

/** "$896", "$1.4K", "$2.6M" — whole dollars below 1,000, compact above. */
export const formatCompactCurrency = (n: number) =>
  Math.abs(n) < 1000 ? wholeCurrency.format(n) : compactCurrency.format(n);

/** Clean axis ticks from 0: steps of 1, 2, 2.5 or 5 × 10^n, about `count` of them. */
export function niceTicks(max: number, count = 4): number[] {
  if (!(max > 0)) return [0, 1];
  const raw = max / count;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((s) => s >= raw) ?? raw;
  const ticks: number[] = [];
  for (let v = 0; v < max + step; v += step) ticks.push(Math.round(v * 100) / 100);
  return ticks;
}
export const formatInt = (n: number) => integerFmt.format(n);

/** "Oct 3" from a YYYY-MM-DD day key (parsed as a local date, not UTC). */
export function formatDayKey(key: string): string {
  const [y, m, d] = key.split("-").map(Number);
  return shortDateFmt.format(new Date(y!, (m ?? 1) - 1, d ?? 1));
}

/** "3 days ago", "just now", … — rendered on the server per request. */
export function formatRelative(iso: string, now: number = Date.now()): string {
  const diff = Math.round((new Date(iso).getTime() - now) / 1000);
  const rtf = new Intl.RelativeTimeFormat("en-US", { numeric: "auto" });
  const abs = Math.abs(diff);
  if (abs < 60) return "just now";
  if (abs < 3600) return rtf.format(Math.round(diff / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), "hour");
  if (abs < 86400 * 30) return rtf.format(Math.round(diff / 86400), "day");
  return formatDate(iso);
}

/** Percent change vs. a previous value; null when there is no baseline. */
export function percentChange(current: number, previous: number): number | null {
  if (!previous) return current ? null : 0;
  return ((current - previous) / previous) * 100;
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  const first = parts[0]![0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]![0] ?? "") : "";
  return (first + last).toUpperCase();
}

export function pluralize(n: number, one: string, many = `${one}s`): string {
  return `${formatInt(n)} ${n === 1 ? one : many}`;
}
