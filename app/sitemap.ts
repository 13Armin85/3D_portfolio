import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000");
  return ["en", "fa"].map((locale) => ({
    url: new URL(`/${locale}`, origin).href,
    alternates: {
      languages: {
        en: new URL("/en", origin).href,
        fa: new URL("/fa", origin).href,
      },
    },
  }));
}
