/**
 * Where the floating preview sits.
 *
 * Pure geometry so it can be reasoned about (and tested) without a browser.
 * Rules, in order:
 *  1. Pick the side of the label with more room in the viewport.
 *  2. Sit beside the pointer, one gap away, on that side.
 *  3. Never overlap the label box that is being hovered, if there is room.
 *  4. Clamp the whole card inside the viewport, so it can never be clipped or
 *     pushed off screen at the edges.
 */

export interface Box {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface PlacementInput {
  /** Pointer (or focus anchor) in viewport coordinates. */
  origin: { x: number; y: number };
  /** The label box that must stay readable. */
  label: Box | null;
  size: { w: number; h: number };
  viewport: { w: number; h: number };
  gap: number;
  pad: number;
  /** "pointer" follows the cursor; "anchor" sits clear of the element. */
  mode: "pointer" | "anchor";
}

export interface Placement {
  x: number;
  y: number;
  side: 1 | -1;
}

const clamp = (value: number, min: number, max: number) =>
  min > max ? (min + max) / 2 : Math.min(Math.max(value, min), max);

export function placeCard({
  origin,
  label,
  size,
  viewport,
  gap,
  pad,
  mode,
}: PlacementInput): Placement {
  const { w, h } = size;
  const spaceRight = viewport.w - (label ? label.right : origin.x);
  const spaceLeft = label ? label.left : origin.x;
  const side: 1 | -1 = spaceRight >= spaceLeft ? 1 : -1;

  // 2. beside the pointer…
  let x =
    mode === "pointer"
      ? origin.x + side * (gap + w / 2)
      : (side > 0 ? (label?.right ?? origin.x) : (label?.left ?? origin.x)) +
        side * (gap + w / 2);

  // 3. …but never on top of the label itself.
  if (label) {
    if (side > 0) x = Math.max(x, label.right + gap + w / 2);
    else x = Math.min(x, label.left - gap - w / 2);
  }

  // 4. inside the window, always.
  x = clamp(x, pad + w / 2, viewport.w - pad - w / 2);

  let y = origin.y - h * 0.06;
  y = clamp(y, pad + h / 2, viewport.h - pad - h / 2);

  return { x: Math.round(x), y: Math.round(y), side };
}

/** Longest edge of the card: viewport-relative, capped, and per-item ratio. */
export function cardSize(
  ratio: number,
  viewport: { w: number; h: number },
  max: number,
): { w: number; h: number } {
  const long = Math.min(viewport.w * 0.34, viewport.h * 0.56, max);
  const w = ratio >= 1 ? long : long * ratio;
  const h = ratio >= 1 ? long / ratio : long;
  return { w: Math.round(w), h: Math.round(h) };
}
