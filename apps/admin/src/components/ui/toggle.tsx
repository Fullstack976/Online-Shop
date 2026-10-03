"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Switch-styled checkbox. Submits "on" under `name` when checked, like a native checkbox. */
export function Toggle({
  name,
  checked,
  onChange,
  label,
  description,
  icon,
}: {
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-lg p-1 select-none">
      <span className="min-w-0">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-ink [&_svg]:size-4">
          {icon}
          {label}
        </span>
        {description ? <span className="mt-0.5 block text-xs text-muted">{description}</span> : null}
      </span>
      <span className="relative mt-0.5 inline-flex shrink-0">
        <input
          type="checkbox"
          role="switch"
          name={name}
          checked={checked}
          onChange={(e) => onChange(e.currentTarget.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className={cn(
            "h-6 w-11 rounded-full transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-tan peer-focus-visible:ring-offset-2",
            checked ? "bg-navy" : "bg-line-strong",
          )}
        />
        <span
          aria-hidden
          className={cn(
            "absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform",
            checked && "translate-x-5",
          )}
        />
      </span>
    </label>
  );
}
