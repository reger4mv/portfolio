"use client";

import { Environment, Lightformer } from "@react-three/drei";

/**
 * A hand-built studio, rendered once into an environment map.
 * No HDR downloads: the reflections come from these light shapes,
 * which is what gives the chrome its clean, designed highlights.
 * `grade` scales the amount of light and the env resolution.
 */
export function StudioEnvironment({ grade = "full" }: { grade?: "full" | "lite" }) {
  const lite = grade === "lite";

  return (
    <>
      <ambientLight intensity={lite ? 0.34 : 0.22} />
      <directionalLight
        position={[4, 5.5, 3]}
        intensity={lite ? 1.5 : 2.1}
        color="#f4f2ec"
      />
      <directionalLight
        position={[-4.5, -1.5, -2]}
        intensity={0.55}
        color="#e4663c"
      />
      <spotLight
        position={[-2.5, 4, 4.5]}
        angle={0.6}
        penumbra={1}
        intensity={lite ? 6 : 12}
        color="#e8e1d3"
        distance={16}
      />

      <Environment resolution={lite ? 96 : 256} frames={1}>
        {/* Overhead softbox */}
        <Lightformer
          form="rect"
          intensity={lite ? 2.2 : 3.4}
          color="#f6f4ee"
          scale={[9, 4, 1]}
          position={[0, 5.2, -0.5]}
          rotation={[Math.PI / 2, 0, 0]}
        />
        {/* Cool rim from the right */}
        <Lightformer
          form="rect"
          intensity={lite ? 2.4 : 4}
          color="#dfe6ff"
          scale={[1.6, 8, 1]}
          position={[5.4, 0.5, 0.5]}
          rotation={[0, -Math.PI / 2, 0]}
        />
        {/* Dimmer left bounce */}
        <Lightformer
          form="rect"
          intensity={1.1}
          color="#9aa0b5"
          scale={[1.2, 7, 1]}
          position={[-5.6, -0.6, 1]}
          rotation={[0, Math.PI / 2, 0]}
        />
        {/* Accent strips — used sparingly */}
        <Lightformer
          form="circle"
          intensity={1.5}
          color="#e4663c"
          scale={[2.2, 2.2, 1]}
          position={[1.8, -2.6, 3.4]}
        />
        <Lightformer
          form="rect"
          intensity={0.7}
          color="#ff784f"
          scale={[3.4, 0.32, 1]}
          position={[-2.4, -1.2, -3.6]}
          rotation={[0, 0.6, 0]}
        />
        {/* Backing wall keeps the silhouette readable */}
        <mesh scale={16} position={[0, 0, -7]}>
          <planeGeometry />
          <meshBasicMaterial color="#0c0c0d" />
        </mesh>
      </Environment>
    </>
  );
}
