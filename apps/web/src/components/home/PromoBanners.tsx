import Link from "next/link";
import { ArrowRight, Gift, Package, Percent } from "lucide-react";

export function PromoBanners() {
  return (
    <section className="container-page py-6">
      <div className="grid overflow-hidden rounded-xl md:grid-cols-3">
        <Link href="/shop" className="group flex items-center gap-5 bg-navy px-7 py-8 text-white">
          <Package className="size-12 shrink-0 text-white" strokeWidth={1.2} aria-hidden />
          <div>
            <p className="font-display text-sm font-extrabold uppercase tracking-wide">Free shipping</p>
            <p className="mt-1 text-sm text-white/75">On orders over $50</p>
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold">
              Shop Now <ArrowRight className="size-3.5 transition group-hover:translate-x-1" aria-hidden />
            </p>
          </div>
        </Link>
        <Link href="/shop?sale=1" className="group flex items-center gap-5 bg-tan px-7 py-8 text-white">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-tan">
            <Percent className="size-6" strokeWidth={2.2} aria-hidden />
          </span>
          <div>
            <p className="font-display text-sm font-extrabold uppercase tracking-wide">Special offer</p>
            <p className="mt-1 text-sm text-white/85">Save up to 50% off</p>
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold">
              Grab the Deal <ArrowRight className="size-3.5 transition group-hover:translate-x-1" aria-hidden />
            </p>
          </div>
        </Link>
        <Link href="/account" className="group flex items-center gap-5 bg-cloud px-7 py-8 text-navy">
          <Gift className="size-12 shrink-0" strokeWidth={1.2} aria-hidden />
          <div>
            <p className="font-display text-sm font-extrabold uppercase tracking-wide">Member benefits</p>
            <p className="mt-1 text-sm text-muted">Join now &amp; get exclusive deals</p>
            <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold">
              Join Free <ArrowRight className="size-3.5 transition group-hover:translate-x-1" aria-hidden />
            </p>
          </div>
        </Link>
      </div>
    </section>
  );
}
