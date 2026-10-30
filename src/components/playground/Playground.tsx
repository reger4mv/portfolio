"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import { SectionHeading } from "@/components/sections/SectionHeading";
import { SceneBoundary } from "@/components/system/SceneBoundary";
import {
  OBJECTS,
  type CameraPreset,
  type LightMode,
  type SurfaceMode,
} from "@/data/lab";
import { useHasWebGL } from "@/hooks/useHasWebGL";
import { useInView } from "@/hooks/useInView";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useSceneQuality } from "@/hooks/useSceneQuality";

const PlaygroundScene = dynamic(() => import("@/scenes/PlaygroundScene"), {
  ssr: false,
});

const SURFACES: Array<{ id: SurfaceMode; label: string }> = [
  { id: "chrome", label: "Chrome" },
  { id: "glass", label: "Glass" },
  { id: "wire", label: "Wire" },
];

const LIGHTS: Array<{ id: LightMode; label: string }> = [
  { id: "studio", label: "Studio" },
  { id: "dusk", label: "Dusk" },
  { id: "mono", label: "Mono" },
];

const CAMERAS: Array<{ id: CameraPreset; label: string }> = [
  { id: "orbit", label: "Orbit" },
  { id: "front", label: "Front" },
  { id: "top", label: "Top" },
];

function useFrameRate(active: boolean) {
  const [fps, setFps] = useState(0);

  useEffect(() => {
    if (!active) return;
    let frames = 0;
    let last = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      frames += 1;
      if (now - last >= 700) {
        setFps(Math.round((frames * 1000) / (now - last)));
        frames = 0;
        last = now;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  return fps;
}

export function Playground() {
  const webgl = useHasWebGL();
  const quality = useSceneQuality();
  const { ref: stageRef, inView } = useInView<HTMLDivElement>("120px");

  const [surface, setSurface] = useState<SurfaceMode>("chrome");
  const [light, setLight] = useState<LightMode>("studio");
  const [preset, setPreset] = useState<CameraPreset>("orbit");
  const [selected, setSelected] = useState(0);
  const [spin, setSpin] = useState(true);
  const [pulse, setPulse] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  const fps = useFrameRate(inView && webgl === true);

  // Start still for visitors who asked for less motion; they can still
  // switch the rotation back on from the controls.
  useEffect(() => {
    if (reducedMotion) setSpin(false);
  }, [reducedMotion]);
  const ready = webgl === true;

  return (
    <section
      id="experiments"
      className="section shell"
      aria-labelledby="lab-title"
    >
      <SectionHeading
        index="03"
        label="Experiments"
        note="Scene_001 · real-time 3D"
      />

      <div className="lab__intro">
        <h2 className="display work__heading" id="lab-title" data-lines>
          <span className="line">
            <span>An instrument,</span>
          </span>
          <span className="line">
            <span>
              not a demo<em>.</em>
            </span>
          </span>
        </h2>
        <p className="body-copy" data-reveal>
          Four objects in a live scene. Drag to orbit, click an object to bring it
          forward, then change its surface, the light or the camera. Everything
          here is rendered in real time — there is no video pretending to be
          interaction.
        </p>
      </div>

      <p className="sr-only" aria-live="polite">
        {OBJECTS[selected]?.label} selected. Surface: {surface}. Lighting:{" "}
        {light}. Camera: {preset}.
      </p>

      <div className="lab" data-reveal>
        <div className="lab__stage" ref={stageRef}>
          {ready ? (
            <SceneBoundary
              fallback={
                <div className="lab__fallback">
                  <p className="mono">Scene could not start</p>
                  <p className="body-copy" style={{ maxWidth: "38ch" }}>
                    The real-time scene failed to initialise on this device. The
                    rest of the page is unaffected.
                  </p>
                </div>
              }
            >
              <PlaygroundScene
                quality={quality}
                surface={surface}
                light={light}
                preset={preset}
                selected={selected}
                spin={spin}
                pulse={pulse}
                onSelect={setSelected}
                active={inView}
              />
            </SceneBoundary>
          ) : webgl === false ? (
            <div className="lab__fallback">
              <p className="mono">Scene unavailable</p>
              <p className="body-copy" style={{ maxWidth: "38ch" }}>
                This browser can&apos;t run WebGL, so the real-time scene is
                switched off. Everything else on the page still works.
              </p>
            </div>
          ) : (
            <div className="lab__fallback">
              <p className="mono">Loading scene…</p>
            </div>
          )}

          <div className="lab__hud" aria-hidden="true">
            <div className="lab__hud-row">
              <div className="lab__hud-block">
                <p className="mono">
                  <strong>SCENE_001</strong>
                </p>
                <p className="mono">Real-time render</p>
                <p className="mono">Interactive environment</p>
              </div>
              <div className="lab__hud-block" style={{ textAlign: "right" }}>
                <p className="mono">
                  {ready ? `${quality === "lite" ? "LITE" : "FULL"} · ${fps || "--"} FPS` : "OFFLINE"}
                </p>
                <p className="mono">Three.js / WebGL</p>
              </div>
            </div>

            <div className="lab__hud-row">
              <div className="lab__readout">
                <div className="lab__hud-block">
                  <p className="mono">Selected</p>
                  <p className="lab__hud-value">
                    {OBJECTS[selected]?.label ?? "—"}
                  </p>
                </div>
                <div className="lab__hud-block">
                  <p className="mono">Surface</p>
                  <p className="lab__hud-value">{surface}</p>
                </div>
                <div className="lab__hud-block">
                  <p className="mono">Light</p>
                  <p className="lab__hud-value">{light}</p>
                </div>
              </div>
            </div>
          </div>

          {ready ? (
            <p className="lab__hint">Drag to orbit · click to select</p>
          ) : null}
        </div>

        <div className="lab__controls">
          <div className="lab__control">
            <span className="lab__control-label" id="lab-object-label">
              Object
            </span>
            <div
              className="lab__options"
              role="group"
              aria-labelledby="lab-object-label"
            >
              {OBJECTS.map((object, index) => (
                <button
                  key={object.id}
                  type="button"
                  className="lab__option"
                  aria-pressed={selected === index}
                  onClick={() => setSelected(index)}
                >
                  {object.label.replace(" ", "\u00a0")}
                </button>
              ))}
            </div>
          </div>

          <div className="lab__control">
            <span className="lab__control-label" id="lab-surface-label">
              Surface
            </span>
            <div
              className="lab__options"
              role="group"
              aria-labelledby="lab-surface-label"
            >
              {SURFACES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="lab__option"
                  aria-pressed={surface === item.id}
                  onClick={() => setSurface(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="lab__control">
            <span className="lab__control-label" id="lab-light-label">
              Lighting
            </span>
            <div
              className="lab__options"
              role="group"
              aria-labelledby="lab-light-label"
            >
              {LIGHTS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="lab__option"
                  aria-pressed={light === item.id}
                  onClick={() => setLight(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="lab__control">
            <span className="lab__control-label" id="lab-camera-label">
              Camera
            </span>
            <div
              className="lab__options"
              role="group"
              aria-labelledby="lab-camera-label"
            >
              {CAMERAS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="lab__option"
                  aria-pressed={preset === item.id}
                  onClick={() => setPreset(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="lab__control">
            <span className="lab__control-label">Motion</span>
            <div className="lab__options">
              <button
                type="button"
                className="lab__option"
                aria-pressed={spin}
                onClick={() => setSpin((value) => !value)}
              >
                Rotation
              </button>
              <button
                type="button"
                className="lab__option"
                onClick={() => setPulse((value) => value + 1)}
                disabled={!ready}
              >
                Pulse
              </button>
            </div>
          </div>
        </div>
      </div>

      <p className="footnote lab__caption">
        Scene_001 — four procedural objects, no textures, no post-processing.
        Quality adapts to the device.
      </p>
    </section>
  );
}
