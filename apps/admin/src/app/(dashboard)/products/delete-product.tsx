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
          <h2 className="font-display text-[15px] font-bold text-ink">Бүтээгдэхүүн устгах</h2>
          <p className="mt-0.5 text-[13px] text-muted">
            Каталогоос бүрмөсөн хасна. Өмнөх захиалгуудын мэдээлэл хадгалагдана. Түр нуух бол{" "}
            <span className="font-semibold text-ink">Идэвхтэй</span> тохиргоог унтраахад хангалттай.
          </p>
        </div>
        {!confirming ? (
          <Button
            variant="secondary"
            className="text-danger hover:border-danger/40"
            onClick={() => setConfirming(true)}
          >
            <Trash aria-hidden />
            Устгах…
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
                <span className="font-semibold">“{name}”</span> бүтээгдэхүүнийг устгах уу? Энэ үйлдлийг буцаах
                боломжгүй.
              </span>
            </p>
            <div className="flex shrink-0 gap-2">
              <Button variant="ghost" onClick={() => setConfirming(false)} disabled={pending}>
                Болих
              </Button>
              <Button type="submit" variant="danger" disabled={pending} autoFocus>
                {pending ? <LoaderCircle className="animate-spin" aria-hidden /> : <Trash aria-hidden />}
                {pending ? "Устгаж байна…" : "Тийм, устгах"}
              </Button>
            </div>
          </div>
        </form>
      ) : null}
    </Card>
  );
}
