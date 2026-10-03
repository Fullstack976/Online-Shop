"use client";

import { FREE_SHIPPING_THRESHOLD, formatPrice, shippingFor } from "@shop/db/utils";

export function OrderSummary({ subtotal, children }: { subtotal: number; children?: React.ReactNode }) {
  const shipping = shippingFor(subtotal);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="rounded-xl border border-line bg-white p-6">
      <h2 className="font-display text-base font-extrabold uppercase tracking-wide text-navy">Order summary</h2>
      <div className="mt-4 rounded-lg bg-cloud p-3">
        <p className="text-xs text-ink/80">
          {remaining > 0 ? (
            <>
              Add <strong className="text-navy">{formatPrice(remaining)}</strong> more for <strong>free shipping</strong>.
            </>
          ) : (
            <>🎉 You&apos;ve unlocked <strong>free shipping</strong>!</>
          )}
        </p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-tan transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <dl className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd className="font-semibold tabular-nums">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Shipping</dt>
          <dd className="font-semibold tabular-nums">{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
        </div>
        <div className="flex justify-between border-t border-line pt-3 text-base">
          <dt className="font-bold text-navy">Total</dt>
          <dd className="font-display font-extrabold tabular-nums text-navy">{formatPrice(subtotal + shipping)}</dd>
        </div>
      </dl>
      {children}
    </div>
  );
}
