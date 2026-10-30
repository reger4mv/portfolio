"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * Custom cursor: a precision dot with a lagging ring that reacts to
 * interactive elements. Only mounted for fine pointers, and never
 * when the visitor prefers reduced motion.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
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
    if (!wrap || !dot || !ring) return;

    document.documentElement.classList.add("has-cursor");

    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power2.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.55, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.55, ease: "power3.out" });

    let visible = false;

    const move = (event: PointerEvent) => {
      if (!visible) {
        visible = true;
        gsap.to(wrap, { autoAlpha: 1, duration: 0.3 });
      }
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);
    };

    const over = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      const interactive = target?.closest(
        "a, button, [role='button'], [data-cursor='grab'], input, textarea",
      );
      wrap.classList.toggle("is-active", Boolean(interactive));
    };

    const leave = () => {
      visible = false;
      gsap.to(wrap, { autoAlpha: 0, duration: 0.25 });
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("pointerleave", leave);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="cursor" ref={wrapRef} aria-hidden="true" style={{ opacity: 0 }}>
      <div className="cursor__ring" ref={ringRef} />
      <div className="cursor__dot" ref={dotRef} />
    </div>
  );
}
