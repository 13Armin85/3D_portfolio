"use client";

import { useI18n } from "../locale-provider";
import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

const PdfViewer = dynamic(() => import("./pdf-viewer"), { ssr: false });

import {
  ArrowDownToLine,
  ArrowUpRight,
  Check,
  Copy,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Languages,
} from "lucide-react";
import { Github, Linkedin } from "./brand-icons";
import type { Project, SectionId } from "@/lib/types";
import { ProjectArt } from "./project-art";
import { ContactForm } from "./contact-form";
import { ProfilePhoto } from "./profile-identity";

export function ProjectCard({ project }: { project: Project }) {
  const { t } = useI18n();
  return (
    <article className="project-card">
      {project.image ? (
        <div className="project-screenshot">
          <Image
            src={project.image}
            alt={`${t("Project banner")}: ${project.title}`}
            fill
            sizes="(max-width: 700px) 90vw, 450px"
          />
        </div>
      ) : (
        <ProjectArt project={project} />
      )}
      <div className="project-card-body">
        <span className="eyebrow">{project.category}</span>
        <div className="project-title-row">
          <h3>{project.title}</h3>
          {project.sourceUrl && (
            <a
              className="icon-link"
              href={project.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${t("View source")}: ${project.title}`}
            >
              <ArrowUpRight size={20} />
            </a>
          )}
        </div>
        <p>{project.description}</p>
        <div className="tag-list">
          {project.technologies.slice(0, 4).map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
        <details className="project-details">
          <summary>
            {t("Under the hood")} <PlusMark />
          </summary>
          <ul>
            {project.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
          <div className="tag-list">
            {project.technologies.slice(4).map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>
          <div className="project-links">
            {project.sourceUrl && (
              <a
                href={project.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={15} /> {t("View source")}{" "}
                <ArrowUpRight size={14} />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("Visit project")} <ArrowUpRight size={14} />
              </a>
            )}
          </div>
        </details>
      </div>
    </article>
  );
}

function PlusMark() {
  return (
    <span className="plus-mark" aria-hidden="true">
      +
    </span>
  );
}

function AboutContent() {
  const { t, content } = useI18n();
  const { profile } = content;
  return (
    <div className="about-content">
      <div className="about-card">
        <ProfilePhoto />
        <div>
          <span className="eyebrow">{t("A human behind the code")}</span>
          <h3>{profile.name}</h3>
          <span className="location">
            <MapPin size={13} /> {profile.location}
          </span>
        </div>
        <span className="about-card-decoration" aria-hidden="true">
          ↗
        </span>
      </div>
      <p className="lead-copy">{profile.bio}</p>
      <p>{profile.approach}</p>
      <div className="now-card">
        <span className="eyebrow">
          <span className="status-dot" /> {t("CURRENTLY BUILDING")}{" "}
        </span>
        <p>{profile.current}</p>
      </div>
      <div className="about-facts">
        {profile.facts.map((fact) => (
          <div key={fact.value}>
            <strong>{fact.value}</strong>
            <span>{fact.label}</span>
          </div>
        ))}
      </div>
      <div className="text-links">
        <a href={profile.github} target="_blank" rel="noopener noreferrer">
          <Github size={16} /> {t("GitHub")} <ArrowUpRight size={14} />
        </a>
        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
          <Linkedin size={16} /> {t("LinkedIn")} <ArrowUpRight size={14} />
        </a>
      </div>
    </div>
  );
}

function SkillsContent() {
  const { t, content } = useI18n();
  const { skillGroups } = content;
  return (
    <div className="skills-content">
      <p className="lead-copy">
        {t(
          "A practical toolkit for building responsive interfaces, backend services, and connected web applications.",
        )}{" "}
      </p>
      {skillGroups.map((group, i) => (
        <div className="skill-group" key={group.title}>
          <div className="skill-group-title">
            <span>0{i + 1}</span>
            <div>
              <h3>{group.title}</h3>
              <p>{group.note}</p>
            </div>
          </div>
          <div className="skill-tags">
            {group.skills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function JourneyContent() {
  const { t, content } = useI18n();
  const { experience, education, languages, softSkills } = content;
  return (
    <div className="journey-content">
      <p className="lead-copy">
        {t("Learning by doing. Growing with every project.")}{" "}
      </p>
      <span className="eyebrow section-divider">{t("EXPERIENCE")}</span>
      {experience.map((job) => (
        <article className="timeline-item" key={`${job.company}-${job.role}`}>
          <span className="timeline-dot" />
          <span className="timeline-period">{job.period}</span>
          <h3>{job.role}</h3>
          <span className="timeline-company">{job.company}</span>
          <span className="location">
            <MapPin size={12} /> {job.location}
          </span>
          <ul>
            {job.details.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </article>
      ))}
      <span className="eyebrow section-divider">{t("EDUCATION")}</span>
      {education.map((item) => (
        <article className="education-item" key={item.institution}>
          <GraduationCap size={22} strokeWidth={1.4} />
          <div>
            <span className="timeline-period">{item.period}</span>
            <h3>{item.degree}</h3>
            <p>{item.institution}</p>
            <span>{item.detail}</span>
          </div>
        </article>
      ))}
      <div className="achievements">
        <h3>
          <Languages size={18} /> {t("Languages")}{" "}
        </h3>
        <ul>
          {languages.map((item) => (
            <li key={item.name}>
              {item.name} — {item.level}
            </li>
          ))}
        </ul>
        <h3>{t("How I work")}</h3>
        <ul>
          {softSkills.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ResumeContent() {
  const { t, content } = useI18n();
  const { profile } = content;
  return (
    <div className="resume-content">
      <p className="lead-copy">
        {t("My experience, skills, and selected work, on one page.")}{" "}
      </p>
      <div className="resume-preview">
        <PdfViewer file={profile.resume} />
        <span className="resume-file-label" dir="ltr">
          {profile.resumeFilename} <span>PDF</span>
        </span>
      </div>
      <a className="primary-button full-width" href={profile.resume} download>
        <ArrowDownToLine size={17} /> {t("Download résumé")}{" "}
      </a>
      <a
        className="secondary-button full-width"
        href={profile.resume}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t("Open in a new tab")} <ArrowUpRight size={16} />
      </a>
      <p className="small-note">
        {t("The original résumé, ready to keep or share.")}
      </p>
    </div>
  );
}

function ContactContent() {
  const { t, content } = useI18n();
  const { profile } = content;
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  }

  return (
    <div className="contact-content">
      <p className="lead-copy">
        {t(
          "Have an idea, an opportunity, or just a good question? I’d love to hear from you.",
        )}{" "}
      </p>
      <div className="contact-email">
        <Mail size={21} strokeWidth={1.5} />
        <div>
          <span className="eyebrow">{t("DROP ME A LINE")}</span>
          <a href={`mailto:${profile.email}`} dir="ltr">
            {profile.email}
          </a>
        </div>
        <button
          className="icon-link"
          onClick={copyEmail}
          aria-label={copied ? t("Email copied") : t("Copy email address")}
        >
          {copied ? <Check size={17} /> : <Copy size={17} />}
        </button>
      </div>
      <span className="sr-only" role="status">
        {copied
          ? t("Email address copied to clipboard.")
          : copyError
            ? `${t("Please copy this email address:")} ${profile.email}`
            : ""}
      </span>
      {copyError && (
        <p className="small-note">
          {t("Please select and copy the email address above.")}{" "}
        </p>
      )}
      <ContactForm />
      <div className="contact-socials">
        <a href={profile.github} target="_blank" rel="noopener noreferrer">
          <Github size={18} />
          <span>{t("GitHub")}</span>
          <ArrowUpRight size={15} />
        </a>
        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
          <Linkedin size={18} />
          <span>{t("LinkedIn")}</span>
          <ArrowUpRight size={15} />
        </a>
        <a href={`tel:${profile.phone}`}>
          <Phone size={18} />
          <span>{t("Call me")}</span>
          <ArrowUpRight size={15} />
        </a>
      </div>
      <span className="location">
        <MapPin size={13} /> {t("Based in")} {profile.location} ·{" "}
        {profile.utcOffset}
      </span>
    </div>
  );
}

export function SectionContent({ section }: { section: SectionId }) {
  const { t, content } = useI18n();
  const { projects, wordpressProjects } = content;
  switch (section) {
    case "about":
      return <AboutContent />;
    case "projects":
      return (
        <div className="projects-content">
          <p className="lead-copy">
            {t(
              "A few things I’ve brought to life. Built with purpose, from the first idea to the final detail.",
            )}{" "}
          </p>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          <div className="wordpress-work">
            <span className="eyebrow">{t("SELECTED WORDPRESS PROJECTS")}</span>
            <h3>{t("Websites for real businesses.")}</h3>
            <p>
              {t(
                "Custom themes, plugins, and ongoing improvements to SEO, speed, and reliability.",
              )}{" "}
            </p>
            <div className="wordpress-links">
              {wordpressProjects.map((domain) => (
                <a
                  key={domain}
                  href={`https://${domain}`}
                  dir="ltr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {domain}
                  <ArrowUpRight size={14} />
                </a>
              ))}
            </div>
          </div>
        </div>
      );
    case "skills":
      return <SkillsContent />;
    case "journey":
      return <JourneyContent />;
    case "resume":
      return <ResumeContent />;
    case "contact":
      return <ContactContent />;
  }
}
