"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * Custom cursor with real states.
 *
 *   default → dot + ring
 *   link    → ring opens up
 *   view    → filled disc with a VIEW label (plates, imagery)
 *   drag    → filled disc with a DRAG label (the 3D stage)
 *
 * Colour follows the surface. On the black registers the ring is bone and the
 * dot acid; over the one bone-coloured section it inverts to ink and oxblood;
 * over a project it borrows that project's own pigment. The surface is read
 * once per frame with `elementFromPoint` — no scroll listeners, no polling.
 *
 * Elements opt in declaratively:  data-cursor="view" data-cursor-label="VIEW"
 * and, for pigment:               data-cursor-accent="#B6FF3B"
 * The ring also leans gently toward the centre of the element being hovered,
 * which is what makes the pointer feel attached to the page rather than
 * floating above it. Never mounted for coarse pointers or reduced motion.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(fine && !reduce);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const wrap = wrapRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!wrap || !dot || !ring || !label) return;

    document.documentElement.classList.add("has-cursor");

    const dotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power2.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3.out" });

    let visible = false;
    let anchor: { x: number; y: number } | null = null;
    let pointer = { x: 0, y: 0 };

    /* ── surface sense ─────────────────────────────────────────────
       One elementFromPoint per frame at most: cheaper than a scroll
       listener per section, and correct where sections overlap. */
    let sample = 0;
    let surface = "ink";
    let accent = "";

    const readSurface = () => {
      sample = 0;
      const el = document.elementFromPoint(pointer.x, pointer.y);
      if (!el) return;

      const nextSurface = el.closest(".reg--paper") ? "paper" : "ink";
      if (nextSurface !== surface) {
        surface = nextSurface;
        wrap.dataset.surface = surface;
      }

      const pigmented = el.closest<HTMLElement>("[data-cursor-accent]");
      const nextAccent = pigmented?.dataset.cursorAccent ?? "";
      if (nextAccent !== accent) {
        accent = nextAccent;
        if (accent) wrap.style.setProperty("--cursor-accent", accent);
        else wrap.style.removeProperty("--cursor-accent");
      }
    };

    const move = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      if (!sample) sample = window.requestAnimationFrame(readSurface);
      if (!visible) {
        visible = true;
        gsap.to(wrap, { autoAlpha: 1, duration: 0.28 });
      }
      dotX(pointer.x);
      dotY(pointer.y);

      // Lean toward the centre of a hovered target, by a small fraction.
      if (anchor) {
        ringX(pointer.x + (anchor.x - pointer.x) * 0.16);
        ringY(pointer.y + (anchor.y - pointer.y) * 0.16);
      } else {
        ringX(pointer.x);
        ringY(pointer.y);
      }
    };

    const setMode = (mode: string, text: string) => {
      if (wrap.dataset.mode === mode && label.textContent === text) return;
      wrap.dataset.mode = mode;
      label.textContent = text;
    };

    const over = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const explicit = target.closest<HTMLElement>("[data-cursor]");
      if (explicit) {
        const mode = explicit.dataset.cursor || "link";
        setMode(mode, explicit.dataset.cursorLabel || "");
        const rect = explicit.getBoundingClientRect();
        anchor = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        return;
      }

      const interactive = target.closest(
        "a, button, [role='button'], input, textarea, select, [tabindex='0']",
      );
      anchor = null;
      setMode(interactive ? "link" : "default", "");
    };

    const leave = () => {
      visible = false;
      anchor = null;
      gsap.to(wrap, { autoAlpha: 0, duration: 0.22 });
    };

    const onDown = () => {
      wrap.dataset.pressed = "true";
    };
    const onUp = () => {
      delete wrap.dataset.pressed;
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", leave);

    wrap.dataset.surface = "ink";

    return () => {
      if (sample) window.cancelAnimationFrame(sample);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      className="cursor"
      ref={wrapRef}
      aria-hidden="true"
      data-mode="default"
      style={{ opacity: 0 }}
    >
      <div className="cursor__ring" ref={ringRef}>
        <span className="cursor__label" ref={labelRef} />
      </div>
      <div className="cursor__dot" ref={dotRef} />
    </div>
  );
}
