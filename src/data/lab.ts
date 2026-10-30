/** Scene_001 metadata — kept free of three.js so it can be imported cheaply. */

export type SurfaceMode = "chrome" | "glass" | "wire";
export type LightMode = "studio" | "dusk" | "mono";
export type CameraPreset = "orbit" | "front" | "top";
export type Quality = "full" | "lite";

export const OBJECTS = [
  { id: "cage", label: "Orbit cage" },
  { id: "prism", label: "Glass prism" },
  { id: "lattice", label: "Wire lattice" },
  { id: "field", label: "Particle field" },
] as const;
