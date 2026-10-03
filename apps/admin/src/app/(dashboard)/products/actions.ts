"use server";

import type { ProductInput } from "@shop/db";
import { slugify } from "@shop/db/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getData } from "@/lib/data";
import { PRODUCT_IMAGES_BUCKET } from "@/lib/env";
import { isHttpUrl } from "@/lib/images";
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
  if (!name) errors.name = "Give the product a name.";
  else if (name.length > 120) errors.name = "Keep the name under 120 characters.";

  let slug = text(formData, "slug").toLowerCase();
  if (!slug && name) slug = slugify(name);
  if (!slug) errors.slug = "A URL slug is required.";
  else if (!SLUG_PATTERN.test(slug)) errors.slug = "Use lowercase letters, numbers and single hyphens only.";
  else if (slug.length > 140) errors.slug = "Keep the slug under 140 characters.";

  const description = text(formData, "description");
  if (description.length > 5000) errors.description = "Keep the description under 5,000 characters.";

  const priceRaw = text(formData, "price");
  const price = parseNumber(priceRaw);
  if (!priceRaw) errors.price = "Enter a price.";
  else if (!Number.isFinite(price) || price < 0) errors.price = "Enter a valid price, e.g. 49.99.";
  else if (price > MAX_PRICE) errors.price = "That price looks too high.";

  const compareRaw = text(formData, "compareAtPrice");
  let compareAtPrice: number | null = null;
  if (compareRaw) {
    const value = parseNumber(compareRaw);
    if (!Number.isFinite(value) || value < 0) errors.compareAtPrice = "Enter a valid price or leave it empty.";
    else if (Number.isFinite(price) && value <= price)
      errors.compareAtPrice = "Must be higher than the price to show a discount — or leave it empty.";
    else compareAtPrice = round2(value);
  }

  const categoryId = text(formData, "categoryId");
  if (!categoryId) errors.categoryId = "Choose a category.";

  const stockRaw = text(formData, "stock");
  const stock = parseNumber(stockRaw);
  if (!stockRaw) errors.stock = "Enter the stock on hand (0 if none).";
  else if (!Number.isInteger(stock) || stock < 0) errors.stock = "Stock must be a whole number of 0 or more.";
  else if (stock > 1_000_000) errors.stock = "That stock level looks too high.";

  const images = [
    ...new Set(
      formData
        .getAll("images")
        .map((v) => (typeof v === "string" ? v.trim() : ""))
        .filter(Boolean),
    ),
  ];
  if (images.some((url) => !isHttpUrl(url) || url.length > 2048))
    errors.images = "Every image must be a valid http(s) URL.";
  else if (images.length > MAX_IMAGES) errors.images = `Add at most ${MAX_IMAGES} images.`;

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
  if (id !== null && !UUID_PATTERN.test(id)) return { message: "Product not found." };

  const { input, errors } = parseProduct(formData);
  if (errors) return { errors, message: "Please fix the highlighted fields." };

  const data = await getData();
  try {
    const categories = await data.listCategories();
    if (!categories.some((c) => c.id === input.categoryId)) {
      return {
        errors: { categoryId: "That category no longer exists." },
        message: "Please fix the highlighted fields.",
      };
    }
    if (id) await data.updateProduct(id, input);
    else await data.createProduct(input);
  } catch (error) {
    const message = errorMessage(error);
    if (/slug/i.test(message)) {
      return {
        errors: { slug: "Another product already uses this slug." },
        message: "Please fix the highlighted fields.",
      };
    }
    return { message };
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
    if (!UUID_PATTERN.test(id)) return { error: "Product not found." };
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
  if (!supabase) return { error: "Uploads need Supabase. In demo mode, paste an image URL instead." };

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return { error: "Choose an image to upload." };
  const ext = ALLOWED_TYPES[file.type];
  if (!ext) return { error: "Use a JPG, PNG, WebP, AVIF or GIF image." };
  if (file.size > MAX_UPLOAD_BYTES) return { error: "Images must be 4 MB or smaller." };

  const path = `products/${new Date().toISOString().slice(0, 7)}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(PRODUCT_IMAGES_BUCKET).upload(path, file, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) return { error: `Upload failed: ${error.message}` };

  const { data } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path);
  return { url: data.publicUrl };
}
