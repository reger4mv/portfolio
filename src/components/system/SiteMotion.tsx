"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import { setLenis } from "@/lib/scroll";

gsap.registerPlugin(ScrollTrigger);

/**
 * THE MOTION VOCABULARY
 *
 * One controller, but not one animation. Each primitive has a distinct job and
 * a distinct shape, so no two sections arrive the same way:
 *
 *   data-lines      display headings rise out of a mask, line by line
 *   data-mask       long copy is unclipped from the top, not faded
 *   data-grow       vertical rules extend instead of fading in
 *   data-shift      opposing horizontal drift (scrub) for wide type
 *   data-reveal     the plain fade-up, used only where nothing else fits
 *   data-reveal-group / -item  staggered lists
 *
 * Scroll is handled by Lenis, wired into the GSAP ticker so both share one
 * clock. Everything is skipped for prefers-reduced-motion — in that case all
 * content is simply present and readable.
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

    if (reduce) {
      return () => {
        window.removeEventListener("scroll", onScroll);
      };
    }

    const ctx = gsap.context(() => {
      /* ── display headings rise out of a mask ───────────── */
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

      /* ── long copy unclips from the top ────────────────── */
      gsap.utils.toArray<HTMLElement>("[data-mask]").forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(0% 0% 100% 0%)", y: 18 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            y: 0,
            duration: 1.3,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          },
        );
      });

      /* ── vertical rules extend ─────────────────────────── */
      gsap.utils.toArray<HTMLElement>("[data-grow]").forEach((el) => {
        gsap.from(el, {
          scaleY: 0,
          transformOrigin: "top center",
          duration: 1.4,
          ease: "expo.inOut",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      });

      /* ── the plain fade-up, used sparingly ─────────────── */
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 24,
          autoAlpha: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((group) => {
        const items = group.querySelectorAll<HTMLElement>("[data-reveal-item]");
        gsap.from(items, {
          y: 20,
          autoAlpha: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: { trigger: group, start: "top 90%", once: true },
        });
      });

      /* ── wide type drifts apart as the section arrives ─── */
      gsap.utils.toArray<HTMLElement>("[data-shift]").forEach((el) => {
        const dir = el.dataset.shift === "right" ? 1 : -1;
        gsap.fromTo(
          el,
          { xPercent: dir * -1.6 },
          {
            xPercent: dir * 1.6,
            ease: "none",
            scrollTrigger: {
              trigger: el.closest("section") ?? el,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          },
        );
      });

      /* ── hero: type and canvas leave at different speeds ─ */
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
    });

    /* Late-loading fonts change layout heights; re-measure once.
       Deliberately not calling ScrollTrigger.refresh() on every resize —
       Lenis + ScrollTrigger handle that themselves. */
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

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
