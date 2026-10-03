"use client";

import { CircleCheck, FolderPlus, LoaderCircle, Pencil, Plus, RefreshCw, Trash, TriangleAlert, X } from "lucide-react";
import Link from "next/link";
import { Fragment, useRef, useState, useTransition, type FormEvent } from "react";
import { EmptyState } from "@/components/empty-state";
import { Thumb } from "@/components/thumb";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, TableScroll, td, th } from "@/components/ui/card";
import { Field, FormAlert, inputClass } from "@/components/ui/field";
import { cn } from "@/lib/cn";
import { formatInt } from "@/lib/format";
import { isHttpUrl } from "@/lib/images";
import { makeSlug } from "@/lib/slug";
import { deleteCategory, saveCategory, type CategoryResult } from "./actions";

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  sortOrder: number;
  productCount: number;
};

export function CategoryManager({ categories }: { categories: CategoryRow[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [rowError, setRowError] = useState<{ id: string; message: string } | null>(null);
  const [deleting, startDelete] = useTransition();
  const editorRef = useRef<HTMLDivElement>(null);

  const editing = editingId ? (categories.find((c) => c.id === editingId) ?? null) : null;
  const nextSortOrder = Math.max(0, ...categories.map((c) => c.sortOrder)) + 1;

  function startEdit(id: string | null) {
    setEditingId(id);
    setFlash(null);
    setConfirmId(null);
    setRowError(null);
    editorRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function remove(category: CategoryRow) {
    setRowError(null);
    startDelete(async () => {
      const result = await deleteCategory(category.id);
      if (result.ok) {
        setConfirmId(null);
        if (editingId === category.id) setEditingId(null);
        setFlash(`“${category.name}” ангилал устгагдлаа.`);
      } else {
        setRowError({ id: category.id, message: result.error ?? "Ангиллыг устгаж чадсангүй." });
      }
    });
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="min-w-0 lg:col-span-2">
        {flash ? (
          <div
            role="status"
            className="animate-fade-in mb-4 flex items-center gap-3 rounded-xl border border-success/20 bg-success-bg px-4 py-3 text-sm font-medium text-success"
          >
            <CircleCheck className="size-4 shrink-0" aria-hidden />
            <span className="flex-1">{flash}</span>
            <button
              type="button"
              onClick={() => setFlash(null)}
              className="inline-flex size-7 items-center justify-center rounded-md hover:bg-success/10"
              aria-label="Хаах"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : null}

        <Card>
          <CardHeader
            title="Бүх ангилал"
            description="Дэлгүүрийн цэсэнд энэ дарааллаар харагдана."
            action={
              <Button size="sm" onClick={() => startEdit(null)} className="lg:hidden">
                <Plus aria-hidden /> Шинэ
              </Button>
            }
          />
          {categories.length ? (
            <TableScroll className="mt-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-y border-line bg-page/60">
                    <th scope="col" className={th}>
                      Ангилал
                    </th>
                    <th scope="col" className={th}>
                      Slug
                    </th>
                    <th scope="col" className={`${th} text-right`}>
                      Бүтээгдэхүүн
                    </th>
                    <th scope="col" className={`${th} text-right`}>
                      Дараалал
                    </th>
                    <th scope="col" className={th}>
                      <span className="sr-only">Үйлдэл</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {categories.map((c) => {
                    const confirming = confirmId === c.id;
                    const error = rowError?.id === c.id ? rowError.message : null;
                    return (
                      <Fragment key={c.id}>
                        <tr
                          className={cn("transition-colors", editingId === c.id ? "bg-tan-100/40" : "hover:bg-page/60")}
                        >
                          <td className={td}>
                            <div className="flex items-center gap-3">
                              <Thumb src={c.imageUrl} alt="" size={44} />
                              <span className="font-semibold text-ink">{c.name}</span>
                            </div>
                          </td>
                          <td className={`${td} text-muted`}>/{c.slug}</td>
                          <td className={`${td} text-right tabular-nums`}>
                            <Link
                              href={`/products?category=${c.slug}`}
                              className="font-medium text-navy hover:text-tan-600"
                            >
                              {formatInt(c.productCount)}
                            </Link>
                          </td>
                          <td className={`${td} text-right text-muted tabular-nums`}>{c.sortOrder}</td>
                          <td className={`${td} text-right`}>
                            <div className="flex justify-end gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => startEdit(c.id)}
                                aria-label={`Засах: ${c.name}`}
                              >
                                <Pencil />
                              </Button>
                              <Button
                                size="icon"
                                variant="danger-ghost"
                                onClick={() => {
                                  setRowError(null);
                                  setConfirmId(confirming ? null : c.id);
                                }}
                                aria-label={`Устгах: ${c.name}`}
                                aria-expanded={confirming}
                              >
                                <Trash />
                              </Button>
                            </div>
                          </td>
                        </tr>
                        {confirming ? (
                          <tr>
                            <td colSpan={5} className="px-5 pb-4">
                              <div className="flex flex-col gap-3 rounded-lg border border-danger/20 bg-danger-bg/60 px-4 py-3 whitespace-normal sm:flex-row sm:items-center sm:justify-between">
                                {error ? (
                                  <p role="alert" className="flex items-start gap-2 text-sm font-medium text-danger">
                                    <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
                                    {error}
                                  </p>
                                ) : (
                                  <p className="text-sm text-ink">
                                    <span className="font-semibold">“{c.name}”</span> ангиллыг устгах уу? Энэ үйлдлийг
                                    буцаах боломжгүй.
                                  </p>
                                )}
                                <div className="flex shrink-0 gap-2">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setConfirmId(null)}
                                    disabled={deleting}
                                  >
                                    Болих
                                  </Button>
                                  {!error ? (
                                    <Button
                                      size="sm"
                                      variant="danger"
                                      onClick={() => remove(c)}
                                      disabled={deleting}
                                      autoFocus
                                    >
                                      {deleting ? (
                                        <LoaderCircle className="animate-spin" aria-hidden />
                                      ) : (
                                        <Trash aria-hidden />
                                      )}
                                      {deleting ? "Устгаж байна…" : "Тийм, устгах"}
                                    </Button>
                                  ) : c.productCount ? (
                                    <Link
                                      href={`/products?category=${c.slug}`}
                                      className="inline-flex h-8 items-center rounded-lg px-3 text-xs font-semibold text-navy hover:bg-white"
                                    >
                                      Бүтээгдэхүүнийг харах
                                    </Link>
                                  ) : null}
                                </div>
                              </div>
                            </td>
                          </tr>
                        ) : null}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </TableScroll>
          ) : (
            <EmptyState icon={<FolderPlus />} title="Ангилал алга байна">
              Бүтээгдэхүүнээ ангилахын тулд анхны ангиллаа үүсгэнэ үү.
            </EmptyState>
          )}
        </Card>
      </div>

      <div ref={editorRef} className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
        <CategoryEditor
          key={editing?.id ?? "new"}
          category={editing}
          defaultSortOrder={nextSortOrder}
          onCancel={() => setEditingId(null)}
          onSaved={(message) => {
            setEditingId(null);
            setFlash(message);
          }}
        />
      </div>
    </div>
  );
}

function CategoryEditor({
  category,
  defaultSortOrder,
  onCancel,
  onSaved,
}: {
  category: CategoryRow | null;
  defaultSortOrder: number;
  onCancel: () => void;
  onSaved: (message: string) => void;
}) {
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(category));
  const [imageUrl, setImageUrl] = useState(category?.imageUrl ?? "");
  const [sortOrder, setSortOrder] = useState(String(category?.sortOrder ?? defaultSortOrder));
  const [result, setResult] = useState<CategoryResult>({});
  const [pending, startTransition] = useTransition();
  const errors = result.errors ?? {};

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await saveCategory(formData);
      if (res.ok) {
        onSaved(res.message ?? "Хадгалагдлаа.");
        if (!category) {
          // Stay in "new" mode, ready for the next one.
          setName("");
          setSlug("");
          setSlugTouched(false);
          setImageUrl("");
          setSortOrder(String(defaultSortOrder + 1));
          setResult({});
        }
      } else {
        setResult(res);
      }
    });
  }

  return (
    <Card>
      <CardHeader
        title={category ? "Ангилал засах" : "Шинэ ангилал"}
        description={category ? `Засаж буй: “${category.name}”` : "Дэлгүүрт шинэ ангилал нэмэх."}
      />
      <form onSubmit={submit} noValidate className="space-y-4 p-5">
        {category ? <input type="hidden" name="id" value={category.id} /> : null}
        {result.error ? <FormAlert>{result.error}</FormAlert> : null}

        <Field label="Нэр" htmlFor="category-name" error={errors.name}>
          <input
            id="category-name"
            name="name"
            value={name}
            onChange={(e) => {
              const value = e.currentTarget.value;
              setName(value);
              if (!slugTouched) setSlug(makeSlug(value));
            }}
            placeholder="Жишээ нь: Гэр ахуй"
            maxLength={60}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "category-name-error" : undefined}
            className={inputClass}
          />
        </Field>

        <Field
          label="Slug"
          htmlFor="category-slug"
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
          <input
            id="category-slug"
            name="slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.currentTarget.value.toLowerCase().replace(/\s+/g, "-"));
              setSlugTouched(true);
            }}
            placeholder="ger-akhui"
            aria-invalid={Boolean(errors.slug)}
            aria-describedby={errors.slug ? "category-slug-error" : undefined}
            className={inputClass}
          />
        </Field>

        <Field label="Зургийн холбоос" htmlFor="category-image" error={errors.imageUrl} optional>
          <div className="flex items-center gap-3">
            <Thumb src={isHttpUrl(imageUrl) ? imageUrl : null} alt="" size={42} />
            <input
              id="category-image"
              name="imageUrl"
              type="url"
              inputMode="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.currentTarget.value)}
              placeholder="https://images.unsplash.com/…"
              aria-invalid={Boolean(errors.imageUrl)}
              aria-describedby={errors.imageUrl ? "category-image-error" : undefined}
              className={inputClass}
            />
          </div>
        </Field>

        <Field label="Дараалал" htmlFor="category-sort" error={errors.sortOrder} hint="Бага тоотой нь эхэнд харагдана.">
          <input
            id="category-sort"
            name="sortOrder"
            inputMode="numeric"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.currentTarget.value.replace(/[^\d]/g, ""))}
            aria-invalid={Boolean(errors.sortOrder)}
            aria-describedby={errors.sortOrder ? "category-sort-error" : undefined}
            className={cn(inputClass, "w-28 tabular-nums")}
          />
        </Field>

        <div className="flex items-center justify-end gap-2 border-t border-line pt-4">
          {category ? (
            <Button variant="ghost" onClick={onCancel} disabled={pending}>
              Болих
            </Button>
          ) : null}
          <Button type="submit" disabled={pending}>
            {pending ? <LoaderCircle className="animate-spin" aria-hidden /> : null}
            {pending ? "Хадгалж байна…" : category ? "Өөрчлөлт хадгалах" : "Ангилал үүсгэх"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
