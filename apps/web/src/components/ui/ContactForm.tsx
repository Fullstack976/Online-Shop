"use client";

import { useActionState } from "react";
import { Send } from "lucide-react";
import { contactAction, type FormState } from "@/app/actions";

export function ContactForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(contactAction, { status: "idle" });

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-xl bg-emerald-50 p-6 text-emerald-800">
        <p className="font-display font-bold">Зурвас илгээгдлээ!</p>
        <p className="mt-1 text-sm">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      {[
        { name: "name", label: "Таны нэр", type: "text", autoComplete: "name" },
        { name: "email", label: "Имэйл", type: "email", autoComplete: "email" },
      ].map((f) => (
        <div key={f.name}>
          <label htmlFor={`contact-${f.name}`} className="mb-1.5 block text-xs font-semibold">
            {f.label}
          </label>
          <input
            id={`contact-${f.name}`}
            name={f.name}
            type={f.type}
            autoComplete={f.autoComplete}
            defaultValue={state.values?.[f.name]}
            required
            className="h-11 w-full rounded-md border border-line px-3.5 text-sm outline-none focus:border-navy"
          />
        </div>
      ))}
      <div className="sm:col-span-2">
        <label htmlFor="contact-message" className="mb-1.5 block text-xs font-semibold">
          Зурвас
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          defaultValue={state.values?.message}
          required
          className="w-full rounded-md border border-line px-3.5 py-3 text-sm outline-none focus:border-navy"
        />
      </div>
      {state.status === "error" && <p className="text-sm text-red-600 sm:col-span-2">{state.message}</p>}
      <button
        type="submit"
        disabled={pending}
        className="label-caps inline-flex h-12 items-center justify-center gap-2 rounded-md bg-navy px-6 text-white hover:bg-navy-700 disabled:opacity-60 sm:col-span-2 sm:justify-self-start"
      >
        <Send className="size-4" aria-hidden /> {pending ? "Илгээж байна…" : "Илгээх"}
      </button>
    </form>
  );
}
