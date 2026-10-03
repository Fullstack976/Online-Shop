import type { Metadata } from "next";
import Link from "next/link";
import type { DashboardStats } from "@shop/db";
import { ArrowRight, CircleCheck, DollarSign, Receipt, ShoppingCart, UserPlus } from "lucide-react";
import { CategoryChart } from "@/components/charts/category-chart";
import { RevenueChart } from "@/components/charts/revenue-chart";
import { EmptyState } from "@/components/empty-state";
import { KpiTile } from "@/components/kpi-tile";
import { PageIntro } from "@/components/page-intro";
import { OrderStatusBadge, STATUS_META } from "@/components/status-badge";
import { StockBadge } from "@/components/stock-badge";
import { Thumb } from "@/components/thumb";
import { buttonClass } from "@/components/ui/button";
import { Card, CardHeader, TableScroll, td, th } from "@/components/ui/card";
import { getData } from "@/lib/data";
import { formatDayKey, formatInt, formatPrice, formatRelative, withCount } from "@/lib/format";
import { ORDER_STATUS_LIST } from "@/lib/orders";

export const metadata: Metadata = { title: "Хянах самбар" };

const wholeDollars = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default async function DashboardPage() {
  const data = await getData();
  const stats = await data.getDashboardStats();
  const firstDay = stats.daily[0]?.date;
  const lastDay = stats.daily[stats.daily.length - 1]?.date;

  return (
    <div className="animate-fade-in space-y-6">
      <PageIntro
        actions={
          <Link href="/products/new" className={buttonClass({ variant: "primary" })}>
            Бүтээгдэхүүн нэмэх
          </Link>
        }
      >
        <p className="font-display text-base font-bold text-navy">Тавтай морил</p>
        <p className="mt-0.5">
          Сүүлийн 30 хоногийн
          {firstDay && lastDay ? ` (${formatDayKey(firstDay)} – ${formatDayKey(lastDay)})` : ""} дэлгүүрийн гүйцэтгэлийг
          өмнөх 30 хоногтой харьцуулав.
        </p>
      </PageIntro>

      <section aria-label="Гол үзүүлэлтүүд" className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <KpiTile
          label="Орлого (30 хоног)"
          value={wholeDollars.format(stats.revenue.current)}
          current={stats.revenue.current}
          previous={stats.revenue.previous}
          icon={<DollarSign aria-hidden />}
          previousLabel={`өмнө нь ${wholeDollars.format(stats.revenue.previous)}`}
        />
        <KpiTile
          label="Захиалга"
          value={formatInt(stats.orders.current)}
          current={stats.orders.current}
          previous={stats.orders.previous}
          icon={<ShoppingCart aria-hidden />}
          previousLabel={`өмнө нь ${formatInt(stats.orders.previous)}`}
        />
        <KpiTile
          label="Шинэ үйлчлүүлэгч"
          value={formatInt(stats.customers.current)}
          current={stats.customers.current}
          previous={stats.customers.previous}
          icon={<UserPlus aria-hidden />}
          previousLabel={`өмнө нь ${formatInt(stats.customers.previous)}`}
        />
        <KpiTile
          label="Дундаж захиалгын дүн"
          value={formatPrice(stats.averageOrderValue.current)}
          current={stats.averageOrderValue.current}
          previous={stats.averageOrderValue.previous}
          icon={<Receipt aria-hidden />}
          previousLabel={`өмнө нь ${formatPrice(stats.averageOrderValue.previous)}`}
        />
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Орлогын явц"
            description="Өдөр тутмын орлого, сүүлийн 30 хоног · цуцалсан захиалгыг хассан"
            action={
              <div className="text-right">
                <p className="font-display text-lg font-bold text-navy">{formatPrice(stats.revenue.current)}</p>
                <p className="text-xs text-muted">{withCount(stats.orders.current, "захиалга")}</p>
              </div>
            }
          />
          <div className="px-2 pt-4 pb-2 sm:px-4">
            <RevenueChart data={stats.daily} />
          </div>
          <RevenueTable daily={stats.daily} />
        </Card>

        <StatusBreakdown counts={stats.statusCounts} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Ангиллаар борлуулалт" description="Зарагдсан барааны орлого, сүүлийн 30 хоног" />
          <div className="px-3 pt-4 pb-5 sm:px-5">
            {stats.salesByCategory.length ? (
              <CategoryChart
                data={stats.salesByCategory.map((row) => ({
                  ...row,
                  category: row.category === "Uncategorized" ? "Ангилалгүй" : row.category,
                }))}
              />
            ) : (
              <EmptyState icon={<ShoppingCart />} title="Борлуулалт алга" className="py-10">
                Захиалга ирмэгц ангиллын борлуулалт энд харагдана.
              </EmptyState>
            )}
          </div>
        </Card>

        <TopProducts products={stats.topProducts} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <RecentOrders orders={stats.recentOrders} />
        <LowStock products={stats.lowStock} />
      </div>
    </div>
  );
}

/** Table twin of the revenue chart, so no value is tooltip-only. */
function RevenueTable({ daily }: { daily: DashboardStats["daily"] }) {
  return (
    <details className="group border-t border-line">
      <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-3 text-xs font-semibold text-muted select-none hover:text-ink [&::-webkit-details-marker]:hidden">
        Хүснэгтээр харах
        <ArrowRight className="size-3.5 transition-transform group-open:rotate-90" aria-hidden />
      </summary>
      <TableScroll className="max-h-72 overflow-y-auto border-t border-line">
        <table className="w-full text-sm">
          <caption className="sr-only">Сүүлийн 30 хоногийн өдөр тутмын орлого, захиалга</caption>
          <thead className="sticky top-0 bg-white">
            <tr className="border-b border-line">
              <th scope="col" className={th}>
                Өдөр
              </th>
              <th scope="col" className={`${th} text-right`}>
                Захиалга
              </th>
              <th scope="col" className={`${th} text-right`}>
                Орлого
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {[...daily].reverse().map((d) => (
              <tr key={d.date}>
                <td className={`${td} py-2 text-muted`}>{formatDayKey(d.date)}</td>
                <td className={`${td} py-2 text-right tabular-nums`}>{formatInt(d.orders)}</td>
                <td className={`${td} py-2 text-right font-medium tabular-nums`}>{formatPrice(d.revenue)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableScroll>
    </details>
  );
}

/** Orders by status: one bar per status, all in the order-count colour, every value labelled. */
function StatusBreakdown({ counts }: { counts: DashboardStats["statusCounts"] }) {
  const total = ORDER_STATUS_LIST.reduce((s, k) => s + counts[k], 0);
  const max = Math.max(1, ...ORDER_STATUS_LIST.map((k) => counts[k]));

  return (
    <Card>
      <CardHeader
        title="Төлөв бүрээр захиалга"
        description="Сүүлийн 30 хоногт ирсэн бүх захиалга"
        action={
          <div className="text-right">
            <p className="font-display text-lg font-bold text-navy">{formatInt(total)}</p>
            <p className="text-xs text-muted">захиалга</p>
          </div>
        }
      />
      <ul className="space-y-4 px-5 pt-5 pb-5">
        {ORDER_STATUS_LIST.map((status) => {
          const count = counts[status];
          const share = total ? Math.round((count / total) * 100) : 0;
          return (
            <li key={status}>
              <Link
                href={`/orders?status=${status}`}
                className="group block rounded-lg outline-offset-4"
                title={`${STATUS_META[status].label}: ${count} захиалга (${share}%)`}
              >
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <OrderStatusBadge status={status} />
                  <span className="text-sm tabular-nums">
                    <span className="font-semibold text-ink">{formatInt(count)}</span>
                    <span className="ml-1.5 text-xs text-muted">{share}%</span>
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-chart-2-track" aria-hidden>
                  <div
                    className="h-full rounded-full bg-chart-2 transition-[filter] group-hover:brightness-110"
                    style={{ width: `${count ? Math.max((count / max) * 100, 2) : 0}%` }}
                  />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="border-t border-line px-5 py-3">
        <Link
          href="/orders"
          className="inline-flex items-center gap-1 text-xs font-semibold text-tan-600 hover:text-navy"
        >
          Захиалга удирдах <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </div>
    </Card>
  );
}

function TopProducts({ products }: { products: DashboardStats["topProducts"] }) {
  const max = Math.max(1, ...products.map((p) => p.revenue));
  return (
    <Card>
      <CardHeader title="Шилдэг бүтээгдэхүүн" description="Орлогоор тэргүүлэгчид, сүүлийн 30 хоног" />
      {products.length ? (
        <ol className="divide-y divide-line px-5 pt-2 pb-2">
          {products.map((p, i) => {
            const inner = (
              <>
                <span className="w-4 shrink-0 text-center font-display text-xs font-bold text-subtle">{i + 1}</span>
                <Thumb src={p.imageUrl} alt="" size={44} eager={i < 3} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink group-hover:text-tan-600">{p.name}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-chart-1-track" aria-hidden>
                      <div
                        className="h-full rounded-full bg-chart-1"
                        style={{ width: `${(p.revenue / max) * 100}%` }}
                      />
                    </div>
                    <span className="shrink-0 text-xs text-muted tabular-nums">
                      {formatInt(p.quantity)} ш зарагдсан
                    </span>
                  </div>
                </div>
                <span className="shrink-0 text-sm font-semibold text-ink tabular-nums">{formatPrice(p.revenue)}</span>
              </>
            );
            return (
              <li key={p.productId ?? p.name}>
                {p.productId ? (
                  <Link href={`/products/${p.productId}`} className="group flex items-center gap-3 py-3">
                    {inner}
                  </Link>
                ) : (
                  <div className="flex items-center gap-3 py-3">{inner}</div>
                )}
              </li>
            );
          })}
        </ol>
      ) : (
        <EmptyState icon={<ShoppingCart />} title="Борлуулалт алга">
          Захиалга ирмэгц хамгийн их зарагдсан бараа энд харагдана.
        </EmptyState>
      )}
    </Card>
  );
}

function RecentOrders({ orders }: { orders: DashboardStats["recentOrders"] }) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader
        title="Сүүлийн захиалгууд"
        description="Бүх төлөвийн хамгийн сүүлийн захиалгууд"
        action={
          <Link href="/orders" className={buttonClass({ variant: "secondary", size: "sm" })}>
            Бүгдийг харах
          </Link>
        }
      />
      <TableScroll className="mt-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-line bg-page/60">
              <th scope="col" className={th}>
                Захиалга
              </th>
              <th scope="col" className={th}>
                Үйлчлүүлэгч
              </th>
              <th scope="col" className={th}>
                Хугацаа
              </th>
              <th scope="col" className={`${th} text-right`}>
                Нийт
              </th>
              <th scope="col" className={th}>
                Төлөв
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {orders.map((o) => (
              <tr key={o.id} className="transition-colors hover:bg-page/60">
                <td className={td}>
                  <Link href={`/orders/${o.id}`} className="font-semibold text-navy hover:text-tan-600">
                    {o.orderNumber}
                  </Link>
                </td>
                <td className={td}>
                  <p className="font-medium text-ink">{o.customerName}</p>
                  <p className="text-xs text-muted">{o.city}</p>
                </td>
                <td className={`${td} text-muted`}>{formatRelative(o.createdAt)}</td>
                <td className={`${td} text-right font-semibold tabular-nums`}>{formatPrice(o.total)}</td>
                <td className={td}>
                  <OrderStatusBadge status={o.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableScroll>
    </Card>
  );
}

function LowStock({ products }: { products: DashboardStats["lowStock"] }) {
  return (
    <Card>
      <CardHeader
        title="Нөөц багассан"
        description="10 ба түүнээс цөөн үлдсэн идэвхтэй бүтээгдэхүүн"
        action={
          products.length ? (
            <span className="rounded-full bg-warning-bg px-2 py-0.5 text-xs font-semibold text-warning tabular-nums">
              {products.length}
            </span>
          ) : null
        }
      />
      {products.length ? (
        <ul className="divide-y divide-line px-5 pt-2 pb-2">
          {products.slice(0, 8).map((p) => (
            <li key={p.id}>
              <Link href={`/products/${p.id}`} className="group flex items-center gap-3 py-3">
                <Thumb src={p.images[0]} alt="" size={40} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink group-hover:text-tan-600">{p.name}</p>
                  <p className="text-xs text-muted">Засах, нөөц нэмэх</p>
                </div>
                <StockBadge stock={p.stock} />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState icon={<CircleCheck />} title="Нөөц хангалттай">
          Нөөц багассан идэвхтэй бүтээгдэхүүн алга.
        </EmptyState>
      )}
      {products.length > 8 ? (
        <div className="border-t border-line px-5 py-3">
          <Link
            href="/products?status=low"
            className="inline-flex items-center gap-1 text-xs font-semibold text-tan-600 hover:text-navy"
          >
            Бүгдийг харах ({products.length}) <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>
      ) : null}
    </Card>
  );
}
