"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { collections, mainNav } from "@/lib/site";

type NavItem = { label: string; href: string };

export function NavLinks({ categories }: { categories: NavItem[] }) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <nav aria-label="Main" className="mx-auto hidden lg:block">
      <ul className="flex items-center gap-8">
        {mainNav.map((item) => {
          const menu = item.menu === "categories" ? categories : item.menu === "collections" ? collections : null;
          return (
            <li key={item.href} className="group relative">
              <Link
                href={item.href}
                className={cn(
                  "label-caps relative flex items-center gap-1 py-6 text-[12px] text-navy transition-colors hover:text-tan",
                  "after:absolute after:inset-x-0 after:bottom-[18px] after:h-0.5 after:origin-left after:scale-x-0 after:bg-navy after:transition-transform",
                  isActive(item.href) && "after:scale-x-100",
                )}
              >
                {item.label}
                {menu && <ChevronDown className="size-3.5 transition-transform group-hover:rotate-180" aria-hidden />}
              </Link>
              {menu && (
                <div className="invisible absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 translate-y-1 rounded-lg border border-line bg-white p-2 opacity-0 shadow-xl shadow-navy/5 transition group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  {menu.map((m) => (
                    <Link
                      key={m.href}
                      href={m.href}
                      className="block rounded-md px-3 py-2 text-sm text-ink transition hover:bg-cloud hover:text-tan"
                    >
                      {m.label}
                    </Link>
                  ))}
                  {item.menu === "categories" && (
                    <Link
                      href="/shop"
                      className="mt-1 block rounded-md border-t border-line px-3 pb-2 pt-3 text-sm font-semibold text-navy hover:text-tan"
                    >
                      View all products →
                    </Link>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
