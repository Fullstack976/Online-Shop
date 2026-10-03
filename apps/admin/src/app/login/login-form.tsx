"use client";

import { Eye, EyeOff, LoaderCircle, Lock, Mail } from "lucide-react";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FormAlert, inputClass } from "@/components/ui/field";
import { cn } from "@/lib/cn";
import { signIn, type SignInState } from "./actions";

const initialState: SignInState = {};

export function LoginForm({ next, disabled }: { next: string; disabled?: boolean }) {
  const [state, formAction, pending] = useActionState(signIn, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <input type="hidden" name="next" value={next} />
      {state.error ? <FormAlert>{state.error}</FormAlert> : null}

      <Field label="Email" htmlFor="email" error={state.fieldErrors?.email}>
        <div className="relative">
          <Mail
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle"
            aria-hidden
          />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@shopluxe.com"
            defaultValue={state.email ?? ""}
            disabled={disabled}
            aria-invalid={Boolean(state.fieldErrors?.email)}
            aria-describedby={state.fieldErrors?.email ? "email-error" : undefined}
            className={cn(inputClass, "h-11 pl-9")}
          />
        </div>
      </Field>

      <Field label="Password" htmlFor="password" error={state.fieldErrors?.password}>
        <div className="relative">
          <Lock
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle"
            aria-hidden
          />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            disabled={disabled}
            aria-invalid={Boolean(state.fieldErrors?.password)}
            aria-describedby={state.fieldErrors?.password ? "password-error" : undefined}
            className={cn(inputClass, "h-11 pr-10 pl-9")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute top-1/2 right-1.5 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted hover:bg-page hover:text-ink"
            aria-label={showPassword ? "Hide password" : "Show password"}
            disabled={disabled}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </Field>

      <Button type="submit" className="h-11 w-full" disabled={pending || disabled}>
        {pending ? <LoaderCircle className="animate-spin" aria-hidden /> : null}
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
