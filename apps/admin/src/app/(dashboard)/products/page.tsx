import type { Metadata } from "next";
import Link from "next/link";
import type { ProductWithCategory } from "@shop/db";
import { Flame, PackageSearch, Pencil, Plus } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { SearchInput, SelectFilter } from "@/components/filters";
import { Notice, param, withoutNotice } from "@/components/notice";
import { PageIntro } from "@/components/page-intro";
import { StockBadge } from "@/components/stock-badge";
import { Thumb } from "@/components/thumb";
import { Badge } from "@/components/ui/badge";
import { buttonClass } from "@/components/ui/button";
import { Card, TableScroll, td, th } from "@/components/ui/card";
import { getData } from "@/lib/data";
import { formatInt, formatPrice, withCount } from "@/lib/format";
import { LOW_STOCK_THRESHOLD } from "@/lib/orders";

export const metadata: Metadata = { title: "Бүтээгдэхүүн" };

const STATUS_OPTIONS = [
  { value: "", label: "Бүх төлөв" },
  { value: "active", label: "Идэвхтэй" },
  { value: "draft", label: "Ноорог" },
  { value: "trending", label: "Тренд" },
  { value: "low", label: "Нөөц багассан" },
];

const SORT_OPTIONS = [
  { value: "", label: "Шинэ нь эхэндээ" },
  { value: "name", label: "Нэрээр (А–Я)" },
  { value: "price-desc", label: "Үнэ: өндрөөс бага" },
  { value: "price-asc", label: "Үнэ: багаас өндөр" },
  { value: "stock", label: "Нөөц: багаас их" },
];

const NOTICES: Record<string, string> = {
  created: "Бүтээгдэхүүн нэмэгдлээ.",
  updated: "Өөрчлөлт хадгалагдлаа.",
  deleted: "Бүтээгдэхүүн устгагдлаа.",
};

function sortProducts(list: ProductWithCategory[], sort: string) {
  const sorted = [...list];
  switch (sort) {
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name, "mn"));
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "stock":
      return sorted.sort((a, b) => a.stock - b.stock);
    default:
      return sorted.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  }
}

export default async function ProductsPage({ searchParams }: PageProps<"/products">) {
  const sp = await searchParams;
  const q = param(sp.q).toLowerCase();
  const category = param(sp.category);
  const status = param(sp.status);
  const sort = param(sp.sort);
  const notice = NOTICES[param(sp.notice)];

  const data = await getData();
  const [all, categories] = await Promise.all([data.listProducts({ includeInactive: true }), data.listCategories()]);

  // Filter locally so search behaves the same on mock data and Supabase.
  const filtered = all.filter((p) => {
    if (category && p.category?.slug !== category) return false;
    if (status === "active" && !p.isActive) return false;
    if (status === "draft" && p.isActive) return false;
    if (status === "trending" && !p.isTrending) return false;
    if (status === "low" && p.stock > LOW_STOCK_THRESHOLD) return false;
    if (q && ![p.name, p.slug, p.category?.name ?? ""].some((s) => s.toLowerCase().includes(q))) return false;
    return true;
  });
  const products = sortProducts(filtered, sort);
  const drafts = all.filter((p) => !p.isActive).length;
  const hasFilters = Boolean(q || category || status);

  return (
    <div className="animate-fade-in">
      {notice ? <Notice message={notice} dismissHref={withoutNotice("/products", sp)} /> : null}

      <PageIntro
        actions={
          <Link href="/products/new" className={buttonClass({ variant: "primary" })}>
            <Plus aria-hidden />
            Бүтээгдэхүүн нэмэх
          </Link>
        }
      >
        Каталогт {withCount(all.length, "бүтээгдэхүүн")}
        {drafts ? ` · ${withCount(drafts, "ноорог")}` : ""}.
      </PageIntro>

      <Card>
        <div className="flex flex-col gap-3 border-b border-line p-4 md:flex-row md:items-center">
          <SearchInput placeholder="Нэр, slug эсвэл ангиллаар хайх" label="Бүтээгдэхүүн хайх" className="md:flex-1" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:flex md:w-auto">
            <SelectFilter
              param="category"
              label="Ангиллаар шүүх"
              options={[
                { value: "", label: "Бүх ангилал" },
                ...categories.map((c) => ({ value: c.slug, label: c.name })),
              ]}
              className="md:w-44"
            />
            <SelectFilter param="status" label="Төлөвөөр шүүх" options={STATUS_OPTIONS} className="md:w-36" />
            <SelectFilter
              param="sort"
              label="Эрэмбэлэх"
              options={SORT_OPTIONS}
              className="col-span-2 sm:col-span-1 md:w-44"
            />
          </div>
        </div>

        {products.length ? (
          <>
            <TableScroll>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line bg-page/60">
                    <th scope="col" className={th}>
                      Бүтээгдэхүүн
                    </th>
                    <th scope="col" className={th}>
                      Ангилал
                    </th>
                    <th scope="col" className={`${th} text-right`}>
                      Үнэ
                    </th>
                    <th scope="col" className={th}>
                      Нөөц
                    </th>
                    <th scope="col" className={th}>
                      Төлөв
                    </th>
                    <th scope="col" className={th}>
                      <span className="sr-only">Үйлдэл</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {products.map((p, index) => (
                    <tr key={p.id} className="group transition-colors hover:bg-page/60">
                      <td className={td}>
                        <Link href={`/products/${p.id}`} className="flex items-center gap-3">
                          <Thumb src={p.images[0]} alt="" size={44} eager={index < 8} />
                          <span className="min-w-0">
                            <span className="block max-w-[18rem] truncate font-semibold text-ink group-hover:text-tan-600">
                              {p.name}
                            </span>
                            <span className="block max-w-[18rem] truncate text-xs text-muted">/{p.slug}</span>
                          </span>
                        </Link>
                      </td>
                      <td className={`${td} text-muted`}>{p.category?.name ?? "—"}</td>
                      <td className={`${td} text-right tabular-nums`}>
                        <span className="font-semibold text-ink">{formatPrice(p.price)}</span>
                        {p.compareAtPrice ? (
                          <span className="block text-xs text-subtle line-through">
                            {formatPrice(p.compareAtPrice)}
                          </span>
                        ) : null}
                      </td>
                      <td className={td}>
                        <StockBadge stock={p.stock} />
                      </td>
                      <td className={td}>
                        <span className="flex items-center gap-1.5">
                          <Badge tone={p.isActive ? "success" : "neutral"}>{p.isActive ? "Идэвхтэй" : "Ноорог"}</Badge>
                          {p.isTrending ? (
                            <Badge tone="tan" icon={<Flame aria-hidden />}>
                              Тренд
                            </Badge>
                          ) : null}
                        </span>
                      </td>
                      <td className={`${td} text-right`}>
                        <Link
                          href={`/products/${p.id}`}
                          className={buttonClass({ variant: "ghost", size: "icon" })}
                          aria-label={`Засах: ${p.name}`}
                        >
                          <Pencil aria-hidden />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableScroll>
            <p className="border-t border-line px-5 py-3 text-xs text-muted">
              Харуулж буй: {formatInt(products.length)} / {withCount(all.length, "бүтээгдэхүүн")}
            </p>
          </>
        ) : (
          <EmptyState
            icon={<PackageSearch />}
            title={hasFilters ? "Шүүлтүүрт тохирох бүтээгдэхүүн алга" : "Бүтээгдэхүүн алга байна"}
            action={
              hasFilters ? (
                <Link href="/products" className={buttonClass({ variant: "secondary" })}>
                  Шүүлтүүр арилгах
                </Link>
              ) : (
                <Link href="/products/new" className={buttonClass({ variant: "primary" })}>
                  <Plus aria-hidden /> Анхны бүтээгдэхүүнээ нэмэх
                </Link>
              )
            }
          >
            {hasFilters ? "Өөр түлхүүр үг, ангилал эсвэл төлөв сонгоод үзнэ үү." : "Нэмсэн бүтээгдэхүүн энд харагдана."}
          </EmptyState>
        )}
      </Card>
    </div>
  );
}
