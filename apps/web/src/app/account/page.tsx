import type { Metadata } from "next";
import Link from "next/link";
import { Gift, Heart, Package, UserRound } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Миний бүртгэл" };

export default function AccountPage() {
  return (
    <>
      <PageHeader title="Миний бүртгэл" crumbs={[{ label: "Миний бүртгэл" }]} />
      <div className="container-page grid gap-8 py-12 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl border border-line p-8">
          <span className="grid size-14 place-items-center rounded-full bg-beige">
            <UserRound className="size-7 text-navy" strokeWidth={1.5} aria-hidden />
          </span>
          <h2 className="mt-5 font-display text-2xl font-extrabold text-navy">Хэрэглэгчийн бүртгэл тун удахгүй</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink/70">
            Одоогоор та бүртгэлгүйгээр захиалга өгөх боломжтой — захиалгын баталгаажуулалт, хянах мэдээллийг имэйлээр
            илгээнэ. Удахгүй гишүүд захиалгын түүх, хадгалсан хаяг, онцгой хямдрал авах боломжтой болно.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/shop" className="label-caps inline-flex h-11 items-center rounded-md bg-navy px-5 text-white hover:bg-navy-700">
              Худалдан авалт үргэлжлүүлэх
            </Link>
            <Link href="/contact" className="label-caps inline-flex h-11 items-center rounded-md border border-navy px-5 text-navy hover:bg-navy hover:text-white">
              Тусламж хэрэгтэй юу?
            </Link>
          </div>
        </div>
        <ul className="grid content-start gap-4">
          {[
            { icon: Package, title: "Захиалга хянах", text: "Захиалга бүрээ агуулахаас таны үүдэнд хүртэл хянах." },
            { icon: Heart, title: "Хүслийн жагсаалт", text: "Дуртай бараагаа хадгалж, үнэ буурахад мэдэгдэл авах." },
            { icon: Gift, title: "Гишүүний урамшуулал", text: "Худалдан авалт бүрээс оноо цуглуулж, онцгой санал авах." },
          ].map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-4 rounded-xl bg-cloud p-5">
              <Icon className="size-6 shrink-0 text-tan" strokeWidth={1.6} aria-hidden />
              <div>
                <p className="font-display font-bold text-navy">{title}</p>
                <p className="mt-1 text-sm text-muted">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
