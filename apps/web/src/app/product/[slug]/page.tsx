import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CreditCard, PackageCheck, RotateCcw, Truck } from "lucide-react";
import { discountPercent, formatPrice } from "@shop/db/utils";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { StarRating } from "@/components/product/StarRating";
import { Price } from "@/components/product/Price";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getData } from "@/lib/data";

export const revalidate = 60;

// Render product pages on first visit, then cache them (ISR) instead of rendering every request.
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getData().getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description,
    openGraph: { images: product.images.slice(0, 1) },
  };
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const data = getData();
  const product = await data.getProductBySlug(slug);
  if (!product || !product.isActive) notFound();

  const related = product.category
    ? (await data.listProducts({ categorySlug: product.category.slug, limit: 6 })).filter((p) => p.id !== product.id).slice(0, 5)
    : [];
  const discount = discountPercent(product.price, product.compareAtPrice);

  return (
    <>
      <div className="container-page py-8 lg:py-12">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted">
          <Link href="/" className="hover:text-tan">Home</Link>
          <span className="mx-1.5">/</span>
          <Link href="/shop" className="hover:text-tan">Shop</Link>
          {product.category && (
            <>
              <span className="mx-1.5">/</span>
              <Link href={`/shop?category=${product.category.slug}`} className="hover:text-tan">
                {product.category.name}
              </Link>
            </>
          )}
          <span className="mx-1.5">/</span>
          <span className="text-ink">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <ProductGallery images={product.images} name={product.name} badge={discount ? `-${discount}%` : undefined} />

          <div>
            {product.category && <p className="label-caps text-tan">{product.category.name}</p>}
            <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">{product.name}</h1>
            <div className="mt-3 flex items-center gap-3">
              <StarRating rating={product.rating} size="md" />
              <span className="text-sm text-muted">
                {product.rating.toFixed(1)} · {product.reviewCount} reviews
              </span>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Price price={product.price} compareAtPrice={product.compareAtPrice} size="lg" />
              {discount && product.compareAtPrice && (
                <span className="rounded-full bg-tan-100 px-3 py-1 text-xs font-bold text-tan-600">
                  You save {formatPrice(product.compareAtPrice - product.price)}
                </span>
              )}
            </div>
            <p className="mt-6 leading-relaxed text-ink/75">{product.description}</p>

            <p className="mt-6 flex items-center gap-2 text-sm">
              <span className={`size-2 rounded-full ${product.stock > 10 ? "bg-emerald-500" : product.stock > 0 ? "bg-amber-500" : "bg-red-500"}`} />
              {product.stock > 10 ? "In stock, ready to ship" : product.stock > 0 ? `Hurry — only ${product.stock} left` : "Out of stock"}
            </p>

            <div className="mt-6">
              <ProductPurchase
                product={{
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  image: product.images[0] ?? null,
                  stock: product.stock,
                }}
              />
            </div>

            <ul className="mt-8 grid gap-4 rounded-xl bg-cloud p-5 sm:grid-cols-2">
              {[
                { icon: Truck, title: "Free shipping", text: "On orders over $50" },
                { icon: RotateCcw, title: "Easy returns", text: "30-day return policy" },
                { icon: CreditCard, title: "Secure payment", text: "100% secure checkout" },
                { icon: PackageCheck, title: "Quality checked", text: "Handpicked products" },
              ].map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex items-center gap-3">
                  <Icon className="size-5 shrink-0 text-navy" strokeWidth={1.6} aria-hidden />
                  <span>
                    <span className="label-caps block text-[10.5px] text-navy">{title}</span>
                    <span className="block text-xs text-muted">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="container-page pb-16">
          <SectionHeading title="You may also like" href={`/shop?category=${product.category?.slug}`} />
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
