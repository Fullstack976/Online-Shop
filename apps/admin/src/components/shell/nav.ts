import { LayoutDashboard, Package, ReceiptText, Tags, Users } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/products", label: "Products", Icon: Package },
  { href: "/orders", label: "Orders", Icon: ReceiptText },
  { href: "/customers", label: "Customers", Icon: Users },
  { href: "/categories", label: "Categories", Icon: Tags },
] as const;

export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/** Top-bar title (and optional parent crumb) for the current path. */
export function titleForPath(pathname: string): { title: string; parent?: { href: string; label: string } } {
  const [section, sub] = pathname.split("/").filter(Boolean);
  switch (section) {
    case undefined:
      return { title: "Dashboard" };
    case "products":
      if (sub === "new") return { title: "New product", parent: { href: "/products", label: "Products" } };
      if (sub) return { title: "Edit product", parent: { href: "/products", label: "Products" } };
      return { title: "Products" };
    case "orders":
      if (sub) return { title: "Order details", parent: { href: "/orders", label: "Orders" } };
      return { title: "Orders" };
    case "customers":
      return { title: "Customers" };
    case "categories":
      return { title: "Categories" };
    default:
      return { title: "Page not found" };
  }
}
