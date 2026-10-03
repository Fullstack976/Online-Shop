"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { Banknote, CreditCard, Lock } from "lucide-react";
import { formatPrice } from "@shop/db/utils";
import { placeOrderAction, type CheckoutState } from "@/app/actions";
import { cartSubtotal, useCart } from "@/lib/cart-store";
import { cn } from "@/lib/cn";
import { OrderSummary } from "./OrderSummary";

const fields = [
  { name: "name", label: "Овог нэр", autoComplete: "name", type: "text", span: true },
  { name: "email", label: "Имэйл", autoComplete: "email", type: "email" },
  { name: "phone", label: "Утас (заавал биш)", autoComplete: "tel", type: "tel" },
  { name: "address", label: "Хаяг (дүүрэг, хороо, байр, тоот)", autoComplete: "street-address", type: "text", span: true },
  { name: "city", label: "Хот / аймаг", autoComplete: "address-level2", type: "text", span: true },
] as const;

export function CheckoutForm() {
  const { items, hydrated } = useCart();
  const [state, action, pending] = useActionState<CheckoutState, FormData>(placeOrderAction, {});

  if (!hydrated) return <div className="h-96 animate-pulse rounded-xl bg-cloud" />;

  if (!items.length) {
    return (
      <div className="py-16 text-center">
        <p className="font-display text-xl font-bold text-navy">Таны сагс хоосон байна</p>
        <Link href="/shop" className="label-caps mt-5 inline-flex h-11 items-center rounded-md bg-navy px-5 text-white">
          Дэлгүүр рүү буцах
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-8 lg:grid-cols-[1fr_380px]" noValidate>
      <input type="hidden" name="items" value={JSON.stringify(items.map((i) => ({ productId: i.productId, quantity: i.quantity })))} />
      <div className="space-y-8">
        <section className="rounded-xl border border-line p-6">
          <h2 className="font-display text-base font-extrabold uppercase tracking-wide text-navy">Хүргэлтийн мэдээлэл</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {fields.map((f) => {
              const error = state.fieldErrors?.[f.name];
              return (
                <div key={f.name} className={cn("span" in f && f.span && "sm:col-span-2")}>
                  <label htmlFor={f.name} className="mb-1.5 block text-xs font-semibold text-ink">
                    {f.label}
                  </label>
                  <input
                    id={f.name}
                    name={f.name}
                    type={f.type}
                    autoComplete={f.autoComplete}
                    defaultValue={state.values?.[f.name]}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `${f.name}-error` : undefined}
                    className={cn(
                      "h-11 w-full rounded-md border px-3.5 text-sm outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/10",
                      error ? "border-red-400" : "border-line",
                    )}
                  />
                  {error && (
                    <p id={`${f.name}-error`} className="mt-1 text-xs text-red-600">
                      {error}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-xl border border-line p-6">
          <h2 className="font-display text-base font-extrabold uppercase tracking-wide text-navy">Төлбөр</h2>
          <div className="mt-5 grid gap-3">
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-navy p-4">
              <input type="radio" name="payment" value="cod" defaultChecked className="accent-navy" />
              <Banknote className="size-5 text-navy" aria-hidden />
              <span className="text-sm font-semibold">Хүргэлтээр бэлнээр төлөх</span>
            </label>
            <label className="flex cursor-not-allowed items-center gap-3 rounded-lg border border-line p-4 opacity-60">
              <input type="radio" name="payment" value="card" disabled />
              <CreditCard className="size-5 text-navy" aria-hidden />
              <span className="text-sm font-semibold">Картаар төлөх</span>
              <span className="ml-auto rounded-full bg-cloud px-2 py-0.5 text-[10px] font-bold uppercase text-muted">Тун удахгүй</span>
            </label>
          </div>
        </section>
      </div>

      <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <ul className="space-y-3 rounded-xl border border-line p-5">
          {items.map((i) => (
            <li key={i.productId} className="flex items-center gap-3">
              <span className="relative size-14 shrink-0 overflow-hidden rounded-md bg-cloud">
                {i.image && <Image src={i.image} alt="" fill sizes="56px" className="object-cover" />}
                <span className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-navy text-[10px] font-bold text-white">
                  {i.quantity}
                </span>
              </span>
              <span className="min-w-0 flex-1 truncate text-sm">{i.name}</span>
              <span className="text-sm font-semibold tabular-nums">{formatPrice(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <OrderSummary subtotal={cartSubtotal(items)}>
          {state.error && (
            <p role="alert" className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
              {state.error}
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="label-caps mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-navy text-white transition hover:bg-navy-700 disabled:opacity-60"
          >
            <Lock className="size-4" aria-hidden /> {pending ? "Захиалж байна…" : "Захиалга өгөх"}
          </button>
          <p className="mt-3 text-center text-xs text-muted">Үнийг захиалга өгөх үед манай сервер дээр дахин баталгаажуулна.</p>
        </OrderSummary>
      </div>
    </form>
  );
}
