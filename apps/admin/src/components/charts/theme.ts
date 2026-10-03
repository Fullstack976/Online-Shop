/**
 * Chart tokens (mirrors the `--color-chart-*` theme tokens in globals.css).
 * Recharts needs literal values for SVG attributes, so they live here too.
 * Validated with the dataviz palette validator against the white card surface.
 */
export const chart = {
  revenue: "#3869ad", // navy family, step 500 — every revenue mark
  orders: "#b37736", // bronze (tan family) — every order-count mark
  grid: "#ececf0",
  axis: "#d4d4da",
  tick: "#6b7280",
  ink: "#111827",
  surface: "#ffffff",
} as const;

export const tickStyle = { fill: chart.tick, fontSize: 12, fontVariantNumeric: "tabular-nums" } as const;
