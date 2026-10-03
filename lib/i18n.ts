import * as portfolio from "@/content/portfolio";
import { fa } from "@/content/translations";
import { sections } from "@/lib/room-config";

export type Locale = "en" | "fa";
export function isLocale(value: string): value is Locale {
  return value === "en" || value === "fa";
}
export function translator(locale: Locale) {
  return (text: string) => (locale === "fa" ? (fa[text] ?? text) : text);
}

// Translate display copy while keeping asset paths, URLs, IDs and technical names intact.
function localize<T>(value: T, t: (text: string) => string): T {
  if (typeof value === "string") return t(value) as T;
  if (Array.isArray(value)) return value.map((item) => localize(item, t)) as T;
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, localize(item, t)]),
    ) as T;
  return value;
}
export function getContent(locale: Locale) {
  return localize({ ...portfolio, sections }, translator(locale));
}
