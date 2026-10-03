import { notFound } from "next/navigation";
import { ClassicPortfolio } from "@/components/classic-portfolio";
import { PortfolioShell } from "@/components/portfolio-shell";
import { getContent, isLocale } from "@/lib/i18n";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { profile, education, skillGroups } = getContent(lang);
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    description: profile.bio,
    url: profile.website,
    sameAs: [profile.github, profile.linkedin],
    email: profile.email,
    image: profile.photo,
    telephone: profile.phone,
    homeLocation: { "@type": "Place", name: profile.location },
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: education[0].institution,
    },
    knowsAbout: skillGroups.flatMap((group) => group.skills),
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(person).replace(/</g, "\\u003c"),
        }}
      />
      <PortfolioShell>
        <ClassicPortfolio />
      </PortfolioShell>
    </>
  );
}
