"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import gsap from "gsap";

import { SceneBoundary } from "@/components/system/SceneBoundary";
import { Angel } from "@/components/system/Angel";
import { Sigil } from "@/components/graphics/Sigil";
import { site } from "@/data/site";
import { useHasWebGL } from "@/hooks/useHasWebGL";
import { useInView } from "@/hooks/useInView";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useSceneQuality } from "@/hooks/useSceneQuality";
import { scrollToId } from "@/lib/scroll";

const MainScene = dynamic(() => import("@/scenes/MainScene"), { ssr: false });

const Line = ({ text }: { text: string }) => (
  <>
    {text.split("").map((char, index) => (
      <span className="char" key={`${char}-${index}`} aria-hidden="true">
        {char}
      </span>
    ))}
  </>
);

export function Hero() {
  const webgl = useHasWebGL();
  const quality = useSceneQuality();
  const reducedMotion = usePrefersReducedMotion();
  const { ref: sectionRef, inView } = useInView<HTMLElement>("240px");
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      const chars = titleRef.current?.querySelectorAll(".char");
      const tl = gsap.timeline({ delay: 0.15 });

      if (chars?.length) {
        tl.from(chars, {
          yPercent: 118,
          opacity: 0,
          duration: 1.05,
          ease: "expo.out",
          stagger: { each: 0.028, from: "start" },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  /**
   * Pointer reaction on the masthead: the two lines pull in opposite
   * directions by a few pixels. Fine pointers only, never under reduced
   * motion, and it writes `x` only — the entrance and scroll transforms are
   * untouched.
   */
  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    const lines = Array.from(title.querySelectorAll<HTMLElement>(".hero__line"));
    if (!lines.length) return;

    const setters = lines.map((line) =>
      gsap.quickTo(line, "x", { duration: 1.1, ease: "power3.out" }),
    );

    const onMove = (event: PointerEvent) => {
      const nx = event.clientX / window.innerWidth - 0.5;
      setters.forEach((set, index) => set(nx * 14 * (index % 2 === 0 ? 1 : -1)));
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      lines.forEach((line) => gsap.set(line, { clearProps: "x" }));
    };
  }, []);

  const showScene = webgl === true;

  return (
    <section
      id="home"
      ref={sectionRef}
      className="hero reg--ink"
      aria-label="Introduction"
    >
      {webgl === false ? (
        <div className="hero__fallback" aria-hidden="true">
          <svg className="hero__fallback-rings" viewBox="0 0 400 400">
            <circle cx="200" cy="200" r="188" />
            <circle cx="200" cy="200" r="142" />
            <ellipse cx="200" cy="200" rx="64" ry="176" />
            <ellipse cx="200" cy="200" rx="176" ry="58" />
          </svg>
        </div>
      ) : null}

      {showScene ? (
        <div className="hero__canvas">
          <SceneBoundary fallback={null}>
            <MainScene
              quality={quality}
              active={inView}
              motion={!reducedMotion}
            />
          </SceneBoundary>
        </div>
      ) : null}

      <div className="hero__veil" aria-hidden="true" />
      <Angel variant="hero" />

      <div className="hero__sigil" aria-hidden="true">
        <Sigil name="spear" strokeWidth={0.7} />
      </div>

      <span className="hero__rail micro" aria-hidden="true">
        Portfolio — MMXXVI · Kathmandu · Nepal
      </span>

      <div className="hero__inner">
        <div className="hero__mast">
          <span className="micro">Sys/001 — Creative developer</span>
          <span className="micro hero__mast-mid">
            Self-taught · Nepal
          </span>
          <span className="micro">27.7172° N / 85.3240° E</span>
        </div>

        <h1 className="hero__title" ref={titleRef}>
          <span className="sr-only">
            {`${site.fullName} — creative developer, ${site.role.toLowerCase()} based in ${site.location}.`}
          </span>
          <span className="hero__line chrome" aria-hidden="true">
            <Line text={site.firstName} />
          </span>
          <span className="hero__line hero__line--b chrome" aria-hidden="true">
            <Line text={site.lastName} />
          </span>
        </h1>

        <p className="hero__aside micro">
          <span>[ interface · interaction · 3D ]</span>
          <span className="hero__aside-alt">open to work</span>
        </p>

        <div className="hero__foot">
          <p className="hero__desc">{site.heroDescription}</p>

          <ul className="hero__meta">
            {site.heroMeta.map((item, index) => (
              <li key={item}>
                <b aria-hidden="true">{String(index + 1).padStart(2, "0")}</b>
                {item}
              </li>
            ))}
          </ul>

          <button
            type="button"
            className="hero__scroll"
            onClick={() => scrollToId("about")}
          >
            <span className="hero__scroll-label micro">Enter</span>
            <span className="hero__scroll-line" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
