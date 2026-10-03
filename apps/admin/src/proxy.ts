import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseEnv } from "@/lib/env";

/**
 * Refreshes the Supabase session cookie on every request and sends signed-out
 * visitors to /login. This is an optimistic check only: the dashboard layout,
 * every Server Action and RLS re-check the user. In mock mode it does nothing.
 */
export async function proxy(request: NextRequest) {
  const env = supabaseEnv();
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

  // Do not run code between createServerClient and getClaims(): it triggers the refresh.
  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims?.sub);

  const { pathname, search } = request.nextUrl;
  const onLogin = pathname === "/login" || pathname.startsWith("/login/");

  if (!signedIn && !onLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    if (pathname !== "/") url.searchParams.set("next", `${pathname}${search}`);
    return withCookies(NextResponse.redirect(url), response);
  }

  if (signedIn && onLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    return withCookies(NextResponse.redirect(url), response);
  }

  return response;
}

/** Carry refreshed auth cookies over to a redirect response. */
function withCookies(target: NextResponse, source: NextResponse) {
  for (const cookie of source.cookies.getAll()) target.cookies.set(cookie);
  const cacheControl = source.headers.get("cache-control");
  if (cacheControl) target.headers.set("cache-control", cacheControl);
  return target;
}

export const config = {
  matcher: [
    // Everything except Next internals and static files.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|txt|xml)$).*)",
  ],
};
