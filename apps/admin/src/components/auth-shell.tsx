import type { ReactNode } from "react";
import { Logo } from "@/components/shell/logo";

/** Branded navy backdrop + white card shared by the sign-in and set-password pages. */
export function AuthShell({ children, footer }: { children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-navy px-4 py-12">
      {/* Soft brand glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 size-[640px] -translate-x-1/2 rounded-full bg-tan/20 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#ffffff_1px,transparent_1px)] [background-size:22px_22px]"
      />

      <div className="animate-fade-in relative w-full max-w-[420px]">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <div className="rounded-2xl bg-white p-7 shadow-[0_24px_64px_-24px_rgba(0,0,0,0.5)] sm:p-8">
          {children}
          {footer ? (
            <div className="mt-6 flex items-start gap-2 border-t border-line pt-5 text-xs leading-relaxed text-muted">
              {footer}
            </div>
          ) : null}
        </div>

        <p className="mt-6 text-center text-xs text-white/40">ShopLuxe — Танд хэрэгтэй бүхэн</p>
      </div>
    </div>
  );
}
