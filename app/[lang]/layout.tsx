import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { getContent, isLocale, translator } from "@/lib/i18n";
import { LocaleProvider } from "@/components/locale-provider";
import "@fontsource/geist/latin-400.css";
import "@fontsource/geist/latin-500.css";
import "@fontsource/geist/latin-600.css";
import "@fontsource/geist/latin-700.css";
import "@fontsource/geist-mono/latin-400.css";
import "@fontsource/vazirmatn/arabic-400.css";
import "@fontsource/vazirmatn/arabic-500.css";
import "@fontsource/vazirmatn/arabic-600.css";
import "@fontsource/vazirmatn/arabic-700.css";
import "../globals.css";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "fa" }];
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { profile } = getContent(lang);
  const t = translator(lang);
  const title = `${profile.name} — ${profile.role}`;
  const description = t(
    "Explore Armin Nataj’s interactive developer workspace: React, Next.js, TypeScript, Node.js, Django, .NET, and WordPress projects, skills, and experience.",
  );
  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ||
        (process.env.VERCEL_PROJECT_PRODUCTION_URL
          ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
          : "http://localhost:3000"),
    ),
    title,
    description,
    applicationName: title,
    authors: [{ name: profile.name, url: profile.website }],
    keywords: [
      profile.name,
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "Django",
      ".NET",
      "WordPress",
      profile.location,
      "3D portfolio",
    ],
    alternates: {
      canonical: `/${lang}`,
      languages: { en: "/en", fa: "/fa", "x-default": "/en" },
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: lang === "fa" ? "fa_IR" : "en_US",
      alternateLocale: lang === "fa" ? "en_US" : "fa_IR",
      url: `/${lang}`,
    },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: true, follow: true },
    icons: { icon: profile.logo, apple: profile.logo },
  };
}
export const viewport: Viewport = {
  themeColor: "#f2f6f7",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <html lang={lang} dir={lang === "fa" ? "rtl" : "ltr"}>
      <body>
        <LocaleProvider locale={lang}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
