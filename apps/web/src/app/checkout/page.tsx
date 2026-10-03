import type { Metadata } from "next";
import { CheckoutForm } from "@/components/cart/CheckoutForm";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Захиалга" };

export default function CheckoutPage() {
  return (
    <>
      <PageHeader title="Захиалга баталгаажуулах" crumbs={[{ label: "Сагс", href: "/cart" }, { label: "Захиалга" }]} />
      <div className="container-page py-10">
        <CheckoutForm />
      </div>
    </>
  );
}
