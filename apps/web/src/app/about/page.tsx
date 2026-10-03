import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HeartHandshake, Leaf, ShieldCheck, Sparkles } from "lucide-react";
import { siteImage } from "@shop/db/assets";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "About Us" };

const stats = [
  { value: "25K+", label: "Happy customers" },
  { value: "500+", label: "Curated products" },
  { value: "4.8/5", label: "Average rating" },
  { value: "48h", label: "Average delivery" },
];

const values = [
  { icon: Sparkles, title: "Handpicked quality", text: "Every product is tested by our team before it reaches the store." },
  { icon: ShieldCheck, title: "Shop with confidence", text: "Secure checkout, honest pricing and a 30-day return policy." },
  { icon: Leaf, title: "Thoughtful packaging", text: "Recyclable boxes and plastic-free fillers on every order." },
  { icon: HeartHandshake, title: "Real human support", text: "Friendly experts available seven days a week." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader title="About us" crumbs={[{ label: "About Us" }]} />
      <section className="container-page grid items-center gap-10 py-14 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <Image
            src={siteImage("about-store")}
            alt="Inside the ShopLuxe store"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="label-caps text-tan">Our story</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold uppercase leading-tight text-navy sm:text-4xl">
            Everything you need, <span className="font-script normal-case text-tan">all in one place</span>
          </h2>
          <p className="mt-5 leading-relaxed text-ink/75">
            ShopLuxe started with a simple idea: shopping online should feel as good as walking into your favourite
            neighbourhood store. We search the world for products that look great, work brilliantly and are priced fairly
            — from everyday essentials to gifts worth remembering.
          </p>
          <p className="mt-4 leading-relaxed text-ink/75">
            Today we serve thousands of customers, but we still pack every order with the same care as our very first one.
          </p>
          <Link href="/shop" className="label-caps mt-7 inline-flex h-12 items-center rounded-md bg-navy px-6 text-white hover:bg-navy-700">
            Start shopping
          </Link>
        </div>
      </section>

      <section className="bg-navy text-white">
        <div className="container-page grid grid-cols-2 gap-8 py-12 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-4xl font-extrabold text-tan">{s.value}</p>
              <p className="label-caps mt-2 text-white/75">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-16">
        <h2 className="text-center font-display text-lg font-extrabold uppercase tracking-wide text-navy">What we stand for</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-xl bg-cloud p-6">
              <Icon className="size-8 text-tan" strokeWidth={1.5} aria-hidden />
              <h3 className="mt-4 font-display font-bold text-navy">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
