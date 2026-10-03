import type { Metadata } from "next";
import { getData } from "@/lib/data";
import { supabaseEnv } from "@/lib/env";
import { ProductForm } from "../product-form";

export const metadata: Metadata = { title: "Шинэ бүтээгдэхүүн" };

export default async function NewProductPage() {
  const data = await getData();
  const categories = await data.listCategories();

  return (
    <ProductForm
      productId={null}
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      uploadEnabled={Boolean(supabaseEnv())}
      initial={{
        name: "",
        slug: "",
        description: "",
        price: "",
        compareAtPrice: "",
        categoryId: "",
        stock: "0",
        images: [],
        isTrending: false,
        isActive: true,
      }}
    />
  );
}
