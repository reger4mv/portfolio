"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { principles } from "@/data/philosophy";
import { SectionHeading } from "@/components/sections/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

/**
 * Approach — the one section that moves sideways.
 *
 * Implementation note: rather than pinning (which is fragile under an
 * `overflow-x: clip` body), the section is a tall stage containing a
 * `position: sticky` viewport. Scroll progress through the stage drives the
 * track's x translate. No pinning, no layout jumps, and if the JS never runs
 * the stage simply collapses and the track reads as a normal row.
 *
 * Below 1024px, or with reduced motion, the stage height stays auto and the
 * principles stack vertically — the JS never arms itself.
 */
export function Creed() {
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const track = trackRef.current;
    const bar = barRef.current;
    if (!stage || !track) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      let tween: gsap.core.Tween | null = null;

      const measure = () => {
        // How far the row overflows its viewport.
        const distance = Math.max(track.scrollWidth - track.clientWidth, 0);

        // Stage = one viewport of "hold" + the distance the row must travel.
        stage.style.height = `${Math.round(window.innerHeight + distance)}px`;

        if (tween) {
          tween.scrollTrigger?.kill();
          tween.kill();
        }
        gsap.set(track, { x: 0 });

        tween = gsap.to(track, {
          x: -distance,
          ease: "none",
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (bar) bar.style.transform = `scaleX(${self.progress.toFixed(3)})`;
            },
          },
        });
      };

      measure();

      // Fonts and viewport changes alter the row width — re-measure, debounced.
      let frame = 0;
      const onResize = () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(measure);
      };
      window.addEventListener("resize", onResize);
      document.fonts?.ready.then(measure);

      return () => {
        window.removeEventListener("resize", onResize);
        cancelAnimationFrame(frame);
        tween?.scrollTrigger?.kill();
        tween?.kill();
        stage.style.removeProperty("height");
        gsap.set(track, { clearProps: "transform" });
        if (bar) bar.style.removeProperty("transform");
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section id="approach" className="section creed-section" aria-labelledby="creed-title">
      <div className="shell">
        <SectionHeading index="05" label="Approach" note="Four working principles" />
      </div>

      <div className="creed__stage" ref={stageRef}>
        <div className="creed__pin">
          <div className="shell creed__intro">
            <h2 id="creed-title" className="creed__statement" data-lines>
              <span className="line">
                <span>Good design</span>
              </span>
              <span className="line">
                <span>isn&apos;t just how it looks.</span>
              </span>
              <span className="line">
                <span>
                  It&apos;s how it <em>feels.</em>
                </span>
              </span>
            </h2>
            <p className="creed__aside" data-reveal>
              I don&apos;t have a manifesto. These are the four habits that keep
              showing up in the work — the things I check a project against
              before I call it done.
            </p>
          </div>

          <div className="creed__viewport">
            <div className="creed__track" ref={trackRef}>
              {principles.map((principle) => (
                <article className="creed__panel" key={principle.index}>
                  <span className="creed__panel-index mono">{principle.index}</span>
                  <h3 className="creed__panel-title">{principle.title}</h3>
                  <p className="creed__panel-body">{principle.body}</p>
                  <span className="creed__panel-rule" aria-hidden="true" />
                </article>
              ))}
            </div>
          </div>

          <div className="shell creed__meter">
            <span className="mono">Scroll — the principles move sideways</span>
            <span className="creed__meter-bar">
              <span className="creed__meter-fill" ref={barRef} />
            </span>
            <span className="mono">04</span>
          </div>
        </div>
      </div>
    </section>
  );
}
