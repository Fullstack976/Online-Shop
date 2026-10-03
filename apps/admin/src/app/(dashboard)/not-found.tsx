import Link from "next/link";
import { Compass } from "lucide-react";
import { buttonClass } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/** Rendered inside the dashboard shell when a page calls notFound() (unknown product or order). */
export default function DashboardNotFound() {
  return (
    <Card className="animate-fade-in mx-auto max-w-lg px-6 py-14 text-center">
      <span className="mx-auto mb-5 inline-flex size-14 items-center justify-center rounded-full bg-beige text-tan">
        <Compass className="size-6" aria-hidden />
      </span>
      <p className="label-caps text-tan-600">404</p>
      <h2 className="mt-1 font-display text-xl font-extrabold tracking-tight text-navy">We couldn&apos;t find that</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
        It may have been deleted, or the link is out of date. Head back to a list and try again.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link href="/" className={buttonClass({ variant: "primary" })}>
          Go to dashboard
        </Link>
        <Link href="/products" className={buttonClass({ variant: "secondary" })}>
          Products
        </Link>
        <Link href="/orders" className={buttonClass({ variant: "secondary" })}>
          Orders
        </Link>
      </div>
    </Card>
  );
}
