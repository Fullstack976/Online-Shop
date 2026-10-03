import { cache } from "react";
import { isAllowedAdminEmail } from "@/lib/env";
import { getSupabase } from "@/lib/supabase/server";

export type Viewer =
  | { mode: "mock" }
  | {
      mode: "supabase";
      user: { id: string; email: string; name: string } | null;
      role: string | null;
      isAdmin: boolean;
    };

async function loadViewer(): Promise<Viewer> {
  const supabase = await getSupabase();
  if (!supabase) return { mode: "mock" };

  // getUser() validates the JWT with Supabase Auth, unlike getSession().
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return { mode: "supabase", user: null, role: null, isAdmin: false };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, email")
    .eq("id", data.user.id)
    .maybeSingle();

  const email = data.user.email ?? profile?.email ?? "";
  const name = (profile?.full_name as string | null)?.trim() || email.split("@")[0] || "Админ";
  const role = (profile?.role as string | undefined) ?? null;
  return {
    mode: "supabase",
    user: { id: data.user.id, email, name },
    role,
    // Both the database role and the email allow-list must agree.
    isAdmin: role === "admin" && isAllowedAdminEmail(email),
  };
}

/** Current viewer, memoised per request. Mock mode has no auth at all. */
export const getViewer = cache(loadViewer);

/**
 * Guard for Server Actions: actions are public POST endpoints, so each one
 * re-checks the session and role. RLS enforces the same rule in the database.
 */
export async function requireAdmin(): Promise<void> {
  const viewer = await loadViewer();
  if (viewer.mode === "mock") return;
  if (!viewer.user) throw new Error("Нэвтрэлтийн хугацаа дууссан байна. Дахин нэвтэрнэ үү.");
  if (!viewer.isAdmin)
    throw new Error("Зөвхөн админ өөрчлөлт хийх эрхтэй. Эзэмшигчээс эрхээ admin болгуулахыг хүснэ үү.");
}
