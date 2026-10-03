"use client";

import { useActionState } from "react";
import { subscribeAction, type FormState } from "@/app/actions";

export function NewsletterForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(subscribeAction, { status: "idle" });

  return (
    <form action={action} className="mt-3">
      <div className="flex overflow-hidden rounded-md border border-line focus-within:border-navy">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="Enter your email"
          className="h-11 min-w-0 flex-1 px-4 text-sm outline-none placeholder:text-muted"
        />
        <button
          type="submit"
          disabled={pending}
          className="label-caps shrink-0 bg-navy px-5 text-[11px] text-white transition hover:bg-navy-700 disabled:opacity-60"
        >
          {pending ? "…" : "Subscribe"}
        </button>
      </div>
      {state.status !== "idle" && (
        <p role="status" className={state.status === "error" ? "mt-2 text-xs text-red-600" : "mt-2 text-xs text-emerald-700"}>
          {state.message}
        </p>
      )}
    </form>
  );
}
