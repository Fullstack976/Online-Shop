"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getBrowserSupabase } from "@/lib/supabase/browser";

/**
 * Receives a session from the storefront (owner signed in there) via the URL hash —
 * hashes never reach any server — stores it in this app's cookies and opens the dashboard.
 * The storefront drops its own copy of the session first, so only this app refreshes it.
 */
export default function HandoffPage() {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const access_token = params.get("sl_at");
    const refresh_token = params.get("sl_rt");
    // Remove the tokens from the address bar and history immediately.
    window.history.replaceState(null, "", window.location.pathname);

    const supabase = getBrowserSupabase();
    if (!supabase || !access_token || !refresh_token) {
      window.location.replace("/login");
      return;
    }
    supabase.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
      if (error) setFailed(true);
      else window.location.replace("/");
    });
  }, []);

  return (
    <main className="grid min-h-dvh place-items-center bg-navy px-4 text-center text-white">
      {failed ? (
        <div>
          <p className="font-display text-lg font-bold">Нэвтрэлтийг дамжуулж чадсангүй</p>
          <p className="mt-2 text-sm text-white/70">Админ самбарт имэйл, нууц үгээрээ нэвтэрнэ үү.</p>
          <Link href="/login" className="mt-6 inline-flex h-11 items-center rounded-md bg-white px-5 text-sm font-semibold text-navy">
            Нэвтрэх
          </Link>
        </div>
      ) : (
        <p className="text-sm text-white/80">Админ самбар руу шилжиж байна…</p>
      )}
    </main>
  );
}
