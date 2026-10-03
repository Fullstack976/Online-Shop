import type { Metadata } from "next";
import Link from "next/link";
import { Gift, Heart, Package, UserRound } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "My Account" };

export default function AccountPage() {
  return (
    <>
      <PageHeader title="My account" crumbs={[{ label: "My Account" }]} />
      <div className="container-page grid gap-8 py-12 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl border border-line p-8">
          <span className="grid size-14 place-items-center rounded-full bg-beige">
            <UserRound className="size-7 text-navy" strokeWidth={1.5} aria-hidden />
          </span>
          <h2 className="mt-5 font-display text-2xl font-extrabold text-navy">Customer accounts are coming soon</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink/70">
            For now you can check out as a guest — we&apos;ll email your order confirmation and tracking details. Members will
            soon get order history, saved addresses and exclusive deals.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/shop" className="label-caps inline-flex h-11 items-center rounded-md bg-navy px-5 text-white hover:bg-navy-700">
              Continue shopping
            </Link>
            <Link href="/contact" className="label-caps inline-flex h-11 items-center rounded-md border border-navy px-5 text-navy hover:bg-navy hover:text-white">
              Need help?
            </Link>
          </div>
        </div>
        <ul className="grid content-start gap-4">
          {[
            { icon: Package, title: "Order tracking", text: "Follow every order from warehouse to doorstep." },
            { icon: Heart, title: "Wishlist", text: "Save favourites and get notified when prices drop." },
            { icon: Gift, title: "Member rewards", text: "Earn points on every purchase and unlock exclusive offers." },
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
