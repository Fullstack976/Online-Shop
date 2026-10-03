import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Row under the top bar: a short description (the page title itself lives in
 * the top bar) and primary actions on the right.
 */
export function PageIntro({
  children,
  actions,
  className,
}: {
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-3", className)}>
      <div className="min-w-0 text-sm text-muted">{children}</div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
