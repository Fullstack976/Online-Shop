import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HeartHandshake, Leaf, ShieldCheck, Sparkles } from "lucide-react";
import { siteImage } from "@shop/db/assets";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Бидний тухай" };

const stats = [
  { value: "25K+", label: "Сэтгэл хангалуун хэрэглэгч" },
  { value: "500+", label: "Шилсэн бараа" },
  { value: "4.8/5", label: "Дундаж үнэлгээ" },
  { value: "48 цаг", label: "Дундаж хүргэлт" },
];

const values = [
  { icon: Sparkles, title: "Шилж авсан чанар", text: "Бараа бүрийг дэлгүүрт гаргахаас өмнө манай баг өөрсдөө туршиж шалгадаг." },
  { icon: ShieldCheck, title: "Итгэлтэй худалдан авалт", text: "Аюулгүй төлбөр, шударга үнэ, 30 хоногийн буцаалтын баталгаа." },
  { icon: Leaf, title: "Байгальд ээлтэй савлагаа", text: "Захиалга бүрт дахин боловсруулах хайрцаг, хуванцаргүй дүүргэгч ашигладаг." },
  { icon: HeartHandshake, title: "Жинхэнэ хүний тусламж", text: "Долоо хоногийн 7 өдөр туслахад бэлэн найрсаг мэргэжилтнүүд." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader title="Бидний тухай" crumbs={[{ label: "Бидний тухай" }]} />
      <section className="container-page grid items-center gap-10 py-14 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <Image
            src={siteImage("about-store")}
            alt="ShopLuxe дэлгүүрийн дотор тал"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="label-caps text-tan">Бидний түүх</p>
          <h2 className="mt-3 font-display text-3xl font-extrabold uppercase leading-tight text-navy sm:text-4xl">
            Танд хэрэгтэй бүхэн <span className="font-script normal-case text-tan">нэг дороос</span>
          </h2>
          <p className="mt-5 leading-relaxed text-ink/75">
            ShopLuxe энгийн нэгэн санаагаар эхэлсэн: онлайн худалдан авалт нь таны дуртай ойрын дэлгүүрт орохтой адил
            таатай байх ёстой. Бид харагдах байдал сайтай, сайн ажилладаг, шударга үнэтэй барааг дэлхийн өнцөг булан бүрээс
            хайж олдог — өдөр тутмын хэрэгцээнээс эхлээд дурсамж болох бэлэг хүртэл.
          </p>
          <p className="mt-4 leading-relaxed text-ink/75">
            Өнөөдөр бид мянга мянган хэрэглэгчдэд үйлчилж байгаа ч захиалга бүрийг анхны захиалга шигээ анхаарал халамжтай савладаг хэвээр.
          </p>
          <Link href="/shop" className="label-caps mt-7 inline-flex h-12 items-center rounded-md bg-navy px-6 text-white hover:bg-navy-700">
            Худалдан авалт эхлэх
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
        <h2 className="text-center font-display text-lg font-extrabold uppercase tracking-wide text-navy">Бидний үнэт зүйлс</h2>
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
