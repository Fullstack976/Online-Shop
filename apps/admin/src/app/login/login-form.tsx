"use client";

import { ArrowLeft, LoaderCircle, Mail, MailCheck, Send } from "lucide-react";
import { useActionState, useRef, useState, type RefObject } from "react";
import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { Field, FormAlert, inputClass } from "@/components/ui/field";
import { cn } from "@/lib/cn";
import { requestPasswordReset, signIn, type ResetState, type SignInState } from "./actions";

const initialSignIn: SignInState = {};
const initialReset: ResetState = {};

export function LoginForm({ next, disabled }: { next: string; disabled?: boolean }) {
  const [mode, setMode] = useState<"signin" | "reset">("signin");
  const [resetEmail, setResetEmail] = useState("");
  const emailInput = useRef<HTMLInputElement>(null);

  if (mode === "reset") {
    return (
      <ResetForm key={resetEmail} defaultEmail={resetEmail} disabled={disabled} onBack={() => setMode("signin")} />
    );
  }

  return (
    <SignInForm
      next={next}
      disabled={disabled}
      emailInput={emailInput}
      onForgot={() => {
        setResetEmail(emailInput.current?.value.trim() ?? "");
        setMode("reset");
      }}
    />
  );
}

function SignInForm({
  next,
  disabled,
  emailInput,
  onForgot,
}: {
  next: string;
  disabled?: boolean;
  emailInput: RefObject<HTMLInputElement | null>;
  onForgot: () => void;
}) {
  const [state, formAction, pending] = useActionState(signIn, initialSignIn);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <input type="hidden" name="next" value={next} />
      {state.error ? <FormAlert>{state.error}</FormAlert> : null}

      <Field label="Имэйл" htmlFor="email" error={state.fieldErrors?.email}>
        <div className="relative">
          <Mail
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle"
            aria-hidden
          />
          <input
            ref={emailInput}
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="ta@shopluxe.mn"
            defaultValue={state.email ?? ""}
            disabled={disabled}
            aria-invalid={Boolean(state.fieldErrors?.email)}
            aria-describedby={state.fieldErrors?.email ? "email-error" : undefined}
            className={cn(inputClass, "h-11 pl-9")}
          />
        </div>
      </Field>

      <Field label="Нууц үг" htmlFor="password" error={state.fieldErrors?.password}>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
          disabled={disabled}
          aria-invalid={Boolean(state.fieldErrors?.password)}
          aria-describedby={state.fieldErrors?.password ? "password-error" : undefined}
        />
      </Field>

      <div className="-mt-1 flex justify-end">
        <button
          type="button"
          onClick={onForgot}
          disabled={disabled}
          className="text-xs font-semibold text-tan-600 hover:text-navy disabled:cursor-not-allowed disabled:opacity-50"
        >
          Нууц үгээ мартсан?
        </button>
      </div>

      <Button type="submit" className="h-11 w-full" disabled={pending || disabled}>
        {pending ? <LoaderCircle className="animate-spin" aria-hidden /> : null}
        {pending ? "Нэвтэрч байна…" : "Нэвтрэх"}
      </Button>
    </form>
  );
}

function ResetForm({
  defaultEmail,
  disabled,
  onBack,
}: {
  defaultEmail: string;
  disabled?: boolean;
  onBack: () => void;
}) {
  const [state, formAction, pending] = useActionState(requestPasswordReset, initialReset);

  return (
    <div className="animate-fade-in">
      <div className="mb-4">
        <p className="font-display text-[15px] font-bold text-navy">Нууц үг сэргээх</p>
        <p className="mt-0.5 text-[13px] leading-relaxed text-muted">
          Бүртгэлтэй имэйлээ оруулбал шинэ нууц үг тохируулах холбоос илгээнэ.
        </p>
      </div>

      {state.ok ? (
        <div role="status" className="rounded-xl border border-success/20 bg-success-bg p-4 text-sm text-success">
          <p className="flex items-center gap-2 font-semibold">
            <MailCheck className="size-4" aria-hidden />
            Имэйлээ шалгана уу
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-ink/80">{state.message}</p>
        </div>
      ) : (
        <form action={formAction} className="space-y-4" noValidate>
          {state.error ? <FormAlert>{state.error}</FormAlert> : null}
          <Field label="Имэйл" htmlFor="reset-email" error={state.fieldError}>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle"
                aria-hidden
              />
              <input
                id="reset-email"
                name="email"
                type="email"
                autoComplete="email"
                autoFocus
                placeholder="ta@shopluxe.mn"
                defaultValue={state.email ?? defaultEmail}
                disabled={disabled}
                aria-invalid={Boolean(state.fieldError)}
                aria-describedby={state.fieldError ? "reset-email-error" : undefined}
                className={cn(inputClass, "h-11 pl-9")}
              />
            </div>
          </Field>
          <Button type="submit" className="h-11 w-full" disabled={pending || disabled}>
            {pending ? <LoaderCircle className="animate-spin" aria-hidden /> : <Send aria-hidden />}
            {pending ? "Илгээж байна…" : "Сэргээх холбоос илгээх"}
          </Button>
        </form>
      )}

      <button
        type="button"
        onClick={onBack}
        className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-navy"
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        Нэвтрэх хэсэг рүү буцах
      </button>
    </div>
  );
}
