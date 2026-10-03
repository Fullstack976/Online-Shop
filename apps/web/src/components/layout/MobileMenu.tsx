"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { collections, mainNav } from "@/lib/site";
import { Logo } from "./Logo";

type NavItem = { label: string; href: string };

export function MobileMenu({ categories }: { categories: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);
  // Close the drawer whenever the route changes.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="-ml-2 grid size-10 place-items-center rounded-full text-navy hover:bg-cloud"
        aria-label="Open menu"
        aria-expanded={open}
      >
        <Menu className="size-6" strokeWidth={1.8} />
      </button>
      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-navy/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-[min(320px,85vw)] flex-col overflow-y-auto bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <Logo />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-10 place-items-center rounded-full text-navy hover:bg-cloud"
                aria-label="Close menu"
              >
                <X className="size-5" />
              </button>
            </div>
            <nav className="mt-8 space-y-1" aria-label="Mobile">
              {mainNav.map((item) => (
                <Link key={item.href} href={item.href} className="label-caps block rounded-md px-3 py-3 text-navy hover:bg-cloud">
                  {item.label}
                </Link>
              ))}
            </nav>
            <p className="label-caps mt-8 px-3 text-muted">Categories</p>
            <div className="mt-2 grid gap-1">
              {categories.map((c) => (
                <Link key={c.href} href={c.href} className="rounded-md px-3 py-2 text-sm text-ink hover:bg-cloud">
                  {c.label}
                </Link>
              ))}
            </div>
            <p className="label-caps mt-6 px-3 text-muted">Collections</p>
            <div className="mt-2 grid gap-1">
              {collections.map((c) => (
                <Link key={c.href} href={c.href} className="rounded-md px-3 py-2 text-sm text-ink hover:bg-cloud">
                  {c.label}
                </Link>
              ))}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
