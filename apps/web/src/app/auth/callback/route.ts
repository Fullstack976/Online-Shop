import { NextResponse, type NextRequest } from "next/server";
import { getSupabase, isAdminUser, safeNext } from "@/lib/supabase/server";

/** Landing route for Google sign-in and email confirmation links (PKCE code exchange). */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const next = safeNext(searchParams.get("next"));
  const code = searchParams.get("code");
  const supabase = await getSupabase();

  if (code && supabase) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (data.user && (await isAdminUser(supabase, data.user.id))) return NextResponse.redirect(`${origin}/auth/to-admin`);
      return NextResponse.redirect(`${origin}${next}`);
    }
  }
  return NextResponse.redirect(`${origin}/login?error=auth&next=${encodeURIComponent(next)}`);
}
