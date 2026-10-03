"use server";

import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@shop/db/env";
import { getData, getSessionData } from "@/lib/data";
import { getUser } from "@/lib/supabase/server";

export type FormState = { status: "idle" | "success" | "error"; message?: string; values?: Record<string, string> };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Checkout errors come from the shared data layer or the `place_order` SQL function in English;
 * show them to shoppers in Mongolian.
 */
function translateCheckoutError(message: string): string {
  const known: Record<string, string> = {
    "Please fill in your name, email, address and city.": "Нэр, имэйл, хаяг, хотоо бүрэн бөглөнө үү.",
    "Your cart is empty.": "Таны сагс хоосон байна.",
    "Invalid quantity in cart.": "Сагсанд буруу тоо ширхэг байна.",
    "A product in your cart is no longer available.": "Таны сагсан дахь нэг бараа дууссан байна.",
    "Too many items in one order.": "Нэг захиалгад хэт олон бараа байна.",
    "Please sign in to place an order.": "Захиалга өгөхийн тулд нэвтэрнэ үү.",
  };
  if (known[message]) return known[message];
  const stock = message.match(/^Only (\d+) left of (.+)\.$/);
  if (stock) return `«${stock[2]}» ердөө ${stock[1]} ширхэг үлдсэн байна.`;
  return "Захиалга өгөх үед алдаа гарлаа. Дахин оролдоно уу.";
}

export async function subscribeAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!EMAIL_RE.test(email)) {
    return { status: "error", message: "Зөв имэйл хаяг оруулна уу." };
  }
  try {
    await getData().subscribe(email);
    return { status: "success", message: "Бүртгүүлсэнд баярлалаа! Шинэ мэдээг таны имэйл рүү илгээнэ." };
  } catch {
    return { status: "error", message: "Одоогоор бүртгэж чадсангүй. Дахин оролдоно уу." };
  }
}

type CheckoutField = "name" | "email" | "phone" | "address" | "city";
export type CheckoutState = {
  error?: string;
  fieldErrors?: Partial<Record<CheckoutField, string>>;
  /** Echoed back so inputs keep their values after React resets the form. */
  values?: Partial<Record<CheckoutField, string>>;
};

export async function placeOrderAction(_prev: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const field = (k: string) => String(formData.get(k) ?? "").trim();
  const user = await getUser();
  if (isSupabaseConfigured() && !user) redirect("/login?next=/checkout");
  const customer = {
    name: field("name"),
    // Signed-in shoppers always order with their account email.
    email: user?.email ?? field("email"),
    phone: field("phone"),
    address: field("address"),
    city: field("city"),
  };

  const fieldErrors: CheckoutState["fieldErrors"] = {};
  if (customer.name.length < 2) fieldErrors.name = "Овог нэрээ оруулна уу.";
  if (!EMAIL_RE.test(customer.email)) fieldErrors.email = "Зөв имэйл хаяг оруулна уу.";
  if (customer.phone && !/^[+\d][\d\s()-]{5,}$/.test(customer.phone)) fieldErrors.phone = "Зөв утасны дугаар оруулна уу.";
  if (customer.address.length < 4) fieldErrors.address = "Хүргэлтийн хаягаа оруулна уу.";
  if (customer.city.length < 2) fieldErrors.city = "Хот эсвэл аймгаа оруулна уу.";
  if (Object.keys(fieldErrors).length) return { fieldErrors, values: customer };

  let items: { productId: string; quantity: number }[];
  try {
    const parsed = JSON.parse(field("items")) as unknown;
    if (!Array.isArray(parsed)) throw new Error();
    items = parsed.map((i: { productId?: unknown; quantity?: unknown }) => ({
      productId: String(i.productId),
      quantity: Number(i.quantity),
    }));
  } catch {
    return { error: "Сагсны мэдээллийг уншиж чадсангүй. Хуудсаа шинэчлээд дахин оролдоно уу.", values: customer };
  }

  let orderNumber: string;
  try {
    ({ orderNumber } = await (await getSessionData()).placeOrder({ customer, items }));
  } catch (e) {
    return { error: translateCheckoutError(e instanceof Error ? e.message : ""), values: customer };
  }
  redirect(`/checkout/success?order=${encodeURIComponent(orderNumber)}`);
}

export async function contactAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  if (!name || !EMAIL_RE.test(email) || message.length < 5) {
    return {
      status: "error",
      message: "Нэр, зөв имэйл хаяг болон зурвасаа бичнэ үү.",
      values: { name, email, message },
    };
  }
  // Demo only: messages are not stored yet. Hook up email or a `contact_messages` table here.
  return { status: "success", message: `Баярлалаа, ${name.split(" ")[0]}! Бид 24 цагийн дотор хариу өгнө.` };
}
