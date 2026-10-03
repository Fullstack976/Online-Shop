"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string | null;
  stock: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  hydrated: boolean;
  add: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      hydrated: false,
      add: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, ...item, quantity: Math.min(i.quantity + quantity, item.stock) }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: Math.min(quantity, item.stock) }] };
        }),
      setQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) } : i,
          ),
        })),
      remove: (productId) => set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "shopluxe-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      // Rehydrated from <CartHydrator /> after mount to avoid SSR mismatches.
      skipHydration: true,
      onRehydrateStorage: () => () => useCart.setState({ hydrated: true }),
    },
  ),
);

export const cartCount = (items: CartItem[]) => items.reduce((n, i) => n + i.quantity, 0);
export const cartSubtotal = (items: CartItem[]) =>
  Math.round(items.reduce((s, i) => s + i.price * i.quantity, 0) * 100) / 100;
