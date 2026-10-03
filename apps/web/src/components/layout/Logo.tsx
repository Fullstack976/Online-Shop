import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/cn";
import { site } from "@/lib/site";

export function Logo({ inverted = false, className }: { inverted?: boolean; className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)} aria-label={`${site.name} нүүр хуудас`}>
      <span
        className={cn(
          "grid size-9 place-items-center rounded-md",
          inverted ? "bg-white/10 text-white" : "bg-navy text-white",
        )}
      >
        <ShoppingBag className="size-5" strokeWidth={1.8} aria-hidden />
      </span>
      <span className="leading-none">
        <span
          className={cn(
            "block font-display text-xl font-extrabold tracking-[0.04em]",
            inverted ? "text-white" : "text-navy",
          )}
        >
          SHOP<span className="text-tan">LUXE</span>
        </span>
        <span
          className={cn(
            "mt-1 block font-display text-[8.5px] font-semibold uppercase tracking-[0.28em]",
            inverted ? "text-white/60" : "text-muted",
          )}
        >
          {site.tagline}
        </span>
      </span>
    </Link>
  );
}
