import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { Logo } from "@/components/shell/logo";
import { buttonClass } from "@/components/ui/button";
import { supabaseEnv } from "@/lib/env";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next } = await searchParams;
  const nextPath = typeof next === "string" ? next : "/";
  const configured = Boolean(supabaseEnv());

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
          <p className="label-caps text-tan-600">Admin dashboard</p>
          <h1 className="mt-1.5 font-display text-2xl font-extrabold tracking-tight text-navy">Welcome back</h1>
          <p className="mt-1 text-sm text-muted">Sign in with your ShopLuxe staff account.</p>

          {!configured ? (
            <div className="mt-6 rounded-xl border border-tan/25 bg-tan-100/70 p-4 text-sm text-navy">
              <p className="flex items-center gap-2 font-semibold">
                <Sparkles className="size-4 text-tan-600" aria-hidden />
                Demo mode
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-navy/75">
                Supabase isn&apos;t configured, so sign-in is skipped and the dashboard runs on mock data.
              </p>
              <Link href="/" className={buttonClass({ variant: "accent", size: "sm" }) + " mt-3"}>
                Open dashboard
                <ArrowRight aria-hidden />
              </Link>
            </div>
          ) : null}

          <div className="mt-6">
            <LoginForm next={nextPath} disabled={!configured} />
          </div>

          <p className="mt-6 flex items-start gap-2 border-t border-line pt-5 text-xs leading-relaxed text-muted">
            <ShieldCheck className="mt-px size-4 shrink-0 text-tan" aria-hidden />
            Access is limited to accounts with the admin role. Ask a store owner if you need access.
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-white/40">ShopLuxe — Everything you need</p>
      </div>
    </div>
  );
}
