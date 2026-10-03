import type { Customer, Order, OrderStatus } from "../types.ts";
import { shippingFor } from "../utils.ts";
import { productSeeds, unsplash } from "./catalog.ts";

const custId = (n: number) => `33333333-0000-4000-8000-${String(n).padStart(12, "0")}`;
const orderId = (n: number) => `44444444-0000-4000-8000-${String(n).padStart(12, "0")}`;
const itemId = (n: number) => `55555555-0000-4000-8000-${String(n).padStart(12, "0")}`;

/** Small deterministic PRNG so mock data is identical on every render and in seed.sql. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const people: [string, string][] = [
  ["Emma Johnson", "New York"],
  ["Liam Smith", "Los Angeles"],
  ["Olivia Brown", "Chicago"],
  ["Noah Davis", "Houston"],
  ["Ava Wilson", "Phoenix"],
  ["Elijah Martinez", "Philadelphia"],
  ["Sophia Anderson", "San Antonio"],
  ["James Taylor", "San Diego"],
  ["Isabella Thomas", "Dallas"],
  ["Lucas Moore", "Austin"],
  ["Mia Jackson", "Seattle"],
  ["Mason White", "Denver"],
  ["Amelia Harris", "Boston"],
  ["Ethan Clark", "Miami"],
  ["Harper Lewis", "Atlanta"],
  ["Aiden Walker", "Portland"],
  ["Evelyn Hall", "Nashville"],
  ["Logan Allen", "Las Vegas"],
  ["Abigail Young", "San Francisco"],
  ["Jackson King", "Minneapolis"],
  ["Emily Wright", "Detroit"],
  ["Sebastian Scott", "Orlando"],
  ["Ella Green", "Charlotte"],
  ["Jack Baker", "Columbus"],
  ["Scarlett Adams", "Baltimore"],
  ["Henry Nelson", "Sacramento"],
];

const streets = ["Main St", "Oak Ave", "Maple Dr", "Park Blvd", "Cedar Ln", "Lake Rd", "Hill St", "River Way"];

export const customerSeeds = people.map(([name, city], i) => {
  const handle = name.toLowerCase().replace(/[^a-z]+/g, ".");
  return {
    id: custId(i + 1),
    name,
    email: `${handle}@example.com`,
    phone: `+1 555 01${String(i).padStart(2, "0")}`,
    city,
    address: `${100 + i * 17} ${streets[i % streets.length]}`,
    daysAgo: 120 - i * 4,
  };
});

export type OrderSeed = Omit<Order, "createdAt"> & { minutesAgo: number };

const round2 = (n: number) => Math.round(n * 100) / 100;

function buildOrderSeeds(): OrderSeed[] {
  const rand = mulberry32(20261003);
  const pick = <T>(list: readonly T[]) => list[Math.floor(rand() * list.length)]!;
  const COUNT = 96;
  const raw: { minutesAgo: number }[] = [];
  for (let i = 0; i < COUNT; i++) {
    // Skew towards recent days so the revenue chart trends upward.
    const days = Math.pow(rand(), 1.35) * 60;
    raw.push({ minutesAgo: Math.floor(days * 24 * 60) });
  }
  raw.sort((a, b) => b.minutesAgo - a.minutesAgo); // oldest first → ascending order numbers

  let itemCounter = 1;
  return raw.map(({ minutesAgo }, i) => {
    const customer = pick(customerSeeds);
    const lineCount = 1 + Math.floor(rand() * 3);
    const chosen = new Set<number>();
    while (chosen.size < lineCount) chosen.add(Math.floor(rand() * productSeeds.length));
    const id = orderId(i + 1);
    const items = [...chosen].map((idx) => {
      const p = productSeeds[idx]!;
      return {
        id: itemId(itemCounter++),
        orderId: id,
        productId: p.id,
        productName: p.name,
        imageUrl: unsplash(p.photos[0]!, 400),
        unitPrice: p.price,
        quantity: rand() < 0.75 ? 1 : 2,
      };
    });
    const subtotal = round2(items.reduce((s, it) => s + it.unitPrice * it.quantity, 0));
    const shipping = shippingFor(subtotal);
    const ageDays = minutesAgo / 60 / 24;
    let status: OrderStatus;
    const r = rand();
    if (r < 0.06) status = "cancelled";
    else if (ageDays < 1.5) status = r < 0.6 ? "pending" : "processing";
    else if (ageDays < 4) status = r < 0.5 ? "processing" : "shipped";
    else if (ageDays < 8) status = r < 0.4 ? "shipped" : "delivered";
    else status = "delivered";

    return {
      id,
      orderNumber: `SL-${10001 + i}`,
      customerId: customer.id,
      customerName: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      status,
      subtotal,
      shipping,
      total: round2(subtotal + shipping),
      minutesAgo,
      items,
    };
  });
}

export const orderSeeds = buildOrderSeeds();

export function buildCustomers(now = Date.now()): Customer[] {
  return customerSeeds.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    city: c.city,
    createdAt: new Date(now - c.daysAgo * 24 * 60 * 60 * 1000).toISOString(),
  }));
}

export function buildOrders(now = Date.now()): Order[] {
  return orderSeeds
    .map(({ minutesAgo, ...o }) => ({ ...o, createdAt: new Date(now - minutesAgo * 60 * 1000).toISOString() }))
    .reverse(); // newest first
}
