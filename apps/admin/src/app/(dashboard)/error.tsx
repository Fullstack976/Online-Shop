"use client";

import { RefreshCw, TriangleAlert } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/** Error boundary for dashboard pages (e.g. Supabase unreachable or RLS denied a read). */
export default function DashboardError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Card className="animate-fade-in mx-auto max-w-lg px-6 py-12 text-center">
      <span className="mx-auto mb-5 inline-flex size-14 items-center justify-center rounded-full bg-danger-bg text-danger">
        <TriangleAlert className="size-6" aria-hidden />
      </span>
      <h2 className="font-display text-xl font-extrabold tracking-tight text-navy">Something went wrong</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
        We couldn&apos;t load this page. Check your connection and that your account still has admin access, then try
        again.
      </p>
      {error.digest ? <p className="mt-3 font-mono text-xs text-subtle">Reference: {error.digest}</p> : null}
      <Button className="mt-6" onClick={() => retry()}>
        <RefreshCw aria-hidden /> Try again
      </Button>
    </Card>
  );
}
