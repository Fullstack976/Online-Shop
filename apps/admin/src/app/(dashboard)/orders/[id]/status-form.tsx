"use client";

import type { OrderStatus } from "@shop/db";
import { Check, LoaderCircle } from "lucide-react";
import { useActionState, useState } from "react";
import { STATUS_META } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { FormAlert, selectClass } from "@/components/ui/field";
import { ORDER_STATUS_LIST } from "@/lib/orders";
import { updateOrderStatus, type OrderStatusState } from "../actions";

const initialState: OrderStatusState = {};

export function StatusForm({ orderId, current }: { orderId: string; current: OrderStatus }) {
  const [state, formAction, pending] = useActionState(updateOrderStatus.bind(null, orderId), initialState);
  const [status, setStatus] = useState<OrderStatus>(current);
  const dirty = status !== current;

  return (
    <form action={formAction} className="space-y-3">
      <label htmlFor="status" className="block text-[13px] font-semibold text-ink">
        Захиалгын төлөв
      </label>
      <select
        id="status"
        name="status"
        value={status}
        onChange={(e) => setStatus(e.currentTarget.value as OrderStatus)}
        className={selectClass}
      >
        {ORDER_STATUS_LIST.map((s) => (
          <option key={s} value={s}>
            {STATUS_META[s].label}
          </option>
        ))}
      </select>
      {status === "cancelled" && current !== "cancelled" ? (
        <p className="text-xs text-warning">Цуцалсан захиалга орлогод тооцогдохгүй. Нөөц автоматаар нөхөгдөхгүй.</p>
      ) : null}
      <Button type="submit" className="w-full" disabled={pending || !dirty}>
        {pending ? <LoaderCircle className="animate-spin" aria-hidden /> : null}
        {pending ? "Хадгалж байна…" : "Төлөв шинэчлэх"}
      </Button>
      {state.error ? <FormAlert>{state.error}</FormAlert> : null}
      {state.ok && !dirty && !pending ? (
        <p role="status" className="flex items-center justify-center gap-1.5 text-xs font-medium text-success">
          <Check className="size-3.5" aria-hidden /> Хадгаллаа — одоогийн төлөв: {STATUS_META[current].label}.
        </p>
      ) : null}
    </form>
  );
}
