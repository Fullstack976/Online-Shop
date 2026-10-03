import type { Category, Customer, Order, Product } from "../types.ts";
import { buildProducts, categories } from "./catalog.ts";
import { buildCustomers, buildOrders } from "./orders.ts";

export { categories, productSeeds, unsplash } from "./catalog.ts";
export { customerSeeds, orderSeeds } from "./orders.ts";

export type MockStore = {
  categories: Category[];
  products: Product[];
  customers: Customer[];
  orders: Order[];
};

const globalForMock = globalThis as unknown as { __shopMockStore?: MockStore };

/**
 * In-memory store used when Supabase env vars are missing.
 * Lives on globalThis so edits survive hot reloads during `next dev`;
 * it resets whenever the server process restarts.
 */
export function getMockStore(): MockStore {
  if (!globalForMock.__shopMockStore) {
    const now = Date.now();
    globalForMock.__shopMockStore = {
      categories: structuredClone(categories),
      products: buildProducts(now),
      customers: buildCustomers(now),
      orders: buildOrders(now),
    };
  }
  return globalForMock.__shopMockStore;
}
