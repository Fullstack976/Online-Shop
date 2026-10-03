import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/shell/logo";
import { buttonClass } from "@/components/ui/button";

export const metadata: Metadata = { title: "Хуудас олдсонгүй" };

/** App-wide 404 for URLs that match no route. */
export default function NotFound() {
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-navy px-4 py-12 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 size-[560px] -translate-x-1/2 rounded-full bg-tan/20 blur-[120px]"
      />
      <div className="animate-fade-in relative max-w-md">
        <div className="mb-10 flex justify-center">
          <Logo />
        </div>
        <p className="font-display text-7xl font-extrabold tracking-tight text-white/90">
          4<span className="text-tan">0</span>4
        </p>
        <h1 className="mt-4 font-display text-xl font-bold text-white">Энэ хуудас “дууссан” бололтой</h1>
        <p className="mt-2 text-sm text-white/60">Таны хайсан хуудас байхгүй эсвэл өөр хаяг руу шилжсэн байна.</p>
        <Link href="/" className={`${buttonClass({ variant: "accent" })} mt-8`}>
          Хянах самбар руу буцах
        </Link>
      </div>
    </div>
  );
}
