"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { getData } from "@/lib/data";
import { isOrderStatus, ORDER_STATUS_LABEL } from "@/lib/orders";
import { errorMessage, text, UUID_PATTERN } from "@/lib/validation";

export type OrderStatusState = { ok?: boolean; message?: string; error?: string };

export async function updateOrderStatus(
  id: string,
  _prev: OrderStatusState,
  formData: FormData,
): Promise<OrderStatusState> {
  const status = text(formData, "status");
  if (!UUID_PATTERN.test(id)) return { error: "Захиалга олдсонгүй." };
  if (!isOrderStatus(status)) return { error: "Зөв төлөв сонгоно уу." };

  try {
    await requireAdmin();
    const data = await getData();
    await data.updateOrderStatus(id, status);
  } catch (error) {
    return { error: errorMessage(error) };
  }

  revalidatePath(`/orders/${id}`);
  revalidatePath("/orders");
  revalidatePath("/");
  return { ok: true, message: `Төлөв “${ORDER_STATUS_LABEL[status]}” болж шинэчлэгдлээ.` };
}
