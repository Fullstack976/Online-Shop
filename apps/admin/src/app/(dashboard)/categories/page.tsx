import type { Metadata } from "next";
import { PageIntro } from "@/components/page-intro";
import { getData } from "@/lib/data";
import { withCount } from "@/lib/format";
import { CategoryManager } from "./category-manager";

export const metadata: Metadata = { title: "Ангилал" };

export default async function CategoriesPage() {
  const data = await getData();
  const [categories, products] = await Promise.all([
    data.listCategories(),
    data.listProducts({ includeInactive: true }),
  ]);

  const counts = new Map<string, number>();
  for (const p of products) counts.set(p.categoryId, (counts.get(p.categoryId) ?? 0) + 1);

  return (
    <div className="animate-fade-in">
      <PageIntro>
        {withCount(categories.length, "ангилал")} · нийт {withCount(products.length, "бүтээгдэхүүн")}.
      </PageIntro>
      <CategoryManager
        categories={categories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          imageUrl: c.imageUrl,
          sortOrder: c.sortOrder,
          productCount: counts.get(c.id) ?? 0,
        }))}
      />
    </div>
  );
}
