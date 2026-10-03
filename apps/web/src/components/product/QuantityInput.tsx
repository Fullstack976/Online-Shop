"use client";

import { Minus, Plus } from "lucide-react";

export function QuantityInput({
  value,
  max,
  onChange,
  size = "md",
}: {
  value: number;
  max: number;
  onChange: (n: number) => void;
  size?: "sm" | "md";
}) {
  const h = size === "sm" ? "h-9" : "h-12";
  return (
    <div className={`inline-flex items-center rounded-md border border-line ${h}`}>
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        className="grid h-full w-9 place-items-center text-navy disabled:text-line"
        aria-label="Тоо ширхэг хасах"
      >
        <Minus className="size-4" />
      </button>
      <span className="w-8 text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="grid h-full w-9 place-items-center text-navy disabled:text-line"
        aria-label="Тоо ширхэг нэмэх"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
