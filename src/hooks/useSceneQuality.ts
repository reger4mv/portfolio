"use client";

import { useEffect, useState } from "react";

export type SceneQuality = "full" | "lite";

/**
 * Picks a scene grade from things we can actually observe:
 * viewport width and core count.
 * Lite means fewer segments, no transmission glass, lower env res.
 */
export function useSceneQuality(): SceneQuality {
  const [quality, setQuality] = useState<SceneQuality>("full");

  useEffect(() => {
    const evaluate = () => {
      const narrow = window.matchMedia("(max-width: 900px)").matches;
      const cores =
        typeof navigator !== "undefined" ? navigator.hardwareConcurrency ?? 8 : 8;
      setQuality(narrow || cores <= 4 ? "lite" : "full");
    };
    evaluate();
    window.addEventListener("resize", evaluate);
    return () => window.removeEventListener("resize", evaluate);
  }, []);

  return quality;
}
