"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useRoomStore } from "@/store/room-store";
import * as THREE from "three";

export function CursorParallax({ children }: { children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const { invalidate } = useThree();
  const reducedMotion = useRoomStore((s) => s.reducedMotion);

  // Wake up frameloop on mouse move
  useEffect(() => {
    if (reducedMotion) return;
    const onMove = () => invalidate();
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [invalidate, reducedMotion]);

  useFrame((state, delta) => {
    if (reducedMotion || !group.current) return;

    // Calculate subtle target rotation based on cursor
    const targetX = (state.pointer.y * Math.PI) / 80;
    const targetY = (state.pointer.x * Math.PI) / 80;

    // Smoothly interpolate current rotation towards target
    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      targetX,
      4,
      delta,
    );
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      targetY,
      4,
      delta,
    );
  });

  return <group ref={group}>{children}</group>;
}
