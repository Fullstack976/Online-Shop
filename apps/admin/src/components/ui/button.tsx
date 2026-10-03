import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "accent" | "secondary" | "ghost" | "danger" | "danger-ghost";
type Size = "sm" | "md" | "icon";

const variants: Record<Variant, string> = {
  primary: "bg-navy text-white shadow-sm hover:bg-navy-700 disabled:bg-navy/60",
  accent: "bg-tan text-white shadow-sm hover:bg-tan-600 disabled:bg-tan/60",
  secondary: "border border-line bg-white text-ink shadow-xs hover:border-line-strong hover:bg-page",
  ghost: "text-muted hover:bg-page hover:text-ink",
  danger: "bg-danger text-white shadow-sm hover:bg-[#991b1b] disabled:bg-danger/60",
  "danger-ghost": "text-danger hover:bg-danger-bg",
};

const sizes: Record<Size, string> = {
  sm: "h-8 gap-1.5 rounded-lg px-3 text-xs",
  md: "h-10 gap-2 rounded-lg px-4 text-sm",
  icon: "size-9 rounded-lg",
};

export function buttonClass({ variant = "primary", size = "md" }: { variant?: Variant; size?: Size } = {}) {
  return cn(
    "inline-flex shrink-0 items-center justify-center font-semibold whitespace-nowrap transition-colors disabled:cursor-not-allowed [&_svg]:size-4 [&_svg]:shrink-0",
    variants[variant],
    sizes[size],
  );
}

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return <button type={type} className={cn(buttonClass({ variant, size }), className)} {...props} />;
}
