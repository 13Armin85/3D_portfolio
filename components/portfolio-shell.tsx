"use client";

import { useI18n } from "./locale-provider";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Box,
  HelpCircle,
  House,
  LayoutList,
  Mail,
  MapPin,
  Moon,
  MousePointer2,
  MoveUpRight,
  RotateCcw,
  Sun,
  X,
} from "lucide-react";
import { Github, Linkedin } from "./ui/brand-icons";
import { BrandLogo, ProfilePhoto } from "./ui/profile-identity";
import { useRoomStore } from "@/store/room-store";
import { SectionIcon } from "./ui/section-icon";
import { SectionPanel } from "./ui/section-panel";
import { LanguageSwitcher } from "./ui/language-switcher";

function RoomPlaceholder() {
  const { t } = useI18n();
  return (
    <div className="room-loading" role="status">
      <span className="loading-symbol">
        <BrandLogo />
      </span>
      <p>{t("Opening the door…")}</p>
      <div className="loading-track loading-indeterminate">
        <span />
      </div>
    </div>
  );
}

const RoomCanvas = dynamic(() => import("./room/room-canvas"), {
  ssr: false,
  loading: RoomPlaceholder,
});

function LocalTime() {
  const { locale, content } = useI18n();
  const { profile } = content;
  const [time, setTime] = useState(
    `${profile.timezoneLabel} · ${profile.utcOffset}`,
  );
  useEffect(() => {
    const update = () =>
      setTime(
        `${new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-GB", { timeZone: profile.timezone, hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date())} ${profile.timezoneLabel}`,
      );
    update();
    const timer = window.setInterval(update, 60000);
    return () => window.clearInterval(timer);
  }, [locale, profile.timezone, profile.timezoneLabel]);
  return (
    <span className="local-time" dir="ltr">
      {time}
    </span>
  );
}

function HelpDialog({
  dialogRef,
}: {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
}) {
  const { t, content } = useI18n();
  const { sections } = content;
  return (
    <dialog
      className="help-dialog"
      ref={dialogRef}
      aria-labelledby="help-title"
    >
      <div className="help-top">
        <span className="eyebrow">{t("MAKE YOURSELF AT HOME")}</span>
        <button
          className="icon-link"
          onClick={() => dialogRef.current?.close()}
          aria-label={t("Close room guide")}
        >
          <X size={20} />
        </button>
      </div>
      <h2 id="help-title">{t("A room worth exploring.")}</h2>
      <p>
        {t(
          "Every object is a little piece of my story. Select one to take a closer look.",
        )}{" "}
      </p>
      <div className="help-grid">
        {sections.map((section, i) => (
          <div key={section.id}>
            <SectionIcon section={section.id} size={20} />
            <span>
              <strong>{section.object}</strong>
              <span>{section.label}</span>
            </span>
            <kbd>{i + 1}</kbd>
          </div>
        ))}
      </div>
      <div className="help-controls">
        <p>
          <MousePointer2 size={15} />{" "}
          {t("Drag to look around · Tap or click to explore")}{" "}
        </p>
        <p>
          <kbd>esc</kbd> {t("Return to the room")} <kbd>0</kbd>{" "}
          {t("Reset the view")}{" "}
        </p>
      </div>
      <button
        className="primary-button full-width"
        onClick={() => dialogRef.current?.close()}
      >
        {t("Let’s explore")} <ArrowRight size={16} />
      </button>
    </dialog>
  );
}

export function PortfolioShell({ children }: { children: ReactNode }) {
  const { t, content } = useI18n();
  const { profile, projects, sections } = content;
  const section = useRoomStore((s) => s.section);
  const mode = useRoomStore((s) => s.mode);
  const theme = useRoomStore((s) => s.theme);
  const open = useRoomStore((s) => s.open);
  const reset = useRoomStore((s) => s.reset);
  const setMode = useRoomStore((s) => s.setMode);
  const toggleTheme = useRoomStore((s) => s.toggleTheme);
  const setReducedMotion = useRoomStore((s) => s.setReducedMotion);
  const helpDialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [setReducedMotion]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        (event.target instanceof HTMLElement &&
          (event.target.isContentEditable ||
            ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName))) ||
        document.querySelector("dialog:modal")
      )
        return;
      if (event.key === "0" || event.key === "Escape") reset();
      const index = Number(event.key) - 1;
      if (index >= 0 && index < sections.length) open(sections[index].id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, reset, sections]);

  function goHome() {
    reset();
    setMode("room");
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  function switchView() {
    setMode(mode === "room" ? "list" : "room");
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  return (
    <div
      className={`portfolio-app ${section ? "is-inspecting" : ""} view-${mode}`}
      data-theme={theme}
    >
      <a
        className="skip-link"
        href={mode === "room" ? "#room-navigation" : "#classic-portfolio"}
      >
        {t("Skip to portfolio navigation")}{" "}
      </a>
      <header className="site-header">
        <a
          className="brand"
          href="#"
          onClick={(event) => {
            event.preventDefault();
            goHome();
          }}
          aria-label={`${profile.name} — ${t("home")}`}
        >
          <span className="brand-mark">
            <BrandLogo />
          </span>
          <span className="brand-description">
            {profile.name.toUpperCase()}
            <span>{profile.role}</span>
          </span>
        </a>
        <nav className="header-nav" aria-label={t("Main navigation")}>
          <button onClick={() => open("about")}>{t("About me")}</button>
          <button onClick={() => open("projects")}>
            {t("Selected work")}{" "}
            <span>{String(projects.length).padStart(2, "0")}</span>
          </button>
          <button onClick={() => open("contact")}>
            {t("Let’s talk")} <ArrowUpRight size={14} />
          </button>
        </nav>
        <LanguageSwitcher />
        <a
          className="header-resume"
          href={profile.resume}
          download
          aria-label={t("Download Armin’s résumé")}
        >
          <ArrowDownToLine size={15} />
          <span>{t("Résumé")}</span>
        </a>
      </header>
      <main id="main-content">
        <div className="room-layout" hidden={mode !== "room"}>
          <div className="hero-copy" inert={Boolean(section)}>
            <div className="hello-line">
              <ProfilePhoto className="hero-photo" eager />
              <span>
                {t("HELLO, WORLD. I’M")} {profile.shortName.toUpperCase()}.
              </span>
            </div>
            <h1>
              {t("A little space.")} <br />
              {t("A lot of")}{" "}
              <span className="ideas-word">
                {t("ideas")}
                <svg viewBox="0 0 180 12" aria-hidden="true">
                  <path d="M3 8C47 1 126 1 176 6" />
                </svg>
              </span>
              <span className="accent-period">.</span>
            </h1>
            <p className="hero-role">
              {profile.role}.
              <br /> {t("Curious by nature.")}{" "}
            </p>
            <p className="hero-description">{profile.intro}</p>
            <button
              className="primary-button explore-button"
              onClick={() => open("projects")}
            >
              {t("Explore my work")} <ArrowUpRight size={18} />
            </button>
            <div className="hero-socials">
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("GitHub profile")}
              >
                <Github size={18} />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("LinkedIn profile")}
              >
                <Linkedin size={18} />
              </a>
              <a
                href={`mailto:${profile.email}`}
                aria-label={`${t("Email")} ${profile.shortName}`}
              >
                <Mail size={18} />
              </a>
              <span className="social-divider" />
              <span>{t("LET’S CONNECT")}</span>
            </div>
          </div>
          <div className="room-stage">
            <div className="room-stage-top">
              <span>
                <span className="status-dot" />{" "}
                {t("A SMALL CORNER OF MY WORLD")}{" "}
              </span>
              <span className="room-number">{t("ROOM 01 / 01")}</span>
            </div>
            {mode === "room" && <RoomCanvas />}
            <div className="room-annotation">
              <span className="annotation-arrow" aria-hidden="true">
                ⤴
              </span>
              <span>{t("Go on, click something.")}</span>
            </div>
          </div>
          <div className="scene-controls">
            <button
              className="scene-control"
              onClick={toggleTheme}
              aria-label={
                theme === "day"
                  ? t("Switch to evening lighting")
                  : t("Switch to daylight")
              }
              title={theme === "day" ? t("Evening lighting") : t("Daylight")}
            >
              {theme === "day" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <span />
            <button
              className="scene-control"
              onClick={reset}
              aria-label={t("Reset room view")}
              title={t("Reset view (0)")}
            >
              <RotateCcw size={17} />
            </button>
            <span />
            <button
              className="scene-control"
              onClick={() => helpDialog.current?.showModal()}
              aria-label={t("How to explore the room")}
              title={t("Room guide")}
            >
              <HelpCircle size={18} />
            </button>
          </div>
          <div className="room-bottom-note">
            <MousePointer2 size={14} />
            <span>
              {t("Drag to look around")}
              <span className="hint-divider">·</span>
              {t("Click an object to discover")}{" "}
            </span>
          </div>
        </div>
        <div
          className="classic-view"
          style={{ display: mode === "list" ? "block" : "none" }}
        >
          {children}
        </div>
      </main>
      <div className="room-navigation-wrap" hidden={mode !== "room"}>
        <div className="navigation-intro">
          <span className="eyebrow">{t("A WORKSPACE, A STORY.")}</span>
          <span>
            {t("Pick a place to start")} <MoveUpRight size={14} />
          </span>
        </div>
        <nav
          className="room-navigation"
          id="room-navigation"
          aria-label={t("Explore the room")}
        >
          <button
            className={`nav-object nav-home ${!section ? "active" : ""}`}
            onClick={reset}
            aria-label={t("Room overview")}
            aria-current={!section ? "page" : undefined}
          >
            <House size={19} />
            <span>{t("Room")}</span>
          </button>
          <span className="nav-separator" />
          {sections.map((item, i) => (
            <button
              key={item.id}
              className={`nav-object ${section === item.id ? "active" : ""}`}
              onClick={() => open(item.id)}
              aria-label={`${t("Open")} ${item.label}`}
              aria-keyshortcuts={String(i + 1)}
              aria-current={section === item.id ? "page" : undefined}
            >
              <SectionIcon section={item.id} size={19} />
              <span>{item.label}</span>
              <span className="nav-key">{i + 1}</span>
            </button>
          ))}
        </nav>
        <div className="navigation-end">
          <span className="tiny-orbit" aria-hidden="true">
            <span />
          </span>
          <span>{t("MADE TO BE EXPLORED")}</span>
        </div>
      </div>
      <footer className="site-footer">
        <div className="footer-location">
          <MapPin size={13} />
          <span>{profile.location}</span>
          <span className="footer-dot">·</span>
          <LocalTime />
        </div>
        <span className="footer-signoff">
          {t("Built with intention. A little coffee, too.")}{" "}
        </span>
        <button className="view-toggle" onClick={switchView}>
          {mode === "room" ? <LayoutList size={14} /> : <Box size={15} />}
          <span>
            {mode === "room"
              ? t("Prefer a classic view?")
              : t("Back to the 3D room")}
          </span>
          <ArrowUpRight size={13} />
        </button>
      </footer>
      <SectionPanel />
      <HelpDialog dialogRef={helpDialog} />
      <noscript>
        <style>{`.room-layout,.room-navigation-wrap,.header-nav,.view-toggle,.contact-form{display:none!important}.classic-view{display:block!important}.portfolio-app{min-height:100vh}.site-footer{position:static}`}</style>
        <p className="noscript-note">
          {t(
            "You’re viewing the accessible HTML portfolio. Enable JavaScript to explore the 3D room.",
          )}{" "}
        </p>
      </noscript>
    </div>
  );
}
