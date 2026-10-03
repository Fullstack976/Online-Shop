import Link from "next/link";
import { CircleCheck, X } from "lucide-react";

/** Flash banner shown after a redirect (e.g. `?notice=created`), with a dismiss link. */
export function Notice({ message, dismissHref }: { message: string; dismissHref: string }) {
  return (
    <div
      role="status"
      className="animate-fade-in mb-5 flex items-center gap-3 rounded-xl border border-success/20 bg-success-bg px-4 py-3 text-sm font-medium text-success"
    >
      <CircleCheck className="size-4 shrink-0" aria-hidden />
      <span className="flex-1">{message}</span>
      <Link
        href={dismissHref}
        scroll={false}
        replace
        className="inline-flex size-7 items-center justify-center rounded-md hover:bg-success/10"
        aria-label="Dismiss"
      >
        <X className="size-4" />
      </Link>
    </div>
  );
}

/** First value of a search param, or "". */
export function param(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

/** Current search params minus `notice`, as an href for the given path. */
export function withoutNotice(pathname: string, sp: Record<string, string | string[] | undefined>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(sp)) {
    if (key === "notice" || value === undefined) continue;
    for (const v of Array.isArray(value) ? value : [value]) params.append(key, v);
  }
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}
