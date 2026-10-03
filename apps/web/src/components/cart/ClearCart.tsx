"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart-store";

/** Empties the cart once the persisted state has loaded (used after a successful order). */
export function ClearCart() {
  const hydrated = useCart((s) => s.hydrated);
  const clear = useCart((s) => s.clear);
  useEffect(() => {
    if (hydrated) clear();
  }, [hydrated, clear]);
  return null;
}
