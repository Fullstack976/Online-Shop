import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { site } from "@/lib/site";
import { Logo } from "./Logo";

const columns = [
  {
    title: "Холбоосууд",
    links: [
      { label: "Нүүр", href: "/" },
      { label: "Дэлгүүр", href: "/shop" },
      { label: "Цуглуулга", href: "/collections" },
      { label: "Бидний тухай", href: "/about" },
      { label: "Холбоо барих", href: "/contact" },
    ],
  },
  {
    title: "Үйлчилгээ",
    links: [
      { label: "Түгээмэл асуулт", href: "/contact#faq" },
      { label: "Хүргэлтийн нөхцөл", href: "/contact#faq" },
      { label: "Буцаалт ба мөнгө буцаах", href: "/contact#faq" },
      { label: "Үйлчилгээний нөхцөл", href: "/about" },
      { label: "Нууцлалын бодлого", href: "/about" },
    ],
  },
  {
    title: "Миний бүртгэл",
    links: [
      { label: "Миний бүртгэл", href: "/account" },
      { label: "Захиалгын түүх", href: "/account" },
      { label: "Сагс", href: "/cart" },
      { label: "Захиалга хийх", href: "/checkout" },
      { label: "Нэвтрэх / Бүртгүүлэх", href: "/account" },
    ],
  },
];

const payments = ["VISA", "Mastercard", "PayPal", "Apple Pay", "G Pay"];

export function Footer() {
  return (
    <footer className="mt-auto bg-navy text-white">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.3fr]">
        <div className="max-w-xs">
          <Logo inverted />
          <p className="mt-5 text-sm leading-relaxed text-white/65">{site.description}</p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="label-caps text-white">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-white/65 transition hover:text-tan">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h3 className="label-caps text-white">Холбоо барих</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/65">
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-tan" aria-hidden />
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-tan">
                {site.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 size-4 shrink-0 text-tan" aria-hidden />
              <a href={`mailto:${site.email}`} className="break-all hover:text-tan">
                {site.email}
              </a>
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-tan" aria-hidden />
              <span>
                {site.address[0]}
                <br />
                {site.address[1]}
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-5 text-xs text-white/55 sm:flex-row">
          <p>© {new Date().getFullYear()} {site.name}. Бүх эрх хуулиар хамгаалагдсан.</p>
          <ul className="flex flex-wrap items-center justify-center gap-2" aria-label="Хүлээн авах төлбөрийн хэрэгсэл">
            {payments.map((p) => (
              <li key={p} className="rounded bg-white px-2 py-1 font-display text-[10px] font-extrabold italic tracking-wide text-navy">
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
