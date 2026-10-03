import type { Category, Customer, DashboardStats, Order, OrderStatus, Product } from "./types.ts";
import { ORDER_STATUSES } from "./types.ts";

const DAY = 24 * 60 * 60 * 1000;
const round2 = (n: number) => Math.round(n * 100) / 100;

/** Local-date key (YYYY-MM-DD) for bucketing orders into days. */
export function dayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Derives every dashboard number from raw rows. Shared by the mock and Supabase
 * sources so both produce identical shapes. `orders` should cover at least 60 days.
 */
export function computeDashboardStats(input: {
  orders: Order[];
  products: Product[];
  customers: Customer[];
  categories: Category[];
  now?: number;
}): DashboardStats {
  const now = input.now ?? Date.now();
  const startCurrent = now - 30 * DAY;
  const startPrevious = now - 60 * DAY;

  const counted = input.orders.filter((o) => o.status !== "cancelled");
  const inRange = (o: { createdAt: string }, from: number, to: number) => {
    const t = Date.parse(o.createdAt);
    return t >= from && t < to;
  };
  const current = counted.filter((o) => inRange(o, startCurrent, now + 1));
  const previous = counted.filter((o) => inRange(o, startPrevious, startCurrent));
  const sum = (list: Order[]) => round2(list.reduce((s, o) => s + o.total, 0));

  const revenueCurrent = sum(current);
  const revenuePrevious = sum(previous);

  // Daily buckets for the last 30 days, oldest first, zero-filled.
  const daily = new Map<string, { revenue: number; orders: number }>();
  for (let i = 29; i >= 0; i--) daily.set(dayKey(new Date(now - i * DAY)), { revenue: 0, orders: 0 });
  for (const o of current) {
    const bucket = daily.get(dayKey(new Date(o.createdAt)));
    if (bucket) {
      bucket.revenue = round2(bucket.revenue + o.total);
      bucket.orders += 1;
    }
  }

  const statusCounts = Object.fromEntries(ORDER_STATUSES.map((s) => [s, 0])) as Record<OrderStatus, number>;
  for (const o of input.orders) if (inRange(o, startCurrent, now + 1)) statusCounts[o.status] += 1;

  const productById = new Map(input.products.map((p) => [p.id, p]));
  const categoryById = new Map(input.categories.map((c) => [c.id, c.name]));
  const byCategory = new Map<string, number>();
  const byProduct = new Map<string, DashboardStats["topProducts"][number]>();
  for (const o of current) {
    for (const it of o.items) {
      const line = it.unitPrice * it.quantity;
      const product = it.productId ? productById.get(it.productId) : undefined;
      const cat = (product && categoryById.get(product.categoryId)) ?? "Uncategorized";
      byCategory.set(cat, round2((byCategory.get(cat) ?? 0) + line));
      const key = it.productId ?? it.productName;
      const prev = byProduct.get(key) ?? {
        productId: it.productId,
        name: it.productName,
        imageUrl: product?.images[0] ?? it.imageUrl,
        quantity: 0,
        revenue: 0,
      };
      prev.quantity += it.quantity;
      prev.revenue = round2(prev.revenue + line);
      byProduct.set(key, prev);
    }
  }

  const newCustomers = (from: number, to: number) =>
    input.customers.filter((c) => {
      const t = Date.parse(c.createdAt);
      return t >= from && t < to;
    }).length;

  return {
    revenue: { current: revenueCurrent, previous: revenuePrevious },
    orders: { current: current.length, previous: previous.length },
    customers: { current: newCustomers(startCurrent, now + 1), previous: newCustomers(startPrevious, startCurrent) },
    averageOrderValue: {
      current: current.length ? round2(revenueCurrent / current.length) : 0,
      previous: previous.length ? round2(revenuePrevious / previous.length) : 0,
    },
    daily: [...daily.entries()].map(([date, v]) => ({ date, ...v })),
    statusCounts,
    salesByCategory: [...byCategory.entries()]
      .map(([category, revenue]) => ({ category, revenue }))
      .sort((a, b) => b.revenue - a.revenue),
    topProducts: [...byProduct.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 5),
    recentOrders: [...input.orders].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)).slice(0, 6),
    lowStock: input.products.filter((p) => p.isActive && p.stock <= 10).sort((a, b) => a.stock - b.stock),
    productCount: input.products.length,
  };
}
