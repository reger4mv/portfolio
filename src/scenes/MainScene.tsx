"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { HeroSculpture } from "@/scenes/HeroSculpture";
import { StudioEnvironment } from "@/scenes/Lighting";

type Quality = "full" | "lite";

/** Camera responds to scroll — gentle, not a ride. */
function ScrollCamera({ quality }: { quality: Quality }) {
  const { camera } = useThree();
  const progress = useRef(0);

  useEffect(() => {
    const update = () => {
      const max = window.innerHeight || 1;
      progress.current = Math.min(Math.max(window.scrollY / max, 0), 1);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);
    const p = progress.current;
    const baseZ = quality === "lite" ? 7.6 : 6.5;
    camera.position.z = THREE.MathUtils.damp(camera.position.z, baseZ + p * 2.1, 2.4, d);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 0.12 + p * 1.15, 2.4, d);
    camera.lookAt(0, -p * 0.25, 0);
  });

  return null;
}

function SceneContents({
  quality,
  motion,
}: {
  quality: Quality;
  motion: boolean;
}) {
  const mobile = quality === "lite";

  return (
    <>
      <StudioEnvironment grade={quality} />
      <group
        position={mobile ? [0, 0.62, 0] : [1.22, 0.3, 0]}
        scale={mobile ? 0.78 : 0.88}
      >
        <HeroSculpture quality={quality} motion={motion} />
      </group>
      {/* Dark floor plane: gives the metal something to sit against */}
      <mesh position={[0, -2.6, -1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[26, 26]} />
        <meshBasicMaterial color="#080808" transparent opacity={0.85} />
      </mesh>
      {motion ? <ScrollCamera quality={quality} /> : null}
    </>
  );
}

export default function MainScene({
  quality = "full",
  active = true,
  motion = true,
}: {
  quality?: Quality;
  active?: boolean;
  motion?: boolean;
}) {
  const dpr = useMemo<[number, number]>(
    () => (quality === "lite" ? [1, 1.4] : [1, 1.75]),
    [quality],
  );

  return (
    <Canvas
      frameloop={!motion ? "demand" : active ? "always" : "never"}
      dpr={dpr}
      camera={{ position: [0, 0.12, 6.5], fov: 38, near: 0.1, far: 40 }}
      gl={{
        antialias: quality !== "lite",
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
      }}
      style={{ pointerEvents: "none" }}
    >
      <SceneContents quality={quality} motion={motion} />
    </Canvas>
  );
}
