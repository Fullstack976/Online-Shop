import { slugify } from "@shop/db/utils";

/**
 * Mongolian Cyrillic → Latin, so Mongolian names still produce a URL slug.
 * (`slugify` from `@shop/db/utils` keeps only a–z and 0–9 and would drop Cyrillic.)
 */
const MN_TO_LATIN: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "yo",
  ж: "j",
  з: "z",
  и: "i",
  й: "i",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  ө: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ү: "u",
  ф: "f",
  х: "kh",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sh",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
};

/** Client-safe slug generator: transliterates Mongolian, then slugifies. */
export function makeSlug(input: string): string {
  const latin = input
    .toLowerCase()
    .split("")
    .map((ch) => MN_TO_LATIN[ch] ?? ch)
    .join("");
  return slugify(latin);
}
