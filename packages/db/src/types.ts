export type Category = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  sortOrder: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  categoryId: string;
  images: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  isTrending: boolean;
  isActive: boolean;
  createdAt: string;
};

export type ProductWithCategory = Product & { category: Category | null };

export const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  createdAt: string;
};

export type CustomerWithStats = Customer & {
  orderCount: number;
  totalSpent: number;
  lastOrderAt: string | null;
};

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string | null;
  productName: string;
  imageUrl: string | null;
  unitPrice: number;
  quantity: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  customerId: string | null;
  customerName: string;
  email: string;
  phone: string | null;
  address: string;
  city: string;
  status: OrderStatus;
  subtotal: number;
  shipping: number;
  total: number;
  createdAt: string;
  items: OrderItem[];
};

export type ProductSort = "featured" | "newest" | "price-asc" | "price-desc" | "rating";

export type ProductFilter = {
  categorySlug?: string;
  q?: string;
  sort?: ProductSort;
  trending?: boolean;
  onSale?: boolean;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  /** Admin only: include products with isActive = false. */
  includeInactive?: boolean;
};

export type ProductInput = {
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  categoryId: string;
  images: string[];
  stock: number;
  isTrending: boolean;
  isActive: boolean;
};

export type CategoryInput = {
  name: string;
  slug: string;
  imageUrl: string | null;
  sortOrder: number;
};

export type CheckoutInput = {
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
  };
  items: { productId: string; quantity: number }[];
};

export type DailyPoint = { date: string; revenue: number; orders: number };

export type DashboardStats = {
  /** Totals for the last 30 days, with the previous 30 days for comparison. */
  revenue: { current: number; previous: number };
  orders: { current: number; previous: number };
  customers: { current: number; previous: number };
  averageOrderValue: { current: number; previous: number };
  daily: DailyPoint[];
  statusCounts: Record<OrderStatus, number>;
  salesByCategory: { category: string; revenue: number }[];
  topProducts: { productId: string | null; name: string; imageUrl: string | null; quantity: number; revenue: number }[];
  recentOrders: Order[];
  lowStock: Product[];
  productCount: number;
};
