"use client";

import { Bar, BarChart, LabelList, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompactCurrency, formatPrice } from "@/lib/format";
import { chart, tickStyle } from "./theme";

type Row = { category: string; revenue: number };

const ROW_HEIGHT = 40;

/**
 * Horizontal bars, one series (revenue) → one colour for every bar.
 * Each bar carries its value at the tip, so the value axis is omitted.
 */
export function CategoryChart({ data }: { data: Row[] }) {
  const total = data.reduce((s, d) => s + d.revenue, 0);
  const height = Math.max(data.length, 1) * ROW_HEIGHT + 8;

  return (
    <figure
      aria-label={`Ангиллаар орлого: ${data.map((d) => `${d.category} ${formatPrice(d.revenue)}`).join(", ")}.`}
      className="w-full"
      style={{ height }}
    >
      <BarChart
        responsive
        layout="vertical"
        data={data}
        style={{ width: "100%", height: "100%" }}
        margin={{ top: 4, right: 56, bottom: 4, left: 0 }}
        barCategoryGap={12}
      >
        <XAxis type="number" hide domain={[0, "dataMax"]} />
        <YAxis
          type="category"
          dataKey="category"
          width={124}
          tick={{ ...tickStyle, fill: chart.ink, fontSize: 12.5 }}
          tickLine={false}
          axisLine={{ stroke: chart.axis }}
          interval={0}
        />
        <Tooltip
          cursor={{ fill: "rgba(15, 28, 46, 0.04)" }}
          isAnimationActive={false}
          content={({ active, payload }) => {
            const row = payload?.[0]?.payload as Row | undefined;
            if (!active || !row) return null;
            const share = total ? Math.round((row.revenue / total) * 100) : 0;
            return (
              <div className="rounded-lg border border-line bg-white px-3 py-2.5 shadow-lg">
                <p className="text-xs text-muted">{row.category}</p>
                <p className="mt-1 text-sm font-semibold text-ink tabular-nums">{formatPrice(row.revenue)}</p>
                <p className="text-xs text-muted tabular-nums">Нийт борлуулалтын {share}%</p>
              </div>
            );
          }}
        />
        <Bar
          dataKey="revenue"
          name="Орлого"
          fill={chart.revenue}
          barSize={18}
          radius={[0, 4, 4, 0]}
          animationDuration={600}
        >
          <LabelList
            dataKey="revenue"
            position="right"
            offset={8}
            formatter={(v) => formatCompactCurrency(Number(v))}
            style={{ fill: chart.ink, fontSize: 12, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}
          />
        </Bar>
      </BarChart>
    </figure>
  );
}
