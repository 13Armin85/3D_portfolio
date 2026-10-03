"use client";

import { RoomAsset } from "./room-asset";
import { InteractiveObject } from "./interactive-object";
import { HotspotAnchor } from "./room-hotspots";
import { useRoomStore } from "@/store/room-store";
import type { Vec3 } from "@/lib/types";

function Box({
  size,
  position,
  color,
  rotation = [0, 0, 0],
}: {
  size: Vec3;
  position: Vec3;
  color: string;
  rotation?: Vec3;
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.82} />
    </mesh>
  );
}

function RoomShell() {
  const night = useRoomStore((s) => s.theme === "night");
  return (
    <group>
      <Box size={[6.1, 0.23, 4.85]} position={[0, -0.11, 0]} color="#b89472" />
      <Box size={[6.04, 0.035, 4.8]} position={[0, 0.027, 0]} color="#dbc2a0" />
      {Array.from({ length: 18 }, (_, i) => (
        <Box
          key={i}
          size={[0.013, 0.007, 4.78]}
          position={[-2.89 + i * 0.34, 0.048, 0]}
          color="#cbb08e"
        />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <Box
          key={i}
          size={[0.33, 0.007, 0.009]}
          position={[-2.72 + i * 0.68, 0.049, i % 2 ? -0.5 : 0.9]}
          color="#c4a787"
        />
      ))}
      <Box size={[6.1, 3.7, 0.13]} position={[0, 1.87, -2.4]} color="#dce7eb" />
      <Box
        size={[0.13, 3.7, 4.84]}
        position={[-3.0, 1.87, 0]}
        color="#d3e0e5"
      />
      <Box
        size={[6, 0.14, 0.075]}
        position={[0, 0.13, -2.29]}
        color="#f1ecdf"
      />
      <Box
        size={[0.075, 0.14, 4.7]}
        position={[-2.9, 0.13, 0]}
        color="#f1ecdf"
      />
      <Box
        size={[3.15, 0.018, 1.94]}
        position={[0.45, 0.062, 0.84]}
        color="#6d9eac"
      />
      {[-0.67, 2.37].map((x) => (
        <Box
          key={x}
          size={[0.025, 0.002, 1.86]}
          position={[x, 0.074, 0.84]}
          color="#c7d0bf"
        />
      ))}
      <group position={[-2.91, 2.15, -0.72]} rotation={[0, Math.PI / 2, 0]}>
        <Box size={[1.86, 1.98, 0.09]} position={[0, 0, 0]} color="#aa8864" />
        <mesh position={[0, 0, 0.051]}>
          <planeGeometry args={[1.7, 1.82]} />
          <meshStandardMaterial
            color={night ? "#243b53" : "#c8dbe0"}
            emissive={night ? "#293c57" : "#c2d7d9"}
            emissiveIntensity={0.25}
            roughness={0.4}
          />
        </mesh>
        <Box
          size={[0.055, 1.88, 0.07]}
          position={[0, 0, 0.09]}
          color="#f5ecda"
        />
        <Box
          size={[1.76, 0.055, 0.07]}
          position={[0, 0, 0.09]}
          color="#f5ecda"
        />
        <Box
          size={[2.07, 0.075, 0.31]}
          position={[0, -1, 0.13]}
          color="#d0b38b"
        />
        {Array.from({ length: 7 }, (_, i) => (
          <Box
            key={i}
            size={[1.97, 0.075, 0.12]}
            position={[0, 0.98 - i * 0.09, 0.12]}
            color="#e7dac0"
          />
        ))}
      </group>
      <group position={[-2.72, 1.17, 1.18]}>
        <Box size={[0.53, 0.075, 1.05]} position={[0, 0, 0]} color="#b88b5d" />
        <Box
          size={[0.055, 0.25, 0.06]}
          position={[-0.15, -0.14, -0.34]}
          color="#615341"
        />
        <Box
          size={[0.055, 0.25, 0.06]}
          position={[-0.15, -0.14, 0.34]}
          color="#615341"
        />
      </group>
    </group>
  );
}

function SocialObjects() {
  return (
    <group position={[-2.64, 1.32, 1.18]}>
      <Box
        size={[0.24, 0.24, 0.24]}
        position={[0, 0.01, -0.25]}
        color="#34433f"
      />
      <Box
        size={[0.24, 0.24, 0.24]}
        position={[0, 0.01, 0.2]}
        color="#547b8c"
      />
      <HotspotAnchor id="github" position={[0.14, 0.04, -0.25]} />
      <HotspotAnchor id="linkedin" position={[0.14, 0.04, 0.2]} />
    </group>
  );
}

export function RoomGeometry() {
  return (
    <group>
      <RoomShell />
      <group position={[-0.58, 0.055, -1.1]}>
        <RoomAsset id="desk">
          <Box
            size={[3.7, 0.16, 1.5]}
            position={[0, 1.46, 0]}
            color="#c59a6f"
          />
        </RoomAsset>
      </group>
      <InteractiveObject
        section="about"
        label="About me"
        position={[-0.63, 1.6, -1.56]}
        labelPosition={[0, 1.3, 0]}
      >
        <RoomAsset id="monitor">
          <Box
            size={[1.38, 0.84, 0.085]}
            position={[0, 0.66, 0]}
            color="#283a3d"
          />
        </RoomAsset>
      </InteractiveObject>
      <InteractiveObject
        section="projects"
        label="My projects"
        position={[-1.6, 1.61, -0.94]}
        rotation={[0, 0.2, 0]}
        labelPosition={[-0.14, 0.88, 0.14]}
      >
        <RoomAsset id="laptop">
          <Box
            size={[0.95, 0.6, 0.06]}
            position={[0, 0.33, -0.3]}
            color="#8aaba5"
          />
        </RoomAsset>
      </InteractiveObject>
      <InteractiveObject
        section="skills"
        label="My toolkit"
        position={[1.94, 0.075, -1.94]}
        labelPosition={[0.24, 2.28, 0.5]}
      >
        <RoomAsset id="bookshelf">
          <Box size={[1.3, 2.7, 0.6]} position={[0, 1.35, 0]} color="#bc976e" />
        </RoomAsset>
      </InteractiveObject>
      <InteractiveObject
        section="journey"
        label="My journey"
        position={[-0.46, 2.98, -2.29]}
        labelPosition={[0.03, 0.66, 0.15]}
      >
        <RoomAsset id="frames">
          <Box size={[2.1, 0.9, 0.07]} position={[0, 0, 0]} color="#ac8b60" />
        </RoomAsset>
      </InteractiveObject>
      <InteractiveObject
        section="resume"
        label="Résumé"
        position={[0.52, 1.61, -0.8]}
        rotation={[0, 0.18, 0]}
        labelPosition={[-0.14, 0.39, 0.06]}
      >
        <RoomAsset id="resume">
          <Box size={[0.4, 0.025, 0.55]} position={[0, 0, 0]} color="#eeeade" />
        </RoomAsset>
      </InteractiveObject>
      <InteractiveObject
        section="contact"
        label="Say hello"
        position={[1.0, 1.62, -1.0]}
        rotation={[0.5, -0.16, 0]}
        labelPosition={[0.12, 0.5, 0.05]}
      >
        <RoomAsset id="phone">
          <Box
            size={[0.22, 0.025, 0.4]}
            position={[0, 0.09, 0]}
            color="#3b5052"
          />
        </RoomAsset>
      </InteractiveObject>
      <group position={[-0.39, 0.085, 0.65]} rotation={[0, -0.23, 0]}>
        <RoomAsset id="chair">
          <Box
            size={[0.86, 1.3, 0.8]}
            position={[0, 0.65, 0]}
            color="#648d9c"
          />
        </RoomAsset>
      </group>
      <group position={[-2.03, 0.075, 2.0]}>
        <RoomAsset id="plant">
          <Box
            size={[0.45, 1.4, 0.45]}
            position={[0, 0.7, 0]}
            color="#708756"
          />
        </RoomAsset>
      </group>
      <group position={[2.0, 2.79, -1.94]} scale={0.35}>
        <RoomAsset id="plant">
          <Box size={[0.4, 1, 0.4]} position={[0, 0.5, 0]} color="#708756" />
        </RoomAsset>
      </group>
      <group position={[0.6, 1.62, -1.6]} rotation={[0, -1.4, 0]}>
        <RoomAsset id="lamp">
          <Box size={[0.2, 0.8, 0.2]} position={[0, 0.4, 0]} color="#ddd0aa" />
        </RoomAsset>
      </group>
      <group position={[-0.44, 1.6, -0.65]}>
        <RoomAsset id="accessories">
          <Box
            size={[0.87, 0.03, 0.3]}
            position={[0, 0.03, 0]}
            color="#dfdfd2"
          />
        </RoomAsset>
      </group>
      <SocialObjects />
      <HotspotAnchor id="coffee" position={[-1.57, 1.85, -0.61]} />
    </group>
  );
}
