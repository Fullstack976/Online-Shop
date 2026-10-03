"use server";

import type { Category } from "@shop/db";
import { slugify } from "@shop/db/utils";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { getData } from "@/lib/data";
import { isHttpUrl } from "@/lib/images";
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
  if (id && !UUID_PATTERN.test(id)) return { error: "Category not found." };

  const errors: NonNullable<CategoryResult["errors"]> = {};
  const name = text(formData, "name");
  if (!name) errors.name = "Give the category a name.";
  else if (name.length > 60) errors.name = "Keep the name under 60 characters.";

  let slug = text(formData, "slug").toLowerCase();
  if (!slug && name) slug = slugify(name);
  if (!slug) errors.slug = "A URL slug is required.";
  else if (!SLUG_PATTERN.test(slug)) errors.slug = "Use lowercase letters, numbers and single hyphens only.";

  const imageUrl = text(formData, "imageUrl");
  if (imageUrl && (!isHttpUrl(imageUrl) || imageUrl.length > 2048))
    errors.imageUrl = "Enter a valid http(s) image URL.";

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
    if (!Number.isInteger(n) || n < 0 || n > 10_000) errors.sortOrder = "Use a whole number between 0 and 10,000.";
    else sortOrder = n;
  }

  if (slug && !errors.slug && categories.some((c) => c.slug === slug && c.id !== id)) {
    errors.slug = "Another category already uses this slug.";
  }
  if (Object.keys(errors).length) return { errors, error: "Please fix the highlighted fields." };

  const input = { name, slug, imageUrl: imageUrl || null, sortOrder };
  try {
    if (id) await data.updateCategory(id, input);
    else await data.createCategory(input);
  } catch (error) {
    const message = errorMessage(error);
    if (/slug/i.test(message)) return { errors: { slug: "Another category already uses this slug." }, error: message };
    return { error: message };
  }

  revalidateCatalog();
  return { ok: true, message: id ? `Saved “${name}”.` : `Created “${name}”.` };
}

export async function deleteCategory(id: string): Promise<CategoryResult> {
  try {
    await requireAdmin();
    if (!UUID_PATTERN.test(id)) return { error: "Category not found." };
    const data = await getData();
    await data.deleteCategory(id);
  } catch (error) {
    const message = errorMessage(error);
    // Supabase reports the FK restriction generically; make it actionable.
    if (/referenced by other records/i.test(message)) {
      return { error: "This category still has products. Move or delete them first." };
    }
    return { error: message };
  }
  revalidateCatalog();
  return { ok: true, message: "Category deleted." };
}
