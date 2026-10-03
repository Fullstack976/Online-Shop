import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function EmptyState({
  icon,
  title,
  children,
  action,
  className,
}: {
  icon: ReactNode;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center px-6 py-14 text-center", className)}>
      <span className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-beige text-tan [&_svg]:size-5">
        {icon}
      </span>
      <p className="font-display text-[15px] font-bold text-ink">{title}</p>
      {children ? <div className="mt-1 max-w-sm text-sm text-muted">{children}</div> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
