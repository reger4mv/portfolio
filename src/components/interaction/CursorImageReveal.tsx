"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";

import { cardSize, placeCard } from "@/lib/reveal-placement";

/**
 * CURSOR IMAGE REVEAL
 *
 * Hovering — or keyboard-focusing — an element marked with `data-reveal-id`
 * pulls that item's image into the page as a floating object that follows the
 * pointer. Reference: the peaches.world reference list, where the work exists
 * as type until the cursor asks for it.
 *
 * How it behaves:
 *  · The card is a real object with a lag. Pointer coordinates are read into
 *    refs; a single GSAP ticker lerps the card toward them (no React state per
 *    mouse move, no layout reads in the loop).
 *  · It sits beside the pointer, not under it, and steps out of the way of the
 *    text being hovered: the side is chosen by whichever half of the viewport
 *    has room, then the card is pushed clear of the item's own label box.
 *  · Moving between items never blanks: the outgoing image fades while the
 *    incoming one settles, and the card resizes between their proportions.
 *  · Leaving fades the card down and stops the ticker. Nothing runs while the
 *    pointer is elsewhere.
 *
 * The layer is portalled to <body> because `position: fixed` inside the
 * horizontal work track would be trapped by its transform and clipped by the
 * viewport's overflow.
 *
 * Coarse pointers never mount the floating layer; items render their own
 * inline thumbnails instead (see `.reveal-item__thumb`).
 *
 * Reduced motion keeps the image but removes the float: it is placed once,
 * without rotation or lag, and simply fades.
 */

export interface RevealPreview {
  id: string;
  label: string;
  /** width / height of the media — each keeps its own composition. */
  ratio: number;
  media: React.ReactNode;
}

interface CursorImageRevealProps {
  items: RevealPreview[];
  children: React.ReactNode;
  /** Longest edge of the card, in px (viewport-relative caps are also applied). */
  size?: number;
  /** Distance kept between the pointer and the card, in px. */
  gap?: number;
  /** Image URLs to warm up on mount, so a switch never waits on the network. */
  preload?: string[];
}

const EASE_IN = "expo.out";
const EASE_OUT = "power2.in";

export function CursorImageReveal({
  items,
  children,
  size = 460,
  gap = 30,
  preload = [],
}: CursorImageRevealProps) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<Record<string, HTMLDivElement | null>>({});
  const [mounted, setMounted] = useState(false);
  const [fine, setFine] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Coarse pointers get inline thumbnails instead — no floating layer at all.
    setFine(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  useEffect(() => {
    preload.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [preload]);

  useEffect(() => {
    if (!mounted) return;

    const scope = scopeRef.current;
    const layer = layerRef.current;
    const card = cardRef.current;
    if (!scope || !layer || !card) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const byId = new Map(items.map((item) => [item.id, item]));

    let activeId: string | null = null;
    let activeLabel: HTMLElement | null = null;
    let visible = false;
    let keyboard = false;
    let tickerOn = false;
    let rotation = 0;
    let closeTimer = 0;

    const pointer = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 };
    const position = { ...pointer };
    const target = { ...pointer };
    const size_ = { w: 0, h: 0 };

    const clamp = (value: number, min: number, max: number) =>
      Math.min(Math.max(value, min), max);

    /* ── proportions & placement ───────────────────────────────
       Both are pure functions in `lib/reveal-placement` so the geometry can
       be tested without a browser. */
    const measure = (item: RevealPreview) =>
      cardSize(item.ratio, { w: window.innerWidth, h: window.innerHeight }, size);

    const place = (origin: { x: number; y: number }, rect: DOMRect | null, pointerMode: boolean) => {
      const next = placeCard({
        origin,
        label: rect,
        size: size_,
        viewport: { w: window.innerWidth, h: window.innerHeight },
        gap,
        pad: 18,
        mode: pointerMode ? "pointer" : "anchor",
      });
      target.x = next.x;
      target.y = next.y;
    };

    /* ── the float ─────────────────────────────────────────────
       One lerp, frame-rate independent, writing a single composited
       transform. Rotation follows horizontal velocity only, capped at 2.5°. */
    let lastTime = 0;
    const tick = (time: number) => {
      const dt = lastTime ? Math.min(time - lastTime, 0.064) : 1 / 60;
      lastTime = time;

      const k = reduce ? 1 : 1 - Math.pow(1 - 0.16, dt * 60);
      const dx = target.x - position.x;
      position.x += dx * k;
      position.y += (target.y - position.y) * k;

      if (!reduce) {
        const lean = clamp(dx * 0.09, -2.5, 2.5);
        rotation += (lean - rotation) * 0.12;
      }

      layer.style.transform = `translate3d(${position.x.toFixed(2)}px, ${position.y.toFixed(2)}px, 0)`;
      card.style.rotate = `${rotation.toFixed(2)}deg`;
    };

    const startTicker = () => {
      if (tickerOn || reduce) return;
      tickerOn = true;
      lastTime = 0;
      gsap.ticker.add(tick);
    };

    const stopTicker = () => {
      if (!tickerOn) return;
      tickerOn = false;
      gsap.ticker.remove(tick);
    };

    /* A leave is held for a beat. Rows touch, but borders and fast pointer
       paths can produce a one-frame exit; the card should never blink (or
       replay its entrance) because of it. */
    const cancelClose = () => {
      if (!closeTimer) return;
      window.clearTimeout(closeTimer);
      closeTimer = 0;
    };

    const scheduleClose = () => {
      if (closeTimer) return;
      closeTimer = window.setTimeout(() => {
        closeTimer = 0;
        close();
      }, 70);
    };

    /* ── open / switch ──────────────────────────────────────── */
    const open = (id: string, origin: { x: number; y: number }, el: HTMLElement, pointerMode: boolean) => {
      const item = byId.get(id);
      if (!item) return;
      cancelClose();

      const label = el.querySelector<HTMLElement>(".reveal-item__name") ?? el;
      activeLabel = label;
      const rect = label.getBoundingClientRect();

      size_.w = measure(item).w;
      size_.h = measure(item).h;

      gsap.to(card, {
        width: size_.w,
        height: size_.h,
        duration: visible ? (reduce ? 0 : 0.5) : 0,
        ease: "power3.out",
        overwrite: "auto",
      });

      place(origin, rect, pointerMode);

      if (!visible) {
        visible = true;
        position.x = target.x;
        position.y = target.y;
        rotation = 0;
        lastTime = 0;
        tick(gsap.ticker.time);

        const dirX =
          window.innerWidth - rect.right >= rect.left ? 1 : -1;
        gsap.killTweensOf(card);
        gsap.fromTo(
          card,
          {
            autoAlpha: 0,
            scale: reduce ? 1 : 0.86,
            clipPath: reduce
              ? "inset(0% 0% 0% 0%)"
              : dirX > 0
                ? "inset(0% 100% 0% 0%)"
                : "inset(0% 0% 0% 100%)",
          },
          {
            autoAlpha: 1,
            scale: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: reduce ? 0.2 : 0.75,
            ease: EASE_IN,
            overwrite: "auto",
          },
        );
        startTicker();
      }

      activeId = id;

      // Layered crossfade: both images are already in the DOM, so switching
      // can never flash an empty frame or reload a source.
      Object.entries(mediaRef.current).forEach(([key, node]) => {
        if (!node) return;
        if (key === id) {
          gsap.to(node, {
            autoAlpha: 1,
            scale: reduce ? 1 : 1,
            duration: reduce ? 0.12 : 0.55,
            ease: "power2.out",
            overwrite: "auto",
          });
        } else {
          gsap.to(node, {
            autoAlpha: 0,
            scale: reduce ? 1 : 1.04,
            duration: reduce ? 0.12 : 0.38,
            ease: EASE_OUT,
            overwrite: "auto",
          });
        }
      });

      scope.querySelectorAll<HTMLElement>("[data-reveal-id]").forEach((node) => {
        node.dataset.revealActive = String(node.dataset.revealId === id);
      });
    };

    /* ── close ──────────────────────────────────────────────── */
    const close = () => {
      if (!visible) return;
      visible = false;
      activeId = null;
      keyboard = false;
      stopTicker();
      gsap.to(card, {
        autoAlpha: 0,
        scale: reduce ? 1 : 0.94,
        duration: reduce ? 0.12 : 0.34,
        ease: EASE_OUT,
        overwrite: "auto",
      });
      scope.querySelectorAll<HTMLElement>("[data-reveal-id]").forEach((node) => {
        node.dataset.revealActive = "false";
      });
    };

    /* ── pointer tracking ───────────────────────────────────────
       Attached only while the card is on screen. */
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch" || !activeId) return;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      if (!activeLabel) return;
      place(pointer, activeLabel.getBoundingClientRect(), true);
    };

    let scrollFrame = 0;
    const onScroll = () => {
      if (!activeId || scrollFrame) return;
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = 0;
        // The page can move under a stationary pointer (the work track does
        // exactly that), so ask what is actually under the cursor now.
        const el = document.elementFromPoint(pointer.x, pointer.y);
        const item = el instanceof Element ? el.closest<HTMLElement>("[data-reveal-id]") : null;
        if (!item || !scope.contains(item)) {
          close();
        } else if (item.dataset.revealId !== activeId) {
          open(item.dataset.revealId!, pointer, item, true);
        }
      });
    };

    /* ── delegated triggers ───────────────────────────────── */
    const itemFrom = (target: EventTarget | null) =>
      target instanceof Element ? target.closest<HTMLElement>("[data-reveal-id]") : null;

    const onPointerOver = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const el = itemFrom(event.target);
      if (!el || !scope.contains(el)) return;
      keyboard = false;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      if (el.dataset.revealId === activeId) return;
      open(el.dataset.revealId!, pointer, el, true);
    };

    const onPointerOut = (event: PointerEvent) => {
      const from = itemFrom(event.target);
      if (!from) return;
      const to = itemFrom(event.relatedTarget);
      if (to === from) return;
      // Moving straight onto the next item: let pointerover hand over, so the
      // card never blinks between images.
      if (to && scope.contains(to)) return;
      scheduleClose();
    };

    const onFocusIn = (event: FocusEvent) => {
      const el = itemFrom(event.target);
      if (!el || !scope.contains(el)) return;
      keyboard = true;
      const rect = el.getBoundingClientRect();
      if (el.dataset.revealId === activeId) return;
      open(el.dataset.revealId!, { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }, el, false);
    };

    const onFocusOut = (event: FocusEvent) => {
      const from = itemFrom(event.target);
      if (!from) return;
      const to = itemFrom(event.relatedTarget);
      if (to && scope.contains(to)) return;
      if (keyboard) scheduleClose();
    };

    const onResize = () => {
      if (!activeId) return;
      const el = scope.querySelector<HTMLElement>(`[data-reveal-id="${cssEscape(activeId)}"]`);
      const item = byId.get(activeId);
      if (!el || !item) return;
      const dims = measure(item);
      size_.w = dims.w;
      size_.h = dims.h;
      gsap.set(card, { width: dims.w, height: dims.h });
      const label = el.querySelector<HTMLElement>(".reveal-item__name") ?? el;
      place(keyboard ? { x: rectCenter(el).x, y: rectCenter(el).y } : pointer, label.getBoundingClientRect(), !keyboard);
      position.x = target.x;
      position.y = target.y;
      tick(gsap.ticker.time);
    };

    scope.addEventListener("pointerover", onPointerOver);
    scope.addEventListener("pointerout", onPointerOut);
    scope.addEventListener("focusin", onFocusIn);
    scope.addEventListener("focusout", onFocusOut);

    // Passive, cheap, and only doing work while a card is on screen — the
    // float loop itself is the only thing that runs per frame.
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      scope.removeEventListener("pointerover", onPointerOver);
      scope.removeEventListener("pointerout", onPointerOut);
      scope.removeEventListener("focusin", onFocusIn);
      scope.removeEventListener("focusout", onFocusOut);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(scrollFrame);
      cancelClose();
      stopTicker();
      gsap.killTweensOf(card);
      Object.values(mediaRef.current).forEach((node) => node && gsap.killTweensOf(node));
      scope.querySelectorAll<HTMLElement>("[data-reveal-id]").forEach((node) => {
        node.dataset.revealActive = "false";
      });
      layer.style.removeProperty("transform");
      card.style.removeProperty("rotate");
    };
  }, [mounted, fine, items, size, gap]);

  return (
    <>
      <div className="reveal-scope" ref={scopeRef}>
        {children}
      </div>

      {mounted &&
        fine &&
        createPortal(
          <div className="reveal" ref={layerRef} aria-hidden="true">
            <div className="reveal__card" ref={cardRef}>
              {items.map((item) => (
                <div
                  className="reveal__media"
                  key={item.id}
                  ref={(node) => {
                    mediaRef.current[item.id] = node;
                  }}
                >
                  {item.media}
                </div>
              ))}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

/* helpers ─────────────────────────────────────────────────────────── */

function rectCenter(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

/** Minimal escaping for attribute selectors built from ids. */
function cssEscape(value: string) {
  return value.replace(/["\\]/g, "\\$&");
}
