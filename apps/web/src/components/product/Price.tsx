import { formatPrice } from "@shop/db/utils";
import { cn } from "@/lib/cn";

export function Price({
  price,
  compareAtPrice,
  size = "sm",
}: {
  price: number;
  compareAtPrice: number | null;
  size?: "sm" | "lg";
}) {
  return (
    <div className="flex items-baseline gap-2">
      <span className={cn("font-display font-bold tabular-nums text-ink", size === "sm" ? "text-base" : "text-3xl")}>
        {formatPrice(price)}
      </span>
      {compareAtPrice && compareAtPrice > price && (
        <span className={cn("tabular-nums text-muted line-through", size === "sm" ? "text-xs" : "text-lg")}>
          {formatPrice(compareAtPrice)}
        </span>
      )}
    </div>
  );
}
