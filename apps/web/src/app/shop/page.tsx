import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import type { ProductFilter, ProductSort } from "@shop/db";
import { ProductCard } from "@/components/product/ProductCard";
import { SortSelect } from "@/components/shop/SortSelect";
import { PageHeader } from "@/components/ui/PageHeader";
import { cn } from "@/lib/cn";
import { getData } from "@/lib/data";

export const metadata: Metadata = { title: "Shop" };

const SORTS: ProductSort[] = ["featured", "newest", "price-asc", "price-desc", "rating"];
const PRICE_RANGES = [
  { label: "Under $25", min: undefined, max: 25 },
  { label: "$25 – $50", min: 25, max: 50 },
  { label: "$50 – $100", min: 50, max: 100 },
  { label: "$100 & above", min: 100, max: undefined },
];

type Search = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const num = (v: string | undefined) => (v && !Number.isNaN(Number(v)) ? Number(v) : undefined);

/** Builds a /shop URL from the current params with some keys replaced or removed. */
function hrefWith(current: Search, changes: Record<string, string | number | undefined>) {
  const next = new URLSearchParams();
  for (const [k, v] of Object.entries(current)) {
    const value = one(v);
    if (value) next.set(k, value);
  }
  for (const [k, v] of Object.entries(changes)) {
    if (v === undefined || v === "") next.delete(k);
    else next.set(k, String(v));
  }
  const qs = next.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

export default async function ShopPage({ searchParams }: PageProps<"/shop">) {
  const sp = await searchParams;
  const categorySlug = one(sp.category);
  const q = one(sp.q)?.trim();
  const sortParam = one(sp.sort) as ProductSort | undefined;
  const filter: ProductFilter = {
    categorySlug,
    q: q || undefined,
    sort: sortParam && SORTS.includes(sortParam) ? sortParam : "featured",
    onSale: one(sp.sale) === "1" || undefined,
    trending: one(sp.trending) === "1" || undefined,
    minPrice: num(one(sp.min)),
    maxPrice: num(one(sp.max)),
  };

  const data = getData();
  const [categories, products, all] = await Promise.all([
    data.listCategories(),
    data.listProducts(filter),
    data.listProducts(),
  ]);
  const activeCategory = categories.find((c) => c.slug === categorySlug);
  const counts = new Map<string, number>();
  for (const p of all) counts.set(p.categoryId, (counts.get(p.categoryId) ?? 0) + 1);

  const title = q ? `Results for “${q}”` : activeCategory?.name ?? (filter.onSale ? "On Sale" : filter.trending ? "Trending Now" : "Shop All");
  const activeChips = [
    activeCategory && { label: activeCategory.name, href: hrefWith(sp, { category: undefined }) },
    q && { label: `“${q}”`, href: hrefWith(sp, { q: undefined }) },
    filter.onSale && { label: "On sale", href: hrefWith(sp, { sale: undefined }) },
    filter.trending && { label: "Trending", href: hrefWith(sp, { trending: undefined }) },
    (filter.minPrice !== undefined || filter.maxPrice !== undefined) && {
      label: `$${filter.minPrice ?? 0} – ${filter.maxPrice !== undefined ? `$${filter.maxPrice}` : "max"}`,
      href: hrefWith(sp, { min: undefined, max: undefined }),
    },
  ].filter(Boolean) as { label: string; href: string }[];

  const filters = (
    <div className="space-y-8">
      <div>
        <h2 className="label-caps text-navy">Categories</h2>
        <ul className="mt-3 space-y-1">
          <li>
            <Link
              href={hrefWith(sp, { category: undefined })}
              className={cn("flex justify-between rounded-md px-2 py-1.5 text-sm hover:bg-cloud", !categorySlug && "bg-cloud font-semibold text-navy")}
            >
              All products <span className="text-muted">{all.length}</span>
            </Link>
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <Link
                href={hrefWith(sp, { category: c.slug })}
                className={cn("flex justify-between rounded-md px-2 py-1.5 text-sm hover:bg-cloud", c.slug === categorySlug && "bg-cloud font-semibold text-navy")}
              >
                {c.name} <span className="text-muted">{counts.get(c.id) ?? 0}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="label-caps text-navy">Price</h2>
        <ul className="mt-3 space-y-1">
          {PRICE_RANGES.map((r) => {
            const active = filter.minPrice === r.min && filter.maxPrice === r.max;
            return (
              <li key={r.label}>
                <Link
                  href={hrefWith(sp, active ? { min: undefined, max: undefined } : { min: r.min, max: r.max })}
                  className={cn("flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-cloud", active && "font-semibold text-navy")}
                >
                  <span className={cn("size-3.5 rounded-full border", active ? "border-[5px] border-navy" : "border-line")} />
                  {r.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        <h2 className="label-caps text-navy">Offers</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href={hrefWith(sp, { sale: filter.onSale ? undefined : 1 })}
            className={cn("rounded-full border px-3 py-1.5 text-xs font-semibold", filter.onSale ? "border-navy bg-navy text-white" : "border-line hover:border-navy")}
          >
            On sale
          </Link>
          <Link
            href={hrefWith(sp, { trending: filter.trending ? undefined : 1 })}
            className={cn("rounded-full border px-3 py-1.5 text-xs font-semibold", filter.trending ? "border-navy bg-navy text-white" : "border-line hover:border-navy")}
          >
            Trending
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <PageHeader title={title} crumbs={[{ label: "Shop", href: "/shop" }, ...(activeCategory ? [{ label: activeCategory.name }] : [])]} />
      <div className="container-page grid gap-8 py-10 lg:grid-cols-[230px_1fr]">
        <aside className="hidden lg:block">{filters}</aside>

        <div className="min-w-0">
          <details className="group mb-5 rounded-lg border border-line lg:hidden">
            <summary className="label-caps flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-navy">
              <SlidersHorizontal className="size-4" aria-hidden /> Filters
            </summary>
            <div className="border-t border-line p-4">{filters}</div>
          </details>

          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">
              Showing <span className="font-semibold text-ink">{products.length}</span> {products.length === 1 ? "product" : "products"}
            </p>
            <Suspense>
              <SortSelect />
            </Suspense>
          </div>

          {activeChips.length > 0 && (
            <div className="mb-5 flex flex-wrap items-center gap-2">
              {activeChips.map((chip) => (
                <Link key={chip.label} href={chip.href} className="inline-flex items-center gap-1.5 rounded-full bg-tan-100 px-3 py-1 text-xs font-semibold text-tan-600 hover:bg-tan hover:text-white">
                  {chip.label} <X className="size-3" aria-label="Remove filter" />
                </Link>
              ))}
              <Link href="/shop" className="text-xs font-semibold text-muted underline-offset-2 hover:text-navy hover:underline">
                Clear all
              </Link>
            </div>
          )}

          {products.length ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} priority={i < 4} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-line px-6 py-16 text-center">
              <p className="font-display text-lg font-bold text-navy">No products found</p>
              <p className="mt-1 text-sm text-muted">Try removing a filter or searching for something else.</p>
              <Link href="/shop" className="label-caps mt-5 inline-flex h-11 items-center rounded-md bg-navy px-5 text-white">
                Browse all products
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
