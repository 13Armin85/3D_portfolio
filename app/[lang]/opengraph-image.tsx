import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getContent, isLocale, translator } from "@/lib/i18n";

export const alt = "Armin Nataj | آرمین نتاج — Full Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "en";
  const { profile } = getContent(locale);
  const t = translator(locale);
  const [photo, logo, persianFont, englishFont] = await Promise.all([
    readFile(join(process.cwd(), "public", profile.photo)),
    readFile(join(process.cwd(), "public", profile.logo)),
    readFile(
      join(process.cwd(), "public", "fonts", "vazirmatn-arabic-400.woff"),
    ),
    readFile(
      join(
        process.cwd(),
        "node_modules",
        "@fontsource",
        "geist",
        "files",
        "geist-latin-400-normal.woff",
      ),
    ),
  ]);
  const rtl = locale === "fa";
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "65px 80px",
        background: "#f2f6f7",
        color: "#243c47",
        fontFamily: rtl ? "Vazirmatn, Geist" : "Geist",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: rtl ? "row-reverse" : "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/svg+xml;base64,${logo.toString("base64")}`}
          alt=""
          width={70}
          height={70}
        />
        <div
          style={{
            display: "flex",
            flexDirection: rtl ? "row-reverse" : "row",
            gap: 12,
            fontSize: 25,
          }}
        >
          {rtl ? (
            ["آرمین", "نتاج", "/", "توسعه‌دهنده", "فول‌استک"].map(
              (word, index) => <span key={index}>{word}</span>,
            )
          ) : (
            <span>
              {profile.name} / {profile.role}
            </span>
          )}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: rtl ? "flex-end" : "flex-start",
          marginTop: 55,
          fontSize: rtl ? 78 : 86,
          lineHeight: 1.4,
        }}
      >
        {(rtl
          ? [
              ["یک", "فضای", "کوچک", "."],
              ["پر", "از", "ایده", "."],
            ]
          : [[t("A little space.")], ["A lot of ideas."]]
        ).map((words, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: rtl ? "row-reverse" : "row",
              gap: rtl ? 16 : 0,
              color: index === 1 ? "#a35e19" : "#243c47",
            }}
          >
            {words.map((word) => (
              <span key={word}>{word}</span>
            ))}
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: rtl ? "flex-end" : "flex-start",
          fontSize: 23,
          marginTop: 32,
          color: "#536b77",
          gap: 18,
        }}
      >
        <span style={{ fontFamily: "Geist" }}>React · Next.js · .NET</span>
        <div
          style={{
            display: "flex",
            flexDirection: rtl ? "row-reverse" : "row",
            gap: 6,
          }}
        >
          {rtl ? (
            ["تهران،", "ایران"].map((word) => <span key={word}>{word}</span>)
          ) : (
            <span>· {profile.location}</span>
          )}
        </div>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`data:image/png;base64,${photo.toString("base64")}`}
        alt={profile.name}
        width={210}
        height={264}
        style={{
          position: "absolute",
          ...(rtl ? { left: 80 } : { right: 80 }),
          top: 220,
          borderRadius: 24,
          objectFit: "cover",
        }}
      />
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Vazirmatn",
          data: persianFont,
          weight: 400,
          style: "normal",
        },
        {
          name: "Geist",
          data: englishFont,
          weight: 400,
          style: "normal",
        },
      ],
    },
  );
}
