"use client";

import { LoaderCircle, Trash, TriangleAlert } from "lucide-react";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormAlert } from "@/components/ui/field";
import { deleteProduct, type DeleteState } from "./actions";

const initialState: DeleteState = {};

/** Danger zone with a two-step confirm before deleting. */
export function DeleteProduct({ id, name }: { id: string; name: string }) {
  const [confirming, setConfirming] = useState(false);
  const [state, formAction, pending] = useActionState(deleteProduct.bind(null, id), initialState);

  return (
    <Card className="mt-6 border-danger/20">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-display text-[15px] font-bold text-ink">Delete product</h2>
          <p className="mt-0.5 text-[13px] text-muted">
            Removes it from the catalog. Past orders keep their line items. Prefer turning off{" "}
            <span className="font-semibold text-ink">Active</span> to hide it temporarily.
          </p>
        </div>
        {!confirming ? (
          <Button
            variant="secondary"
            className="text-danger hover:border-danger/40"
            onClick={() => setConfirming(true)}
          >
            <Trash aria-hidden />
            Delete…
          </Button>
        ) : null}
      </div>

      {confirming ? (
        <form action={formAction} className="border-t border-danger/15 bg-danger-bg/50 px-5 py-4">
          {state.error ? (
            <div className="mb-3">
              <FormAlert>{state.error}</FormAlert>
            </div>
          ) : null}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-2 text-sm text-ink">
              <TriangleAlert className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden />
              <span>
                Delete <span className="font-semibold">{name}</span>? This can&apos;t be undone.
              </span>
            </p>
            <div className="flex shrink-0 gap-2">
              <Button variant="ghost" onClick={() => setConfirming(false)} disabled={pending}>
                Cancel
              </Button>
              <Button type="submit" variant="danger" disabled={pending} autoFocus>
                {pending ? <LoaderCircle className="animate-spin" aria-hidden /> : <Trash aria-hidden />}
                {pending ? "Deleting…" : "Yes, delete"}
              </Button>
            </div>
          </div>
        </form>
      ) : null}
    </Card>
  );
}
