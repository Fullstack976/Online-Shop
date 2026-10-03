"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, CreditCard, RotateCcw, Truck } from "lucide-react";
import { siteImage } from "@shop/db/assets";
import { cn } from "@/lib/cn";

type Slide = {
  eyebrow: string;
  title: [string, string];
  script: string;
  body: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  badge: { top: string; big: string; bottom: string };
  art: "collage" | { src: string; alt: string };
};

const slides: Slide[] = [
  {
    eyebrow: "Welcome to ShopLuxe",
    title: ["Everything.", "For everyone."],
    script: "Best Quality, Best Prices!",
    body: "Discover a wide range of top-quality products handpicked just for you.",
    primary: { label: "Shop now", href: "/shop" },
    secondary: { label: "Explore collections", href: "/collections" },
    badge: { top: "Up to", big: "50%", bottom: "Off" },
    art: "collage",
  },
  {
    eyebrow: "New season arrivals",
    title: ["Style that", "speaks."],
    script: "Fresh looks, every day",
    body: "Wardrobe essentials and statement pieces — curated for comfort and made to last.",
    primary: { label: "Shop fashion", href: "/shop?category=fashion" },
    secondary: { label: "New arrivals", href: "/shop?sort=newest" },
    badge: { top: "New", big: "40+", bottom: "Styles" },
    art: { src: siteImage("hero-fashion"), alt: "Rail of neatly hung shirts and knitwear" },
  },
  {
    eyebrow: "Tech week deals",
    title: ["Smarter.", "Every day."],
    script: "Gadgets you'll love",
    body: "Smart watches, earbuds, speakers and more — with free shipping on orders over $50.",
    primary: { label: "Shop electronics", href: "/shop?category=electronics" },
    secondary: { label: "View deals", href: "/shop?sale=1" },
    badge: { top: "Save", big: "30%", bottom: "On tech" },
    art: { src: siteImage("hero-tech"), alt: "Laptop, phone, headphones and camera on a desk" },
  },
];

const perks = [
  { icon: Truck, title: "Free shipping", text: "On orders over $50" },
  { icon: RotateCcw, title: "Easy returns", text: "30-day return policy" },
  { icon: CreditCard, title: "Secure payment", text: "100% secure checkout" },
];

function Collage() {
  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-[560px]">
      <div className="absolute inset-[6%_4%_4%_22%] overflow-hidden rounded-[28px] bg-white shadow-xl shadow-navy/10">
        <Image
          src={siteImage("hero-backpack")}
          alt="Leather backpack"
          fill
          priority
          sizes="(min-width: 1024px) 420px, 70vw"
          className="object-cover"
        />
      </div>
      <div className="absolute left-[2%] top-[10%] w-[24%] overflow-hidden rounded-2xl bg-white p-1.5 shadow-lg shadow-navy/10">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
          <Image src={siteImage("hero-bottle")} alt="Insulated water bottle" fill sizes="140px" className="object-cover" />
        </div>
      </div>
      <div className="absolute bottom-[2%] left-[6%] w-[34%] overflow-hidden rounded-2xl bg-white p-1.5 shadow-lg shadow-navy/10">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
          <Image src={siteImage("hero-sneakers")} alt="Sneakers" fill sizes="200px" className="object-cover" />
        </div>
      </div>
      <div className="absolute -bottom-[3%] right-[-2%] w-[30%] overflow-hidden rounded-2xl bg-white p-1.5 shadow-lg shadow-navy/10">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
          <Image src={siteImage("hero-sunglasses")} alt="Sunglasses" fill sizes="180px" className="object-cover" />
        </div>
      </div>
    </div>
  );
}

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = useCallback((next: number) => setIndex((next + slides.length) % slides.length), []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 7000);
    return () => clearInterval(t);
  }, [paused]);

  const slide = slides[index]!;

  return (
    <section
      className="relative overflow-hidden bg-beige"
      aria-roledescription="carousel"
      aria-label="Featured promotions"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute -right-32 -top-32 size-[520px] rounded-full bg-white/50" aria-hidden />
      <div className="container-page relative grid items-center gap-10 py-12 lg:min-h-[520px] lg:grid-cols-[1fr_1.05fr] lg:py-14">
        <div key={`text-${index}`} className="animate-fade-in relative z-10 lg:pl-8">
          <p className="label-caps text-tan">{slide.eyebrow}</p>
          <h1 className="mt-4 font-display text-[40px] font-extrabold uppercase leading-[1.02] tracking-tight text-navy sm:text-6xl lg:text-[64px]">
            {slide.title[0]}
            <br />
            {slide.title[1]}
          </h1>
          <p className="mt-3 font-script text-3xl text-tan sm:text-4xl">{slide.script}</p>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-ink/75">{slide.body}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={slide.primary.href}
              className="label-caps inline-flex h-12 items-center gap-2 rounded-md bg-navy px-6 text-white transition hover:bg-navy-700"
            >
              {slide.primary.label} <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href={slide.secondary.href}
              className="label-caps inline-flex h-12 items-center rounded-md border border-navy/80 bg-white/40 px-6 text-navy transition hover:bg-navy hover:text-white"
            >
              {slide.secondary.label}
            </Link>
          </div>
          <ul className="mt-10 grid max-w-lg grid-cols-1 gap-4 sm:grid-cols-3">
            {perks.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-center gap-3">
                <Icon className="size-6 shrink-0 text-navy" strokeWidth={1.5} aria-hidden />
                <span>
                  <span className="label-caps block text-[10.5px] text-navy">{title}</span>
                  <span className="block text-xs text-muted">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div key={`art-${index}`} className="animate-fade-in relative">
          {slide.art === "collage" ? (
            <Collage />
          ) : (
            <div className="relative mx-auto aspect-[5/4] w-full max-w-[560px] overflow-hidden rounded-[28px] shadow-xl shadow-navy/10">
              <Image src={slide.art.src} alt={slide.art.alt} fill sizes="(min-width: 1024px) 560px, 90vw" className="object-cover" />
            </div>
          )}
          <div className="absolute right-[4%] top-0 grid size-24 place-items-center rounded-full bg-navy text-center text-white shadow-lg sm:size-28 lg:right-[10%]">
            <div className="leading-none">
              <span className="label-caps block text-[10px]">{slide.badge.top}</span>
              <span className="block font-display text-3xl font-extrabold text-tan sm:text-[34px]">{slide.badge.big}</span>
              <span className="label-caps block text-[10px]">{slide.badge.bottom}</span>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => go(index - 1)}
        className="absolute left-2 top-1/2 hidden size-10 -translate-y-1/2 place-items-center rounded-full text-navy transition hover:bg-white/70 md:grid"
        aria-label="Previous slide"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        onClick={() => go(index + 1)}
        className="absolute right-2 top-1/2 hidden size-10 -translate-y-1/2 place-items-center rounded-full text-navy transition hover:bg-white/70 md:grid"
        aria-label="Next slide"
      >
        <ChevronRight className="size-5" />
      </button>
      <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s.eyebrow}
            type="button"
            onClick={() => go(i)}
            className={cn("h-2 rounded-full transition-all", i === index ? "w-6 bg-navy" : "w-2 bg-navy/25 hover:bg-navy/50")}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
          />
        ))}
      </div>
    </section>
  );
}
