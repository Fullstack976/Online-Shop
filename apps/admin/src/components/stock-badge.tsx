import { TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatInt } from "@/lib/format";
import { LOW_STOCK_THRESHOLD } from "@/lib/orders";

/** Stock count; amber when low, red when (almost) gone. Always labelled, never colour alone. */
export function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) {
    return (
      <Badge tone="danger" icon={<TriangleAlert aria-hidden />}>
        Out of stock
      </Badge>
    );
  }
  if (stock <= 3) {
    return (
      <Badge tone="danger" icon={<TriangleAlert aria-hidden />}>
        {formatInt(stock)} left
      </Badge>
    );
  }
  if (stock <= LOW_STOCK_THRESHOLD) {
    return <Badge tone="warning">{formatInt(stock)} · Low</Badge>;
  }
  return <span className="text-sm text-ink tabular-nums">{formatInt(stock)}</span>;
}
