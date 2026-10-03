"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getBrowserSupabase } from "@/lib/supabase/client";

const ADMIN_URL = (
  process.env.NEXT_PUBLIC_ADMIN_URL ||
  (process.env.NODE_ENV === "development" ? "http://localhost:3001" : "https://online-shop-admin-pi.vercel.app")
).replace(/\/$/, "");

/**
 * Hands a signed-in shop owner to the admin dashboard without a second login.
 * Runs once in the browser: reads the session, checks the admin role, forgets the session
 * here (local only) so the two apps never refresh the same token, then opens the admin
 * app with the tokens in the URL hash (hashes are never sent to servers).
 */
export default function ToAdminPage() {
  const started = useRef(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    async function handoff() {
      const supabase = getBrowserSupabase();
      if (!supabase) return window.location.replace("/account");

      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (!session) return window.location.replace("/login");

      const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).maybeSingle();
      if (profile?.role !== "admin") return window.location.replace("/account");

      const hash = new URLSearchParams({ sl_at: session.access_token, sl_rt: session.refresh_token });
      await supabase.auth.signOut({ scope: "local" });
      window.location.replace(`${ADMIN_URL}/auth/handoff#${hash.toString()}`);
    }

    handoff().catch(() => setFailed(true));
  }, []);

  return (
    <div className="grid min-h-[50vh] place-items-center px-4 text-center">
      {failed ? (
        <div>
          <p className="font-display text-lg font-bold text-navy">Админ самбар руу шилжүүлж чадсангүй</p>
          <a href={`${ADMIN_URL}/login`} className="label-caps mt-5 inline-flex h-11 items-center rounded-md bg-navy px-5 text-white">
            Админ руу нэвтрэх
          </a>
          <p className="mt-4 text-sm">
            <Link href="/" className="text-muted hover:text-navy">
              Нүүр хуудас руу буцах
            </Link>
          </p>
        </div>
      ) : (
        <p className="text-sm text-muted">Админ самбар руу шилжиж байна…</p>
      )}
    </div>
  );
}
