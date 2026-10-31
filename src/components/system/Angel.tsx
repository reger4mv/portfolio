"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import { withBase } from "@/data/site";

/**
 * "SEEN THIS ANGEL?"
 *
 * The supplied artwork, used as a graphic signature rather than as a label.
 * Its own black field is dropped out with `screen` blending, so only the
 * lettering sits on the page and the mark can overlap any section without a
 * visible card behind it.
 *
 * Placements are deliberate, never ambient: one behind the hero, one in the
 * negative space beside the about column, one inside the work handoff, one
 * above the footer. Nothing is placed over copy — the marks sit in the margin
 * and are `pointer-events: none`, `aria-hidden`, behind the content layer.
 *
 * Motion: 60–90 px of scroll parallax, scrubbed, and nothing else. Under
 * reduced motion they are simply still.
 */

let motionBound = false;

function bindParallax() {
  if (motionBound) return;
  motionBound = true;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  const ctx = gsap.context(() => {
    gsap.utils.toArray<HTMLElement>("[data-angel]").forEach((el, index) => {
      const drift = index % 2 === 0 ? 1 : -1;
      gsap.fromTo(
        el,
        { y: -34 * drift },
        {
          y: 38 * drift,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement ?? el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    });
  });
}

export function Angel({
  variant,
  scale = 1,
  className,
}: {
  variant: string;
  scale?: number;
  className?: string;
}) {
  useEffect(() => {
    bindParallax();
  }, []);

  return (
    <figure
      className={`angel angel--${variant}${className ? ` ${className}` : ""}`}
      data-angel={variant}
      style={{ "--angel-scale": scale } as React.CSSProperties}
      aria-hidden="true"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={withBase("/assets/angel.png")}
        alt=""
        width={447}
        height={447}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    </figure>
  );
}
