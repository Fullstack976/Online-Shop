"use server";

import { redirect } from "next/navigation";
import { getData } from "@/lib/data";

export type FormState = { status: "idle" | "success" | "error"; message?: string; values?: Record<string, string> };

export async function subscribeAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }
  try {
    await getData().subscribe(email);
    return { status: "success", message: "Thanks for subscribing! Check your inbox for 10% off." };
  } catch (e) {
    return { status: "error", message: e instanceof Error ? e.message : "Something went wrong." };
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
  const customer = {
    name: field("name"),
    email: field("email"),
    phone: field("phone"),
    address: field("address"),
    city: field("city"),
  };

  const fieldErrors: CheckoutState["fieldErrors"] = {};
  if (customer.name.length < 2) fieldErrors.name = "Please enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) fieldErrors.email = "Please enter a valid email.";
  if (customer.phone && !/^[+\d][\d\s()-]{5,}$/.test(customer.phone)) fieldErrors.phone = "Please enter a valid phone number.";
  if (customer.address.length < 4) fieldErrors.address = "Please enter your street address.";
  if (customer.city.length < 2) fieldErrors.city = "Please enter your city.";
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
    return { error: "Your cart could not be read. Please refresh and try again.", values: customer };
  }

  let orderNumber: string;
  try {
    ({ orderNumber } = await getData().placeOrder({ customer, items }));
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not place your order.", values: customer };
  }
  redirect(`/checkout/success?order=${encodeURIComponent(orderNumber)}`);
}

export async function contactAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 5) {
    return {
      status: "error",
      message: "Please fill in your name, a valid email and a short message.",
      values: { name, email, message },
    };
  }
  // Demo only: messages are not stored yet. Hook up email or a `contact_messages` table here.
  return { status: "success", message: `Thanks ${name.split(" ")[0]}, we'll get back to you within 24 hours.` };
}
