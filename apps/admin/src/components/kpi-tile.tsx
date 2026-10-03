import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { percentChange } from "@/lib/format";

/**
 * Stat tile: label · value · signed delta vs the previous 30 days.
 * Direction is carried by a ▲/▼ glyph and sign, not colour alone.
 */
export function KpiTile({
  label,
  value,
  current,
  previous,
  icon,
  previousLabel,
}: {
  label: string;
  value: string;
  current: number;
  previous: number;
  icon: ReactNode;
  previousLabel: string;
}) {
  const change = percentChange(current, previous);
  const rounded = change === null ? null : Math.round(change * 10) / 10;
  const direction = rounded === null || rounded === 0 ? "flat" : rounded > 0 ? "up" : "down";
  const glyph = direction === "up" ? "▲" : direction === "down" ? "▼" : "–";

  return (
    <div className="flex min-w-0 flex-col rounded-xl border border-line bg-white p-4 sm:p-5 shadow-[0_1px_2px_rgba(15,28,46,0.04),0_4px_16px_-8px_rgba(15,28,46,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <p className="min-h-[2lh] text-[13px] font-medium text-muted sm:min-h-0">{label}</p>
        <span className="hidden size-9 shrink-0 items-center justify-center rounded-lg bg-beige text-tan-600 min-[420px]:inline-flex [&_svg]:size-[18px]">
          {icon}
        </span>
      </div>
      <p className="mt-1 truncate font-display text-[22px] leading-tight font-bold tracking-tight text-navy sm:text-[26px]">
        {value}
      </p>
      <p className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-semibold tabular-nums",
            direction === "up" && "bg-success-bg text-success",
            direction === "down" && "bg-danger-bg text-danger",
            direction === "flat" && "bg-page text-muted",
          )}
        >
          <span aria-hidden className="text-[9px] leading-none">
            {glyph}
          </span>
          <span className="sr-only">
            {direction === "up" ? "Өссөн" : direction === "down" ? "Буурсан" : "Өөрчлөлтгүй"}
          </span>
          {rounded === null ? "Шинэ" : `${rounded > 0 ? "+" : ""}${rounded.toFixed(1)}%`}
        </span>
        <span className="text-muted">{previousLabel}</span>
      </p>
    </div>
  );
}
