"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Search, ShoppingCart, User, X } from "lucide-react";
import { formatPrice } from "@shop/db/utils";
import { cartCount, cartSubtotal, useCart } from "@/lib/cart-store";

export function HeaderActions() {
  const items = useCart((s) => s.items);
  const hydrated = useCart((s) => s.hydrated);
  const [searchOpen, setSearchOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const count = hydrated ? cartCount(items) : 0;
  const total = hydrated ? cartSubtotal(items) : 0;

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q")?.toString().trim();
    setSearchOpen(false);
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
  }

  return (
    <div className="ml-auto flex items-center gap-1 sm:gap-3 lg:ml-0">
      <button
        type="button"
        onClick={() => setSearchOpen(true)}
        className="grid size-10 place-items-center rounded-full text-navy transition hover:bg-cloud"
        aria-label="Search products"
      >
        <Search className="size-5" strokeWidth={1.8} />
      </button>
      <Link
        href="/account"
        className="hidden size-10 place-items-center rounded-full text-navy transition hover:bg-cloud sm:grid"
        aria-label="My account"
      >
        <User className="size-5" strokeWidth={1.8} />
      </Link>
      <Link href="/cart" className="flex items-center gap-2 rounded-full py-1 pl-1 pr-1 text-navy transition hover:bg-cloud sm:pr-3" aria-label={`Cart, ${count} items`}>
        <span className="relative grid size-9 place-items-center">
          <ShoppingCart className="size-5" strokeWidth={1.8} />
          <span className="absolute -right-0.5 -top-0.5 grid min-w-[18px] place-items-center rounded-full bg-navy px-1 text-[10px] font-bold leading-[18px] text-white">
            {count}
          </span>
        </span>
        <span className="hidden font-display text-sm font-semibold tabular-nums sm:inline">{formatPrice(total)}</span>
      </Link>

      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-navy/40 backdrop-blur-sm" onClick={() => setSearchOpen(false)}>
          <form
            onSubmit={submit}
            onClick={(e) => e.stopPropagation()}
            className="animate-fade-in mx-auto mt-24 flex w-[min(640px,calc(100%-2rem))] items-center gap-3 rounded-xl bg-white p-3 shadow-2xl"
            role="search"
          >
            <Search className="ml-2 size-5 shrink-0 text-muted" aria-hidden />
            <input
              ref={inputRef}
              name="q"
              placeholder="Search for products, brands and more…"
              className="h-11 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted"
              onKeyDown={(e) => e.key === "Escape" && setSearchOpen(false)}
            />
            <button type="submit" className="label-caps h-11 rounded-md bg-navy px-5 text-white hover:bg-navy-700">
              Search
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="grid size-10 place-items-center rounded-full text-muted hover:bg-cloud"
              aria-label="Close search"
            >
              <X className="size-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
