"use client";

import { useEffect, useState } from "react";

/**
 * WebGL probe. Runs once per session and immediately releases the test
 * context, so mounting several scenes never eats into the browser's
 * limited context budget. Used to swap 3D for static fallbacks.
 */
let probeResult: boolean | null = null;

function probeWebGL() {
  if (probeResult !== null) return probeResult;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    probeResult = Boolean(gl);
    // Free the context straight away.
    const lose = (gl as WebGLRenderingContext | null)?.getExtension(
      "WEBGL_lose_context",
    );
    lose?.loseContext();
  } catch {
    probeResult = false;
  }
  return probeResult;
}

export function useHasWebGL() {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setSupported(probeWebGL());
  }, []);

  return supported;
}
