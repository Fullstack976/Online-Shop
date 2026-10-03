import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogOut, Package, UserRound } from "lucide-react";
import type { OrderStatus } from "@shop/db";
import { isSupabaseConfigured } from "@shop/db/env";
import { formatPrice } from "@shop/db/utils";
import { signOutAction } from "@/app/auth/actions";
import { PageHeader } from "@/components/ui/PageHeader";
import { cn } from "@/lib/cn";
import { getSessionData } from "@/lib/data";
import { getSupabase, getUser, isAdminUser } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Миний бүртгэл" };

const STATUS: Record<OrderStatus, { label: string; className: string }> = {
  pending: { label: "Хүлээгдэж буй", className: "bg-amber-50 text-amber-700" },
  processing: { label: "Боловсруулж буй", className: "bg-sky-50 text-sky-700" },
  shipped: { label: "Илгээсэн", className: "bg-indigo-50 text-indigo-700" },
  delivered: { label: "Хүргэгдсэн", className: "bg-emerald-50 text-emerald-700" },
  cancelled: { label: "Цуцалсан", className: "bg-red-50 text-red-700" },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("mn-MN", { year: "numeric", month: "long", day: "numeric" });

export default async function AccountPage() {
  if (!isSupabaseConfigured()) {
    return (
      <>
        <PageHeader title="Миний бүртгэл" crumbs={[{ label: "Миний бүртгэл" }]} />
        <div className="container-page py-16 text-center text-muted">Demo горимд бүртгэл идэвхгүй байна.</div>
      </>
    );
  }

  const user = await getUser();
  if (!user) redirect("/login?next=/account");
  const supabase = await getSupabase();
  if (supabase && (await isAdminUser(supabase, user.id))) redirect("/auth/to-admin");

  const meta = (user.user_metadata ?? {}) as { full_name?: string; name?: string; avatar_url?: string };
  const name = meta.full_name || meta.name || user.email?.split("@")[0] || "Хэрэглэгч";
  let orders: Awaited<ReturnType<Awaited<ReturnType<typeof getSessionData>>["listOrders"]>> = [];
  let loadFailed = false;
  try {
    orders = await (await getSessionData()).listOrders({ userId: user.id });
  } catch {
    loadFailed = true;
  }

  return (
    <>
      <PageHeader title="Миний бүртгэл" crumbs={[{ label: "Миний бүртгэл" }]} />
      <div className="container-page grid gap-8 py-10 lg:grid-cols-[300px_1fr]">
        <aside className="h-fit rounded-2xl border border-line p-6">
          <div className="flex items-center gap-4">
            {meta.avatar_url ? (
              <Image src={meta.avatar_url} alt="" width={56} height={56} unoptimized className="size-14 rounded-full object-cover" />
            ) : (
              <span className="grid size-14 place-items-center rounded-full bg-beige">
                <UserRound className="size-7 text-navy" strokeWidth={1.5} aria-hidden />
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate font-display text-lg font-bold text-navy">{name}</p>
              <p className="truncate text-sm text-muted">{user.email}</p>
            </div>
          </div>
          <dl className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Нийт захиалга</dt>
              <dd className="font-semibold">{orders.length}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Бүртгүүлсэн</dt>
              <dd className="font-semibold">{formatDate(user.created_at)}</dd>
            </div>
          </dl>
          <form action={signOutAction} className="mt-6">
            <button
              type="submit"
              className="label-caps inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-line text-navy transition hover:border-navy"
            >
              <LogOut className="size-4" aria-hidden /> Гарах
            </button>
          </form>
        </aside>

        <section>
          <h2 className="font-display text-lg font-extrabold uppercase tracking-wide text-navy">Миний захиалгууд</h2>
          {loadFailed && (
            <p className="mt-4 rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Захиалгын түүхийг одоогоор ачаалж чадсангүй. Түр хүлээгээд дахин оролдоно уу.
            </p>
          )}
          {orders.length === 0 && !loadFailed ? (
            <div className="mt-4 rounded-2xl border border-dashed border-line px-6 py-14 text-center">
              <Package className="mx-auto size-10 text-tan" strokeWidth={1.4} aria-hidden />
              <p className="mt-4 font-display font-bold text-navy">Танд одоогоор захиалга алга</p>
              <p className="mt-1 text-sm text-muted">Дуртай бараагаа сагсанд нэмээд анхны захиалгаа өгөөрэй.</p>
              <Link href="/shop" className="label-caps mt-6 inline-flex h-11 items-center rounded-md bg-navy px-5 text-white hover:bg-navy-700">
                Дэлгүүр үзэх
              </Link>
            </div>
          ) : (
            <ul className="mt-4 space-y-4">
              {orders.map((order) => (
                <li key={order.id} className="rounded-2xl border border-line p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-display font-bold text-navy">#{order.orderNumber}</p>
                      <p className="text-xs text-muted">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", STATUS[order.status].className)}>
                        {STATUS[order.status].label}
                      </span>
                      <span className="font-display font-bold tabular-nums">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                  <ul className="mt-4 divide-y divide-line border-t border-line">
                    {order.items.map((item) => (
                      <li key={item.id} className="flex items-center gap-3 py-3">
                        <span className="relative size-12 shrink-0 overflow-hidden rounded-md bg-cloud">
                          {item.imageUrl && <Image src={item.imageUrl} alt="" fill sizes="48px" className="object-cover" />}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-sm">{item.productName}</span>
                        <span className="text-xs text-muted">× {item.quantity}</span>
                        <span className="w-20 text-right text-sm font-semibold tabular-nums">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs text-muted">
                    Хүргэлтийн хаяг: {order.address}, {order.city}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
