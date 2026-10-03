import { cache } from "react";
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
  const name = (profile?.full_name as string | null)?.trim() || email.split("@")[0] || "Admin";
  const role = (profile?.role as string | undefined) ?? null;
  return {
    mode: "supabase",
    user: { id: data.user.id, email, name },
    role,
    isAdmin: role === "admin",
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
  if (!viewer.user) throw new Error("Your session has expired. Please sign in again.");
  if (!viewer.isAdmin) throw new Error("Only admins can make changes. Ask an owner to set your role to admin.");
}
