"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart-store";

/** Loads the persisted cart from localStorage once the app has mounted. */
export function CartHydrator() {
  useEffect(() => {
    void useCart.persist.rehydrate();
  }, []);
  return null;
}
