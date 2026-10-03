import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Crumb = { label: string; href?: string };

export function PageHeader({ title, crumbs, subtitle }: { title: string; crumbs: Crumb[]; subtitle?: string }) {
  return (
    <section className="bg-beige">
      <div className="container-page py-10 sm:py-12">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
            {[{ label: "Home", href: "/" }, ...crumbs].map((c, i, all) => (
              <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
                {c.href && i < all.length - 1 ? (
                  <Link href={c.href} className="hover:text-tan">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-ink" aria-current="page">
                    {c.label}
                  </span>
                )}
                {i < all.length - 1 && <ChevronRight className="size-3" aria-hidden />}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-tight text-navy sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-xl text-sm text-ink/70">{subtitle}</p>}
      </div>
    </section>
  );
}
