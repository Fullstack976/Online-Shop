import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { ClearCart } from "@/components/cart/ClearCart";

export const metadata: Metadata = { title: "Order confirmed" };

export default async function SuccessPage({ searchParams }: PageProps<"/checkout/success">) {
  const { order } = await searchParams;
  const orderNumber = Array.isArray(order) ? order[0] : order;

  return (
    <div className="container-page py-20">
      <ClearCart />
      <div className="mx-auto max-w-lg rounded-2xl border border-line p-8 text-center sm:p-12">
        <CheckCircle2 className="mx-auto size-16 text-emerald-500" strokeWidth={1.5} aria-hidden />
        <h1 className="mt-5 font-display text-3xl font-extrabold text-navy">Thank you!</h1>
        <p className="mt-2 text-muted">Your order has been placed successfully.</p>
        {orderNumber && (
          <p className="mt-6 inline-block rounded-lg bg-beige px-5 py-3 font-display text-lg font-bold tracking-wide text-navy">
            Order #{orderNumber}
          </p>
        )}
        <p className="mt-6 text-sm text-ink/70">
          We&apos;ll email you a confirmation and let you know when it ships. Payment is collected on delivery.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/shop" className="label-caps inline-flex h-12 items-center rounded-md bg-navy px-6 text-white hover:bg-navy-700">
            Continue shopping
          </Link>
          <Link href="/" className="label-caps inline-flex h-12 items-center rounded-md border border-navy px-6 text-navy hover:bg-navy hover:text-white">
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
