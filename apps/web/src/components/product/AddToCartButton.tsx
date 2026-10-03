"use client";

import { useEffect, useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import { useCart, type CartItem } from "@/lib/cart-store";
import { cn } from "@/lib/cn";

type Props = {
  product: Omit<CartItem, "quantity">;
  quantity?: number;
  variant?: "outline" | "solid";
  className?: string;
};

export function AddToCartButton({ product, quantity = 1, variant = "outline", className }: Props) {
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);
  const soldOut = product.stock <= 0;

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1600);
    return () => clearTimeout(t);
  }, [added]);

  return (
    <button
      type="button"
      disabled={soldOut}
      onClick={() => {
        add(product, quantity);
        setAdded(true);
      }}
      className={cn(
        "label-caps inline-flex h-10 w-full items-center justify-center gap-2 rounded-md text-[11px] transition disabled:cursor-not-allowed disabled:opacity-50",
        variant === "outline"
          ? "border border-line bg-white text-navy hover:border-navy hover:bg-navy hover:text-white"
          : "h-12 bg-navy text-xs text-white hover:bg-navy-700",
        added && variant === "outline" && "border-navy bg-navy text-white",
        className,
      )}
    >
      {soldOut ? (
        "Дууссан"
      ) : added ? (
        <>
          <Check className="size-4" aria-hidden /> Нэмэгдлээ
        </>
      ) : (
        <>
          <ShoppingCart className="size-4" aria-hidden /> Сагсанд нэмэх
        </>
      )}
    </button>
  );
}
