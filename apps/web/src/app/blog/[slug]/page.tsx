import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { formatPostDate, posts } from "@/lib/posts";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  return post ? { title: post.title, description: post.excerpt } : {};
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <article className="container-page max-w-3xl py-12">
      <Link href="/blog" className="label-caps inline-flex items-center gap-2 text-[11px] text-navy hover:text-tan">
        <ArrowLeft className="size-4" aria-hidden /> All posts
      </Link>
      <p className="label-caps mt-8 text-tan">{post.category}</p>
      <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight text-navy sm:text-4xl">{post.title}</h1>
      <p className="mt-3 text-sm text-muted">
        {formatPostDate(post.date)} · {post.readMinutes} min read
      </p>
      <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl">
        <Image src={post.image} alt="" fill priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
      </div>
      <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink/80">
        <p className="font-medium text-ink">{post.excerpt}</p>
        {post.body.map((para) => (
          <p key={para}>{para}</p>
        ))}
      </div>
      <Link href="/shop" className="label-caps mt-10 inline-flex h-12 items-center rounded-md bg-navy px-6 text-white hover:bg-navy-700">
        Shop the story
      </Link>
    </article>
  );
}
