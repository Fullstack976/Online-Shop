"use server";

import type { Category } from "@shop/db";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { getData } from "@/lib/data";
import { isHttpUrl } from "@/lib/images";
import { makeSlug } from "@/lib/slug";
import { errorMessage, parseNumber, SLUG_PATTERN, text, UUID_PATTERN } from "@/lib/validation";

export type CategoryField = "name" | "slug" | "imageUrl" | "sortOrder";

export type CategoryResult = {
  ok?: boolean;
  message?: string;
  error?: string;
  errors?: Partial<Record<CategoryField, string>>;
};

function revalidateCatalog() {
  revalidatePath("/categories");
  revalidatePath("/products");
  revalidatePath("/");
}

export async function saveCategory(formData: FormData): Promise<CategoryResult> {
  try {
    await requireAdmin();
  } catch (error) {
    return { error: errorMessage(error) };
  }

  const id = text(formData, "id");
  if (id && !UUID_PATTERN.test(id)) return { error: "Ангилал олдсонгүй." };

  const errors: NonNullable<CategoryResult["errors"]> = {};
  const name = text(formData, "name");
  if (!name) errors.name = "Ангиллын нэрийг оруулна уу.";
  else if (name.length > 60) errors.name = "Нэр 60 тэмдэгтээс хэтрэхгүй байх ёстой.";

  let slug = text(formData, "slug").toLowerCase();
  if (!slug && name) slug = makeSlug(name);
  if (!slug) errors.slug = "URL slug шаардлагатай.";
  else if (!SLUG_PATTERN.test(slug)) errors.slug = "Зөвхөн латин жижиг үсэг, тоо, дан зураас (-) ашиглана уу.";

  const imageUrl = text(formData, "imageUrl");
  if (imageUrl && (!isHttpUrl(imageUrl) || imageUrl.length > 2048))
    errors.imageUrl = "Зөв http(s) зургийн холбоос оруулна уу.";

  const data = await getData();
  let categories: Category[];
  try {
    categories = await data.listCategories();
  } catch (error) {
    return { error: errorMessage(error) };
  }

  const sortRaw = text(formData, "sortOrder");
  let sortOrder = Math.max(0, ...categories.map((c) => c.sortOrder)) + 1;
  if (sortRaw) {
    const n = parseNumber(sortRaw);
    if (!Number.isInteger(n) || n < 0 || n > 10_000) errors.sortOrder = "0-ээс 10,000 хүртэлх бүхэл тоо оруулна уу.";
    else sortOrder = n;
  }

  if (slug && !errors.slug && categories.some((c) => c.slug === slug && c.id !== id)) {
    errors.slug = "Энэ slug-ийг өөр ангилал ашиглаж байна.";
  }
  if (Object.keys(errors).length) return { errors, error: "Тэмдэглэсэн талбаруудыг засна уу." };

  const input = { name, slug, imageUrl: imageUrl || null, sortOrder };
  try {
    if (id) await data.updateCategory(id, input);
    else await data.createCategory(input);
  } catch (error) {
    const raw = error instanceof Error ? error.message : "";
    if (/slug|already (exists|in use)/i.test(raw)) {
      return {
        errors: { slug: "Энэ slug-ийг өөр ангилал ашиглаж байна." },
        error: "Тэмдэглэсэн талбаруудыг засна уу.",
      };
    }
    return { error: errorMessage(error) };
  }

  revalidateCatalog();
  return { ok: true, message: id ? `“${name}” хадгалагдлаа.` : `“${name}” ангилал нэмэгдлээ.` };
}

export async function deleteCategory(id: string): Promise<CategoryResult> {
  try {
    await requireAdmin();
    if (!UUID_PATTERN.test(id)) return { error: "Ангилал олдсонгүй." };
    const data = await getData();
    await data.deleteCategory(id);
  } catch (error) {
    // errorMessage() turns both the mock and the Supabase FK error into an actionable Mongolian message.
    return { error: errorMessage(error) };
  }
  revalidateCatalog();
  return { ok: true, message: "Ангилал устгагдлаа." };
}
