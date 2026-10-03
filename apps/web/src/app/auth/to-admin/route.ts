import { NextResponse, type NextRequest } from "next/server";
import { getSupabase, isAdminUser } from "@/lib/supabase/server";

const ADMIN_URL = (
  process.env.ADMIN_URL ||
  (process.env.NODE_ENV === "development" ? "http://localhost:3001" : "https://online-shop-admin-pi.vercel.app")
).replace(/\/$/, "");

/**
 * Sends a signed-in shop owner to the admin dashboard without a second login.
 * The session travels in the URL hash (never sent to servers); the storefront then
 * forgets its copy locally so the two apps never refresh the same token.
 */
export async function GET(request: NextRequest) {
  const supabase = await getSupabase();
  const account = new URL("/account", request.nextUrl.origin);
  if (!supabase) return NextResponse.redirect(account);

  const { data } = await supabase.auth.getUser();
  if (!data.user || !(await isAdminUser(supabase, data.user.id))) return NextResponse.redirect(account);

  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData.session;
  if (!session) return NextResponse.redirect(account);

  const hash = new URLSearchParams({ sl_at: session.access_token, sl_rt: session.refresh_token });
  await supabase.auth.signOut({ scope: "local" });
  const response = NextResponse.redirect(`${ADMIN_URL}/auth/handoff#${hash.toString()}`);
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}
