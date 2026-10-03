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
      <h2 className="mt-1 font-display text-xl font-extrabold tracking-tight text-navy">Хайсан зүйл олдсонгүй</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
        Устгагдсан эсвэл холбоос хуучирсан байж магадгүй. Жагсаалт руу буцаад дахин оролдоно уу.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link href="/" className={buttonClass({ variant: "primary" })}>
          Хянах самбар
        </Link>
        <Link href="/products" className={buttonClass({ variant: "secondary" })}>
          Бүтээгдэхүүн
        </Link>
        <Link href="/orders" className={buttonClass({ variant: "secondary" })}>
          Захиалга
        </Link>
      </div>
    </Card>
  );
}
