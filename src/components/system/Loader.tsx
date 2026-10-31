"use client";

import { useEffect, useRef, useState } from "react";

import { withBase } from "@/data/site";

/**
 * LOADER — "#SWAG"
 *
 * The supplied artwork is the screen: black field, grey lettering, nothing
 * drawn underneath it. It is never recreated in type, never cropped and never
 * stretched — only scaled, with its aspect ratio held by the image itself.
 *
 * The meter under it is a Y2K hardware bar: 28 stepped cells filling left to
 * right, chrome on silver, with the cell currently being written lit in acid.
 * It is driven by real gates — type loaded, artwork decoded, window loaded —
 * never by a timer pretending to be work.
 *
 * Rules this keeps:
 *  · Wait for real work, then hold. A 1.8 s floor lets the screen register as
 *    an intro; a 4.2 s ceiling means it can never hold the page hostage.
 *  · No layout shift. The overlay is fixed and the page underneath is locked
 *    while it is up, so releasing it moves nothing.
 *  · Reduced motion: no flicker, no power-off, a shorter hold, one fade.
 *  · The artwork is `aria-hidden`; the live region carries the only words.
 */
const CELLS = 28;

type Stage = "type" | "artwork" | "window" | "ready";

const stageText: Record<Stage, string> = {
  type: "Loading type",
  artwork: "Decoding artwork",
  window: "Reading page",
  ready: "Ready",
};

export function Loader() {
  const [state, setState] = useState<"in" | "out" | "gone">("in");
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<Stage>("type");
  const doneRef = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const started = performance.now();
    const minOn = reduce ? 700 : 1800;
    const maxOn = reduce ? 1400 : 4200;

    document.documentElement.classList.add("is-loading");

    /* ── the meter ────────────────────────────────────────────────
       `target` only ever moves when a real gate resolves. `shown`
       eases toward it on rAF so the bar fills like a mechanism
       instead of snapping. */
    let target = 0.06;
    let shown = 0.06;
    let raf = 0;
    let running = true;

    const tick = () => {
      if (!running) return;
      shown += (target - shown) * 0.12;
      if (target - shown < 0.002) shown = target;
      setProgress(shown);
      raf = window.requestAnimationFrame(tick);
    };

    const advance = (value: number, next: Stage) => {
      if (value <= target) return;
      target = value;
      setStage(next);
    };

    raf = window.requestAnimationFrame(tick);

    const leave = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      running = false;
      window.cancelAnimationFrame(raf);
      setProgress(1);
      setStage("ready");
      // A short beat at full so the completed bar is actually seen.
      window.setTimeout(
        () => {
          setState("out");
          window.setTimeout(
            () => {
              setState("gone");
              document.documentElement.classList.remove("is-loading");
            },
            reduce ? 220 : 520,
          );
        },
        reduce ? 120 : 260,
      );
    };

    const artwork = new Image();
    artwork.src = withBase("/assets/swag.png");
    const decoded = artwork.decode?.() ?? Promise.resolve();

    Promise.all([document.fonts?.ready ?? Promise.resolve(), decoded])
      .then(() => advance(0.72, "artwork"))
      .catch(() => advance(0.72, "artwork"));

    const pageLoad = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });
    });

    pageLoad.then(() => advance(0.94, "window"));

    // Both gates cleared → full, then out on the floor/ceiling schedule.
    Promise.all([document.fonts?.ready ?? Promise.resolve(), decoded, pageLoad]).then(() => {
      advance(1, "ready");
      const elapsed = performance.now() - started;
      window.setTimeout(leave, Math.max(minOn - elapsed, 0));
    });

    const ceiling = window.setTimeout(leave, maxOn);

    return () => {
      running = false;
      window.cancelAnimationFrame(raf);
      window.clearTimeout(ceiling);
      document.documentElement.classList.remove("is-loading");
    };
  }, []);

  if (state === "gone") return null;

  const filled = Math.round(progress * CELLS);
  const percent = Math.min(100, Math.round(progress * 100));

  return (
    <div className="loader" data-state={state} role="status" aria-live="polite">
      <div className="loader__plate">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="loader__swag"
          src={withBase("/assets/swag.png")}
          alt=""
          width={651}
          height={307}
          aria-hidden="true"
          draggable={false}
        />
        <span className="loader__glitch" aria-hidden="true" />
      </div>

      <div className="loader__meter" aria-hidden="true">
        {Array.from({ length: CELLS }).map((_, index) => (
          <span
            key={index}
            className="loader__cell"
            data-on={index < filled ? "" : undefined}
            data-live={index === filled - 1 ? "" : undefined}
          />
        ))}
      </div>

      <p className="loader__caption micro" aria-hidden="true">
        <span>{stageText[stage]}</span>
        <span className="loader__count">
          {String(percent).padStart(3, "0")}%
        </span>
        <span>Kathmandu · Nepal</span>
      </p>

      <span className="sr-only">{`Loading — ${stageText[stage]}`}</span>
    </div>
  );
}
