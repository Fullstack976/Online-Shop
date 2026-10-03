import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export const inputClass =
  "block w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink shadow-xs placeholder:text-subtle transition-colors hover:border-line-strong focus:border-tan focus:ring-2 focus:ring-tan/25 focus:outline-none disabled:bg-page disabled:text-muted aria-[invalid=true]:border-danger aria-[invalid=true]:focus:ring-danger/20";

export const selectClass = cn(inputClass, "select-chevron pr-9");

export function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
  className,
  optional,
}: {
  label: ReactNode;
  htmlFor: string;
  error?: string;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
  optional?: boolean;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <label htmlFor={htmlFor} className="mb-1.5 flex items-baseline gap-1.5 text-[13px] font-semibold text-ink">
        {label}
        {optional ? <span className="text-xs font-normal text-subtle">Optional</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="mt-1.5 text-xs font-medium text-danger" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function FormAlert({ tone = "danger", children }: { tone?: "danger" | "success"; children: ReactNode }) {
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cn(
        "rounded-lg border px-3.5 py-2.5 text-sm font-medium",
        tone === "danger"
          ? "border-danger/20 bg-danger-bg text-danger"
          : "border-success/20 bg-success-bg text-success",
      )}
    >
      {children}
    </div>
  );
}
