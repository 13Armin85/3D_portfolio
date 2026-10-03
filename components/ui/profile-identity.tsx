"use client";
import Image from "next/image";
import { useI18n } from "../locale-provider";

export function BrandLogo() {
  const {
    locale,
    content: { profile },
  } = useI18n();
  return (
    <Image
      src={profile.logo}
      alt={locale === "fa" ? `لوگوی ${profile.name}` : `${profile.name} logo`}
      width={56}
      height={56}
      className="brand-logo"
      unoptimized
    />
  );
}

export function ProfilePhoto({
  className = "",
  eager = false,
}: {
  className?: string;
  eager?: boolean;
}) {
  const {
    content: { profile },
  } = useI18n();
  return (
    <Image
      src={profile.photo}
      alt={profile.name}
      width={1122}
      height={1402}
      sizes="96px"
      loading={eager ? "eager" : "lazy"}
      className={`profile-photo ${className}`}
    />
  );
}
