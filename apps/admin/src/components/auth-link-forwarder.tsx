"use client";

import { useEffect } from "react";

const SET_PASSWORD_PATH = "/auth/set-password";

/**
 * Supabase invite/recovery links that fall back to the Site URL land on "/"
 * (or "/login" after the proxy redirect) with the session in the URL hash,
 * which servers never see. Send those visitors on to the set-password page,
 * keeping the hash intact.
 */
export function AuthLinkForwarder() {
  useEffect(() => {
    const { pathname, hash } = window.location;
    if (pathname === SET_PASSWORD_PATH || pathname === "/auth/handoff" || !hash) return;
    if (/(^|[#&])(access_token|error_code|error_description)=/.test(hash)) {
      window.location.replace(`${SET_PASSWORD_PATH}${hash}`);
    }
  }, []);
  return null;
}
