import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type Tone = "neutral" | "success" | "warning" | "danger" | "info" | "violet" | "tan" | "navy";

const tones: Record<Tone, string> = {
  neutral: "bg-page text-muted ring-line",
  success: "bg-success-bg text-success ring-success/15",
  warning: "bg-warning-bg text-warning ring-warning/15",
  danger: "bg-danger-bg text-danger ring-danger/15",
  info: "bg-info-bg text-info ring-info/15",
  violet: "bg-violet-bg text-violet ring-violet/15",
  tan: "bg-tan-100 text-tan-600 ring-tan/20",
  navy: "bg-navy text-white ring-navy",
};

export function Badge({
  tone = "neutral",
  icon,
  children,
  className,
}: {
  tone?: Tone;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap ring-1 ring-inset [&_svg]:size-3.5 [&_svg]:shrink-0",
        tones[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
