import { Info } from "lucide-react";

/** Shown in the top bar when Supabase env vars are missing. */
export function DemoPill() {
  return (
    <span className="group relative inline-flex">
      <span
        tabIndex={0}
        aria-describedby="demo-mode-tip"
        className="inline-flex h-9 cursor-help items-center gap-1.5 rounded-full bg-tan-100 px-3 text-xs font-semibold whitespace-nowrap text-tan-600 ring-1 ring-tan/25 ring-inset outline-none focus-visible:ring-2 focus-visible:ring-tan"
      >
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-tan opacity-50 motion-reduce:hidden" />
          <span className="relative inline-flex size-2 rounded-full bg-tan" />
        </span>
        <span className="hidden sm:inline">Демо горим · туршилтын өгөгдөл</span>
        <span className="sm:hidden">Демо</span>
      </span>
      <span
        id="demo-mode-tip"
        role="tooltip"
        className="pointer-events-none invisible absolute top-full right-0 z-40 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-xl bg-navy p-3.5 text-xs leading-relaxed text-white/80 opacity-0 shadow-xl transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100"
      >
        <span className="mb-1 flex items-center gap-1.5 font-semibold text-white">
          <Info className="size-3.5 text-tan" aria-hidden />
          Туршилтын өгөгдөл дээр ажиллаж байна
        </span>
        Нэвтрэлт алгасагдаж, бүх өөрчлөлт сервер дахин эхлэх хүртэл санах ойд л хадгалагдана. Бодит өгөгдлийн сантай
        холбохын тулд{" "}
        <code className="rounded bg-white/10 px-1 text-[11px] text-tan-200">NEXT_PUBLIC_SUPABASE_URL</code> болон{" "}
        <code className="rounded bg-white/10 px-1 text-[11px] break-all text-tan-200">
          NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
        </code>{" "}
        утгуудыг тохируулна уу.
      </span>
    </span>
  );
}
