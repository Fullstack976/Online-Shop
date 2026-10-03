import { cn } from "@/lib/cn";
import { initials } from "@/lib/format";

// Brand-tinted backgrounds; picked deterministically from the name so a person keeps their colour.
const palettes = [
  "bg-navy text-white",
  "bg-tan text-white",
  "bg-beige text-navy",
  "bg-navy-700 text-white",
  "bg-tan-100 text-tan-600",
  "bg-[#e2ecfa] text-navy",
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function Avatar({ name, size = 36, className }: { name: string; size?: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-display font-bold tracking-wide select-none",
        palettes[hash(name) % palettes.length],
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
    >
      {initials(name)}
    </span>
  );
}
