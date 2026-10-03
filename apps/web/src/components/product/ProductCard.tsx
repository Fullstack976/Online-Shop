import Image from "next/image";
import Link from "next/link";
import type { Product } from "@shop/db";
import { discountPercent } from "@shop/db/utils";
import { AddToCartButton } from "./AddToCartButton";
import { Price } from "./Price";
import { StarRating } from "./StarRating";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const discount = discountPercent(product.price, product.compareAtPrice);
  const image = product.images[0];

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-line bg-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-navy/5">
      <Link href={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden bg-cloud">
        {image && (
          <Image
            src={image}
            alt={product.name}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 240px, (min-width: 768px) 30vw, 50vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        )}
        {discount && (
          <span className="absolute right-2.5 top-2.5 rounded-full bg-navy px-2 py-0.5 font-display text-[11px] font-bold text-white">
            -{discount}%
          </span>
        )}
        {product.stock > 0 && product.stock <= 5 && (
          <span className="absolute bottom-2.5 left-2.5 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-red-600">
            Only {product.stock} left
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <h3 className="line-clamp-1 text-sm font-semibold text-ink">
          <Link href={`/product/${product.slug}`} className="hover:text-tan">
            {product.name}
          </Link>
        </h3>
        <StarRating rating={product.rating} count={product.reviewCount} />
        <Price price={product.price} compareAtPrice={product.compareAtPrice} />
        <div className="mt-auto pt-2">
          <AddToCartButton
            product={{
              productId: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              image: image ?? null,
              stock: product.stock,
            }}
          />
        </div>
      </div>
    </article>
  );
}
