import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { formatPostDate, posts } from "@/lib/posts";

export const metadata: Metadata = { title: "Блог" };

export default function BlogPage() {
  const [featured, ...rest] = posts;
  return (
    <>
      <PageHeader title="Блог" crumbs={[{ label: "Блог" }]} subtitle="ShopLuxe багийн зөвлөгөө, чиг хандлага, санаа." />
      <div className="container-page py-12">
        {featured && (
          <Link href={`/blog/${featured.slug}`} className="group grid overflow-hidden rounded-2xl border border-line lg:grid-cols-2">
            <div className="relative aspect-[16/10] lg:aspect-auto">
              <Image src={featured.image} alt="" fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
            </div>
            <div className="flex flex-col justify-center p-8 lg:p-12">
              <p className="label-caps text-tan">{featured.category}</p>
              <h2 className="mt-3 font-display text-2xl font-extrabold text-navy group-hover:text-tan sm:text-3xl">{featured.title}</h2>
              <p className="mt-3 text-ink/70">{featured.excerpt}</p>
              <p className="mt-5 text-xs text-muted">
                {formatPostDate(featured.date)} · {featured.readMinutes} мин унших
              </p>
            </div>
          </Link>
        )}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group overflow-hidden rounded-2xl border border-line">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image src={post.image} alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <p className="label-caps text-tan">{post.category}</p>
                <h2 className="mt-2 font-display text-lg font-bold text-navy group-hover:text-tan">{post.title}</h2>
                <p className="mt-2 text-sm text-ink/70">{post.excerpt}</p>
                <p className="mt-4 text-xs text-muted">
                  {formatPostDate(post.date)} · {post.readMinutes} мин унших
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
