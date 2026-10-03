import type { Metadata } from "next";
import { CheckoutForm } from "@/components/cart/CheckoutForm";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <>
      <PageHeader title="Checkout" crumbs={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
      <div className="container-page py-10">
        <CheckoutForm />
      </div>
    </>
  );
}
