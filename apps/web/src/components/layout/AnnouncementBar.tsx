import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="bg-navy text-white">
      <div className="container-page flex h-10 items-center justify-center gap-3 text-center sm:justify-between">
        <p className="label-caps truncate text-[11px] sm:text-xs">
          Free shipping on orders over $50 <span className="text-tan">·</span> 30-day easy returns
        </p>
        <Link
          href="/shop?sale=1"
          className="label-caps hidden shrink-0 items-center gap-1.5 rounded bg-tan px-3 py-1 text-[11px] text-white transition hover:bg-tan-600 sm:inline-flex"
        >
          Shop the sale <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
