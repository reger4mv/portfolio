"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import gsap from "gsap";

import { SceneBoundary } from "@/components/system/SceneBoundary";
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
  const fadeRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      const chars = titleRef.current?.querySelectorAll(".char");
      const tl = gsap.timeline({ delay: 0.35 });

      if (chars?.length) {
        tl.from(chars, {
          yPercent: 118,
          opacity: 0,
          duration: 1.15,
          ease: "expo.out",
          stagger: { each: 0.032, from: "start" },
        });
      }

      const sup = titleRef.current?.querySelector(".hero__sup");
      if (sup) {
        tl.from(sup, { autoAlpha: 0, y: 12, duration: 0.9, ease: "power2.out" }, 0.75);
      }

      const fades = fadeRefs.current.filter(Boolean) as HTMLElement[];
      if (fades.length) {
        tl.from(
          fades,
          { y: 18, autoAlpha: 0, duration: 0.9, ease: "power3.out", stagger: 0.09 },
          "-=0.65",
        );
      }
    });

    return () => ctx.revert();
  }, []);

  /**
   * A restrained pointer reaction on the headline: each line slides by a
   * couple of pixels in opposite directions. Skipped for coarse pointers and
   * reduced motion, and it never touches the entrance/scroll transforms
   * because it only writes `x` on the line boxes.
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
      setters.forEach((set, index) => {
        const dir = index % 2 === 0 ? 1 : -1;
        set(nx * 9 * dir);
      });
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
      className="hero shell"
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
      <div className="hero__grid" aria-hidden="true">
        {Array.from({ length: 12 }).map((_, index) => (
          <span key={index} />
        ))}
      </div>

      <div className="hero__inner">
        <div className="hero__top">
          <p className="mono" ref={(node) => void (fadeRefs.current[0] = node)}>
            Portfolio — 2026
            <br />
            Set in Space Grotesk
          </p>
          <p className="mono" ref={(node) => void (fadeRefs.current[1] = node)}>
            Kathmandu, Nepal
            <br />
            27.7172° N / 85.3240° E
          </p>
        </div>

        <h1 className="hero__title" ref={titleRef}>
          <span className="sr-only">
            {`${site.fullName} — creative developer, ${site.role.toLowerCase()} based in ${site.location}.`}
          </span>
          <span className="hero__line" aria-hidden="true">
            <Line text={site.firstName} />
            <span className="hero__sup">
              <span className="serif">creative developer</span>
              <span className="mono">self-taught</span>
            </span>
          </span>
          <span className="hero__line" aria-hidden="true">
            <Line text={site.lastName} />
          </span>
        </h1>

        <div className="hero__bottom">
          <ul className="hero__meta">
            {site.heroMeta.map((item) => (
              <li key={item}>
                <b aria-hidden="true">◆</b>
                {item}
              </li>
            ))}
          </ul>

          <p
            className="hero__desc"
            ref={(node) => void (fadeRefs.current[2] = node)}
          >
            {site.heroDescription}
          </p>

          <div className="hero__coords">
            <button
              type="button"
              className="hero__scroll"
              onClick={() => scrollToId("about")}
            >
              <span className="hero__scroll-label">Scroll to explore</span>
              <span className="hero__scroll-line" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
