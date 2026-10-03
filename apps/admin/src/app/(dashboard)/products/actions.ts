"use server";

import type { ProductInput } from "@shop/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getData } from "@/lib/data";
import { PRODUCT_IMAGES_BUCKET } from "@/lib/env";
import { isHttpUrl } from "@/lib/images";
import { makeSlug } from "@/lib/slug";
import { getSupabase } from "@/lib/supabase/server";
import { checkbox, errorMessage, parseNumber, round2, SLUG_PATTERN, text, UUID_PATTERN } from "@/lib/validation";

export type ProductField =
  "name" | "slug" | "description" | "price" | "compareAtPrice" | "categoryId" | "stock" | "images";

export type ProductFormState = {
  errors?: Partial<Record<ProductField, string>>;
  message?: string;
};

const MAX_IMAGES = 12;
const MAX_PRICE = 1_000_000;

function parseProduct(formData: FormData): { input: ProductInput; errors: ProductFormState["errors"] } {
  const errors: NonNullable<ProductFormState["errors"]> = {};

  const name = text(formData, "name");
  if (!name) errors.name = "Бүтээгдэхүүний нэрийг оруулна уу.";
  else if (name.length > 120) errors.name = "Нэр 120 тэмдэгтээс хэтрэхгүй байх ёстой.";

  let slug = text(formData, "slug").toLowerCase();
  if (!slug && name) slug = makeSlug(name);
  if (!slug) errors.slug = "URL slug шаардлагатай.";
  else if (!SLUG_PATTERN.test(slug)) errors.slug = "Зөвхөн латин жижиг үсэг, тоо, дан зураас (-) ашиглана уу.";
  else if (slug.length > 140) errors.slug = "Slug 140 тэмдэгтээс хэтрэхгүй байх ёстой.";

  const description = text(formData, "description");
  if (description.length > 5000) errors.description = "Тайлбар 5,000 тэмдэгтээс хэтрэхгүй байх ёстой.";

  const priceRaw = text(formData, "price");
  const price = parseNumber(priceRaw);
  if (!priceRaw) errors.price = "Үнэ оруулна уу.";
  else if (!Number.isFinite(price) || price < 0) errors.price = "Зөв үнэ оруулна уу, жишээ нь 49.99.";
  else if (price > MAX_PRICE) errors.price = "Үнэ хэт өндөр байна.";

  const compareRaw = text(formData, "compareAtPrice");
  let compareAtPrice: number | null = null;
  if (compareRaw) {
    const value = parseNumber(compareRaw);
    if (!Number.isFinite(value) || value < 0) errors.compareAtPrice = "Зөв үнэ оруулах эсвэл хоосон орхино уу.";
    else if (Number.isFinite(price) && value <= price)
      errors.compareAtPrice = "Хямдрал харуулахын тулд үнээс өндөр байх ёстой — эсвэл хоосон орхино уу.";
    else compareAtPrice = round2(value);
  }

  const categoryId = text(formData, "categoryId");
  if (!categoryId) errors.categoryId = "Ангилал сонгоно уу.";

  const stockRaw = text(formData, "stock");
  const stock = parseNumber(stockRaw);
  if (!stockRaw) errors.stock = "Нөөцийн тоог оруулна уу (байхгүй бол 0).";
  else if (!Number.isInteger(stock) || stock < 0) errors.stock = "Нөөц 0 буюу түүнээс их бүхэл тоо байх ёстой.";
  else if (stock > 1_000_000) errors.stock = "Нөөцийн тоо хэт их байна.";

  const images = [
    ...new Set(
      formData
        .getAll("images")
        .map((v) => (typeof v === "string" ? v.trim() : ""))
        .filter(Boolean),
    ),
  ];
  if (images.some((url) => !isHttpUrl(url) || url.length > 2048))
    errors.images = "Зураг бүр зөв http(s) холбоос байх ёстой.";
  else if (images.length > MAX_IMAGES) errors.images = `Хамгийн ихдээ ${MAX_IMAGES} зураг нэмнэ үү.`;

  return {
    input: {
      name,
      slug,
      description,
      price: round2(price),
      compareAtPrice,
      categoryId,
      images,
      stock,
      isTrending: checkbox(formData, "isTrending"),
      isActive: checkbox(formData, "isActive"),
    },
    errors: Object.keys(errors).length ? errors : undefined,
  };
}

export async function saveProduct(
  id: string | null,
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  try {
    await requireAdmin();
  } catch (error) {
    return { message: errorMessage(error) };
  }
  if (id !== null && !UUID_PATTERN.test(id)) return { message: "Бүтээгдэхүүн олдсонгүй." };

  const { input, errors } = parseProduct(formData);
  if (errors) return { errors, message: "Тэмдэглэсэн талбаруудыг засна уу." };

  const data = await getData();
  try {
    const categories = await data.listCategories();
    if (!categories.some((c) => c.id === input.categoryId)) {
      return {
        errors: { categoryId: "Энэ ангилал устгагдсан байна." },
        message: "Тэмдэглэсэн талбаруудыг засна уу.",
      };
    }
    if (id) await data.updateProduct(id, input);
    else await data.createProduct(input);
  } catch (error) {
    const raw = error instanceof Error ? error.message : "";
    if (/slug|already (exists|in use)/i.test(raw)) {
      return {
        errors: { slug: "Энэ slug-ийг өөр бүтээгдэхүүн ашиглаж байна." },
        message: "Тэмдэглэсэн талбаруудыг засна уу.",
      };
    }
    return { message: errorMessage(error) };
  }

  revalidatePath("/products");
  revalidatePath("/");
  if (id) revalidatePath(`/products/${id}`);
  redirect(`/products?notice=${id ? "updated" : "created"}`);
}

export type DeleteState = { error?: string };

export async function deleteProduct(id: string): Promise<DeleteState> {
  try {
    await requireAdmin();
    if (!UUID_PATTERN.test(id)) return { error: "Бүтээгдэхүүн олдсонгүй." };
    const data = await getData();
    await data.deleteProduct(id);
  } catch (error) {
    return { error: errorMessage(error) };
  }
  revalidatePath("/products");
  revalidatePath("/");
  redirect("/products?notice=deleted");
}

export type UploadResult = { url?: string; error?: string };

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

/** Uploads one image to the public `product-images` bucket and returns its public URL. */
export async function uploadProductImage(formData: FormData): Promise<UploadResult> {
  try {
    await requireAdmin();
  } catch (error) {
    return { error: errorMessage(error) };
  }

  const supabase = await getSupabase();
  if (!supabase) return { error: "Файл байршуулахад Supabase шаардлагатай. Демо горимд зургийн холбоос буулгана уу." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Байршуулах зургаа сонгоно уу." };
  const ext = ALLOWED_TYPES[file.type];
  if (!ext) return { error: "JPG, PNG, WebP, AVIF эсвэл GIF зураг ашиглана уу." };
  if (file.size > MAX_UPLOAD_BYTES) return { error: "Зураг 4 МБ-аас ихгүй байх ёстой." };

  const path = `products/${new Date().toISOString().slice(0, 7)}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(PRODUCT_IMAGES_BUCKET).upload(path, file, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) return { error: `Байршуулж чадсангүй: ${error.message}` };

  const { data } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl };
}
