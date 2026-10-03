"use server";

import { redirect } from "next/navigation";
import { getSupabase } from "@/lib/supabase/server";

export type SignInState = {
  error?: string;
  fieldErrors?: { email?: string; password?: string };
  email?: string;
};

/** Only allow same-site relative paths as the post-login destination. */
function safeNext(value: FormDataEntryValue | null): string {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") && !next.startsWith("/login")
    ? next
    : "/";
}

export async function signIn(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  const fieldErrors: SignInState["fieldErrors"] = {};
  if (!email) fieldErrors.email = "Enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fieldErrors.email = "That doesn't look like an email address.";
  if (!password) fieldErrors.password = "Enter your password.";
  if (fieldErrors.email || fieldErrors.password) return { fieldErrors, email };

  const supabase = await getSupabase();
  if (!supabase) {
    return {
      email,
      error: "Supabase isn't configured, so the admin runs in demo mode — no sign-in needed.",
    };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    let message = error.message;
    if (error.code === "invalid_credentials" || /invalid login credentials/i.test(error.message)) {
      message = "Incorrect email or password.";
    } else if (error.code === "email_not_confirmed") {
      message = "Please confirm your email address before signing in.";
    } else if (error.name === "AuthRetryableFetchError" || /fetch failed/i.test(error.message)) {
      message = "Couldn't reach Supabase. Check NEXT_PUBLIC_SUPABASE_URL and your connection, then try again.";
    } else if (error.status === 429) {
      message = "Too many sign-in attempts. Please wait a minute and try again.";
    }
    return { email, error: message };
  }

  redirect(safeNext(formData.get("next")));
}

export async function signOut(): Promise<void> {
  const supabase = await getSupabase();
  if (supabase) await supabase.auth.signOut();
  redirect(supabase ? "/login" : "/");
}
