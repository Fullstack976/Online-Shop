"use client";

import { Eye, EyeOff, Lock } from "lucide-react";
import { useState, type ComponentProps } from "react";
import { inputClass } from "@/components/ui/field";
import { cn } from "@/lib/cn";

/** Password field with a lock icon and a show/hide toggle. */
export function PasswordInput({ className, disabled, ...props }: Omit<ComponentProps<"input">, "type">) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" aria-hidden />
      <input
        type={visible ? "text" : "password"}
        disabled={disabled}
        className={cn(inputClass, "h-11 pr-10 pl-9", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute top-1/2 right-1.5 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted hover:bg-page hover:text-ink"
        aria-label={visible ? "Нууц үгийг нуух" : "Нууц үгийг харуулах"}
        disabled={disabled}
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}
