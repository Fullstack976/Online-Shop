import type { SupabaseClient } from "@supabase/supabase-js";
import { getMockStore } from "./mock/index.ts";
import { shippingFor } from "./utils.ts";
import { computeDashboardStats } from "./stats.ts";
import type {
  Category,
  CategoryInput,
  CheckoutInput,
  Customer,
  CustomerWithStats,
  DashboardStats,
  Order,
  OrderItem,
  OrderStatus,
  Product,
  ProductFilter,
  ProductInput,
  ProductWithCategory,
} from "./types.ts";

export type OrderFilter = { status?: OrderStatus; q?: string; limit?: number };

export interface DataSource {
  mode: "supabase" | "mock";
  listCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | null>;
  listProducts(filter?: ProductFilter): Promise<ProductWithCategory[]>;
  getProductBySlug(slug: string): Promise<ProductWithCategory | null>;
  getProductById(id: string): Promise<ProductWithCategory | null>;
  listOrders(filter?: OrderFilter): Promise<Order[]>;
  getOrder(id: string): Promise<Order | null>;
  listCustomers(): Promise<CustomerWithStats[]>;
  getDashboardStats(): Promise<DashboardStats>;

  createProduct(input: ProductInput): Promise<Product>;
  updateProduct(id: string, input: ProductInput): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  createCategory(input: CategoryInput): Promise<Category>;
  updateCategory(id: string, input: CategoryInput): Promise<Category>;
  deleteCategory(id: string): Promise<void>;
  updateOrderStatus(id: string, status: OrderStatus): Promise<void>;

  /** Public checkout. Prices are always recomputed server-side from the catalog. */
  placeOrder(input: CheckoutInput): Promise<{ orderNumber: string; total: number }>;
  subscribe(email: string): Promise<void>;
}

const DAY = 24 * 60 * 60 * 1000;
const round2 = (n: number) => Math.round(n * 100) / 100;

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function sortProducts<T extends Product>(list: T[], sort: ProductFilter["sort"] = "featured"): T[] {
  const byNewest = (a: Product, b: Product) => Date.parse(b.createdAt) - Date.parse(a.createdAt);
  const sorted = [...list];
  switch (sort) {
    case "newest":
      return sorted.sort(byNewest);
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    default:
      return sorted.sort((a, b) => Number(b.isTrending) - Number(a.isTrending) || byNewest(a, b));
  }
}

function customerStats(customers: Customer[], orders: Order[]): CustomerWithStats[] {
  return customers
    .map((c) => {
      const mine = orders.filter((o) => o.customerId === c.id && o.status !== "cancelled");
      const last = mine.reduce<string | null>(
        (acc, o) => (!acc || Date.parse(o.createdAt) > Date.parse(acc) ? o.createdAt : acc),
        null,
      );
      return {
        ...c,
        orderCount: mine.length,
        totalSpent: round2(mine.reduce((s, o) => s + o.total, 0)),
        lastOrderAt: last,
      };
    })
    .sort((a, b) => b.totalSpent - a.totalSpent);
}

function validateCheckout(input: CheckoutInput) {
  const { customer, items } = input;
  if (!customer.name.trim() || !customer.email.includes("@") || !customer.address.trim() || !customer.city.trim()) {
    throw new Error("Please fill in your name, email, address and city.");
  }
  if (!items.length) throw new Error("Your cart is empty.");
  if (items.some((i) => !Number.isInteger(i.quantity) || i.quantity < 1 || i.quantity > 99)) {
    throw new Error("Invalid quantity in cart.");
  }
}

// ---------------------------------------------------------------------------
// Mock source (no env vars) — in-memory, resets on server restart
// ---------------------------------------------------------------------------

export function createMockSource(): DataSource {
  const store = getMockStore();
  const withCategory = (p: Product): ProductWithCategory => ({
    ...p,
    category: store.categories.find((c) => c.id === p.categoryId) ?? null,
  });
  const nextId = () => crypto.randomUUID();

  return {
    mode: "mock",
    async listCategories() {
      return [...store.categories].sort((a, b) => a.sortOrder - b.sortOrder);
    },
    async getCategoryBySlug(slug) {
      return store.categories.find((c) => c.slug === slug) ?? null;
    },
    async listProducts(filter = {}) {
      let list = store.products;
      if (!filter.includeInactive) list = list.filter((p) => p.isActive);
      if (filter.categorySlug) {
        const cat = store.categories.find((c) => c.slug === filter.categorySlug);
        list = cat ? list.filter((p) => p.categoryId === cat.id) : [];
      }
      if (filter.q) {
        const q = filter.q.toLowerCase();
        list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
      }
      if (filter.trending) list = list.filter((p) => p.isTrending);
      if (filter.onSale) list = list.filter((p) => p.compareAtPrice !== null);
      if (filter.minPrice !== undefined) list = list.filter((p) => p.price >= filter.minPrice!);
      if (filter.maxPrice !== undefined) list = list.filter((p) => p.price <= filter.maxPrice!);
      list = sortProducts(list, filter.sort);
      if (filter.limit) list = list.slice(0, filter.limit);
      return list.map(withCategory);
    },
    async getProductBySlug(slug) {
      const p = store.products.find((x) => x.slug === slug);
      return p ? withCategory(p) : null;
    },
    async getProductById(id) {
      const p = store.products.find((x) => x.id === id);
      return p ? withCategory(p) : null;
    },
    async listOrders(filter = {}) {
      let list = store.orders;
      if (filter.status) list = list.filter((o) => o.status === filter.status);
      if (filter.q) {
        const q = filter.q.toLowerCase();
        list = list.filter(
          (o) =>
            o.orderNumber.toLowerCase().includes(q) ||
            o.customerName.toLowerCase().includes(q) ||
            o.email.toLowerCase().includes(q),
        );
      }
      list = [...list].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
      return filter.limit ? list.slice(0, filter.limit) : list;
    },
    async getOrder(id) {
      return store.orders.find((o) => o.id === id) ?? null;
    },
    async listCustomers() {
      return customerStats(store.customers, store.orders);
    },
    async getDashboardStats() {
      return computeDashboardStats(store);
    },

    async createProduct(input) {
      if (store.products.some((p) => p.slug === input.slug)) throw new Error("A product with this slug already exists.");
      const product: Product = {
        ...input,
        id: nextId(),
        rating: 0,
        reviewCount: 0,
        createdAt: new Date().toISOString(),
      };
      store.products.unshift(product);
      return product;
    },
    async updateProduct(id, input) {
      const idx = store.products.findIndex((p) => p.id === id);
      if (idx === -1) throw new Error("Product not found.");
      if (store.products.some((p) => p.slug === input.slug && p.id !== id)) {
        throw new Error("A product with this slug already exists.");
      }
      store.products[idx] = { ...store.products[idx]!, ...input };
      return store.products[idx]!;
    },
    async deleteProduct(id) {
      store.products = store.products.filter((p) => p.id !== id);
    },
    async createCategory(input) {
      if (store.categories.some((c) => c.slug === input.slug)) throw new Error("A category with this slug already exists.");
      const category: Category = { ...input, id: nextId() };
      store.categories.push(category);
      return category;
    },
    async updateCategory(id, input) {
      const idx = store.categories.findIndex((c) => c.id === id);
      if (idx === -1) throw new Error("Category not found.");
      store.categories[idx] = { ...store.categories[idx]!, ...input };
      return store.categories[idx]!;
    },
    async deleteCategory(id) {
      if (store.products.some((p) => p.categoryId === id)) {
        throw new Error("Move or delete this category's products first.");
      }
      store.categories = store.categories.filter((c) => c.id !== id);
    },
    async updateOrderStatus(id, status) {
      const order = store.orders.find((o) => o.id === id);
      if (!order) throw new Error("Order not found.");
      order.status = status;
    },

    async placeOrder(input) {
      validateCheckout(input);
      const orderId = nextId();
      const items: OrderItem[] = input.items.map((line) => {
        const p = store.products.find((x) => x.id === line.productId && x.isActive);
        if (!p) throw new Error("A product in your cart is no longer available.");
        if (p.stock < line.quantity) throw new Error(`Only ${p.stock} left of ${p.name}.`);
        return {
          id: nextId(),
          orderId,
          productId: p.id,
          productName: p.name,
          imageUrl: p.images[0] ?? null,
          unitPrice: p.price,
          quantity: line.quantity,
        };
      });
      for (const it of items) {
        const p = store.products.find((x) => x.id === it.productId)!;
        p.stock -= it.quantity;
      }
      const email = input.customer.email.trim().toLowerCase();
      let customer = store.customers.find((c) => c.email === email);
      if (!customer) {
        customer = {
          id: nextId(),
          name: input.customer.name.trim(),
          email,
          phone: input.customer.phone || null,
          city: input.customer.city,
          createdAt: new Date().toISOString(),
        };
        store.customers.push(customer);
      }
      const subtotal = round2(items.reduce((s, i) => s + i.unitPrice * i.quantity, 0));
      const shipping = shippingFor(subtotal);
      const maxNumber = Math.max(10000, ...store.orders.map((o) => Number(o.orderNumber.replace(/\D/g, "")) || 0));
      const order: Order = {
        id: orderId,
        orderNumber: `SL-${maxNumber + 1}`,
        customerId: customer.id,
        customerName: input.customer.name.trim(),
        email,
        phone: input.customer.phone || null,
        address: input.customer.address.trim(),
        city: input.customer.city.trim(),
        status: "pending",
        subtotal,
        shipping,
        total: round2(subtotal + shipping),
        createdAt: new Date().toISOString(),
        items,
      };
      store.orders.unshift(order);
      return { orderNumber: order.orderNumber, total: order.total };
    },
    async subscribe(email) {
      if (!email.includes("@")) throw new Error("Please enter a valid email.");
    },
  };
}

// ---------------------------------------------------------------------------
// Supabase source
// ---------------------------------------------------------------------------

/* eslint-disable @typescript-eslint/no-explicit-any */
type Row = Record<string, any>;

export const mapCategory = (r: Row): Category => ({
  id: r.id,
  name: r.name,
  slug: r.slug,
  imageUrl: r.image_url ?? null,
  sortOrder: r.sort_order ?? 0,
});

export const mapProduct = (r: Row): Product => ({
  id: r.id,
  name: r.name,
  slug: r.slug,
  description: r.description ?? "",
  price: Number(r.price),
  compareAtPrice: r.compare_at_price === null || r.compare_at_price === undefined ? null : Number(r.compare_at_price),
  categoryId: r.category_id,
  images: r.images ?? [],
  stock: r.stock ?? 0,
  rating: Number(r.rating ?? 0),
  reviewCount: r.review_count ?? 0,
  isTrending: Boolean(r.is_trending),
  isActive: Boolean(r.is_active),
  createdAt: r.created_at,
});

const mapProductWithCategory = (r: Row): ProductWithCategory => ({
  ...mapProduct(r),
  category: r.category ? mapCategory(r.category) : null,
});

const mapCustomer = (r: Row): Customer => ({
  id: r.id,
  name: r.name,
  email: r.email,
  phone: r.phone ?? null,
  city: r.city ?? null,
  createdAt: r.created_at,
});

const mapOrderItem = (r: Row): OrderItem => ({
  id: r.id,
  orderId: r.order_id,
  productId: r.product_id ?? null,
  productName: r.product_name,
  imageUrl: r.image_url ?? null,
  unitPrice: Number(r.unit_price),
  quantity: r.quantity,
});

const mapOrder = (r: Row): Order => ({
  id: r.id,
  orderNumber: r.order_number,
  customerId: r.customer_id ?? null,
  customerName: r.customer_name,
  email: r.email,
  phone: r.phone ?? null,
  address: r.address,
  city: r.city,
  status: r.status,
  subtotal: Number(r.subtotal),
  shipping: Number(r.shipping),
  total: Number(r.total),
  createdAt: r.created_at,
  items: (r.items ?? []).map(mapOrderItem),
});

const productRow = (input: ProductInput) => ({
  name: input.name,
  slug: input.slug,
  description: input.description,
  price: input.price,
  compare_at_price: input.compareAtPrice,
  category_id: input.categoryId,
  images: input.images,
  stock: input.stock,
  is_trending: input.isTrending,
  is_active: input.isActive,
});

const categoryRow = (input: CategoryInput) => ({
  name: input.name,
  slug: input.slug,
  image_url: input.imageUrl,
  sort_order: input.sortOrder,
});

function fail(error: { message: string; code?: string } | null, context: string): void {
  if (!error) return;
  if (error.code === "23505") throw new Error(`${context}: that slug or email is already in use.`);
  if (error.code === "23503") throw new Error(`${context}: it is still referenced by other records.`);
  if (error.code === "42501") throw new Error(`${context}: permission denied (is this user an admin?).`);
  throw new Error(`${context}: ${error.message}`);
}

const escapeLike = (s: string) => s.replace(/[%_\\]/g, (c) => `\\${c}`);

export function createSupabaseSource(client: SupabaseClient): DataSource {
  const PRODUCT_SELECT = "*, category:categories(*)";
  const ORDER_SELECT = "*, items:order_items(*)";

  async function getCategoryBySlug(slug: string) {
    const { data, error } = await client.from("categories").select("*").eq("slug", slug).maybeSingle();
    fail(error, "Could not load category");
    return data ? mapCategory(data) : null;
  }

  return {
    mode: "supabase",
    async listCategories() {
      const { data, error } = await client.from("categories").select("*").order("sort_order");
      fail(error, "Could not load categories");
      return (data ?? []).map(mapCategory);
    },
    getCategoryBySlug,
    async listProducts(filter = {}) {
      let query = client.from("products").select(PRODUCT_SELECT);
      if (!filter.includeInactive) query = query.eq("is_active", true);
      if (filter.categorySlug) {
        const cat = await getCategoryBySlug(filter.categorySlug);
        if (!cat) return [];
        query = query.eq("category_id", cat.id);
      }
      if (filter.q) query = query.ilike("name", `%${escapeLike(filter.q)}%`);
      if (filter.trending) query = query.eq("is_trending", true);
      if (filter.onSale) query = query.not("compare_at_price", "is", null);
      if (filter.minPrice !== undefined) query = query.gte("price", filter.minPrice);
      if (filter.maxPrice !== undefined) query = query.lte("price", filter.maxPrice);
      switch (filter.sort) {
        case "newest":
          query = query.order("created_at", { ascending: false });
          break;
        case "price-asc":
          query = query.order("price", { ascending: true });
          break;
        case "price-desc":
          query = query.order("price", { ascending: false });
          break;
        case "rating":
          query = query.order("rating", { ascending: false }).order("review_count", { ascending: false });
          break;
        default:
          query = query.order("is_trending", { ascending: false }).order("created_at", { ascending: false });
      }
      if (filter.limit) query = query.limit(filter.limit);
      const { data, error } = await query;
      fail(error, "Could not load products");
      return (data ?? []).map(mapProductWithCategory);
    },
    async getProductBySlug(slug) {
      const { data, error } = await client.from("products").select(PRODUCT_SELECT).eq("slug", slug).maybeSingle();
      fail(error, "Could not load product");
      return data ? mapProductWithCategory(data) : null;
    },
    async getProductById(id) {
      const { data, error } = await client.from("products").select(PRODUCT_SELECT).eq("id", id).maybeSingle();
      fail(error, "Could not load product");
      return data ? mapProductWithCategory(data) : null;
    },
    async listOrders(filter = {}) {
      let query = client.from("orders").select(ORDER_SELECT).order("created_at", { ascending: false });
      if (filter.status) query = query.eq("status", filter.status);
      if (filter.q) {
        const q = escapeLike(filter.q).replace(/[,()]/g, " ");
        query = query.or(`order_number.ilike.%${q}%,customer_name.ilike.%${q}%,email.ilike.%${q}%`);
      }
      if (filter.limit) query = query.limit(filter.limit);
      const { data, error } = await query;
      fail(error, "Could not load orders");
      return (data ?? []).map(mapOrder);
    },
    async getOrder(id) {
      const { data, error } = await client.from("orders").select(ORDER_SELECT).eq("id", id).maybeSingle();
      fail(error, "Could not load order");
      return data ? mapOrder(data) : null;
    },
    async listCustomers() {
      const [customers, orders] = await Promise.all([
        client.from("customers").select("*"),
        client.from("orders").select("id, customer_id, total, status, created_at"),
      ]);
      fail(customers.error, "Could not load customers");
      fail(orders.error, "Could not load orders");
      const lite = (orders.data ?? []).map((o: Row) => mapOrder({ ...o, items: [] }));
      return customerStats((customers.data ?? []).map(mapCustomer), lite);
    },
    async getDashboardStats() {
      const since = new Date(Date.now() - 60 * DAY).toISOString();
      const [orders, products, customers, categories] = await Promise.all([
        client.from("orders").select(ORDER_SELECT).gte("created_at", since),
        client.from("products").select("*"),
        client.from("customers").select("*").gte("created_at", since),
        client.from("categories").select("*"),
      ]);
      fail(orders.error, "Could not load orders");
      fail(products.error, "Could not load products");
      fail(customers.error, "Could not load customers");
      fail(categories.error, "Could not load categories");
      return computeDashboardStats({
        orders: (orders.data ?? []).map(mapOrder),
        products: (products.data ?? []).map(mapProduct),
        customers: (customers.data ?? []).map(mapCustomer),
        categories: (categories.data ?? []).map(mapCategory),
      });
    },

    async createProduct(input) {
      const { data, error } = await client.from("products").insert(productRow(input)).select().single();
      fail(error, "Could not create product");
      return mapProduct(data!);
    },
    async updateProduct(id, input) {
      const { data, error } = await client.from("products").update(productRow(input)).eq("id", id).select().single();
      fail(error, "Could not update product");
      return mapProduct(data!);
    },
    async deleteProduct(id) {
      const { error } = await client.from("products").delete().eq("id", id);
      fail(error, "Could not delete product");
    },
    async createCategory(input) {
      const { data, error } = await client.from("categories").insert(categoryRow(input)).select().single();
      fail(error, "Could not create category");
      return mapCategory(data!);
    },
    async updateCategory(id, input) {
      const { data, error } = await client.from("categories").update(categoryRow(input)).eq("id", id).select().single();
      fail(error, "Could not update category");
      return mapCategory(data!);
    },
    async deleteCategory(id) {
      const { error } = await client.from("categories").delete().eq("id", id);
      fail(error, "Could not delete category");
    },
    async updateOrderStatus(id, status) {
      const { error } = await client.from("orders").update({ status }).eq("id", id);
      fail(error, "Could not update order");
    },

    async placeOrder(input) {
      validateCheckout(input);
      const { data, error } = await client.rpc("place_order", {
        p_customer: {
          name: input.customer.name.trim(),
          email: input.customer.email.trim().toLowerCase(),
          phone: input.customer.phone.trim(),
          address: input.customer.address.trim(),
          city: input.customer.city.trim(),
        },
        p_items: input.items.map((i) => ({ product_id: i.productId, quantity: i.quantity })),
      });
      if (error) throw new Error(error.message);
      const row = (Array.isArray(data) ? data[0] : data) as Row;
      return { orderNumber: row.order_number, total: Number(row.total) };
    },
    async subscribe(email) {
      const { error } = await client.from("newsletter_subscribers").insert({ email: email.trim().toLowerCase() });
      // Already subscribed is fine.
      if (error && error.code !== "23505") throw new Error("Could not subscribe right now. Please try again.");
    },
  };
}

// ---------------------------------------------------------------------------

/** Pick the Supabase source when a client is available, otherwise fall back to mock data. */
export function createDataSource(client: SupabaseClient | null): DataSource {
  return client ? createSupabaseSource(client) : createMockSource();
}
