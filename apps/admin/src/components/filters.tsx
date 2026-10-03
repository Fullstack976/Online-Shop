"use client";

import { LoaderCircle, Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { inputClass, selectClass } from "@/components/ui/field";
import { cn } from "@/lib/cn";

/** Returns a function that writes one search param to the URL (replace, no scroll). */
function useParamWriter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function write(name: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("notice"); // one-off flash message from a redirect
    params.delete("page"); // a new filter starts from the first page
    if (value) params.set(name, value);
    else params.delete(name);
    const query = params.toString();
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  }

  return { write, isPending, searchParams };
}

export function SearchInput({
  placeholder,
  param = "q",
  label = "Хайх",
  className,
}: {
  placeholder: string;
  param?: string;
  label?: string;
  className?: string;
}) {
  const { write, isPending, searchParams } = useParamWriter();
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const urlValue = searchParams.get(param) ?? "";

  // Controlled so "Clear filters" links (external URL changes) also clear the box,
  // without clobbering what the user is typing while their own debounced write lands.
  const [value, setValue] = useState(urlValue);
  const [seenUrlValue, setSeenUrlValue] = useState(urlValue);
  const [lastWritten, setLastWritten] = useState(urlValue);
  if (urlValue !== seenUrlValue) {
    setSeenUrlValue(urlValue);
    if (urlValue !== lastWritten) {
      setValue(urlValue);
      setLastWritten(urlValue);
    }
  }

  function commit(next: string) {
    clearTimeout(timer.current);
    setLastWritten(next);
    write(param, next);
  }

  return (
    <div className={cn("relative min-w-0", className)}>
      <label className="sr-only" htmlFor={`filter-${param}`}>
        {label}
      </label>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" aria-hidden />
      <input
        id={`filter-${param}`}
        type="search"
        placeholder={placeholder}
        value={value}
        autoComplete="off"
        className={cn(inputClass, "h-10 pr-9 pl-9")}
        onChange={(e) => {
          const next = e.currentTarget.value;
          setValue(next);
          clearTimeout(timer.current);
          timer.current = setTimeout(() => commit(next.trim()), 300);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit(e.currentTarget.value.trim());
          }
        }}
      />
      {isPending ? (
        <LoaderCircle
          className="absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin text-tan"
          aria-label="Үр дүнг ачаалж байна"
        />
      ) : null}
    </div>
  );
}

export function SelectFilter({
  param,
  label,
  options,
  className,
}: {
  param: string;
  label: string;
  options: { value: string; label: string }[];
  className?: string;
}) {
  const { write, isPending, searchParams } = useParamWriter();
  const current = searchParams.get(param) ?? "";

  return (
    <div className={cn("min-w-0", className)}>
      <label className="sr-only" htmlFor={`filter-${param}`}>
        {label}
      </label>
      <select
        // Re-mount when the URL changes elsewhere so the shown value stays in sync.
        key={current}
        id={`filter-${param}`}
        defaultValue={current}
        aria-busy={isPending}
        className={cn(selectClass, "h-10", isPending && "opacity-70")}
        onChange={(e) => write(param, e.currentTarget.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
