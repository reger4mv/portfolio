"use client";

import { useEffect, useRef } from "react";

/**
 * Hairline scroll progress sitting on the nav's bottom edge.
 * Reads scroll position from rAF rather than a scroll listener, and writes
 * only a transform — nothing re-renders.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const bar = ref.current;
    if (!bar) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      bar.style.transform = `scaleX(${progress.toFixed(4)})`;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <span className="nav__progress" aria-hidden="true">
      <span className="nav__progress-bar" ref={ref} />
    </span>
  );
}
