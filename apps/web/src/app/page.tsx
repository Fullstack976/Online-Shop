import { CategoryGrid } from "@/components/home/CategoryGrid";
import { HeroSlider } from "@/components/home/HeroSlider";
import { PromoBanners } from "@/components/home/PromoBanners";
import { TrustNewsletter } from "@/components/home/TrustNewsletter";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getData } from "@/lib/data";

export const revalidate = 60;

export default async function HomePage() {
  const data = getData();
  const [categories, trending, newest] = await Promise.all([
    data.listCategories(),
    data.listProducts({ trending: true, limit: 5 }),
    data.listProducts({ sort: "rating", limit: 5 }),
  ]);

  return (
    <>
      <HeroSlider />
      <CategoryGrid categories={categories} />

      <section className="container-page pb-10">
        <SectionHeading title="Trending products" href="/shop?trending=1" linkLabel="View all products" />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
          {trending.map((p, i) => (
            <ProductCard key={p.id} product={p} priority={i < 2} />
          ))}
        </div>
      </section>

      <PromoBanners />

      <section className="container-page py-10">
        <SectionHeading title="Top rated" href="/shop?sort=rating" linkLabel="See more" />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
          {newest.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <TrustNewsletter />
    </>
  );
}
