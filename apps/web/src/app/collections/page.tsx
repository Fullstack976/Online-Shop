import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { getData } from "@/lib/data";
import { collections } from "@/lib/site";

export const metadata: Metadata = { title: "Collections" };
export const revalidate = 60;

export default async function CollectionsPage() {
  const data = getData();
  const [categories, products] = await Promise.all([data.listCategories(), data.listProducts()]);
  const count = (id: string) => products.filter((p) => p.categoryId === id).length;
  const cover = (id: string) => products.find((p) => p.categoryId === id && p.images[0])?.images[0];
  // The first card spans two columns; widen the last one too when that leaves a gap in a 3-column grid.
  const widenLast = (categories.length + 1) % 3 === 2;

  return (
    <>
      <PageHeader
        title="Collections"
        crumbs={[{ label: "Collections" }]}
        subtitle="Browse every department, or jump straight into one of our curated edits."
      />
      <div className="container-page py-10">
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {collections.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="label-caps shrink-0 rounded-full border border-line px-4 py-2 text-[11px] text-navy transition hover:border-navy hover:bg-navy hover:text-white"
            >
              {c.label}
            </Link>
          ))}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => {
            const image = cover(c.id) ?? c.imageUrl;
            return (
              <Link
                key={c.id}
                href={`/shop?category=${c.slug}`}
                className={`group relative flex aspect-[4/3] items-end overflow-hidden rounded-2xl bg-navy ${
                  i === 0 || (widenLast && i === categories.length - 1) ? "lg:col-span-2 lg:aspect-auto" : ""
                }`}
              >
                {image && (
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover opacity-80 transition duration-700 group-hover:scale-105 group-hover:opacity-70"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/20 to-transparent" />
                <div className="relative flex w-full items-end justify-between gap-4 p-6 text-white">
                  <div>
                    <p className="label-caps text-tan">{count(c.id)} products</p>
                    <h2 className="mt-1 font-display text-2xl font-extrabold uppercase">{c.name}</h2>
                  </div>
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-navy transition group-hover:bg-tan group-hover:text-white">
                    <ArrowRight className="size-5" aria-hidden />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
