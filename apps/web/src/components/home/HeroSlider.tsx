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
    eyebrow: "ShopLuxe-д тавтай морил",
    title: ["Бүх зүйл.", "Хүн бүрт."],
    script: "Шилдэг чанар, хямд үнэ!",
    body: "Танд зориулан шилсэн чанартай олон төрлийн бараатай танилцаарай.",
    primary: { label: "Худалдан авах", href: "/shop" },
    secondary: { label: "Цуглуулга үзэх", href: "/collections" },
    badge: { top: "Хүртэл", big: "50%", bottom: "Хямдрал" },
    art: "collage",
  },
  {
    eyebrow: "Шинэ улирлын бараа",
    title: ["Өөрийн", "хэв маяг."],
    script: "Өдөр бүр шинэ төрх",
    body: "Тав тухтай, удаан эдэлгээтэй өдөр тутмын хувцас болон онцгой загварууд.",
    primary: { label: "Хувцас үзэх", href: "/shop?category=fashion" },
    secondary: { label: "Шинэ бараа", href: "/shop?sort=newest" },
    badge: { top: "Шинэ", big: "40+", bottom: "Загвар" },
    art: { src: siteImage("hero-fashion"), alt: "Өлгүүрт эмх цэгцтэй өлгөсөн цамц, сүлжмэл хувцас" },
  },
  {
    eyebrow: "Технологийн долоо хоног",
    title: ["Ухаалаг.", "Өдөр бүр."],
    script: "Таны дуртай гаджетууд",
    body: "Ухаалаг цаг, чихэвч, чанга яригч болон бусад — $50-аас дээш захиалгад хүргэлт үнэгүй.",
    primary: { label: "Электроник үзэх", href: "/shop?category=electronics" },
    secondary: { label: "Хямдрал үзэх", href: "/shop?sale=1" },
    badge: { top: "Хэмнэлт", big: "30%", bottom: "Техник" },
    art: { src: siteImage("hero-tech"), alt: "Ширээн дээрх зөөврийн компьютер, утас, чихэвч, камер" },
  },
];

const perks = [
  { icon: Truck, title: "Үнэгүй хүргэлт", text: "$50-аас дээш захиалгад" },
  { icon: RotateCcw, title: "Хялбар буцаалт", text: "30 хоногийн дотор" },
  { icon: CreditCard, title: "Аюулгүй төлбөр", text: "100% найдвартай" },
];

function Collage() {
  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-[340px] sm:max-w-[560px]">
      <div className="absolute inset-[6%_4%_4%_22%] overflow-hidden rounded-[28px] bg-white shadow-xl shadow-navy/10">
        <Image
          src={siteImage("hero-backpack")}
          alt="Арьсан үүргэвч"
          fill
          priority
          sizes="(min-width: 1024px) 420px, 70vw"
          className="object-cover"
        />
      </div>
      <div className="absolute left-[2%] top-[10%] w-[24%] overflow-hidden rounded-2xl bg-white p-1.5 shadow-lg shadow-navy/10">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
          <Image src={siteImage("hero-bottle")} alt="Термос усны сав" fill sizes="140px" className="object-cover" />
        </div>
      </div>
      <div className="absolute bottom-[2%] left-[6%] w-[34%] overflow-hidden rounded-2xl bg-white p-1.5 shadow-lg shadow-navy/10">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
          <Image src={siteImage("hero-sneakers")} alt="Пүүз" fill sizes="200px" className="object-cover" />
        </div>
      </div>
      <div className="absolute -bottom-[3%] right-[-2%] w-[30%] overflow-hidden rounded-2xl bg-white p-1.5 shadow-lg shadow-navy/10">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
          <Image src={siteImage("hero-sunglasses")} alt="Нарны шил" fill sizes="180px" className="object-cover" />
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
      aria-label="Онцлох урамшуулал"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="pointer-events-none absolute -right-32 -top-32 size-[520px] rounded-full bg-white/50" aria-hidden />
      <div className="container-page relative grid items-center gap-8 pb-12 pt-8 sm:gap-10 sm:py-12 lg:min-h-[520px] lg:grid-cols-[1fr_1.05fr] lg:py-14">
        <div key={`text-${index}`} className="animate-fade-in relative z-10 lg:pl-8">
          <p className="label-caps text-tan">{slide.eyebrow}</p>
          <h1 className="mt-3 font-display text-[36px] font-extrabold uppercase leading-[1.02] tracking-tight text-navy sm:text-6xl lg:text-[64px]">
            {slide.title[0]}
            <br />
            {slide.title[1]}
          </h1>
          <p className="mt-2 font-script text-[28px] font-semibold text-tan sm:mt-3 sm:text-4xl">{slide.script}</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink/75 sm:mt-5 sm:text-[15px]">{slide.body}</p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-7 sm:flex sm:flex-wrap">
            <Link
              href={slide.primary.href}
              className="label-caps inline-flex h-12 items-center justify-center gap-2 rounded-md bg-navy px-3 text-[11px] text-white transition hover:bg-navy-700 sm:px-6 sm:text-xs"
            >
              {slide.primary.label} <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              href={slide.secondary.href}
              className="label-caps inline-flex h-12 items-center justify-center rounded-md border border-navy/80 bg-white/40 px-3 text-[11px] text-navy transition hover:bg-navy hover:text-white sm:px-6 sm:text-xs"
            >
              {slide.secondary.label}
            </Link>
          </div>
          <ul className="mt-7 grid max-w-lg grid-cols-3 gap-2 sm:mt-10 sm:gap-4">
            {perks.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex flex-col items-center gap-1.5 text-center sm:flex-row sm:gap-3 sm:text-left">
                <Icon className="size-6 shrink-0 text-navy" strokeWidth={1.5} aria-hidden />
                <span>
                  <span className="label-caps block text-[9.5px] text-navy sm:text-[10.5px]">{title}</span>
                  <span className="block text-[11px] leading-snug text-muted sm:text-xs">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div key={`art-${index}`} className="animate-fade-in relative">
          {slide.art === "collage" ? (
            <Collage />
          ) : (
            <div className="relative mx-auto aspect-[5/4] w-full max-w-[340px] overflow-hidden rounded-[28px] shadow-xl shadow-navy/10 sm:max-w-[560px]">
              <Image src={slide.art.src} alt={slide.art.alt} fill sizes="(min-width: 1024px) 560px, 90vw" className="object-cover" />
            </div>
          )}
          <div className="absolute right-[2%] top-0 grid size-20 place-items-center rounded-full bg-navy text-center text-white shadow-lg sm:right-[4%] sm:size-28 lg:right-[10%]">
            <div className="leading-none">
              <span className="label-caps block text-[10px]">{slide.badge.top}</span>
              <span className="block font-display text-2xl font-extrabold text-tan sm:text-[34px]">{slide.badge.big}</span>
              <span className="label-caps block text-[10px]">{slide.badge.bottom}</span>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => go(index - 1)}
        className="absolute left-2 top-1/2 hidden size-10 -translate-y-1/2 place-items-center rounded-full text-navy transition hover:bg-white/70 md:grid"
        aria-label="Өмнөх слайд"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        onClick={() => go(index + 1)}
        className="absolute right-2 top-1/2 hidden size-10 -translate-y-1/2 place-items-center rounded-full text-navy transition hover:bg-white/70 md:grid"
        aria-label="Дараах слайд"
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
            aria-label={`${i + 1}-р слайд руу шилжих`}
            aria-current={i === index}
          />
        ))}
      </div>
    </section>
  );
}
