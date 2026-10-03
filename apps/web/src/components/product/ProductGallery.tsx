"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";

export function ProductGallery({ images, name, badge }: { images: string[]; name: string; badge?: string }) {
  const [active, setActive] = useState(0);
  const main = images[active] ?? images[0];

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      {images.length > 1 && (
        <div className="flex gap-3 sm:flex-col">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              className={cn(
                "relative size-20 shrink-0 overflow-hidden rounded-lg border-2 bg-cloud transition",
                i === active ? "border-navy" : "border-transparent opacity-70 hover:opacity-100",
              )}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === active}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
      <div className="relative aspect-square flex-1 overflow-hidden rounded-xl bg-cloud">
        {main && (
          <Image key={main} src={main} alt={name} fill priority sizes="(min-width: 1024px) 560px, 100vw" className="animate-fade-in object-cover" />
        )}
        {badge && (
          <span className="absolute left-4 top-4 rounded-full bg-navy px-3 py-1 font-display text-xs font-bold text-white">{badge}</span>
        )}
      </div>
    </div>
  );
}
