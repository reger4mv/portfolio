"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

type Quality = "full" | "lite";

/**
 * HERO SCULPTURE — "CALIBRATOR"
 *
 * A mounted instrument rather than a floating ornament:
 *   · a heavy plinth with engraved tick marks
 *   · a slim steel column with chrome collars
 *   · a three-ring gimbal held in the column's cradle
 *   · a faceted dark core at the centre of the gimbal
 *   · one counterweighted arm that breaks the symmetry
 *   · a single glass lens slab cutting through the assembly
 *
 * Everything is parametric geometry — no textures, nothing to download.
 */

const GIMBAL = [
  { radius: 1.28, tube: 0.028, rotation: [0.16, 0.42, -0.2] as const, speed: 0.11, bolts: 2 },
  { radius: 0.99, tube: 0.05, rotation: [1.24, 0.12, 0.62] as const, speed: -0.16, bolts: 3 },
  { radius: 0.7, tube: 0.016, rotation: [0.62, -1.02, 0.28] as const, speed: 0.24, bolts: 0 },
];

const CORE_Y = 0.28;
const TICKS = 18;

function GlassLens({ lite = false }: { lite?: boolean }) {
  return (
    <meshPhysicalMaterial
      color="#e8e1d3"
      transmission={lite ? 0 : 0.95}
      thickness={lite ? 0 : 0.9}
      roughness={0.12}
      ior={1.44}
      metalness={0}
      envMapIntensity={lite ? 0.8 : 1.25}
      transparent
      opacity={lite ? 0.14 : 1}
      depthWrite={!lite}
      side={THREE.DoubleSide}
    />
  );
}

export function HeroSculpture({
  quality = "full",
  motion = true,
}: {
  quality?: Quality;
  motion?: boolean;
}) {
  const lite = quality === "lite";

  const root = useRef<THREE.Group>(null);
  const gimbal = useRef<THREE.Group>(null);
  const pointer = useRef(new THREE.Vector2(0, 0));
  const ringRefs = useRef<Array<THREE.Group | null>>([]);
  const coreRef = useRef<THREE.Mesh>(null);
  const armRef = useRef<THREE.Group>(null);

  /** Pointer tracked on the window so the canvas stays non-interactive. */
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.current.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        (event.clientY / window.innerHeight) * 2 - 1,
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  /** Two segmented arms that clamp the gimbal to the column cradle. */
  const clamps = useMemo(
    () =>
      [0, 1].map((side) =>
        Array.from({ length: 6 }, (_, index) => {
          const t = (index / 5) * 1.15;
          return {
            position: [
              side === 0 ? -0.16 - t * 0.36 : 0.16 + t * 0.36,
              CORE_Y - 1.06 + Math.cos(t) * 0.16,
              Math.sin(t) * 0.1,
            ] as [number, number, number],
            rotation: [0, 0, side === 0 ? -0.5 + t * 0.4 : 0.5 - t * 0.4] as [
              number,
              number,
              number,
            ],
          };
        }),
      ),
    [],
  );

  useFrame((state, delta) => {
    if (!motion) return;
    const d = Math.min(delta, 0.05);
    const time = state.clock.elapsedTime;
    const target = pointer.current;

    if (root.current) {
      // The instrument answers the cursor, it does not follow it.
      root.current.rotation.y = THREE.MathUtils.damp(
        root.current.rotation.y,
        target.x * 0.26 + 0.28 + time * 0.03,
        2.4,
        d,
      );
      root.current.rotation.x = THREE.MathUtils.damp(
        root.current.rotation.x,
        target.y * 0.09 - 0.03,
        2,
        d,
      );
    }

    if (gimbal.current) {
      gimbal.current.position.y = THREE.MathUtils.damp(
        gimbal.current.position.y,
        CORE_Y + Math.sin(time * 0.55) * 0.028,
        2,
        d,
      );
    }

    ringRefs.current.forEach((group, index) => {
      if (!group) return;
      const spec = GIMBAL[index];
      group.rotation.z += d * spec.speed;
      group.rotation.x += d * spec.speed * 0.42;
    });

    if (coreRef.current) {
      coreRef.current.rotation.y += d * 0.16;
      coreRef.current.rotation.x += d * 0.07;
    }

    if (armRef.current) {
      armRef.current.rotation.y += d * 0.05;
    }
  });

  const chrome = (
    <meshPhysicalMaterial
      color="#cfc7b6"
      metalness={1}
      roughness={lite ? 0.17 : 0.06}
      envMapIntensity={lite ? 1.1 : 1.55}
      clearcoat={1}
      clearcoatRoughness={0.12}
    />
  );

  const steel = (
    <meshStandardMaterial
      color="#221e16"
      metalness={1}
      roughness={0.36}
      envMapIntensity={0.85}
    />
  );

  const gunmetal = (
    <meshPhysicalMaterial
      color="#8a8375"
      metalness={1}
      roughness={0.22}
      envMapIntensity={1.2}
    />
  );

  return (
    <group ref={root} rotation={[0, 0.28, 0]}>
      {/* ── Plinth ───────────────────────────────────────────── */}
      <group position={[0, -1.62, 0]}>
        <mesh>
          <cylinderGeometry args={[0.86, 0.94, 0.1, lite ? 32 : 72]} />
          {steel}
        </mesh>
        <mesh position={[0, 0.07, 0]}>
          <cylinderGeometry args={[0.78, 0.8, 0.045, lite ? 32 : 72]} />
          {gunmetal}
        </mesh>
        {/* engraved tick marks around the plinth */}
        {Array.from({ length: lite ? 9 : TICKS }).map((_, index) => {
          const total = lite ? 9 : TICKS;
          const angle = (index / total) * Math.PI * 2;
          const long = index % 3 === 0;
          return (
            <mesh
              key={index}
              position={[Math.cos(angle) * 0.72, 0.095, Math.sin(angle) * 0.72]}
              rotation={[0, -angle, 0]}
            >
              <boxGeometry args={[long ? 0.09 : 0.05, 0.004, 0.012]} />
              <meshBasicMaterial color={long ? "#e4663c" : "#6f695c"} />
            </mesh>
          );
        })}
      </group>

      {/* ── Column ───────────────────────────────────────────── */}
      <mesh position={[0, -0.86, 0]}>
        <cylinderGeometry args={[0.038, 0.055, 1.5, lite ? 12 : 28]} />
        {steel}
      </mesh>
      {[-1.3, -0.62, -0.34].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <cylinderGeometry args={[0.068, 0.068, 0.05, lite ? 14 : 32]} />
          {chrome}
        </mesh>
      ))}

      {/* Column cradle — two segmented clamps reaching the gimbal */}
      {clamps.map((segments, side) => (
        <group key={side}>
          {segments.map((segment, index) => (
            <mesh key={index} position={segment.position} rotation={segment.rotation}>
              <boxGeometry args={[0.05, 0.2, 0.055]} />
              {steel}
            </mesh>
          ))}
        </group>
      ))}

      {/* ── Gimbal ───────────────────────────────────────────── */}
      <group ref={gimbal} position={[0, CORE_Y, 0]}>
        {GIMBAL.map((ring, index) => (
          <group
            key={ring.radius}
            ref={(node) => {
              ringRefs.current[index] = node;
            }}
            rotation={ring.rotation as unknown as [number, number, number]}
          >
            <mesh>
              <torusGeometry
                args={[ring.radius, ring.tube, lite ? 10 : 20, lite ? 80 : 210]}
              />
              {chrome}
            </mesh>
            {Array.from({ length: ring.bolts }).map((_, bolt) => {
              const angle = (bolt / Math.max(ring.bolts, 1)) * Math.PI * 2 + index;
              return (
                <mesh
                  key={bolt}
                  position={[
                    Math.cos(angle) * ring.radius,
                    Math.sin(angle) * ring.radius,
                    0,
                  ]}
                  rotation={[0, 0, angle]}
                >
                  <boxGeometry args={[0.1, 0.055, 0.055]} />
                  {steel}
                </mesh>
              );
            })}
          </group>
        ))}

        {/* Counterweighted arm — the one broken symmetry */}
        <group ref={armRef} rotation={[0.35, 0, 0.2]}>
          <mesh position={[0.62, 0.14, 0]} rotation={[0, 0, -0.18]}>
            <boxGeometry args={[1.24, 0.018, 0.028]} />
            {gunmetal}
          </mesh>
          <mesh position={[1.22, 0.02, 0]}>
            <sphereGeometry args={[0.052, lite ? 12 : 28, lite ? 12 : 28]} />
            {chrome}
          </mesh>
          <mesh position={[1.22, 0.02, 0]}>
            <sphereGeometry args={[0.085, 8, 8]} />
            <meshBasicMaterial color="#e4663c" wireframe transparent opacity={0.35} />
          </mesh>
        </group>

        {/* Faceted core, held dark so the chrome has contrast */}
        <mesh ref={coreRef} rotation={[0.4, 0.7, 0.1]}>
          <icosahedronGeometry args={[0.42, 0]} />
          <meshPhysicalMaterial
            color="#17150f"
            metalness={1}
            roughness={0.16}
            envMapIntensity={1.3}
            flatShading
          />
        </mesh>

        {/* Vertical hairline through the whole gimbal */}
        <mesh>
          <cylinderGeometry args={[0.0035, 0.0035, 2.3, 6]} />
          <meshBasicMaterial color="#7c7567" />
        </mesh>
      </group>

      {/* ── Glass lens slab ─────────────────────────────────── */}
      <group rotation={[0.12, -0.62, 0.24]} position={[0.42, 0.12, 0.1]}>
        {lite ? (
          <mesh>
            <boxGeometry args={[0.86, 1.26, 0.16]} />
            <GlassLens lite />
          </mesh>
        ) : (
          <RoundedBox args={[0.86, 1.26, 0.16]} radius={0.05} smoothness={3}>
            <GlassLens />
          </RoundedBox>
        )}
      </group>
    </group>
  );
}
