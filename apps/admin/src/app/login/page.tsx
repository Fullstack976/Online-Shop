import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { supabaseEnv } from "@/lib/env";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Нэвтрэх" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next } = await searchParams;
  const nextPath = typeof next === "string" ? next : "/";
  const configured = Boolean(supabaseEnv());

  return (
    <AuthShell
      footer={
        <>
          <ShieldCheck className="mt-px size-4 shrink-0 text-tan" aria-hidden />
          Зөвхөн админ эрхтэй бүртгэл нэвтрэх боломжтой. Эрх хэрэгтэй бол дэлгүүрийн эзэмшигчид хандана уу.
        </>
      }
    >
      <p className="label-caps text-tan-600">Админ самбар</p>
      <h1 className="mt-1.5 font-display text-2xl font-extrabold tracking-tight text-navy">Тавтай морил</h1>
      <p className="mt-1 text-sm text-muted">ShopLuxe ажилтны бүртгэлээрээ нэвтэрнэ үү.</p>

      {!configured ? (
        <div className="mt-6 rounded-xl border border-tan/25 bg-tan-100/70 p-4 text-sm text-navy">
          <p className="flex items-center gap-2 font-semibold">
            <Sparkles className="size-4 text-tan-600" aria-hidden />
            Демо горим
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-navy/75">
            Supabase тохируулаагүй тул нэвтрэх шаардлагагүй бөгөөд самбар туршилтын өгөгдөл дээр ажиллана.
          </p>
          <Link href="/" className={cn(buttonClass({ variant: "accent", size: "sm" }), "mt-3")}>
            Самбар нээх
            <ArrowRight aria-hidden />
          </Link>
        </div>
      ) : null}

      <div className="mt-6">
        <LoginForm next={nextPath} disabled={!configured} />
      </div>
    </AuthShell>
  );
}
