"use client";

import { ChevronDown, LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { signOut } from "@/app/login/actions";
import { Avatar } from "@/components/avatar";
import { cn } from "@/lib/cn";

export function UserMenu({ name, email, role }: { name: string; email: string; role: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-full py-1 pr-1.5 pl-1 transition-colors hover:bg-page sm:pr-2.5"
      >
        <Avatar name={name} size={32} />
        <span className="hidden max-w-[10rem] truncate text-sm font-semibold text-ink md:block">{name}</span>
        <ChevronDown className={cn("hidden size-4 text-muted transition-transform sm:block", open && "rotate-180")} />
        <span className="sr-only">Account menu</span>
      </button>

      {open ? (
        <div
          role="menu"
          className="animate-fade-in absolute top-full right-0 z-40 mt-2 w-64 overflow-hidden rounded-xl border border-line bg-white shadow-xl"
        >
          <div className="flex items-center gap-3 border-b border-line bg-page/60 px-4 py-3.5">
            <Avatar name={name} size={36} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{name}</p>
              <p className="truncate text-xs text-muted">{email}</p>
            </div>
          </div>
          <div className="px-4 py-2.5 text-xs text-muted">
            Role: <span className="label-caps text-[10px] text-tan-600">{role}</span>
          </div>
          <form action={signOut} className="border-t border-line p-1.5">
            <button
              type="submit"
              role="menuitem"
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-ink hover:bg-page"
            >
              <LogOut className="size-4 text-muted" aria-hidden />
              Sign out
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
