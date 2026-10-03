"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabase, isAdminUser, safeNext } from "@/lib/supabase/server";

export type AuthState = { error?: string; message?: string; values?: { name?: string; email?: string } };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function translateAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "Имэйл эсвэл нууц үг буруу байна.";
  if (m.includes("email not confirmed")) return "Имэйлээ баталгаажуулаагүй байна. Ирсэн имэйлийн линк дээр дарна уу.";
  if (m.includes("already registered") || m.includes("already been registered")) {
    return "Энэ имэйлээр бүртгэл үүссэн байна. Нэвтэрнэ үү.";
  }
  if (m.includes("password")) return "Нууц үг хамгийн багадаа 8 тэмдэгттэй байх ёстой.";
  if (m.includes("rate limit") || m.includes("too many")) return "Хэт олон оролдлого хийлээ. Түр хүлээгээд дахин оролдоно уу.";
  return "Алдаа гарлаа. Дахин оролдоно уу.";
}

async function siteOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function signInAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));
  if (!EMAIL_RE.test(email) || !password) {
    return { error: "Имэйл болон нууц үгээ оруулна уу.", values: { email } };
  }
  const supabase = await getSupabase();
  if (!supabase) return { error: "Нэвтрэх үйлчилгээ одоогоор идэвхгүй байна.", values: { email } };

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: translateAuthError(error.message), values: { email } };
  // The shop owner goes straight to the admin dashboard.
  if (await isAdminUser(supabase, data.user.id)) redirect("/auth/to-admin");
  redirect(next);
}

export async function signUpAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));
  const values = { name, email };

  if (name.length < 2) return { error: "Нэрээ оруулна уу.", values };
  if (!EMAIL_RE.test(email)) return { error: "Зөв имэйл хаяг оруулна уу.", values };
  if (password.length < 8) return { error: "Нууц үг хамгийн багадаа 8 тэмдэгттэй байх ёстой.", values };

  const supabase = await getSupabase();
  if (!supabase) return { error: "Бүртгэлийн үйлчилгээ одоогоор идэвхгүй байна.", values };

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
      emailRedirectTo: `${await siteOrigin()}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });
  if (error) return { error: translateAuthError(error.message), values };
  // Supabase hides "already registered" by returning a user with no identities.
  if (data.user && data.user.identities?.length === 0) {
    return { error: "Энэ имэйлээр бүртгэл үүссэн байна. Нэвтэрнэ үү.", values };
  }
  if (data.session) redirect(next);
  return { message: "Бүртгэл үүслээ! Имэйлээ шалгаж, баталгаажуулах линк дээр дарна уу.", values };
}

export async function signOutAction() {
  const supabase = await getSupabase();
  await supabase?.auth.signOut();
  redirect("/");
}
