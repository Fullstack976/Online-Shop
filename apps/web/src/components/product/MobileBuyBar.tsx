"use client";

import { formatPrice } from "@shop/db/utils";
import type { CartItem } from "@/lib/cart-store";
import { AddToCartButton } from "./AddToCartButton";

/** Price + add-to-cart pinned above the mobile tab bar on product pages. */
export function MobileBuyBar({ product, compareAtPrice }: { product: Omit<CartItem, "quantity">; compareAtPrice: number | null }) {
  return (
    <div
      data-mobile-buybar
      className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-30 border-t border-line bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-lg items-center gap-3">
        <div className="min-w-0">
          <p className="font-display text-lg font-extrabold leading-none tabular-nums text-navy">{formatPrice(product.price)}</p>
          {compareAtPrice && compareAtPrice > product.price && (
            <p className="mt-1 text-xs tabular-nums text-muted line-through">{formatPrice(compareAtPrice)}</p>
          )}
        </div>
        <AddToCartButton product={product} variant="solid" className="h-11 flex-1" />
      </div>
    </div>
  );
}
