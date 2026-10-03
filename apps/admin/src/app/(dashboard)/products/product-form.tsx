"use client";

import { discountPercent, formatPrice } from "@shop/db/utils";
import { Eye, Flame, ImagePlus, Link2, LoaderCircle, RefreshCw, Star, Trash, Upload } from "lucide-react";
import Link from "next/link";
import { useActionState, useRef, useState, useTransition } from "react";
import { Thumb } from "@/components/thumb";
import { Button, buttonClass } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Field, FormAlert, inputClass, selectClass } from "@/components/ui/field";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/cn";
import { isHttpUrl } from "@/lib/images";
import { LOW_STOCK_THRESHOLD } from "@/lib/orders";
import { makeSlug } from "@/lib/slug";
import { saveProduct, uploadProductImage, type ProductFormState } from "./actions";

export type ProductFormValues = {
  name: string;
  slug: string;
  description: string;
  price: string;
  compareAtPrice: string;
  categoryId: string;
  stock: string;
  images: string[];
  isTrending: boolean;
  isActive: boolean;
};

const initialState: ProductFormState = {};

export function ProductForm({
  productId,
  initial,
  categories,
  uploadEnabled,
}: {
  productId: string | null;
  initial: ProductFormValues;
  categories: { id: string; name: string }[];
  uploadEnabled: boolean;
}) {
  const [state, formAction, saving] = useActionState(saveProduct.bind(null, productId), initialState);

  // Controlled fields: React resets uncontrolled inputs after an action, which
  // would wipe the user's input when the server returns validation errors.
  const [name, setName] = useState(initial.name);
  const [slug, setSlug] = useState(initial.slug);
  const [slugTouched, setSlugTouched] = useState(Boolean(productId));
  const [description, setDescription] = useState(initial.description);
  const [price, setPrice] = useState(initial.price);
  const [compareAtPrice, setCompareAtPrice] = useState(initial.compareAtPrice);
  const [categoryId, setCategoryId] = useState(initial.categoryId);
  const [stock, setStock] = useState(initial.stock);
  const [images, setImages] = useState<string[]>(initial.images);
  const [isTrending, setIsTrending] = useState(initial.isTrending);
  const [isActive, setIsActive] = useState(initial.isActive);

  const [newImage, setNewImage] = useState("");
  const [imageError, setImageError] = useState<string | null>(null);
  const [uploading, startUpload] = useTransition();
  const fileInput = useRef<HTMLInputElement>(null);

  const errors = state.errors ?? {};
  const priceNum = Number(price);
  const compareNum = Number(compareAtPrice);
  const discount =
    price && compareAtPrice && Number.isFinite(priceNum) && Number.isFinite(compareNum)
      ? discountPercent(priceNum, compareNum)
      : null;
  const stockNum = Number(stock);

  function addImage() {
    const url = newImage.trim();
    if (!url) return;
    if (!isHttpUrl(url)) {
      setImageError("https://-ээр эхэлсэн бүтэн холбоос оруулна уу.");
      return;
    }
    if (images.includes(url)) {
      setImageError("Энэ зураг жагсаалтад аль хэдийн байна.");
      return;
    }
    setImages((list) => [...list, url]);
    setNewImage("");
    setImageError(null);
  }

  function uploadFile(file: File) {
    setImageError(null);
    const body = new FormData();
    body.set("file", file);
    startUpload(async () => {
      const result = await uploadProductImage(body);
      if (result.url) setImages((list) => [...list, result.url!]);
      else setImageError(result.error ?? "Байршуулж чадсангүй.");
    });
  }

  const describedBy = (field: keyof NonNullable<ProductFormState["errors"]>) =>
    errors[field] ? `${field}-error` : undefined;

  return (
    <form action={formAction} noValidate className="animate-fade-in">
      {state.message ? (
        <div className="mb-5">
          <FormAlert>{state.message}</FormAlert>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader
              title="Үндсэн мэдээлэл"
              description="Худалдан авагчид бүтээгдэхүүний хуудсан дээр үзэх мэдээлэл."
            />
            <div className="space-y-5 p-5">
              <Field label="Нэр" htmlFor="name" error={errors.name}>
                <input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => {
                    const value = e.currentTarget.value;
                    setName(value);
                    if (!slugTouched) setSlug(makeSlug(value));
                  }}
                  placeholder="Жишээ нь: Ухаалаг цаг"
                  maxLength={120}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={describedBy("name")}
                  className={inputClass}
                />
              </Field>

              <Field
                label="URL slug (холбоосын нэр)"
                htmlFor="slug"
                error={errors.slug}
                hint={
                  slugTouched ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 font-medium text-tan-600 hover:text-navy"
                      onClick={() => {
                        setSlug(makeSlug(name));
                        setSlugTouched(false);
                      }}
                    >
                      <RefreshCw className="size-3" aria-hidden /> Нэрнээс үүсгэх
                    </button>
                  ) : (
                    "Та засах хүртэл нэрнээс автоматаар үүснэ."
                  )
                }
              >
                <div className="flex rounded-lg shadow-xs">
                  <span className="hidden items-center rounded-l-lg border border-r-0 border-line bg-page px-3 text-sm text-muted sm:inline-flex">
                    /products/
                  </span>
                  <input
                    id="slug"
                    name="slug"
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.currentTarget.value.toLowerCase().replace(/\s+/g, "-"));
                      setSlugTouched(true);
                    }}
                    placeholder="ukhaalag-tsag"
                    maxLength={140}
                    aria-invalid={Boolean(errors.slug)}
                    aria-describedby={describedBy("slug")}
                    className={cn(inputClass, "shadow-none sm:rounded-l-none")}
                  />
                </div>
              </Field>

              <Field label="Тайлбар" htmlFor="description" error={errors.description} optional>
                <textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.currentTarget.value)}
                  rows={5}
                  maxLength={5000}
                  placeholder="Материал, онцлог, хэмжээ…"
                  aria-invalid={Boolean(errors.description)}
                  aria-describedby={describedBy("description")}
                  className={cn(inputClass, "resize-y leading-relaxed")}
                />
              </Field>
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Зураг"
              description="Эхний зураг жагсаалтад харагдах нүүр зураг болно."
              action={<span className="text-xs text-muted tabular-nums">{images.length} / 12</span>}
            />
            <div className="space-y-4 p-5">
              {images.map((url) => (
                <input key={url} type="hidden" name="images" value={url} />
              ))}

              {images.length ? (
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                  {images.map((url, index) => (
                    <li key={url} className="group relative overflow-hidden rounded-xl border border-line bg-white">
                      <Thumb
                        src={url}
                        alt={`Бүтээгдэхүүний зураг ${index + 1}`}
                        sizes="(min-width: 1280px) 180px, (min-width: 640px) 30vw, 45vw"
                        eager={index < 4}
                        className="aspect-square w-full rounded-none ring-0"
                      />
                      {index === 0 ? (
                        <span className="label-caps absolute top-2 left-2 rounded-md bg-navy/85 px-1.5 py-0.5 text-[9.5px] text-white">
                          Нүүр
                        </span>
                      ) : null}
                      <div className="flex items-center justify-between gap-1 border-t border-line p-1.5">
                        {index === 0 ? (
                          <span className="px-1.5 text-xs whitespace-nowrap text-muted">Нүүр зураг</span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setImages((list) => [url, ...list.filter((u) => u !== url)])}
                            className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-xs font-medium whitespace-nowrap text-muted hover:bg-page hover:text-ink"
                            title="Нүүр зураг болгох"
                          >
                            <Star className="size-3.5" aria-hidden /> Нүүр болгох
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setImages((list) => list.filter((u) => u !== url))}
                          className="inline-flex size-7 items-center justify-center rounded-md text-muted hover:bg-danger-bg hover:text-danger"
                          aria-label={`${index + 1}-р зургийг хасах`}
                        >
                          <Trash className="size-3.5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center rounded-xl border border-dashed border-line-strong bg-page/50 px-4 py-8 text-center">
                  <ImagePlus className="size-6 text-tan" aria-hidden />
                  <p className="mt-2 text-sm font-semibold text-ink">Зураг алга</p>
                  <p className="mt-0.5 text-xs text-muted">
                    Доор зургийн холбоос буулгана уу{uploadEnabled ? " эсвэл файл байршуулна уу" : ""}.
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative min-w-0 flex-1">
                  <label htmlFor="new-image" className="sr-only">
                    Зургийн холбоос
                  </label>
                  <Link2
                    className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle"
                    aria-hidden
                  />
                  <input
                    id="new-image"
                    type="url"
                    inputMode="url"
                    value={newImage}
                    onChange={(e) => {
                      setNewImage(e.currentTarget.value);
                      setImageError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addImage();
                      }
                    }}
                    placeholder="https://images.unsplash.com/photo-…"
                    className={cn(inputClass, "h-10 pl-9")}
                    aria-describedby={imageError || errors.images ? "images-error" : undefined}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={addImage} disabled={!newImage.trim() || images.length >= 12}>
                    Холбоос нэмэх
                  </Button>
                  {uploadEnabled ? (
                    <>
                      <input
                        ref={fileInput}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                        className="sr-only"
                        tabIndex={-1}
                        onChange={(e) => {
                          const file = e.currentTarget.files?.[0];
                          e.currentTarget.value = "";
                          if (file) uploadFile(file);
                        }}
                      />
                      <Button
                        variant="secondary"
                        onClick={() => fileInput.current?.click()}
                        disabled={uploading || images.length >= 12}
                      >
                        {uploading ? <LoaderCircle className="animate-spin" aria-hidden /> : <Upload aria-hidden />}
                        {uploading ? "Байршуулж байна…" : "Байршуулах"}
                      </Button>
                    </>
                  ) : null}
                </div>
              </div>
              {imageError || errors.images ? (
                <p id="images-error" role="alert" className="text-xs font-medium text-danger">
                  {imageError ?? errors.images}
                </p>
              ) : (
                <p className="text-xs text-muted">
                  {uploadEnabled
                    ? "Зураг Supabase Storage-ийн product-images сан руу байршина (JPG, PNG, WebP, AVIF, GIF, 4 МБ хүртэл)."
                    : "Демо горим: зургийн холбоос буулгана уу. Supabase холбогдсоны дараа файл байршуулах боломжтой."}
                </p>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Үнийн мэдээлэл" />
            <div className="space-y-5 p-5">
              <Field label="Үнэ" htmlFor="price" error={errors.price}>
                <MoneyInput
                  id="price"
                  value={price}
                  onChange={setPrice}
                  invalid={Boolean(errors.price)}
                  describedBy={describedBy("price")}
                />
              </Field>
              <Field
                label="Хуучин үнэ"
                htmlFor="compareAtPrice"
                error={errors.compareAtPrice}
                optional
                hint={
                  discount ? (
                    <span className="font-medium text-success">
                      {discount}% хямдралтай харагдана · өмнө нь {formatPrice(compareNum)}
                    </span>
                  ) : (
                    "Хямдралаас өмнөх үнэ, дээгүүр нь зурж харуулна."
                  )
                }
              >
                <MoneyInput
                  id="compareAtPrice"
                  value={compareAtPrice}
                  onChange={setCompareAtPrice}
                  invalid={Boolean(errors.compareAtPrice)}
                  describedBy={describedBy("compareAtPrice")}
                />
              </Field>
            </div>
          </Card>

          <Card>
            <CardHeader title="Ангилал ба нөөц" />
            <div className="space-y-5 p-5">
              <Field label="Ангилал" htmlFor="categoryId" error={errors.categoryId}>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.currentTarget.value)}
                  aria-invalid={Boolean(errors.categoryId)}
                  aria-describedby={describedBy("categoryId")}
                  className={selectClass}
                >
                  <option value="">Ангилал сонгох…</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                label="Нөөц"
                htmlFor="stock"
                error={errors.stock}
                hint={
                  stock !== "" && Number.isInteger(stockNum) && stockNum <= LOW_STOCK_THRESHOLD ? (
                    <span className="font-medium text-warning">
                      {stockNum <= 0
                        ? "Дууссан — худалдан авах боломжгүй."
                        : "Нөөц бага — хянах самбарт анхааруулга гарна."}
                    </span>
                  ) : (
                    "Зарах боломжтой тоо ширхэг."
                  )
                }
              >
                <input
                  id="stock"
                  name="stock"
                  inputMode="numeric"
                  value={stock}
                  onChange={(e) => setStock(e.currentTarget.value.replace(/[^\d]/g, ""))}
                  placeholder="0"
                  aria-invalid={Boolean(errors.stock)}
                  aria-describedby={describedBy("stock")}
                  className={cn(inputClass, "tabular-nums")}
                />
              </Field>
            </div>
          </Card>

          <Card>
            <CardHeader title="Харагдах байдал" />
            <div className="space-y-3 p-4">
              <Toggle
                name="isActive"
                checked={isActive}
                onChange={setIsActive}
                icon={<Eye className="text-success" aria-hidden />}
                label="Идэвхтэй"
                description={isActive ? "Дэлгүүрт харагдана." : "Ноорог — дэлгүүрт харагдахгүй."}
              />
              <div className="border-t border-line" />
              <Toggle
                name="isTrending"
                checked={isTrending}
                onChange={setIsTrending}
                icon={<Flame className="text-tan" aria-hidden />}
                label="Тренд"
                description="Дэлгүүрийн «Тренд» хэсэгт онцлогдоно."
              />
            </div>
          </Card>
        </div>
      </div>

      <div className="sticky bottom-0 z-10 -mx-4 mt-6 border-t border-line bg-white/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="flex items-center justify-end gap-2">
          <Link href="/products" className={buttonClass({ variant: "ghost" })}>
            Болих
          </Link>
          <Button type="submit" disabled={saving || uploading}>
            {saving ? <LoaderCircle className="animate-spin" aria-hidden /> : null}
            {saving ? "Хадгалж байна…" : productId ? "Өөрчлөлт хадгалах" : "Бүтээгдэхүүн үүсгэх"}
          </Button>
        </div>
      </div>
    </form>
  );
}

function MoneyInput({
  id,
  value,
  onChange,
  invalid,
  describedBy,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  invalid: boolean;
  describedBy?: string;
}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted">$</span>
      <input
        id={id}
        name={id}
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.currentTarget.value.replace(/[^\d.]/g, ""))}
        placeholder="0.00"
        aria-invalid={invalid}
        aria-describedby={describedBy}
        className={cn(inputClass, "pl-7 tabular-nums")}
      />
    </div>
  );
}
