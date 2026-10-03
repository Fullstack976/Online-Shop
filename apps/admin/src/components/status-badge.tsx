import { CircleCheck, CircleX, Clock, Package, Truck } from "lucide-react";
import type { OrderStatus } from "@shop/db";
import { Badge, type Tone } from "@/components/ui/badge";

export const STATUS_META: Record<OrderStatus, { label: string; tone: Tone; Icon: typeof Clock }> = {
  pending: { label: "Pending", tone: "warning", Icon: Clock },
  processing: { label: "Processing", tone: "info", Icon: Package },
  shipped: { label: "Shipped", tone: "violet", Icon: Truck },
  delivered: { label: "Delivered", tone: "success", Icon: CircleCheck },
  cancelled: { label: "Cancelled", tone: "danger", Icon: CircleX },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, tone, Icon } = STATUS_META[status];
  return (
    <Badge tone={tone} icon={<Icon aria-hidden />}>
      {label}
    </Badge>
  );
}
