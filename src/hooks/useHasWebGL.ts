"use client";

import { useEffect, useState } from "react";

/**
 * Cheap synchronous WebGL probe. Used to swap the 3D scenes for
 * static fallbacks so the page never depends on WebGL support.
 */
export function useHasWebGL() {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");
      setSupported(Boolean(gl));
    } catch {
      setSupported(false);
    }
  }, []);

  return supported;
}
