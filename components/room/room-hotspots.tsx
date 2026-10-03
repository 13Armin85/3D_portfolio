"use client";

import { useI18n } from "../locale-provider";
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Vector3 } from "three";
import { Github, Linkedin } from "../ui/brand-icons";
import { useRoomStore } from "@/store/room-store";
import type { SectionId, Vec3 } from "@/lib/types";

const labels: { section: SectionId; label: string }[] = [
  { section: "about", label: "About me" },
  { section: "projects", label: "My projects" },
  { section: "skills", label: "My toolkit" },
  { section: "journey", label: "My journey" },
  { section: "resume", label: "Résumé" },
  { section: "contact", label: "Say hello" },
];

// The markers live in the normal React DOM. Only their screen coordinates come
// from WebGL, avoiding additional React roots and keeping keyboard access native.
export function HotspotAnchor({
  id,
  position,
}: {
  id: string;
  position: Vec3;
}) {
  const anchor = useRef<Group>(null);
  const element = useRef<HTMLElement | null>(null);
  const point = useRef(new Vector3());
  useEffect(() => {
    element.current = document.getElementById(`hotspot-${id}`);
  }, [id]);
  useFrame(({ camera, size }) => {
    if (!anchor.current || !element.current) return;
    anchor.current.getWorldPosition(point.current);
    point.current.project(camera);
    element.current.style.transform = `translate3d(${(point.current.x * 0.5 + 0.5) * size.width}px, ${(-point.current.y * 0.5 + 0.5) * size.height}px, 0)`;
    element.current.style.visibility =
      point.current.z < 1 && point.current.z > -1 ? "visible" : "hidden";
  });
  return <group ref={anchor} position={position} />;
}

export function RoomHotspots() {
  const { t, content } = useI18n();
  const { profile } = content;
  const hovered = useRoomStore((s) => s.hovered);
  const selected = useRoomStore((s) => s.section);
  const hover = useRoomStore((s) => s.hover);
  const open = useRoomStore((s) => s.open);
  return (
    <div
      className="room-hotspots"
      role="group"
      aria-label={t("Interactive room objects")}
    >
      <div id="hotspot-coffee" className="hotspot-position" aria-hidden="true">
        <span className="coffee-steam">
          <i />
          <i />
          <i />
        </span>
      </div>
      {labels.map(({ section, label }) => (
        <div
          id={`hotspot-${section}`}
          className="hotspot-position"
          key={section}
        >
          <button
            className={`room-marker marker-${section} ${hovered === section ? "is-hovered" : ""} ${selected === section ? "is-selected" : ""}`}
            aria-pressed={selected === section}
            onClick={() => open(section)}
            onPointerEnter={() => hover(section)}
            onPointerLeave={() => hover(null)}
            aria-label={`${t("Explore")} ${t(label)}`}
          >
            <span className="marker-dot" />
            <span className="marker-label">
              {t(label)}
              <span>↗</span>
            </span>
          </button>
        </div>
      ))}
      <div id="hotspot-github" className="hotspot-position">
        <a
          className="social-object"
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${t("GitHub profile")} — ${profile.shortName}`}
        >
          <Github size={15} />
        </a>
      </div>
      <div id="hotspot-linkedin" className="hotspot-position">
        <a
          className="social-object linkedin-object"
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${t("LinkedIn profile")} — ${profile.shortName}`}
        >
          <Linkedin size={14} />
        </a>
      </div>
    </div>
  );
}
