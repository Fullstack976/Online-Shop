import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

export function StarRating({ rating, count, size = "sm" }: { rating: number; count?: number; size?: "sm" | "md" }) {
  const icon = size === "sm" ? "size-3.5" : "size-4.5";
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center" role="img" aria-label={`Rated ${rating.toFixed(1)} out of 5`}>
        {Array.from({ length: 5 }, (_, i) => {
          const fill = Math.max(0, Math.min(1, rating - i));
          return (
            <span key={i} className={cn("relative inline-block", icon)}>
              <Star className={cn("absolute inset-0 text-line", icon)} fill="currentColor" strokeWidth={0} />
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className={cn("text-star", icon)} fill="currentColor" strokeWidth={0} />
              </span>
            </span>
          );
        })}
      </div>
      {count !== undefined && <span className={cn("text-muted", size === "sm" ? "text-xs" : "text-sm")}>({count})</span>}
    </div>
  );
}
