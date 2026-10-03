import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeading({ title, href, linkLabel }: { title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <h2 className="font-display text-base font-extrabold uppercase tracking-wide text-navy sm:text-lg">{title}</h2>
      {href && (
        <Link href={href} className="label-caps inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[11px] text-navy hover:text-tan">
          {linkLabel ?? "Бүгдийг үзэх"} <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      )}
    </div>
  );
}
