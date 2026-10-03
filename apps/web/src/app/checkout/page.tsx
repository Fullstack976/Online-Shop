import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@shop/db/env";
import { CheckoutForm } from "@/components/cart/CheckoutForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { getUser } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Захиалга" };

export default async function CheckoutPage() {
  const user = await getUser();
  // Ordering requires an account (mock mode without Supabase stays open for demos).
  if (isSupabaseConfigured() && !user) redirect("/login?next=/checkout");

  const meta = (user?.user_metadata ?? {}) as { full_name?: string; name?: string };
  return (
    <>
      <PageHeader title="Захиалга баталгаажуулах" crumbs={[{ label: "Сагс", href: "/cart" }, { label: "Захиалга" }]} />
      <div className="container-page py-10">
        <CheckoutForm defaults={{ name: meta.full_name ?? meta.name ?? "", email: user?.email ?? "" }} emailLocked={Boolean(user)} />
      </div>
    </>
  );
}
