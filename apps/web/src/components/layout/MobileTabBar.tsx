"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, LayoutGrid, ShoppingCart, Store, UserRound } from "lucide-react";
import { cartCount, useCart } from "@/lib/cart-store";
import { cn } from "@/lib/cn";

const tabs = [
  { href: "/", label: "Нүүр", icon: House, match: (p: string) => p === "/" },
  { href: "/shop", label: "Дэлгүүр", icon: Store, match: (p: string) => p.startsWith("/shop") || p.startsWith("/product") },
  { href: "/collections", label: "Ангилал", icon: LayoutGrid, match: (p: string) => p.startsWith("/collections") },
  { href: "/cart", label: "Сагс", icon: ShoppingCart, match: (p: string) => p.startsWith("/cart") || p.startsWith("/checkout") },
  {
    href: "/account",
    label: "Бүртгэл",
    icon: UserRound,
    match: (p: string) => ["/account", "/login", "/signup"].some((x) => p.startsWith(x)),
  },
];

/** App-style bottom navigation for phones and small tablets (hidden on desktop). */
export function MobileTabBar() {
  const pathname = usePathname();
  const items = useCart((s) => s.items);
  const hydrated = useCart((s) => s.hydrated);
  const count = hydrated ? cartCount(items) : 0;

  return (
    <nav
      aria-label="Гар утасны цэс"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(15,28,46,0.06)] backdrop-blur supports-[backdrop-filter]:bg-white/85 lg:hidden"
    >
      <ul className="mx-auto grid h-16 max-w-lg grid-cols-5">
        {tabs.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex h-full flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors",
                  active ? "text-navy" : "text-muted hover:text-navy",
                )}
              >
                {active && <span className="absolute inset-x-5 top-0 h-0.5 rounded-full bg-tan" aria-hidden />}
                <span className="relative">
                  <Icon className="size-[22px]" strokeWidth={active ? 2.1 : 1.7} aria-hidden />
                  {href === "/cart" && count > 0 && (
                    <span className="absolute -right-2.5 -top-1.5 grid min-w-[18px] place-items-center rounded-full bg-tan px-1 text-[10px] font-bold leading-[18px] text-white">
                      {count > 99 ? "99+" : count}
                    </span>
                  )}
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
