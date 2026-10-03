"use server";

import type { AuthError } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isAllowedAdminEmail } from "@/lib/env";
import { getSupabase } from "@/lib/supabase/server";

export type SignInState = {
  error?: string;
  fieldErrors?: { email?: string; password?: string };
  email?: string;
};

export type ResetState = {
  ok?: boolean;
  message?: string;
  error?: string;
  fieldError?: string;
  email?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MSG = {
  emailMissing: "Имэйл хаягаа оруулна уу.",
  emailInvalid: "Имэйл хаяг буруу байна.",
  passwordMissing: "Нууц үгээ оруулна уу.",
  demo: "Supabase тохируулаагүй тул самбар демо горимд ажиллаж байна — нэвтрэх шаардлагагүй.",
  badCredentials: "Имэйл эсвэл нууц үг буруу байна.",
  unconfirmed: "Нэвтрэхээс өмнө имэйл хаягаа баталгаажуулна уу.",
  offline:
    "Supabase-тэй холбогдож чадсангүй. NEXT_PUBLIC_SUPABASE_URL болон интернэт холболтоо шалгаад дахин оролдоно уу.",
  rateLimited: "Хэт олон удаа оролдлоо. Хэдэн минут хүлээгээд дахин оролдоно уу.",
  notAllowed: "Энэ имэйлээр админ самбар руу нэвтрэх эрхгүй.",
  resetSent:
    "Хэрэв энэ имэйлээр бүртгэл байгаа бол нууц үг тохируулах холбоос илгээгдлээ. Ирсэн мэйлээ (spam хавтсыг оролцуулан) шалгана уу.",
};

function isNetworkError(error: AuthError) {
  return error.name === "AuthRetryableFetchError" || /fetch failed|network/i.test(error.message);
}

/** Only allow same-site relative paths as the post-login destination. */
function safeNext(value: FormDataEntryValue | null): string {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") && !next.startsWith("/login")
    ? next
    : "/";
}

function readEmail(formData: FormData): { email: string; error?: string } {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  if (!email) return { email, error: MSG.emailMissing };
  if (!EMAIL_PATTERN.test(email)) return { email, error: MSG.emailInvalid };
  return { email };
}

export async function signIn(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const { email, error: emailError } = readEmail(formData);
  const password = String(formData.get("password") ?? "");

  const fieldErrors: SignInState["fieldErrors"] = {};
  if (emailError) fieldErrors.email = emailError;
  if (!password) fieldErrors.password = MSG.passwordMissing;
  if (fieldErrors.email || fieldErrors.password) return { fieldErrors, email };

  const supabase = await getSupabase();
  if (!supabase) return { email, error: MSG.demo };
  // Only the allow-listed owner account may sign in here.
  if (!isAllowedAdminEmail(email)) return { email, error: MSG.notAllowed };

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    let message = `Нэвтэрч чадсангүй: ${error.message}`;
    if (error.code === "invalid_credentials" || /invalid login credentials/i.test(error.message)) {
      message = MSG.badCredentials;
    } else if (error.code === "email_not_confirmed") {
      message = MSG.unconfirmed;
    } else if (isNetworkError(error)) {
      message = MSG.offline;
    } else if (error.status === 429) {
      message = MSG.rateLimited;
    }
    return { email, error: message };
  }

  redirect(safeNext(formData.get("next")));
}

/** Public URL of this admin app, for links inside emails. */
async function appOrigin(): Promise<string> {
  const configured = process.env.ADMIN_URL;
  if (configured) return configured.replace(/\/$/, "");
  const h = await headers();
  const origin = h.get("origin");
  if (origin) return origin;
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3001";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

/**
 * Sends a password-reset email. The reply is the same whether or not the
 * account exists, so the form cannot be used to discover admin emails.
 * Supabase only honours `redirectTo` if it is in the project's Redirect URLs.
 */
export async function requestPasswordReset(_prev: ResetState, formData: FormData): Promise<ResetState> {
  const { email, error: emailError } = readEmail(formData);
  if (emailError) return { email, fieldError: emailError };

  const supabase = await getSupabase();
  if (!supabase) return { email, error: MSG.demo };
  // Same neutral reply, but never email anyone outside the allow-list.
  if (!isAllowedAdminEmail(email)) return { ok: true, email, message: MSG.resetSent };

  const redirectTo = `${await appOrigin()}/auth/set-password`;
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) {
    if (isNetworkError(error)) return { email, error: MSG.offline };
    if (error.status === 429 || error.code === "over_email_send_rate_limit") return { email, error: MSG.rateLimited };
    // Anything else (e.g. unknown user) gets the neutral answer below.
  }
  return { ok: true, email, message: MSG.resetSent };
}

export async function signOut(): Promise<void> {
  const supabase = await getSupabase();
  if (supabase) await supabase.auth.signOut();
  redirect(supabase ? "/login" : "/");
}
