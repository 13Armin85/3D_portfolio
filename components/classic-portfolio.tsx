"use client";

import { useI18n } from "./locale-provider";
import { ArrowDownToLine, ArrowUpRight, Mail } from "lucide-react";
import { Github, Linkedin } from "./ui/brand-icons";
import { SectionContent } from "./ui/section-content";
import { ProfilePhoto } from "./ui/profile-identity";

export function ClassicPortfolio() {
  const { t, content } = useI18n();
  const { profile, sections } = content;
  return (
    <div className="classic-portfolio" id="classic-portfolio">
      <div className="classic-intro">
        <ProfilePhoto className="classic-photo" />
        <span className="eyebrow">{t("THE PERSON BEHIND THE SCREEN")}</span>
        <h1>
          {t("Hi, I’m")} {profile.shortName}
          <span>.</span>
          <br />
          {t("I turn ideas into experiences.")}{" "}
        </h1>
        <p>{profile.intro}</p>
        <div className="classic-intro-links">
          <a className="primary-button" href="#classic-projects">
            {t("Explore my work")} <ArrowUpRight size={17} />
          </a>
          <a className="secondary-button" href={profile.resume} download>
            <ArrowDownToLine size={16} /> {t("Résumé")}{" "}
          </a>
        </div>
      </div>
      <nav className="classic-nav" aria-label={t("Portfolio sections")}>
        {sections.map((item) => (
          <a href={`#classic-${item.id}`} key={item.id}>
            {item.label}
          </a>
        ))}
      </nav>
      {sections.map((section, index) => (
        <section
          className={`classic-section classic-section-${section.id}`}
          id={`classic-${section.id}`}
          key={section.id}
        >
          <div className="classic-section-heading">
            <span className="eyebrow">
              0{index + 1} / {section.object}
            </span>
            <h2>
              {section.label}
              <span>.</span>
            </h2>
            <p>{section.description}</p>
          </div>
          <div className="classic-section-body">
            <SectionContent section={section.id} />
          </div>
        </section>
      ))}
      <div className="classic-ending">
        <h2>
          {t("Good things start")} <br />
          {t("with a conversation")}
          <span>.</span>
        </h2>
        <a href={`mailto:${profile.email}`}>
          {t("Let’s talk")} <ArrowUpRight size={28} />
        </a>
        <div className="text-links">
          <a href={profile.github} target="_blank" rel="noopener noreferrer">
            <Github size={17} /> {t("GitHub")}{" "}
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
            <Linkedin size={17} /> {t("LinkedIn")}{" "}
          </a>
          <a href={`mailto:${profile.email}`}>
            <Mail size={17} /> {t("Email")}{" "}
          </a>
        </div>
      </div>
    </div>
  );
}
