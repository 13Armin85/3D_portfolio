"use client";

import { Languages } from "lucide-react";
import { useI18n } from "../locale-provider";

export function LanguageSwitcher() {
  const { locale } = useI18n();
  const target = locale === "en" ? "fa" : "en";
  return (
    <a
      className="language-switcher"
      href={`/${target}`}
      hrefLang={target}
      lang={target}
      aria-label={
        target === "fa" ? "Switch to Persian" : "تغییر زبان به انگلیسی"
      }
      onClick={() => {
        document.cookie = `portfolio-locale=${target}; Path=/; Max-Age=31536000; SameSite=Lax`;
      }}
    >
      <Languages size={16} />
      <span>{target === "fa" ? "فارسی" : "English"}</span>
    </a>
  );
}
