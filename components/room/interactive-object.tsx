"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { useThree, type ThreeEvent } from "@react-three/fiber";
import gsap from "gsap";
import type { Group } from "three";
import type { SectionId, Vec3 } from "@/lib/types";
import { useRoomStore } from "@/store/room-store";
import { HotspotAnchor } from "./room-hotspots";

export function InteractiveObject({
  section,
  position,
  rotation = [0, 0, 0],
  labelPosition,
  children,
}: {
  section: SectionId;
  label: string;
  position: Vec3;
  rotation?: Vec3;
  labelPosition: Vec3;
  children: ReactNode;
}) {
  const group = useRef<Group>(null);
  const hovered = useRoomStore((s) => s.hovered === section);
  const reducedMotion = useRoomStore((s) => s.reducedMotion);
  const open = useRoomStore((s) => s.open);
  const hover = useRoomStore((s) => s.hover);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    if (!group.current) return;
    const tween = gsap.to(group.current.scale, {
      x: hovered ? 1.05 : 1,
      y: hovered ? 1.05 : 1,
      z: hovered ? 1.05 : 1,
      duration: reducedMotion ? 0 : 0.3,
      onUpdate: invalidate,
    });
    return () => {
      tween.kill();
    };
  }, [hovered, invalidate, reducedMotion]);

  function select(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();
    if (event.delta < 5) open(section);
  }

  return (
    <group position={position} rotation={rotation}>
      <group
        ref={group}
        onClick={select}
        onPointerOver={(event) => {
          event.stopPropagation();
          hover(section);
        }}
        onPointerOut={() => hover(null)}
      >
        {children}
      </group>
      <HotspotAnchor id={section} position={labelPosition} />
    </group>
  );
}
