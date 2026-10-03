import { CircleCheck, CircleX, Clock, Package, Truck } from "lucide-react";
import type { OrderStatus } from "@shop/db";
import { Badge, type Tone } from "@/components/ui/badge";
import { ORDER_STATUS_LABEL } from "@/lib/orders";

export const STATUS_META: Record<OrderStatus, { label: string; tone: Tone; Icon: typeof Clock }> = {
  pending: { label: ORDER_STATUS_LABEL.pending, tone: "warning", Icon: Clock },
  processing: { label: ORDER_STATUS_LABEL.processing, tone: "info", Icon: Package },
  shipped: { label: ORDER_STATUS_LABEL.shipped, tone: "violet", Icon: Truck },
  delivered: { label: ORDER_STATUS_LABEL.delivered, tone: "success", Icon: CircleCheck },
  cancelled: { label: ORDER_STATUS_LABEL.cancelled, tone: "danger", Icon: CircleX },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, tone, Icon } = STATUS_META[status];
  return (
    <Badge tone={tone} icon={<Icon aria-hidden />}>
      {label}
    </Badge>
  );
}
