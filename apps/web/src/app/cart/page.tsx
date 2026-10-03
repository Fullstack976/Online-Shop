import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Shopping Cart" };

export default function CartPage() {
  return (
    <>
      <PageHeader title="Shopping cart" crumbs={[{ label: "Cart" }]} />
      <div className="container-page py-10">
        <CartView />
      </div>
    </>
  );
}
