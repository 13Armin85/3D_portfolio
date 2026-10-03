"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { getContent, translator, type Locale } from "@/lib/i18n";

const LocaleContext = createContext<Locale>("en");
export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return <LocaleContext value={locale}>{children}</LocaleContext>;
}
export function useI18n() {
  const locale = useContext(LocaleContext);
  return useMemo(
    () => ({ locale, t: translator(locale), content: getContent(locale) }),
    [locale],
  );
}
