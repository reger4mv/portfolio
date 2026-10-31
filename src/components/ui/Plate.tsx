"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export type PlateVariant = "rise" | "wipe" | "scale";

interface PlateProps {
  children: React.ReactNode;
  /** How the plate enters. Each project gets a different one. */
  variant?: PlateVariant;
  /** Vertical scroll parallax of the inner media, in percent. 0 disables. */
  parallax?: number;
  /** Pointer tilt, in degrees. 0 disables. */
  tilt?: number;
  /** Cursor state while hovering. */
  cursor?: "view" | "link";
  cursorLabel?: string;
  className?: string;
  caption?: React.ReactNode;
  /**
   * "scroll" — the plate reveals itself on vertical scroll (default).
   * "manual" — the plate is animated by an ancestor timeline instead, e.g.
   * inside the horizontal sequence where ScrollTrigger's vertical start
   * position would never trigger for an off-screen panel.
   */
  entry?: "scroll" | "manual";
}

/**
 * MATTE — the image/plate system.
 *
 * A plate is a designed object, not a thumbnail: a clipped frame, media that
 * moves at its own speed behind it, a pointer tilt that only bends a few
 * degrees, and a caption sitting inside the frame edge. Every project uses a
 * different entry (rise / horizontal wipe / scale-in) so no two reveals match.
 *
 * Reduced motion: all states are set to their resting values and scroll
 * listeners are never attached.
 */
export function Plate({
  children,
  variant = "rise",
  parallax = 10,
  tilt = 3,
  cursor = "view",
  cursorLabel = "View",
  className = "",
  caption,
  entry = "scroll",
}: PlateProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const frame = frameRef.current;
    const media = mediaRef.current;
    if (!root || !frame || !media) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      gsap.set(frame, { clearProps: "all" });
      gsap.set(media, { clearProps: "all" });
      return;
    }

    const ctx = gsap.context(() => {
      if (entry === "manual") {
        // Ancestor owns the motion; make sure nothing is left clipped.
        gsap.set(frame, { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set(media, { scale: 1, xPercent: 0 });
        return;
      }

      /* ── entry ─────────────────────────────────────────────
         The window (frame) is clipped, the media only scales — so the reveal
         is a true aperture opening rather than an image sliding inside it. */
      const trigger = { trigger: frame, start: "top 88%", once: true } as const;

      if (variant === "rise") {
        gsap.fromTo(
          frame,
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.out", scrollTrigger: trigger },
        );
      }

      if (variant === "wipe") {
        gsap.fromTo(
          frame,
          { clipPath: "inset(0% 100% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.out", scrollTrigger: trigger },
        );
      }

      gsap.fromTo(
        media,
        { scale: variant === "scale" ? 1.24 : 1.14, xPercent: variant === "wipe" ? -2 : 0 },
        {
          scale: 1,
          xPercent: 0,
          duration: 1.7,
          ease: "expo.out",
          scrollTrigger: trigger,
        },
      );

      if (captionRef.current) {
        gsap.from(captionRef.current, {
          autoAlpha: 0,
          y: 10,
          duration: 0.8,
          delay: 0.45,
          ease: "power2.out",
          scrollTrigger: { trigger: frame, start: "top 88%", once: true },
        });
      }

      if (variant === "scale") {
        gsap.fromTo(
          frame,
          { scale: 0.9 },
          {
            scale: 1,
            duration: 1.5,
            ease: "expo.out",
            scrollTrigger: { trigger: frame, start: "top 88%", once: true },
          },
        );
      }

      /* ── scroll parallax inside the frame ──────────────── */
      if (parallax > 0) {
        gsap.fromTo(
          media,
          { yPercent: -parallax },
          {
            yPercent: parallax,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          },
        );
      }
    }, root);

    /* ── pointer tilt ─────────────────────────────────────── */
    let cleanupTilt = () => {};
    const fine = window.matchMedia("(pointer: fine)").matches;

    if (tilt > 0 && fine) {
      const rotX = gsap.quickTo(frame, "rotationX", { duration: 0.7, ease: "power3.out" });
      const rotY = gsap.quickTo(frame, "rotationY", { duration: 0.7, ease: "power3.out" });

      const onMove = (event: PointerEvent) => {
        const rect = root.getBoundingClientRect();
        const relX = (event.clientX - rect.left) / rect.width - 0.5;
        const relY = (event.clientY - rect.top) / rect.height - 0.5;
        rotY(relX * tilt * 2);
        rotX(-relY * tilt * 2);
      };
      const onLeave = () => {
        rotX(0);
        rotY(0);
      };

      root.addEventListener("pointermove", onMove);
      root.addEventListener("pointerleave", onLeave);
      cleanupTilt = () => {
        root.removeEventListener("pointermove", onMove);
        root.removeEventListener("pointerleave", onLeave);
      };
    }

    return () => {
      cleanupTilt();
      ctx.revert();
    };
  }, [variant, parallax, tilt, entry]);

  return (
    <figure
      className={`matte matte--${variant} ${className}`}
      ref={rootRef}
      data-cursor={cursor}
      data-cursor-label={cursorLabel}
    >
      <div className="matte__frame" ref={frameRef}>
        <div className="matte__media" ref={mediaRef}>
          {children}
        </div>
        <span className="matte__edge" aria-hidden="true" />
      </div>
      {caption ? (
        <figcaption className="matte__caption" ref={captionRef}>
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
