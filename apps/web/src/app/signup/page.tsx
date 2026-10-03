import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";
import { isGoogleEnabled, safeNext } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Бүртгүүлэх" };

export default async function SignupPage({ searchParams }: PageProps<"/signup">) {
  const sp = await searchParams;
  const next = safeNext(Array.isArray(sp.next) ? sp.next[0] : sp.next);
  const notice = next.startsWith("/checkout")
    ? "Бүртгүүлсний дараа захиалгаа шууд үргэлжлүүлнэ. Таны сагс хадгалагдсан хэвээр байна."
    : undefined;

  return (
    <div className="bg-beige px-4 py-14 sm:py-20">
      <AuthForm mode="signup" next={next} googleEnabled={await isGoogleEnabled()} notice={notice} />
    </div>
  );
}
