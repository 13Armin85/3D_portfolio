"use client";

import { useI18n } from "../locale-provider";
import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

import { useRoomStore } from "@/store/room-store";
import { SectionContent } from "./section-content";
import { SectionIcon } from "./section-icon";
import { LanguageSwitcher } from "./language-switcher";

const titles = {
  about: "A little about me.",
  projects: "Built with intention.",
  skills: "My everyday toolkit.",
  journey: "The journey so far.",
  resume: "My story, on paper.",
  contact: "Let’s build something.",
};

export function SectionPanel() {
  const { t, content } = useI18n();
  const { sections } = content;
  const section = useRoomStore((s) => s.section);
  const close = useRoomStore((s) => s.close);
  const open = useRoomStore((s) => s.open);
  const dialog = useRef<HTMLDialogElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const index = sections.findIndex((item) => item.id === section);

  useEffect(() => {
    if (section && dialog.current) {
      const trigger = document.activeElement;
      if (trigger instanceof HTMLElement && !dialog.current.contains(trigger)) {
        returnFocus.current = trigger;
      }
      if (!dialog.current.open) dialog.current.show();
    } else if (!section && dialog.current?.open) {
      dialog.current.close();
      returnFocus.current?.focus();
    }
    scroller.current?.scrollTo({ top: 0 });
  }, [section]);

  useEffect(() => {
    if (!section) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || document.querySelector("dialog:modal"))
        return;
      event.preventDefault();
      close();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [close, section]);

  return (
    <dialog
      ref={dialog}
      className="section-panel"
      aria-modal="false"
      aria-labelledby="panel-title"
      aria-describedby="panel-description"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
      onClose={close}
    >
      {section && (
        <>
          <div className="panel-topbar">
            <button onClick={close} className="back-button">
              <ArrowLeft size={15} /> {t("Back to the room")}{" "}
            </button>
            <button
              onClick={close}
              className="close-button"
              aria-label={t("Close section")}
            >
              <X size={19} />
              <kbd>esc</kbd>
            </button>
            <LanguageSwitcher />
          </div>
          <div
            className="panel-scroll"
            ref={scroller}
            tabIndex={0}
            role="region"
            aria-label={`${sections[index].label} ${t("content")}`}
          >
            <div className="panel-heading">
              <span className="panel-section-label">
                <SectionIcon section={section} size={15} />{" "}
                {sections[index].label} <span>0{index + 1}</span>
              </span>
              <h2 id="panel-title" aria-live="polite">
                {t(titles[section])}
              </h2>
              <p id="panel-description" className="sr-only">
                {sections[index].description}
              </p>
            </div>
            <SectionContent key={section} section={section} />
          </div>
          <div className="panel-footer">
            <span>{t("Make yourself at home.")}</span>
            <button
              onClick={() => open(sections[(index + 1) % sections.length].id)}
            >
              {t("Next:")} {sections[(index + 1) % sections.length].label}
              <ArrowRight size={15} />
            </button>
          </div>
        </>
      )}
    </dialog>
  );
}
