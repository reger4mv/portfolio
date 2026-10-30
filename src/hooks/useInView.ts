"use client";

import { useEffect, useRef, useState } from "react";

/** Flips to false when the element leaves the viewport, so scenes can idle. */
export function useInView<T extends HTMLElement>(margin = "160px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: margin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [margin]);

  return { ref, inView };
}
