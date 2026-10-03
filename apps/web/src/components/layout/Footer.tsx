import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { site } from "@/lib/site";
import { Logo } from "./Logo";

const columns = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "Shop", href: "/shop" },
      { label: "Collections", href: "/collections" },
      { label: "About Us", href: "/about" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Customer Service",
    links: [
      { label: "FAQs", href: "/contact#faq" },
      { label: "Shipping Policy", href: "/contact#faq" },
      { label: "Returns & Refunds", href: "/contact#faq" },
      { label: "Terms & Conditions", href: "/about" },
      { label: "Privacy Policy", href: "/about" },
    ],
  },
  {
    title: "My Account",
    links: [
      { label: "My Account", href: "/account" },
      { label: "Order History", href: "/account" },
      { label: "Shopping Cart", href: "/cart" },
      { label: "Checkout", href: "/checkout" },
      { label: "Login / Register", href: "/account" },
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
          <h3 className="label-caps text-white">Contact Us</h3>
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
          <p>© {new Date().getFullYear()} {site.name}. All Rights Reserved.</p>
          <ul className="flex flex-wrap items-center justify-center gap-2" aria-label="Accepted payment methods">
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
