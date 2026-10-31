"use client";

import { useEffect, useRef } from "react";

import { backdrop, withBase } from "@/data/site";

/**
 * BACKDROP LENS
 *
 * The page holds one image behind everything, but only a soft circle of it is
 * ever visible — the part under the pointer. It behaves like a torch: move and
 * it follows, stop and it switches itself off so nothing stays covered.
 *
 * Rules this component keeps:
 *  · Decorative. `aria-hidden`, `pointer-events: none`, never in the tab order.
 *  · Fine pointers only. No hover state exists on touch, so it is not mounted
 *    there at all (the CSS media query also stops the image from downloading).
 *  · No autonomous motion. It only ever responds to the pointer, and under
 *    `prefers-reduced-motion` the easing is removed so it tracks instantly.
 *  · One rAF loop, two CSS custom properties written per frame. No layout read
 *    and no per-frame style recalc beyond the mask position.
 */
export function BackdropLens() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Coarse pointers never get the element, matched in CSS as well.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ease = reduce ? 1 : 0.18;
    const idleAfter = reduce ? 3200 : 2200;

    let x = 0;
    let y = 0;
    let tx = 0;
    let ty = 0;
    let raf = 0;
    let idle = 0;
    let painted = false;

    const paint = () => {
      el.style.setProperty("--lens-x", `${x.toFixed(1)}px`);
      el.style.setProperty("--lens-y", `${y.toFixed(1)}px`);
    };

    const tick = () => {
      raf = 0;
      x += (tx - x) * ease;
      y += (ty - y) * ease;
      paint();

      if (Math.abs(tx - x) > 0.3 || Math.abs(ty - y) > 0.3) {
        raf = window.requestAnimationFrame(tick);
      }
    };

    // Stop and fade while the pointer rests, so the lens never parks over copy.
    const arm = () => {
      window.clearTimeout(idle);
      el.dataset.active = "true";
      idle = window.setTimeout(() => {
        delete el.dataset.active;
      }, idleAfter);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      tx = event.clientX;
      ty = event.clientY;

      // First sighting: put it where the pointer already is, then reveal.
      if (!painted) {
        x = tx;
        y = ty;
        painted = true;
        paint();
      }

      arm();
      if (!raf) raf = window.requestAnimationFrame(tick);
    };

    const onExit = (event: Event) => {
      const out = event as MouseEvent;
      if (out.relatedTarget) return;
      delete el.dataset.active;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseout", onExit);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseout", onExit);
      window.clearTimeout(idle);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="lens"
      aria-hidden="true"
      style={
        {
          "--lens-image": `url("${withBase(backdrop.src)}")`,
        } as React.CSSProperties
      }
    />
  );
}
