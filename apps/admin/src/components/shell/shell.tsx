"use client";

import { ChevronRight, ExternalLink, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Logo } from "./logo";
import { isActive, NAV_ITEMS, titleForPath } from "./nav";

/**
 * Dashboard chrome: fixed navy sidebar on lg+, slide-over drawer below lg,
 * and a sticky top bar with the page title. Server-rendered bits (demo pill,
 * user menu) arrive through the `topbarEnd` slot.
 */
export function Shell({
  children,
  topbarEnd,
  storeUrl,
}: {
  children: ReactNode;
  topbarEnd: ReactNode;
  storeUrl: string;
}) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { title, parent } = titleForPath(pathname);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen]);

  return (
    <div className="min-h-dvh lg:pl-64">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:flex">
        <SidebarContent pathname={pathname} storeUrl={storeUrl} />
      </aside>

      {drawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <div
            className="animate-fade-in absolute inset-0 bg-navy/50 backdrop-blur-[2px]"
            onClick={() => setDrawerOpen(false)}
            aria-hidden
          />
          <div className="animate-slide-in relative flex h-full w-72 max-w-[85vw] shadow-2xl">
            <SidebarContent
              pathname={pathname}
              storeUrl={storeUrl}
              onNavigate={() => setDrawerOpen(false)}
              closeButton={
                <button
                  type="button"
                  autoFocus
                  onClick={() => setDrawerOpen(false)}
                  className="inline-flex size-9 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white"
                  aria-label="Close navigation"
                >
                  <X className="size-5" />
                </button>
              }
            />
          </div>
        </div>
      ) : null}

      <div className="flex min-h-dvh min-w-0 flex-col">
        <header className="sticky top-0 z-20 border-b border-line bg-white/85 backdrop-blur-md supports-[backdrop-filter]:bg-white/75">
          <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="-ml-1.5 inline-flex size-9 items-center justify-center rounded-lg text-navy hover:bg-page lg:hidden"
              aria-label="Open navigation"
              aria-expanded={drawerOpen}
            >
              <Menu className="size-5" />
            </button>
            <div className="min-w-0 flex-1">
              {parent ? (
                <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-muted">
                  <Link href={parent.href} className="hover:text-tan-600">
                    {parent.label}
                  </Link>
                  <ChevronRight className="size-3" aria-hidden />
                </nav>
              ) : null}
              <h1 className="truncate font-display text-lg leading-tight font-bold tracking-tight text-navy sm:text-xl">
                {title}
              </h1>
            </div>
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <a
                href={storeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 text-[13px] font-semibold text-navy shadow-xs transition-colors hover:border-tan hover:text-tan-600 sm:px-3"
              >
                <ExternalLink className="size-4" aria-hidden />
                <span className="hidden sm:inline">View store</span>
                <span className="sr-only sm:hidden">View store</span>
              </a>
              {topbarEnd}
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1400px] min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarContent({
  pathname,
  storeUrl,
  onNavigate,
  closeButton,
}: {
  pathname: string;
  storeUrl: string;
  onNavigate?: () => void;
  closeButton?: ReactNode;
}) {
  return (
    <div className="flex h-full w-full flex-col bg-navy text-white">
      <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-white/[0.07] px-5">
        <Link href="/" onClick={onNavigate} aria-label="ShopLuxe Admin dashboard">
          <Logo />
        </Link>
        {closeButton}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Main">
        <p className="label-caps px-3 pb-2 text-[10px] text-white/40">Manage</p>
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active ? "bg-white/[0.08] text-white" : "text-white/65 hover:bg-white/[0.04] hover:text-white",
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "absolute top-2 bottom-2 left-0 w-[3px] rounded-r-full bg-tan transition-opacity",
                      active ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <Icon
                    className={cn(
                      "size-[18px] shrink-0",
                      active ? "text-tan" : "text-white/50 group-hover:text-white/80",
                    )}
                    aria-hidden
                  />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-white/[0.07] p-4">
        <a
          href={storeUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between gap-3 rounded-lg bg-white/[0.05] px-3 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/[0.09] hover:text-white"
        >
          <span>
            <span className="block font-semibold">Storefront</span>
            <span className="block text-xs text-white/45">Everything you need</span>
          </span>
          <ExternalLink className="size-4 text-tan" aria-hidden />
        </a>
      </div>
    </div>
  );
}
