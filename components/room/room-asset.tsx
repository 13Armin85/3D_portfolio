"use client";

import { Component, Suspense, useMemo, type ReactNode } from "react";
import { useGLTF } from "@react-three/drei";
import type { Mesh } from "three";
import { roomAssets } from "@/lib/room-config";
import type { AssetId } from "@/lib/types";

class AssetBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((object) => {
      if ((object as Mesh).isMesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);
  return <primitive object={model} />;
}

export function RoomAsset({
  id,
  children,
}: {
  id: AssetId;
  children: ReactNode;
}) {
  return (
    <AssetBoundary fallback={children}>
      <Suspense fallback={children}>
        <Model url={roomAssets[id]} />
      </Suspense>
    </AssetBoundary>
  );
}
