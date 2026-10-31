"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

import { InteractiveObjects } from "@/scenes/InteractiveObjects";
import type {
  CameraPreset,
  LightMode,
  Quality,
  SurfaceMode,
} from "@/data/lab";
import { StudioEnvironment } from "@/scenes/Lighting";

export default function PlaygroundScene({
  quality,
  surface,
  light,
  preset,
  selected,
  spin,
  pulse,
  onSelect,
  active,
}: {
  quality: Quality;
  surface: SurfaceMode;
  light: LightMode;
  preset: CameraPreset;
  selected: number;
  spin: boolean;
  pulse: number;
  onSelect: (index: number) => void;
  active: boolean;
}) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={quality === "lite" ? [1, 1.35] : [1, 1.7]}
      camera={{ position: [0, 0.85, 6.1], fov: 42, near: 0.1, far: 40 }}
      gl={{
        antialias: quality !== "lite",
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
      }}
    >
      <color attach="background" args={["#0a0a0a"]} />
      <Suspense fallback={null}>
        <StudioEnvironment grade={quality} />
        <InteractiveObjects
          quality={quality}
          surface={surface}
          light={light}
          preset={preset}
          selected={selected}
          spin={spin}
          pulse={pulse}
          accent="#b6ff3b"
          onSelect={onSelect}
        />
      </Suspense>
    </Canvas>
  );
}
