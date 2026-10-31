"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import {
  OBJECTS,
  type CameraPreset,
  type LightMode,
  type Quality,
  type SurfaceMode,
} from "@/data/lab";

const RADIUS = 1.72;

/* ---------- materials ---------- */

function Surface({
  mode,
  quality,
  color,
}: {
  mode: SurfaceMode;
  quality: Quality;
  color: string;
}) {
  const lite = quality === "lite";

  if (mode === "wire") {
    return (
      <meshBasicMaterial color={color} wireframe transparent opacity={0.85} />
    );
  }

  if (mode === "glass") {
    return (
      <meshPhysicalMaterial
        color="#e8e8e8"
        transmission={lite ? 0 : 0.94}
        thickness={lite ? 0 : 0.9}
        roughness={0.1}
        ior={1.45}
        metalness={0}
        transparent
        opacity={lite ? 0.2 : 1}
        envMapIntensity={1.2}
        depthWrite={lite ? false : true}
        side={THREE.DoubleSide}
      />
    );
  }

  return (
    <meshPhysicalMaterial
      color="#cfcfcf"
      metalness={1}
      roughness={lite ? 0.18 : 0.07}
      envMapIntensity={lite ? 1.2 : 1.7}
      clearcoat={1}
      clearcoatRoughness={0.1}
    />
  );
}

/* ---------- shapes ---------- */

function OrbitCage({ quality, mode }: { quality: Quality; mode: SurfaceMode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.32;
    ref.current.rotation.x += delta * 0.1;
  });
  const seg = quality === "lite" ? 10 : 18;
  return (
    <group ref={ref}>
      <mesh>
        <torusGeometry args={[0.62, 0.11, seg, quality === "lite" ? 48 : 120]} />
        <Surface mode={mode} quality={quality} color="#cfcfcf" />
      </mesh>
      <mesh rotation={[Math.PI / 2.2, 0.4, 0]}>
        <torusGeometry args={[0.62, 0.055, seg, quality === "lite" ? 40 : 96]} />
        <Surface mode={mode} quality={quality} color="#b4b4b4" />
      </mesh>
      <mesh rotation={[0.55, Math.PI / 2, 0.3]}>
        <torusGeometry args={[0.62, 0.028, 8, quality === "lite" ? 40 : 96]} />
        <Surface mode={mode} quality={quality} color="#8a8a8a" />
      </mesh>
    </group>
  );
}

function GlassPrism({ quality, mode }: { quality: Quality; mode: SurfaceMode }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.22;
  });
  return (
    <group>
      <mesh ref={ref} rotation={[0.12, 0.4, 0.08]}>
        <cylinderGeometry args={[0.56, 0.56, 1.24, 6, 1, false]} />
        <Surface mode={mode} quality={quality} color="#dedede" />
      </mesh>
      <mesh rotation={[0.12, 0.4, 0.08]}>
        <cylinderGeometry args={[0.56, 0.56, 1.24, 6, 1, true]} />
        <meshBasicMaterial
          color="#e8e8e8"
          wireframe
          transparent
          opacity={0.14}
        />
      </mesh>
    </group>
  );
}

function WireLattice({ quality, mode }: { quality: Quality; mode: SurfaceMode }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y -= delta * 0.18;
    ref.current.rotation.z += delta * 0.05;
  });
  return (
    <group>
      <mesh ref={ref}>
        <icosahedronGeometry args={[0.78, 1]} />
        {mode === "wire" ? (
          <meshBasicMaterial color="#b6ff3b" wireframe />
        ) : (
          <Surface mode={mode} quality={quality} color="#cfcfcf" />
        )}
      </mesh>
      <mesh scale={0.42}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#141519"
          metalness={1}
          roughness={0.28}
          envMapIntensity={1.1}
          flatShading
        />
      </mesh>
    </group>
  );
}

function ParticleField({ quality }: { quality: Quality }) {
  const ref = useRef<THREE.Points>(null);
  const count = quality === "lite" ? 260 : 780;
  const positions = useMemo(() => {
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      // A hollow shell with a little noise — a structure, not confetti.
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 0.72 + Math.pow(Math.random(), 3) * 0.34;
      array[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
      array[i * 3 + 1] = Math.cos(phi) * r * 1.15;
      array[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * r;
    }
    return array;
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.1;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.019}
        color="#d8d8d8"
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ---------- selection ring ---------- */

function SelectionRing({ visible, accent }: { visible: boolean; accent: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 0.4;
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.92, 0]}>
      <torusGeometry args={[0.92, 0.005, 6, 96]} />
      <meshBasicMaterial
        color={accent}
        transparent
        opacity={visible ? 0.9 : 0}
      />
    </mesh>
  );
}

/* ---------- camera ---------- */

function CameraRig({ preset, cancel }: { preset: CameraPreset; cancel: number }) {
  const { camera } = useThree();
  const goal = useRef<THREE.Vector3 | null>(null);

  useEffect(() => {
    const map: Record<CameraPreset, [number, number, number]> = {
      orbit: [0, 0.85, 6.1],
      front: [0, 0.35, 5.1],
      top: [0, 5.2, 2.6],
    };
    goal.current = new THREE.Vector3(...map[preset]);
  }, [preset]);

  // Once the visitor drags, hand control back to OrbitControls.
  useEffect(() => {
    if (cancel > 0) goal.current = null;
  }, [cancel]);

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);
    if (!goal.current) return;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, goal.current.x, 3, d);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, goal.current.y, 3, d);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, goal.current.z, 3, d);
    if (camera.position.distanceTo(goal.current) < 0.04) goal.current = null;
  });

  return null;
}

/* ---------- the carousel ---------- */

export function InteractiveObjects({
  quality,
  surface,
  light,
  preset,
  selected,
  spin,
  pulse,
  accent,
  onSelect,
}: {
  quality: Quality;
  surface: SurfaceMode;
  light: LightMode;
  preset: CameraPreset;
  selected: number;
  spin: boolean;
  pulse: number;
  accent: string;
  onSelect: (index: number) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const [orbitStarts, setOrbitStarts] = useState(0);
  const targetRotation = useRef(0);
  const pulseStart = useRef(-10);
  const elapsed = useRef(0);

  const onOrbitStart = () => setOrbitStarts((value) => value + 1);

  /** Bring the selected object round by the shortest route, spin or not. */
  useEffect(() => {
    const step = (Math.PI * 2) / OBJECTS.length;
    const base = -selected * step;
    const current = targetRotation.current;
    const twoPi = Math.PI * 2;
    const diff = (((base - current + Math.PI) % twoPi) + twoPi) % twoPi - Math.PI;
    targetRotation.current = current + diff;
  }, [selected]);

  const firstPulse = useRef(true);
  useEffect(() => {
    if (firstPulse.current) {
      firstPulse.current = false;
      return;
    }
    pulseStart.current = elapsed.current;
  }, [pulse]);

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);
    elapsed.current = state.clock.elapsedTime;
    if (!group.current) return;

    if (spin) targetRotation.current += d * 0.045;
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      targetRotation.current,
      2.6,
      d,
    );

    // Pulse: one controlled swell through the whole arrangement.
    const t = state.clock.elapsedTime - pulseStart.current;
    const swell = t >= 0 && t < 1.4 ? Math.sin((t / 1.4) * Math.PI) * 0.08 : 0;
    const scale = 1 + swell;
    group.current.scale.setScalar(scale);
  });

  return (
    <>
      <CameraRig preset={preset} cancel={orbitStarts} />
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.07}
        rotateSpeed={0.55}
        minPolarAngle={0.55}
        maxPolarAngle={Math.PI / 1.85}
        onStart={() => onOrbitStart()}
      />

      <group ref={group}>
        {OBJECTS.map((object, index) => {
          const angle = (index / OBJECTS.length) * Math.PI * 2;
          return (
            <group
              key={object.id}
              position={[
                Math.sin(angle) * RADIUS,
                0.18 + (index % 2 === 0 ? 0.12 : -0.1),
                Math.cos(angle) * RADIUS,
              ]}
              onClick={(event) => {
                event.stopPropagation();
                onSelect(index);
              }}
            >
              {object.id === "cage" ? (
                <OrbitCage quality={quality} mode={surface} />
              ) : null}
              {object.id === "prism" ? (
                <GlassPrism quality={quality} mode={surface} />
              ) : null}
              {object.id === "lattice" ? (
                <WireLattice quality={quality} mode={surface} />
              ) : null}
              {object.id === "field" ? <ParticleField quality={quality} /> : null}
              <SelectionRing
                visible={selected === index}
                accent={accent}
              />
            </group>
          );
        })}
      </group>

      {/* Stage plate: a thin disc so the objects have a floor to read against */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.34, 0]}>
        <circleGeometry args={[3.6, 64]} />
        <meshStandardMaterial
          color="#0a0a0a"
          metalness={0.6}
          roughness={0.5}
          envMapIntensity={0.5}
        />
      </mesh>

      {/* Lighting presets */}
      {light === "studio" ? (
        <>
          <ambientLight intensity={0.18} />
          <directionalLight position={[3, 5, 4]} intensity={2.2} color="#f2f2f2" />
          <directionalLight position={[-4, 1, 2]} intensity={0.5} color="#b6ff3b" />
        </>
      ) : null}
      {light === "dusk" ? (
        <>
          <ambientLight intensity={0.1} color="#2a2b4d" />
          <directionalLight position={[-3, 2.2, 3.4]} intensity={2.6} color="#b6ff3b" />
          <directionalLight position={[3.4, -1, -2]} intensity={1.5} color="#cfcfcf" />
        </>
      ) : null}
      {light === "mono" ? (
        <>
          <ambientLight intensity={0.06} />
          <spotLight
            position={[0.5, 6, 1.5]}
            angle={0.7}
            penumbra={0.9}
            intensity={26}
            color="#ffffff"
            distance={18}
          />
          <directionalLight position={[0, -2, 3]} intensity={0.25} color="#6f7280" />
        </>
      ) : null}
    </>
  );
}
