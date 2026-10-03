import type { Metadata } from "next";
import Link from "next/link";
import type { OrderStatus } from "@shop/db";
import { ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { SearchInput } from "@/components/filters";
import { param } from "@/components/notice";
import { PageIntro } from "@/components/page-intro";
import { OrderStatusBadge, STATUS_META } from "@/components/status-badge";
import { buttonClass } from "@/components/ui/button";
import { Card, TableScroll, td, th } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { getData } from "@/lib/data";
import { formatDate, formatInt, formatPrice, withCount } from "@/lib/format";
import { isOrderStatus, ORDER_STATUS_LIST } from "@/lib/orders";

export const metadata: Metadata = { title: "Захиалга" };

const PAGE_SIZE = 25;

function ordersHref(status: OrderStatus | null, q: string, page = 1) {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (q) params.set("q", q);
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `/orders?${query}` : "/orders";
}

export default async function OrdersPage({ searchParams }: PageProps<"/orders">) {
  const sp = await searchParams;
  const q = param(sp.q);
  const rawStatus = param(sp.status);
  const status = isOrderStatus(rawStatus) ? rawStatus : null;

  const data = await getData();
  // One query for the search; tab counts and the status filter are derived from it.
  const matching = await data.listOrders(q ? { q } : {});
  const counts = Object.fromEntries(ORDER_STATUS_LIST.map((s) => [s, 0])) as Record<OrderStatus, number>;
  for (const o of matching) counts[o.status] += 1;
  const orders = status ? matching.filter((o) => o.status === status) : matching;
  const revenue = orders.filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);

  const pageCount = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number.parseInt(param(sp.page), 10) || 1), pageCount);
  const visible = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const tabs: { key: OrderStatus | null; label: string; count: number }[] = [
    { key: null, label: "Бүгд", count: matching.length },
    ...ORDER_STATUS_LIST.map((s) => ({ key: s, label: STATUS_META[s].label, count: counts[s] })),
  ];

  return (
    <div className="animate-fade-in">
      <PageIntro>
        {status ? `${STATUS_META[status].label}: ` : ""}
        {withCount(orders.length, "захиалга")}
        {q ? ` (“${q}” хайлтаар)` : ""} · борлуулалт {formatPrice(revenue)}
        {status === "cancelled" ? "" : " (цуцалсныг хассан)"}.
      </PageIntro>

      <Card>
        <div className="border-b border-line">
          <nav aria-label="Төлөвөөр шүүх" className="no-scrollbar -mb-px flex gap-1 overflow-x-auto px-3 pt-2">
            {tabs.map((tab) => {
              const active = tab.key === status;
              return (
                <Link
                  key={tab.key ?? "all"}
                  href={ordersHref(tab.key, q)}
                  scroll={false}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-sm font-semibold whitespace-nowrap transition-colors",
                    active ? "border-tan text-navy" : "border-transparent text-muted hover:text-ink",
                  )}
                >
                  {tab.label}
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-px text-[11px] tabular-nums",
                      active ? "bg-navy text-white" : "bg-page text-muted",
                    )}
                  >
                    {formatInt(tab.count)}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-b border-line p-4">
          <SearchInput placeholder="Захиалгын №, нэр эсвэл имэйлээр хайх" label="Захиалга хайх" className="max-w-xl" />
        </div>

        {orders.length ? (
          <TableScroll>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line bg-page/60">
                  <th scope="col" className={th}>
                    Захиалга
                  </th>
                  <th scope="col" className={th}>
                    Огноо
                  </th>
                  <th scope="col" className={th}>
                    Үйлчлүүлэгч
                  </th>
                  <th scope="col" className={`${th} text-right`}>
                    Бараа
                  </th>
                  <th scope="col" className={`${th} text-right`}>
                    Нийт
                  </th>
                  <th scope="col" className={th}>
                    Төлөв
                  </th>
                  <th scope="col" className={th}>
                    <span className="sr-only">Нээх</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {visible.map((o) => {
                  const items = o.items.reduce((s, i) => s + i.quantity, 0);
                  return (
                    <tr key={o.id} className="group transition-colors hover:bg-page/60">
                      <td className={td}>
                        <Link href={`/orders/${o.id}`} className="font-semibold text-navy group-hover:text-tan-600">
                          {o.orderNumber}
                        </Link>
                      </td>
                      <td className={`${td} text-muted`}>{formatDate(o.createdAt)}</td>
                      <td className={td}>
                        <p className="font-medium text-ink">{o.customerName}</p>
                        <p className="text-xs text-muted">{o.email}</p>
                      </td>
                      <td className={`${td} text-right text-muted tabular-nums`}>{formatInt(items)}</td>
                      <td className={`${td} text-right font-semibold tabular-nums`}>{formatPrice(o.total)}</td>
                      <td className={td}>
                        <OrderStatusBadge status={o.status} />
                      </td>
                      <td className={`${td} text-right`}>
                        <Link
                          href={`/orders/${o.id}`}
                          className={buttonClass({ variant: "ghost", size: "icon" })}
                          aria-label={`${o.orderNumber} захиалгыг нээх`}
                        >
                          <ChevronRight aria-hidden />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </TableScroll>
        ) : null}

        {orders.length ? (
          <nav
            aria-label="Хуудаслалт"
            className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-3 text-xs text-muted"
          >
            <p className="tabular-nums">
              {formatInt((page - 1) * PAGE_SIZE + 1)}–{formatInt((page - 1) * PAGE_SIZE + visible.length)} / нийт{" "}
              {formatInt(orders.length)}
            </p>
            {pageCount > 1 ? (
              <div className="flex items-center gap-2">
                <PageLink href={page > 1 ? ordersHref(status, q, page - 1) : null} label="Өмнөх" direction="prev" />
                <span className="tabular-nums">
                  {page} / {pageCount} хуудас
                </span>
                <PageLink
                  href={page < pageCount ? ordersHref(status, q, page + 1) : null}
                  label="Дараах"
                  direction="next"
                />
              </div>
            ) : null}
          </nav>
        ) : (
          <EmptyState
            icon={<SearchX />}
            title="Захиалга олдсонгүй"
            action={
              q || status ? (
                <Link href="/orders" className={buttonClass({ variant: "secondary" })}>
                  Шүүлтүүр арилгах
                </Link>
              ) : null
            }
          >
            {q || status ? "Өөр хайлт эсвэл төлөв сонгоно уу." : "Дэлгүүрээс ирсэн захиалгууд энд харагдана."}
          </EmptyState>
        )}
      </Card>
    </div>
  );
}

function PageLink({ href, label, direction }: { href: string | null; label: string; direction: "prev" | "next" }) {
  const content = (
    <>
      {direction === "prev" ? <ChevronLeft aria-hidden /> : null}
      {label}
      {direction === "next" ? <ChevronRight aria-hidden /> : null}
    </>
  );
  return href ? (
    <Link href={href} className={buttonClass({ variant: "secondary", size: "sm" })}>
      {content}
    </Link>
  ) : (
    <span
      aria-disabled
      className={cn(buttonClass({ variant: "secondary", size: "sm" }), "pointer-events-none opacity-50")}
    >
      {content}
    </span>
  );
}
