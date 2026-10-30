"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Magnetic pointer pull for a single element.
 *
 * Returns a ref to attach to anything focusable or clickable. The element
 * leans toward the cursor by a fraction of the offset and eases back on
 * leave. Skipped for coarse pointers and reduced motion, so clicks and taps
 * behave exactly as normal for anyone who never sees the effect.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.22) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const xTo = gsap.quickTo(node, "x", { duration: 0.65, ease: "power3.out" });
    const yTo = gsap.quickTo(node, "y", { duration: 0.65, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      xTo((event.clientX - (rect.left + rect.width / 2)) * strength);
      yTo((event.clientY - (rect.top + rect.height / 2)) * strength);
    };

    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    node.addEventListener("pointermove", onMove);
    node.addEventListener("pointerleave", onLeave);

    return () => {
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(node);
      gsap.set(node, { clearProps: "transform" });
    };
  }, [strength]);

  return ref;
}
