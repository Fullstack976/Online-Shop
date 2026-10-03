"use client";

import type { DailyPoint } from "@shop/db";
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompactCurrency, formatDayKey, formatInt, formatPrice, niceTicks } from "@/lib/format";
import { chart, tickStyle } from "./theme";

/**
 * Single-series area chart: daily revenue for the last 30 days.
 * Crosshair + tooltip shows revenue (lead) and that day's order count.
 * The title names the series, so there is no legend box.
 */
export function RevenueChart({ data }: { data: DailyPoint[] }) {
  const total = data.reduce((s, d) => s + d.revenue, 0);
  const first = data[0]?.date;
  const last = data[data.length - 1]?.date;
  const ticks = niceTicks(Math.max(0, ...data.map((d) => d.revenue)));

  return (
    <figure
      aria-label={`Daily revenue from ${first ? formatDayKey(first) : ""} to ${last ? formatDayKey(last) : ""}, ${formatPrice(total)} in total.`}
      className="h-[280px] w-full"
    >
      <AreaChart
        responsive
        data={data}
        style={{ width: "100%", height: "100%" }}
        margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
      >
        <defs>
          <linearGradient id="revenue-wash" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={chart.revenue} stopOpacity={0.16} />
            <stop offset="100%" stopColor={chart.revenue} stopOpacity={0.03} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={chart.grid} />
        <XAxis
          dataKey="date"
          tickFormatter={formatDayKey}
          tick={tickStyle}
          tickLine={false}
          axisLine={{ stroke: chart.axis }}
          minTickGap={28}
          tickMargin={10}
          interval="preserveStartEnd"
        />
        <YAxis
          tickFormatter={(v: number) => formatCompactCurrency(v)}
          tick={tickStyle}
          tickLine={false}
          axisLine={false}
          width={56}
          ticks={ticks}
          domain={[0, ticks[ticks.length - 1]!]}
          interval={0}
        />
        <Tooltip
          cursor={{ stroke: chart.axis, strokeWidth: 1 }}
          isAnimationActive={false}
          content={({ active, payload }) => {
            const point = payload?.[0]?.payload as DailyPoint | undefined;
            if (!active || !point) return null;
            return (
              <div className="min-w-40 rounded-lg border border-line bg-white px-3 py-2.5 shadow-lg">
                <p className="text-xs text-muted">{formatDayKey(point.date)}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span aria-hidden className="h-0.5 w-3 rounded-full" style={{ background: chart.revenue }} />
                  <span className="text-sm font-semibold text-ink tabular-nums">{formatPrice(point.revenue)}</span>
                  <span className="text-xs text-muted">revenue</span>
                </div>
                <div className="mt-1 flex items-center gap-2 pl-5">
                  <span className="text-sm font-semibold text-ink tabular-nums">{formatInt(point.orders)}</span>
                  <span className="text-xs text-muted">{point.orders === 1 ? "order" : "orders"}</span>
                </div>
              </div>
            );
          }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke={chart.revenue}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="url(#revenue-wash)"
          dot={false}
          activeDot={{ r: 5, fill: chart.revenue, stroke: chart.surface, strokeWidth: 2 }}
          animationDuration={600}
        />
      </AreaChart>
    </figure>
  );
}
