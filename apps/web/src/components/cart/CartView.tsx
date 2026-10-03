"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import { formatPrice } from "@shop/db/utils";
import { cartSubtotal, useCart } from "@/lib/cart-store";
import { QuantityInput } from "@/components/product/QuantityInput";
import { OrderSummary } from "./OrderSummary";

export function CartView() {
  const { items, hydrated, setQuantity, remove } = useCart();

  if (!hydrated) {
    return <div className="h-64 animate-pulse rounded-xl bg-cloud" aria-label="Сагс ачаалж байна" />;
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <span className="mx-auto grid size-20 place-items-center rounded-full bg-cloud">
          <ShoppingBag className="size-9 text-navy" strokeWidth={1.4} aria-hidden />
        </span>
        <h2 className="mt-6 font-display text-2xl font-extrabold text-navy">Таны сагс хоосон байна</h2>
        <p className="mt-2 text-sm text-muted">Та одоохондоо юу ч нэмээгүй байна. Дэлгүүр хэсгээс сонголтоо хийгээрэй!</p>
        <Link href="/shop" className="label-caps mt-6 inline-flex h-12 items-center gap-2 rounded-md bg-navy px-6 text-white hover:bg-navy-700">
          Худалдан авалт эхлэх <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        <ul className="divide-y divide-line rounded-xl border border-line">
          {items.map((item) => (
            <li key={item.productId} className="flex gap-4 p-4 sm:p-5">
              <Link href={`/product/${item.slug}`} className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-cloud sm:size-28">
                {item.image && <Image src={item.image} alt={item.name} fill sizes="112px" className="object-cover" />}
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <Link href={`/product/${item.slug}`} className="font-semibold text-ink hover:text-tan">
                    {item.name}
                  </Link>
                  <p className="font-display font-bold tabular-nums">{formatPrice(item.price * item.quantity)}</p>
                </div>
                <p className="mt-1 text-xs text-muted">{formatPrice(item.price)} / ширхэг</p>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <QuantityInput size="sm" value={item.quantity} max={item.stock} onChange={(n) => setQuantity(item.productId, n)} />
                  <button
                    type="button"
                    onClick={() => remove(item.productId)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-red-600"
                  >
                    <Trash2 className="size-4" aria-hidden /> Хасах
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <Link href="/shop" className="label-caps mt-5 inline-flex items-center gap-2 text-[11px] text-navy hover:text-tan">
          <ArrowLeft className="size-4" aria-hidden /> Дэлгүүр рүү буцах
        </Link>
      </div>
      <div className="lg:sticky lg:top-24 lg:self-start">
        <OrderSummary subtotal={cartSubtotal(items)}>
          <Link
            href="/checkout"
            className="label-caps mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-navy text-white transition hover:bg-navy-700"
          >
            Захиалга хийх <ArrowRight className="size-4" aria-hidden />
          </Link>
        </OrderSummary>
      </div>
    </div>
  );
}
