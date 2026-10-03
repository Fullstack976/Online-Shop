import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="bg-navy text-white">
      <div className="container-page flex h-9 items-center justify-center gap-3 text-center sm:h-10 sm:justify-between">
        <p className="label-caps truncate text-[11px] sm:text-xs">
          <span className="sm:hidden">$50+ захиалгад хүргэлт үнэгүй</span>
          <span className="hidden sm:inline">
            $50-аас дээш захиалгад хүргэлт үнэгүй <span className="text-tan">·</span> 30 хоногийн буцаалт
          </span>
        </p>
        <Link
          href="/shop?sale=1"
          className="label-caps hidden shrink-0 items-center gap-1.5 rounded bg-tan px-3 py-1 text-[11px] text-white transition hover:bg-tan-600 sm:inline-flex"
        >
          Хямдрал үзэх <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
