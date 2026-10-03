"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { getData } from "@/lib/data";
import { isOrderStatus } from "@/lib/orders";
import { errorMessage, text, UUID_PATTERN } from "@/lib/validation";

export type OrderStatusState = { ok?: boolean; message?: string; error?: string };

export async function updateOrderStatus(
  id: string,
  _prev: OrderStatusState,
  formData: FormData,
): Promise<OrderStatusState> {
  const status = text(formData, "status");
  if (!UUID_PATTERN.test(id)) return { error: "Order not found." };
  if (!isOrderStatus(status)) return { error: "Choose a valid status." };

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
  return { ok: true, message: `Status updated to ${status}.` };
}
