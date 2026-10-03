import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";
import { isGoogleEnabled, safeNext } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Нэвтрэх" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const sp = await searchParams;
  const next = safeNext(Array.isArray(sp.next) ? sp.next[0] : sp.next);
  const notice =
    sp.error === "auth"
      ? "Нэвтрэх линкийн хугацаа дууссан эсвэл буруу байна. Дахин оролдоно уу."
      : next.startsWith("/checkout")
        ? "Захиалга өгөхийн тулд нэвтэрнэ үү эсвэл шинээр бүртгүүлнэ үү. Таны сагс хадгалагдсан хэвээр байна."
        : undefined;

  return (
    <div className="bg-beige px-4 py-14 sm:py-20">
      <AuthForm mode="login" next={next} googleEnabled={await isGoogleEnabled()} notice={notice} />
    </div>
  );
}
