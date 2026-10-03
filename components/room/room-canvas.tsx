"use client";

import { useI18n } from "../locale-provider";
import { Component, useEffect, type ReactNode } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, useProgress } from "@react-three/drei";
import { ACESFilmicToneMapping, PCFShadowMap } from "three";
import { RoomGeometry } from "./room-geometry";
import { CameraRig } from "./camera-rig";
import { CursorParallax } from "./cursor-parallax";
import { RoomHotspots } from "./room-hotspots";
import { useRoomStore } from "@/store/room-store";
import { overview } from "@/lib/room-config";
import { ArrowUpRight, Box } from "lucide-react";
import { BrandLogo } from "../ui/profile-identity";

function Fallback() {
  const { t } = useI18n();
  const setMode = useRoomStore((s) => s.setMode);
  return (
    <div className="webgl-fallback">
      <Box size={40} strokeWidth={1} />
      <h3>{t("There’s more than one way in.")}</h3>
      <p>
        {t(
          "The interactive room couldn’t load on this device. All my work is available in the classic view.",
        )}{" "}
      </p>
      <button className="primary-button" onClick={() => setMode("list")}>
        {t("Explore my portfolio")} <ArrowUpRight size={16} />
      </button>
    </div>
  );
}

class CanvasBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <Fallback /> : this.props.children;
  }
}

function SceneLifecycle() {
  const gl = useThree((s) => s.gl);
  const invalidate = useThree((s) => s.invalidate);
  const setReady = useRoomStore((s) => s.setReady);
  const setMode = useRoomStore((s) => s.setMode);
  useEffect(() => {
    const canvas = gl.domElement;
    setReady(true);
    const onLost = (event: Event) => {
      event.preventDefault();
      setMode("list");
    };
    const onVisibility = () => {
      if (!document.hidden) invalidate();
    };
    canvas.addEventListener("webglcontextlost", onLost);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      canvas.removeEventListener("webglcontextlost", onLost);
      document.removeEventListener("visibilitychange", onVisibility);
      setReady(false);
    };
  }, [gl, invalidate, setMode, setReady]);
  return null;
}

function RoomLoading() {
  const { t } = useI18n();
  const { active, progress, loaded, total } = useProgress();
  const ready = useRoomStore((s) => s.ready);
  if (ready && !active) return null;
  return (
    <div className="room-loading" role="status" aria-live="polite">
      <span className="loading-symbol">
        <BrandLogo />
      </span>
      <p>{t("Making room for you")}</p>
      <div className="loading-track">
        <span style={{ width: `${progress}%` }} />
      </div>
      <span className="loading-caption">
        {total > 0
          ? `${loaded} / ${total} ${t("assets")} · ${Math.round(progress)}%`
          : t("Preparing your visit…")}
      </span>
    </div>
  );
}

function Lights() {
  const night = useRoomStore((s) => s.theme === "night");
  return (
    <>
      <ambientLight
        intensity={night ? 0.6 : 1.1}
        color={night ? "#b7cce2" : "#fff5e7"}
      />
      <hemisphereLight
        intensity={night ? 0.7 : 1.5}
        color={night ? "#b3c7e0" : "#fffcf5"}
        groundColor="#a39179"
      />
      <directionalLight
        position={[-3, 7, 5]}
        intensity={night ? 0.9 : 2.5}
        color={night ? "#a8c8e7" : "#fff0ce"}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
        shadow-normalBias={0.04}
        shadow-bias={-0.0003}
      />
      <pointLight
        position={[-1.8, 2.18, -1.6]}
        color="#ffd797"
        intensity={night ? 4.0 : 0.55}
        distance={5}
        decay={2}
      />
      <pointLight
        position={[-0.63, 2.2, -1.3]}
        color="#b9dcd2"
        intensity={night ? 0.65 : 0.12}
        distance={2}
      />
    </>
  );
}

export default function RoomCanvas() {
  const { t } = useI18n();
  const hovered = useRoomStore((s) => s.hovered);
  return (
    <CanvasBoundary>
      <div
        className="canvas-surface"
        style={{ cursor: hovered ? "pointer" : "grab" }}
      >
        <Canvas
          shadows={{ type: PCFShadowMap }}
          frameloop="demand"
          dpr={[1, 1.5]}
          camera={{ position: overview.position, fov: 32, near: 0.1, far: 70 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            toneMapping: ACESFilmicToneMapping,
          }}
          fallback={<Fallback />}
          role="group"
          aria-label={t(
            "Interactive 3D developer room. Use the navigation below to explore each section with a keyboard.",
          )}
        >
          <Lights />
          <CursorParallax>
            <RoomGeometry />
            <ContactShadows
              position={[0, -0.245, 0]}
              opacity={0.3}
              scale={17}
              blur={2.7}
              far={5}
              resolution={256}
              frames={1}
              color="#75624d"
            />
          </CursorParallax>
          <CameraRig />
          <SceneLifecycle />
        </Canvas>
        <RoomHotspots />
        <RoomLoading />
      </div>
    </CanvasBoundary>
  );
}
