"use client";

import type { AuthError, EmailOtpType } from "@supabase/supabase-js";
import { ArrowRight, Check, CircleCheck, KeyRound, LoaderCircle, Sparkles, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition, type FormEvent, type ReactNode } from "react";
import { PasswordInput } from "@/components/password-input";
import { Button, buttonClass } from "@/components/ui/button";
import { Field, FormAlert } from "@/components/ui/field";
import { cn } from "@/lib/cn";
import { supabaseEnv } from "@/lib/env";
import { getBrowserSupabase } from "@/lib/supabase/browser";

const MIN_LENGTH = 8;

const MSG = {
  expired: "Холбоосын хугацаа дууссан эсвэл аль хэдийн ашиглагдсан байна. Шинэ холбоос хүснэ үү.",
  invalid:
    "Холбоос буруу эсвэл хүчингүй байна. Имэйлээр ирсэн холбоосыг бүтнээр нь нээнэ үү, эсвэл шинэ холбоос хүснэ үү.",
  otherBrowser:
    "Энэ холбоосыг сэргээх хүсэлт илгээсэн хөтөч (browser) дээрээ нээнэ үү, эсвэл нэвтрэх хуудаснаас шинэ холбоос хүснэ үү.",
  offline: "Supabase-тэй холбогдож чадсангүй. Интернэт холболтоо шалгаад хуудсыг дахин ачаална уу.",
  noLink: "Нууц үг тохируулах холбоос олдсонгүй. Урилга эсвэл нууц үг сэргээх имэйл дэх холбоосоор орно уу.",
};

type SessionResult =
  { ok: true; email: string; flow: "invite" | "recovery" | "session" } | { ok: false; message: string };

type Phase = { kind: "checking" } | { kind: "unconfigured" } | SessionResult | { kind: "done" };

const OTP_TYPES: EmailOtpType[] = ["invite", "recovery", "signup", "magiclink", "email", "email_change"];

function isNetwork(error: AuthError) {
  return error.name === "AuthRetryableFetchError" || /fetch failed|network/i.test(error.message);
}

function linkError(error: AuthError | null, code?: string | null): string {
  if (error && isNetwork(error)) return MSG.offline;
  if (error?.name === "AuthPKCECodeVerifierMissingError") return MSG.otherBrowser;
  const c = code ?? error?.code ?? "";
  if (/expired|otp|flow_state|already|used/i.test(c) || /expired|invalid|used/i.test(error?.message ?? "")) {
    return MSG.expired;
  }
  return MSG.invalid;
}

/**
 * Reads whichever link format Supabase sent and turns it into a session:
 *  - implicit flow: `#access_token=…&refresh_token=…&type=invite|recovery`
 *  - PKCE flow:     `?code=…` (e.g. resetPasswordForEmail from this app)
 *  - token hash:    `?token_hash=…&type=invite|recovery` (custom email templates)
 * Falls back to an existing session (a signed-in user changing their password).
 * Memoised at module level so React Strict Mode's double effect can't spend a one-time code twice.
 */
let sessionPromise: Promise<SessionResult> | null = null;

function establishSession(): Promise<SessionResult> {
  sessionPromise ??= (async (): Promise<SessionResult> => {
    const supabase = getBrowserSupabase()!;
    const url = new URL(window.location.href);
    const hash = new URLSearchParams(url.hash.replace(/^#/, ""));
    const query = url.searchParams;
    const pick = (key: string) => hash.get(key) ?? query.get(key);
    const type = pick("type");

    // Tokens are single-use: drop them from the address bar and history right away.
    window.history.replaceState(window.history.state, "", url.pathname);

    if (pick("error") || pick("error_code") || pick("error_description")) {
      return { ok: false, message: linkError(null, pick("error_code") ?? pick("error")) };
    }

    const accessToken = hash.get("access_token");
    const refreshToken = hash.get("refresh_token");
    const code = query.get("code");
    const tokenHash = query.get("token_hash");

    let error: AuthError | null = null;
    if (accessToken && refreshToken) {
      ({ error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken }));
    } else if (code) {
      ({ error } = await supabase.auth.exchangeCodeForSession(code));
    } else if (tokenHash && type && (OTP_TYPES as string[]).includes(type)) {
      ({ error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: type as EmailOtpType }));
    }
    if (error) return { ok: false, message: linkError(error) };

    const { data, error: userError } = await supabase.auth.getUser();
    if (userError && isNetwork(userError)) return { ok: false, message: MSG.offline };
    if (!data.user) {
      return { ok: false, message: accessToken || code || tokenHash ? MSG.invalid : MSG.noLink };
    }
    return {
      ok: true,
      email: data.user.email ?? "",
      flow: type === "invite" ? "invite" : type === "recovery" ? "recovery" : "session",
    };
  })();
  return sessionPromise;
}

function passwordError(error: AuthError): string {
  if (isNetwork(error)) return MSG.offline;
  switch (error.code) {
    case "same_password":
      return "Шинэ нууц үг өмнөхөөсөө өөр байх ёстой.";
    case "weak_password":
      return "Нууц үг хэт сул байна. Илүү урт, үсэг тоо холилдсон нууц үг сонгоно уу.";
    case "session_not_found":
    case "session_expired":
      return "Нэвтрэлтийн хугацаа дууссан. Шинэ холбоос хүснэ үү.";
    case "over_request_rate_limit":
      return "Хэт олон удаа оролдлоо. Хэдэн минут хүлээгээд дахин оролдоно уу.";
  }
  if (error.name === "AuthSessionMissingError") return "Нэвтрэлтийн хугацаа дууссан. Шинэ холбоос хүснэ үү.";
  return `Нууц үг хадгалж чадсангүй: ${error.message}`;
}

export function SetPasswordCard() {
  // Env vars are inlined at build time, so server and client agree on the initial phase.
  const [phase, setPhase] = useState<Phase>(() => (supabaseEnv() ? { kind: "checking" } : { kind: "unconfigured" }));

  useEffect(() => {
    if (!supabaseEnv()) return;
    let active = true;
    establishSession().then((result) => {
      if (active) setPhase(result);
    });
    return () => {
      active = false;
    };
  }, []);

  if ("kind" in phase) {
    if (phase.kind === "checking") {
      return (
        <div className="flex flex-col items-center py-10 text-center" role="status">
          <LoaderCircle className="size-6 animate-spin text-tan" aria-hidden />
          <p className="mt-3 text-sm text-muted">Холбоосыг шалгаж байна…</p>
        </div>
      );
    }
    if (phase.kind === "unconfigured") {
      return (
        <Message
          icon={<Sparkles className="size-5" aria-hidden />}
          tone="tan"
          title="Демо горим"
          action={
            <Link href="/" className={cn(buttonClass({ variant: "accent" }), "w-full")}>
              Самбар нээх <ArrowRight aria-hidden />
            </Link>
          }
        >
          Supabase тохируулаагүй тул нууц үг шаардлагагүй — самбар туршилтын өгөгдөл дээр ажиллана.
        </Message>
      );
    }
    return (
      <Message icon={<CircleCheck className="size-5" aria-hidden />} tone="success" title="Нууц үг хадгалагдлаа">
        Самбар руу шилжиж байна…
      </Message>
    );
  }

  if (!phase.ok) {
    return (
      <Message
        icon={<TriangleAlert className="size-5" aria-hidden />}
        tone="danger"
        title="Холбоос ажиллахгүй байна"
        action={
          <Link href="/login" className={cn(buttonClass({ variant: "primary" }), "w-full")}>
            Нэвтрэх хуудас руу
          </Link>
        }
      >
        {phase.message}
        <span className="mt-2 block text-xs text-muted">
          Нэвтрэх хуудасны «Нууц үгээ мартсан?» холбоосоор шинэ имэйл авах боломжтой.
        </span>
      </Message>
    );
  }

  return <PasswordForm email={phase.email} flow={phase.flow} onDone={() => setPhase({ kind: "done" })} />;
}

function PasswordForm({
  email,
  flow,
  onDone,
}: {
  email: string;
  flow: "invite" | "recovery" | "session";
  onDone: () => void;
}) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirm?: string; form?: string }>({});
  const [pending, startTransition] = useTransition();

  const longEnough = password.length >= MIN_LENGTH;
  const matches = confirm.length > 0 && confirm === password;

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!longEnough) next.password = `Нууц үг дор хаяж ${MIN_LENGTH} тэмдэгт байх ёстой.`;
    if (!confirm) next.confirm = "Нууц үгээ давтан оруулна уу.";
    else if (confirm !== password) next.confirm = "Нууц үгнүүд таарахгүй байна.";
    setErrors(next);
    if (next.password || next.confirm) return;

    startTransition(async () => {
      const supabase = getBrowserSupabase()!;
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setErrors({ form: passwordError(error) });
        return;
      }
      onDone();
      // Full load so the server reads the fresh session cookies.
      window.location.replace("/");
    });
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div>
        <p className="label-caps text-tan-600">{flow === "invite" ? "Урилга" : "Нууц үг"}</p>
        <h1 className="mt-1.5 font-display text-2xl font-extrabold tracking-tight text-navy">
          {flow === "invite" ? "Бүртгэлээ идэвхжүүлэх" : "Шинэ нууц үг тохируулах"}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {flow === "invite" ? "ShopLuxe админд нэвтрэх нууц үгээ үүсгэнэ үү." : "Бүртгэлдээ шинэ нууц үг оруулна уу."}
        </p>
        {email ? (
          <p className="mt-3 inline-flex max-w-full items-center gap-1.5 rounded-lg bg-page px-2.5 py-1.5 text-xs text-muted">
            <KeyRound className="size-3.5 shrink-0 text-tan" aria-hidden />
            <span className="truncate">
              Бүртгэл: <span className="font-semibold text-ink">{email}</span>
            </span>
          </p>
        ) : null}
      </div>

      {errors.form ? <FormAlert>{errors.form}</FormAlert> : null}

      <Field label="Шинэ нууц үг" htmlFor="new-password" error={errors.password}>
        <PasswordInput
          id="new-password"
          name="password"
          autoComplete="new-password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "new-password-error" : "password-rules"}
        />
      </Field>

      <Field label="Нууц үгээ давтах" htmlFor="confirm-password" error={errors.confirm}>
        <PasswordInput
          id="confirm-password"
          name="confirm"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.currentTarget.value)}
          aria-invalid={Boolean(errors.confirm)}
          aria-describedby={errors.confirm ? "confirm-password-error" : "password-rules"}
        />
      </Field>

      <ul id="password-rules" className="space-y-1 text-xs">
        <Rule ok={longEnough}>Дор хаяж {MIN_LENGTH} тэмдэгт</Rule>
        <Rule ok={matches}>Хоёр нууц үг таарч байна</Rule>
      </ul>

      <Button type="submit" className="h-11 w-full" disabled={pending}>
        {pending ? <LoaderCircle className="animate-spin" aria-hidden /> : null}
        {pending ? "Хадгалж байна…" : "Нууц үг хадгалах"}
      </Button>
    </form>
  );
}

function Rule({ ok, children }: { ok: boolean; children: ReactNode }) {
  return (
    <li className={cn("flex items-center gap-1.5", ok ? "text-success" : "text-muted")}>
      <Check className={cn("size-3.5", ok ? "opacity-100" : "opacity-30")} aria-hidden />
      {children}
      <span className="sr-only">{ok ? " (хангасан)" : " (хангаагүй)"}</span>
    </li>
  );
}

function Message({
  icon,
  tone,
  title,
  children,
  action,
}: {
  icon: ReactNode;
  tone: "danger" | "success" | "tan";
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="text-center" role={tone === "danger" ? "alert" : "status"}>
      <span
        className={cn(
          "mx-auto mb-4 inline-flex size-12 items-center justify-center rounded-full",
          tone === "danger" && "bg-danger-bg text-danger",
          tone === "success" && "bg-success-bg text-success",
          tone === "tan" && "bg-tan-100 text-tan-600",
        )}
      >
        {icon}
      </span>
      <h1 className="font-display text-xl font-extrabold tracking-tight text-navy">{title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">{children}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
