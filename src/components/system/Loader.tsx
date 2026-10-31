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
 * Rules this keeps:
 *  · Wait for real work. `document.fonts.ready` plus the window load event.
 *    A floor of 620 ms stops the screen from strobing on a warm cache; a
 *    ceiling of 2.6 s stops it hanging on a slow network. Nothing is padded
 *    beyond that — no invented progress, no fake percentage.
 *  · No layout shift. The overlay is fixed and the page underneath is locked
 *    while it is up, so releasing it moves nothing.
 *  · Reduced motion: no flicker, no power-off; one 220 ms fade.
 *  · The artwork is `aria-hidden`; the live region carries the only words.
 */
export function Loader() {
  const [state, setState] = useState<"in" | "out" | "gone">("in");
  const doneRef = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const started = performance.now();
    const minOn = reduce ? 320 : 620;
    const maxOn = reduce ? 900 : 2600;
    let timer = 0;

    document.documentElement.classList.add("is-loading");

    const leave = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      setState("out");
      window.setTimeout(
        () => {
          setState("gone");
          document.documentElement.classList.remove("is-loading");
        },
        reduce ? 220 : 520,
      );
    };

    const ready = Promise.all([
      document.fonts?.ready ?? Promise.resolve(),
      new Promise<void>((resolve) => {
        if (document.readyState === "complete") resolve();
        else window.addEventListener("load", () => resolve(), { once: true });
      }),
    ]);

    ready.then(() => {
      const elapsed = performance.now() - started;
      timer = window.setTimeout(leave, Math.max(minOn - elapsed, 0));
    });

    // Nothing is allowed to hold the screen hostage.
    const ceiling = window.setTimeout(leave, maxOn);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(ceiling);
      document.documentElement.classList.remove("is-loading");
    };
  }, []);

  if (state === "gone") return null;

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
      <p className="loader__caption micro" aria-hidden="true">
        <span>Booting the archive</span>
        <span>Kathmandu · Nepal</span>
      </p>
      <span className="sr-only">Loading</span>
    </div>
  );
}
