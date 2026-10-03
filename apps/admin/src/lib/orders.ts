import type { OrderStatus } from "@shop/db";

/**
 * Client-safe copy of `ORDER_STATUSES` (the original lives in the `@shop/db`
 * root, which must not be imported at runtime from client components).
 */
export const ORDER_STATUS_LIST: readonly OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Хүлээгдэж буй",
  processing: "Боловсруулж буй",
  shipped: "Илгээсэн",
  delivered: "Хүргэгдсэн",
  cancelled: "Цуцалсан",
};

export function isOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === "string" && (ORDER_STATUS_LIST as readonly string[]).includes(value);
}

export const LOW_STOCK_THRESHOLD = 10;
