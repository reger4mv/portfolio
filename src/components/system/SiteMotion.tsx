"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import { setLenis } from "@/lib/scroll";

gsap.registerPlugin(ScrollTrigger);

/**
 * One motion controller for the whole page:
 *  · Lenis smooth scroll, wired into the GSAP ticker
 *  · reveal primitives driven by scroll
 *  · a pinned-nav flag on <html>
 * Everything is skipped or reduced when the user prefers reduced motion.
 */
export function SiteMotion() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;

    let lenis: Lenis | null = null;
    let tickerFn: ((time: number) => void) | null = null;

    if (!reduce) {
      lenis = new Lenis({
        lerp: 0.1,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.6,
      });
      setLenis(lenis);
      lenis.on("scroll", ScrollTrigger.update);
      tickerFn = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(tickerFn);
      gsap.ticker.lagSmoothing(0);
    }

    const onScroll = () => {
      root.dataset.scrolled = window.scrollY > 24 ? "true" : "false";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (reduce) return () => {
      window.removeEventListener("scroll", onScroll);
    };

    const ctx = gsap.context(() => {
      /* Line-mask headings: <div data-lines> <span class="line"><span/></span> */
      gsap.utils.toArray<HTMLElement>("[data-lines]").forEach((block) => {
        const lines = block.querySelectorAll<HTMLElement>(".line > span, .line > em");
        if (!lines.length) return;
        gsap.from(lines, {
          yPercent: 112,
          duration: 1.25,
          ease: "expo.out",
          stagger: 0.09,
          scrollTrigger: { trigger: block, start: "top 88%", once: true },
        });
      });

      /* Simple fade-rise reveals */
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        const delay = Number(el.dataset.revealDelay ?? 0);
        gsap.from(el, {
          y: 26,
          autoAlpha: 0,
          duration: 1,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: el.dataset.revealStart ?? "top 90%",
            once: true,
          },
        });
      });

      /* Staggered groups */
      gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((group) => {
        const items = group.querySelectorAll<HTMLElement>("[data-reveal-item]");
        gsap.from(items, {
          y: 22,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.07,
          scrollTrigger: { trigger: group, start: "top 88%", once: true },
        });
      });

      /* Hairlines that draw themselves */
      gsap.utils.toArray<HTMLElement>("[data-draw]").forEach((line) => {
        gsap.from(line, {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.4,
          ease: "expo.inOut",
          scrollTrigger: { trigger: line, start: "top 94%", once: true },
        });
      });

      /* The hero leaves the stage as you scroll into the page */
      const heroTitle = document.querySelector<HTMLElement>(".hero__title");
      if (heroTitle) {
        gsap.to(heroTitle, {
          yPercent: -7,
          autoAlpha: 0.15,
          ease: "none",
          scrollTrigger: {
            trigger: "#home",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      const heroCanvas = document.querySelector<HTMLElement>(".hero__canvas");
      if (heroCanvas) {
        gsap.to(heroCanvas, {
          yPercent: 6,
          ease: "none",
          scrollTrigger: {
            trigger: "#home",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      /* Slow drift on project plates */
      gsap.utils.toArray<HTMLElement>("[data-drift]").forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -3 },
          {
            yPercent: 3,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    });

    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
      window.removeEventListener("scroll", onScroll);
      if (tickerFn) gsap.ticker.remove(tickerFn);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
