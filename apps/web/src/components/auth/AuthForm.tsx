"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signInAction, signUpAction, type AuthState } from "@/app/auth/actions";
import { GoogleButton } from "./GoogleButton";

type Props = { mode: "login" | "signup"; next: string; googleEnabled: boolean; notice?: string };

const inputClass =
  "h-12 w-full rounded-md border border-line px-3.5 text-sm outline-none transition focus:border-navy focus:ring-2 focus:ring-navy/10";

export function AuthForm({ mode, next, googleEnabled, notice }: Props) {
  const isLogin = mode === "login";
  const [state, action, pending] = useActionState<AuthState, FormData>(isLogin ? signInAction : signUpAction, {});
  const nextQuery = next !== "/account" ? `?next=${encodeURIComponent(next)}` : "";

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-line bg-white p-7 shadow-xl shadow-navy/5 sm:p-9">
      <h1 className="font-display text-2xl font-extrabold text-navy">{isLogin ? "Нэвтрэх" : "Бүртгүүлэх"}</h1>
      <p className="mt-1 text-sm text-muted">
        {isLogin ? "ShopLuxe бүртгэлдээ нэвтэрнэ үү." : "Хэдхэн секундэд бүртгэл үүсгээд захиалгаа өгөөрэй."}
      </p>
      {notice && <p className="mt-4 rounded-md bg-beige px-3.5 py-2.5 text-sm text-navy">{notice}</p>}

      <div className="mt-6">
        <GoogleButton next={next} enabled={googleEnabled} label={isLogin ? "Google-ээр нэвтрэх" : "Google-ээр бүртгүүлэх"} />
      </div>

      <div className="my-6 flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-line" /> эсвэл имэйлээр <span className="h-px flex-1 bg-line" />
      </div>

      {state.message ? (
        <p role="status" className="rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {state.message}
        </p>
      ) : (
        <form action={action} className="space-y-4">
          <input type="hidden" name="next" value={next} />
          {!isLogin && (
            <div>
              <label htmlFor="name" className="mb-1.5 block text-xs font-semibold">
                Овог нэр
              </label>
              <input id="name" name="name" autoComplete="name" defaultValue={state.values?.name} required className={inputClass} />
            </div>
          )}
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-semibold">
              Имэйл
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              defaultValue={state.values?.email}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-semibold">
              Нууц үг
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              minLength={isLogin ? undefined : 8}
              required
              className={inputClass}
            />
            {!isLogin && <p className="mt-1 text-xs text-muted">Хамгийн багадаа 8 тэмдэгт.</p>}
          </div>
          {state.error && (
            <p role="alert" className="rounded-md bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
              {state.error}
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="label-caps h-12 w-full rounded-md bg-navy text-white transition hover:bg-navy-700 disabled:opacity-60"
          >
            {pending ? "Түр хүлээнэ үү…" : isLogin ? "Нэвтрэх" : "Бүртгүүлэх"}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-muted">
        {isLogin ? "Бүртгэлгүй юу? " : "Бүртгэлтэй юу? "}
        <Link href={`${isLogin ? "/signup" : "/login"}${nextQuery}`} className="font-semibold text-navy hover:text-tan">
          {isLogin ? "Бүртгүүлэх" : "Нэвтрэх"}
        </Link>
      </p>
    </div>
  );
}
