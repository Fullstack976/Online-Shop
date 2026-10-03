import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "@shop/db/env";

/** Pages that need a signed-in customer. Browsing and the cart stay public. */
const PROTECTED = ["/checkout", "/account"];
const AUTH_PAGES = ["/login", "/signup"];

/**
 * Keeps the Supabase session cookie fresh and sends signed-out shoppers to /login before
 * checkout. Optimistic only: the checkout action and the place_order function re-check
 * the session. Without Supabase env vars (mock mode) it does nothing.
 */
export async function proxy(request: NextRequest) {
  const env = getSupabaseEnv();
  if (!env) return NextResponse.next();

  let response = NextResponse.next({ request });
  const supabase = createServerClient(env.url, env.key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) response.cookies.set(name, value, options);
        for (const [key, value] of Object.entries(headers)) response.headers.set(key, value);
      },
    },
  });

  // Nothing may run between createServerClient and getClaims(): it triggers the refresh.
  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims?.sub);
  const { pathname, search, searchParams } = request.nextUrl;
  const matches = (paths: string[]) => paths.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (!signedIn && matches(PROTECTED)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("next", `${pathname}${search}`);
    return withCookies(NextResponse.redirect(url), response);
  }

  if (signedIn && matches(AUTH_PAGES)) {
    const next = searchParams.get("next");
    const url = request.nextUrl.clone();
    url.pathname = next && next.startsWith("/") && !next.startsWith("//") ? next : "/account";
    url.search = "";
    return withCookies(NextResponse.redirect(url), response);
  }

  return response;
}

function withCookies(target: NextResponse, source: NextResponse) {
  for (const cookie of source.cookies.getAll()) target.cookies.set(cookie);
  return target;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|txt|xml)$).*)"],
};
