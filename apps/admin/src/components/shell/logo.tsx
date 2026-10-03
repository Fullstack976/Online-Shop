import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/cn";

/** "SHOPLUXE" wordmark with the bag mark, plus an optional "Admin" tag. */
export function Logo({ tone = "light", showTag = true }: { tone?: "light" | "dark"; showTag?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="inline-flex size-8 items-center justify-center rounded-lg bg-tan text-white shadow-sm">
        <ShoppingBag className="size-[18px]" strokeWidth={2.25} aria-hidden />
      </span>
      <span
        className={cn(
          "font-display text-[17px] font-extrabold tracking-[0.14em]",
          tone === "light" ? "text-white" : "text-navy",
        )}
      >
        SHOP<span className="text-tan">LUXE</span>
      </span>
      {showTag ? (
        <span
          className={cn(
            "label-caps rounded-md px-1.5 py-0.5 text-[9.5px]",
            tone === "light" ? "bg-white/10 text-tan-200" : "bg-tan-100 text-tan-600",
          )}
        >
          Admin
        </span>
      ) : null}
    </span>
  );
}
