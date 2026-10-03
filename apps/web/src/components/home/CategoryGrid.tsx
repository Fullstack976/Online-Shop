import Image from "next/image";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import type { Category } from "@shop/db";

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <section className="container-page py-12">
      <h2 className="text-center font-display text-base font-extrabold uppercase tracking-wide text-navy sm:text-lg">
        Browse by category
      </h2>
      <ul className="no-scrollbar -mx-4 mt-6 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0 lg:grid-cols-8">
        {categories.map((c) => (
          <li key={c.id} className="w-[132px] shrink-0 snap-start sm:w-auto">
            <Link
              href={`/shop?category=${c.slug}`}
              className="group flex h-full flex-col items-center rounded-xl bg-cloud p-3 pb-4 transition hover:-translate-y-0.5 hover:bg-tan-100"
            >
              <span className="relative block aspect-square w-full overflow-hidden rounded-lg">
                {c.imageUrl && (
                  <Image
                    src={c.imageUrl}
                    alt=""
                    fill
                    sizes="140px"
                    className="object-cover mix-blend-multiply transition duration-500 group-hover:scale-105"
                  />
                )}
              </span>
              <span className="mt-3 text-center text-xs font-semibold text-ink">{c.name}</span>
            </Link>
          </li>
        ))}
        <li className="w-[132px] shrink-0 snap-start sm:w-auto">
          <Link
            href="/collections"
            className="group flex h-full flex-col items-center rounded-xl bg-cloud p-3 pb-4 transition hover:-translate-y-0.5 hover:bg-tan-100"
          >
            <span className="grid aspect-square w-full place-items-center">
              <LayoutGrid className="size-10 text-navy transition group-hover:scale-110" strokeWidth={1.3} aria-hidden />
            </span>
            <span className="mt-3 text-center text-xs font-semibold text-ink">More Categories</span>
          </Link>
        </li>
      </ul>
    </section>
  );
}
