import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import type { OrderStatus } from "@shop/db";
import { ArrowLeft, Check, Mail, MapPin, Phone } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { OrderStatusBadge, STATUS_META } from "@/components/status-badge";
import { Thumb } from "@/components/thumb";
import { buttonClass } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { getData } from "@/lib/data";
import { formatDateTime, formatInt, formatPrice, withCount } from "@/lib/format";
import { UUID_PATTERN } from "@/lib/validation";
import { StatusForm } from "./status-form";

const loadOrder = cache(async (id: string) => {
  if (!UUID_PATTERN.test(id)) return null;
  const data = await getData();
  return data.getOrder(id);
});

export async function generateMetadata({ params }: PageProps<"/orders/[id]">): Promise<Metadata> {
  const { id } = await params;
  const order = await loadOrder(id);
  return { title: order ? `Захиалга ${order.orderNumber}` : "Захиалга олдсонгүй" };
}

const FLOW: OrderStatus[] = ["pending", "processing", "shipped", "delivered"];

export default async function OrderPage({ params }: PageProps<"/orders/[id]">) {
  const { id } = await params;
  const order = await loadOrder(id);
  if (!order) notFound();

  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
  const step = FLOW.indexOf(order.status);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-display text-xl font-bold tracking-tight text-navy">Захиалга {order.orderNumber}</h2>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="mt-1 text-sm text-muted">
            {formatDateTime(order.createdAt)} · {withCount(itemCount, "ширхэг бараа")}
          </p>
        </div>
        <Link href="/orders" className={buttonClass({ variant: "secondary", size: "sm" })}>
          <ArrowLeft aria-hidden /> Бүх захиалга
        </Link>
      </div>

      {/* Fulfilment progress */}
      <Card className="px-5 py-4">
        {order.status === "cancelled" ? (
          <p className="text-sm text-danger">
            <span className="font-semibold">Энэ захиалга цуцлагдсан.</span>{" "}
            <span className="text-muted">Орлого, борлуулалтын тайланд тооцогдохгүй.</span>
          </p>
        ) : (
          <ol className="grid grid-cols-4 gap-2" aria-label="Захиалгын явц">
            {FLOW.map((s, i) => {
              const done = i <= step;
              const Icon = STATUS_META[s].Icon;
              return (
                <li key={s} className="min-w-0" aria-current={i === step ? "step" : undefined}>
                  <div className={cn("h-1.5 rounded-full", done ? "bg-navy" : "bg-line")} />
                  <p
                    className={cn(
                      "mt-2 flex items-center gap-1.5 truncate text-xs font-semibold",
                      done ? "text-navy" : "text-subtle",
                    )}
                  >
                    {i < step ? (
                      <Check className="size-3.5 shrink-0 text-success" aria-hidden />
                    ) : (
                      <Icon className="size-3.5 shrink-0" aria-hidden />
                    )}
                    {STATUS_META[s].label}
                  </p>
                </li>
              );
            })}
          </ol>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden lg:col-span-2 lg:self-start">
          <CardHeader title="Бараа" description={`Энэ захиалгад ${withCount(itemCount, "ширхэг")}`} />
          <ul className="mt-3 divide-y divide-line border-t border-line">
            {order.items.map((item) => {
              const body = (
                <>
                  <Thumb src={item.imageUrl} alt="" size={56} eager />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{item.productName}</p>
                    <p className="mt-0.5 text-xs text-muted tabular-nums">
                      {formatPrice(item.unitPrice)} × {formatInt(item.quantity)}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-ink tabular-nums">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </p>
                </>
              );
              return (
                <li key={item.id}>
                  {item.productId ? (
                    <Link
                      href={`/products/${item.productId}`}
                      className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-page/60"
                    >
                      {body}
                    </Link>
                  ) : (
                    <div className="flex items-center gap-4 px-5 py-3.5">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
          <dl className="space-y-2 border-t border-line bg-page/40 px-5 py-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Барааны дүн</dt>
              <dd className="tabular-nums">{formatPrice(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Хүргэлт</dt>
              <dd className="tabular-nums">{order.shipping ? formatPrice(order.shipping) : "Үнэгүй"}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-line pt-2 text-base">
              <dt className="font-display font-bold text-navy">Нийт дүн</dt>
              <dd className="font-display font-bold text-navy tabular-nums">{formatPrice(order.total)}</dd>
            </div>
          </dl>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Төлөв шинэчлэх" />
            <div className="p-5">
              <StatusForm orderId={order.id} current={order.status} />
            </div>
          </Card>

          <Card>
            <CardHeader title="Үйлчлүүлэгч" />
            <div className="space-y-3 p-5 text-sm">
              <div className="flex items-center gap-3">
                <Avatar name={order.customerName} size={40} />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">{order.customerName}</p>
                  <p className="text-xs text-muted">
                    {order.customerId ? "Бүртгэлтэй үйлчлүүлэгч" : "Зочноор захиалсан"}
                  </p>
                </div>
              </div>
              <p className="flex items-center gap-2 text-muted">
                <Mail className="size-4 shrink-0 text-subtle" aria-hidden />
                <a href={`mailto:${order.email}`} className="truncate text-navy hover:text-tan-600">
                  {order.email}
                </a>
              </p>
              <p className="flex items-center gap-2 text-muted">
                <Phone className="size-4 shrink-0 text-subtle" aria-hidden />
                {order.phone ? (
                  <a href={`tel:${order.phone}`} className="text-navy hover:text-tan-600">
                    {order.phone}
                  </a>
                ) : (
                  <span>Утасны дугааргүй</span>
                )}
              </p>
            </div>
          </Card>

          <Card>
            <CardHeader title="Хүргэлтийн хаяг" />
            <div className="flex gap-2 p-5 text-sm">
              <MapPin className="mt-0.5 size-4 shrink-0 text-tan" aria-hidden />
              <address className="not-italic leading-relaxed text-ink">
                {order.customerName}
                <br />
                {order.address}
                <br />
                {order.city}
              </address>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
