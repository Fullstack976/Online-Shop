import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { CalendarDays, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getData } from "@/lib/data";
import { supabaseEnv } from "@/lib/env";
import { formatDateLong, formatInt } from "@/lib/format";
import { UUID_PATTERN } from "@/lib/validation";
import { DeleteProduct } from "../delete-product";
import { ProductForm } from "../product-form";

// Shared by generateMetadata and the page within one request.
const loadProduct = cache(async (id: string) => {
  if (!UUID_PATTERN.test(id)) return null;
  const data = await getData();
  return data.getProductById(id);
});

export async function generateMetadata({ params }: PageProps<"/products/[id]">): Promise<Metadata> {
  const { id } = await params;
  const product = await loadProduct(id);
  return { title: product ? `Засах: ${product.name}` : "Бүтээгдэхүүн олдсонгүй" };
}

export default async function EditProductPage({ params }: PageProps<"/products/[id]">) {
  const { id } = await params;
  const product = await loadProduct(id);
  if (!product) notFound();

  const data = await getData();
  const categories = await data.listCategories();

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
        <h2 className="font-display text-xl font-bold tracking-tight text-navy">{product.name}</h2>
        <Badge tone={product.isActive ? "success" : "neutral"}>{product.isActive ? "Идэвхтэй" : "Ноорог"}</Badge>
        <span className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
          <span className="inline-flex items-center gap-1">
            <CalendarDays className="size-3.5" aria-hidden /> Нэмсэн: {formatDateLong(product.createdAt)}
          </span>
          {product.reviewCount ? (
            <span className="inline-flex items-center gap-1">
              <Star className="size-3.5 fill-tan text-tan" aria-hidden /> {product.rating.toFixed(1)} ·{" "}
              {formatInt(product.reviewCount)} сэтгэгдэл
            </span>
          ) : null}
        </span>
      </div>

      <ProductForm
        key={product.id}
        productId={product.id}
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        uploadEnabled={Boolean(supabaseEnv())}
        initial={{
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price.toFixed(2),
          compareAtPrice: product.compareAtPrice === null ? "" : product.compareAtPrice.toFixed(2),
          categoryId: product.categoryId,
          stock: String(product.stock),
          images: product.images,
          isTrending: product.isTrending,
          isActive: product.isActive,
        }}
      />

      <DeleteProduct id={product.id} name={product.name} />
    </>
  );
}
