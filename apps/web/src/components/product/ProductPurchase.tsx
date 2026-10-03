"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Zap } from "lucide-react";
import { useCart, type CartItem } from "@/lib/cart-store";
import { AddToCartButton } from "./AddToCartButton";
import { QuantityInput } from "./QuantityInput";

export function ProductPurchase({ product }: { product: Omit<CartItem, "quantity"> }) {
  const [qty, setQty] = useState(1);
  const add = useCart((s) => s.add);
  const router = useRouter();
  const soldOut = product.stock <= 0;

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        {!soldOut && <QuantityInput value={qty} max={product.stock} onChange={setQty} />}
        <AddToCartButton product={product} quantity={qty} variant="solid" className="flex-1" />
      </div>
      {!soldOut && (
        <button
          type="button"
          onClick={() => {
            add(product, qty);
            router.push("/checkout");
          }}
          className="label-caps inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-tan text-xs text-white transition hover:bg-tan-600"
        >
          <Zap className="size-4" aria-hidden /> Шууд худалдан авах
        </button>
      )}
    </div>
  );
}
