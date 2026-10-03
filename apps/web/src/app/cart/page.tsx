import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = { title: "Сагс" };

export default function CartPage() {
  return (
    <>
      <PageHeader title="Миний сагс" crumbs={[{ label: "Сагс" }]} />
      <div className="container-page py-10">
        <CartView />
      </div>
    </>
  );
}
