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
 * On desktop the four principles sit on a horizontal track: the section pins,
 * vertical scroll drives the track left, and a hairline underneath reports
 * progress through it. Below 1024px, and for anyone who prefers reduced
 * motion, the same markup is a plain vertical list — no pin, no translation.
 */
export function Creed() {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    const bar = barRef.current;
    if (!pin || !track) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () =>
        Math.max(track.scrollWidth - pin.clientWidth, 0);

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () => `+=${distance() + window.innerHeight * 0.35}`,
          pin: true,
          scrub: 0.7,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (bar) bar.style.transform = `scaleX(${self.progress.toFixed(3)})`;
          },
        },
      });

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        gsap.set(track, { clearProps: "transform" });
      };
    });

    // Fonts landing late shifts track width — re-measure once they are in.
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    return () => mm.revert();
  }, []);

  return (
    <section id="approach" className="section creed-section" aria-labelledby="creed-title">
      <div className="shell">
        <SectionHeading index="05" label="Approach" note="Four working principles" />
      </div>

      <div className="creed__pin" ref={pinRef}>
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
            showing up in the work — the things I check a project against before
            I call it done.
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
    </section>
  );
}
