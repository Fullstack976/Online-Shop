import { LayoutDashboard, Package, ReceiptText, Tags, Users } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/", label: "Хянах самбар", Icon: LayoutDashboard },
  { href: "/products", label: "Бүтээгдэхүүн", Icon: Package },
  { href: "/orders", label: "Захиалга", Icon: ReceiptText },
  { href: "/customers", label: "Үйлчлүүлэгчид", Icon: Users },
  { href: "/categories", label: "Ангилал", Icon: Tags },
] as const;

export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/** Top-bar title (and optional parent crumb) for the current path. */
export function titleForPath(pathname: string): { title: string; parent?: { href: string; label: string } } {
  const [section, sub] = pathname.split("/").filter(Boolean);
  switch (section) {
    case undefined:
      return { title: "Хянах самбар" };
    case "products":
      if (sub === "new") return { title: "Шинэ бүтээгдэхүүн", parent: { href: "/products", label: "Бүтээгдэхүүн" } };
      if (sub) return { title: "Бүтээгдэхүүн засах", parent: { href: "/products", label: "Бүтээгдэхүүн" } };
      return { title: "Бүтээгдэхүүн" };
    case "orders":
      if (sub) return { title: "Захиалгын дэлгэрэнгүй", parent: { href: "/orders", label: "Захиалга" } };
      return { title: "Захиалга" };
    case "customers":
      return { title: "Үйлчлүүлэгчид" };
    case "categories":
      return { title: "Ангилал" };
    default:
      return { title: "Хуудас олдсонгүй" };
  }
}
