/** Skeleton shown while a dashboard page streams in. Mirrors the page rhythm to avoid layout jumps. */
export default function Loading() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-live="polite">
      <span className="sr-only">Ачаалж байна…</span>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="h-4 w-40 rounded bg-line" />
          <div className="h-3 w-72 max-w-[70vw] rounded bg-line/70" />
        </div>
        <div className="h-10 w-32 rounded-lg bg-line" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-[134px] rounded-xl border border-line bg-white p-5">
            <div className="h-3 w-24 rounded bg-line" />
            <div className="mt-4 h-6 w-32 rounded bg-line" />
            <div className="mt-5 h-3 w-28 rounded bg-line/70" />
          </div>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="h-[380px] rounded-xl border border-line bg-white lg:col-span-2" />
        <div className="h-[380px] rounded-xl border border-line bg-white" />
      </div>
    </div>
  );
}
