/**
 * Client-safe formatting helpers. Only imports `@shop/db/utils` (no data layer).
 *
 * Dates are written out by hand in the Mongolian convention ("2026.10.03",
 * "10-р сарын 3"): Mongolian months are numbered, so this needs no locale data
 * and renders identically on the server and in every browser (no hydration
 * mismatches if a runtime ships without "mn" ICU data). Money stays USD.
 */
export { formatPrice } from "@shop/db/utils";

const compactCurrency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});
const wholeCurrency = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const integerFmt = new Intl.NumberFormat("en-US");

const pad = (n: number) => String(n).padStart(2, "0");

function parts(date: Date) {
  return {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    hh: pad(date.getHours()),
    mm: pad(date.getMinutes()),
  };
}

/** "10-р сарын 3" */
function monthDay(date: Date): string {
  const { m, d } = parts(date);
  return `${m}-р сарын ${d}`;
}

/** "2026.10.03" — compact date for tables. */
export function formatDate(iso: string): string {
  const { y, m, d } = parts(new Date(iso));
  return `${y}.${pad(m)}.${pad(d)}`;
}

/** "2026 оны 10-р сарын 3, 15:45" */
export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  const { y, hh, mm } = parts(date);
  return `${y} оны ${monthDay(date)}, ${hh}:${mm}`;
}

/** "2026 оны 10-р сарын 3" */
export function formatDateLong(iso: string): string {
  const date = new Date(iso);
  return `${date.getFullYear()} оны ${monthDay(date)}`;
}

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

function dayKeyDate(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y!, (m ?? 1) - 1, d ?? 1);
}

/** "10-р сарын 3" from a YYYY-MM-DD day key (parsed as a local date, not UTC). */
export function formatDayKey(key: string): string {
  return monthDay(dayKeyDate(key));
}

/** "10.03" — short day label for chart axes. */
export function formatDayKeyShort(key: string): string {
  const date = dayKeyDate(key);
  return `${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
}

const relativeUnits: [Intl.RelativeTimeFormatUnit, number, string][] = [
  ["minute", 60, "минутын"],
  ["hour", 3600, "цагийн"],
  ["day", 86400, "өдрийн"],
];

const hasMongolianRelative = (() => {
  try {
    return Intl.RelativeTimeFormat.supportedLocalesOf(["mn-MN"]).length > 0;
  } catch {
    return false;
  }
})();

/** "3 өдрийн өмнө", "дөнгөж сая", … — rendered on the server per request. */
export function formatRelative(iso: string, now: number = Date.now()): string {
  const diff = Math.round((new Date(iso).getTime() - now) / 1000);
  const abs = Math.abs(diff);
  if (abs < 60) return "дөнгөж сая";
  if (abs >= 86400 * 30) return formatDate(iso);
  const [unit, seconds, word] = abs < 3600 ? relativeUnits[0]! : abs < 86400 ? relativeUnits[1]! : relativeUnits[2]!;
  const value = Math.round(diff / seconds);
  if (hasMongolianRelative) {
    return new Intl.RelativeTimeFormat("mn-MN", { numeric: "auto" }).format(value, unit);
  }
  // Fallback when the runtime has no Mongolian locale data.
  return value < 0 ? `${Math.abs(value)} ${word} өмнө` : `${value} ${word} дараа`;
}

/** Percent change vs. a previous value; null when there is no baseline. */
export function percentChange(current: number, previous: number): number | null {
  if (!previous) return current ? null : 0;
  return ((current - previous) / previous) * 100;
}

export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return "?";
  const first = words[0]![0] ?? "";
  const last = words.length > 1 ? (words[words.length - 1]![0] ?? "") : "";
  return (first + last).toUpperCase();
}

/** "12 захиалга" — Mongolian nouns keep the same form after a number. */
export function withCount(n: number, noun: string): string {
  return `${formatInt(n)} ${noun}`;
}
