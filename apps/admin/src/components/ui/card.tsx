import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Card({ className, ...props }: ComponentProps<"section">) {
  return (
    <section
      className={cn(
        "min-w-0 rounded-xl border border-line bg-white shadow-[0_1px_2px_rgba(15,28,46,0.04),0_4px_16px_-8px_rgba(15,28,46,0.06)]",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  title,
  description,
  action,
  className,
  id,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <header className={cn("flex flex-wrap items-start justify-between gap-x-4 gap-y-2 px-5 pt-5", className)}>
      <div className="min-w-0 flex-1">
        <h2 id={id} className="font-display text-[15px] font-bold tracking-tight text-ink">
          {title}
        </h2>
        {description ? <p className="mt-0.5 text-[13px] text-muted">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

/** Wraps a table so it scrolls horizontally inside its card instead of the page. */
export function TableScroll({ children, className }: { children: ReactNode; className?: string }) {
  // `relative` makes this the containing block for absolutely positioned descendants
  // (e.g. sr-only labels), so they cannot widen the page outside the scroll area.
  return <div className={cn("relative overflow-x-auto overscroll-x-contain", className)}>{children}</div>;
}

export const th = "label-caps whitespace-nowrap px-4 py-3 text-left text-[10.5px] text-muted first:pl-5 last:pr-5";
export const td = "whitespace-nowrap px-4 py-3 align-middle first:pl-5 last:pr-5";
