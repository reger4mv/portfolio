"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import { depthLabels, skills } from "@/data/skills";
import { SectionMark } from "@/components/sections/SectionMark";

/**
 * Capabilities — a typographic index.
 *
 * One marker slides between rows instead of every row lighting itself up, and
 * the detail panel swaps through a clipped wipe. Arrow keys move the marker
 * too, so the interaction is not hover-only.
 */
export function Skills() {
  const [activeId, setActiveId] = useState(skills[0].id);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const markerRef = useRef<HTMLSpanElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const panelBodyRef = useRef<HTMLDivElement>(null);

  const active = skills.find((group) => group.id === activeId) ?? skills[0];
  const activeIndex = skills.findIndex((group) => group.id === active.id);

  /* Marker follows the active row. */
  useEffect(() => {
    const marker = markerRef.current;
    const list = listRef.current;
    const row = tabRefs.current[activeIndex];
    if (!marker || !list || !row) return;

    const top = row.offsetTop;
    const height = row.offsetHeight;
    marker.style.transform = `translateY(${top}px)`;
    marker.style.height = `${height}px`;
  }, [activeIndex]);

  /* Panel content wipes in when the selection changes. */
  const first = useRef(true);
  useEffect(() => {
    const body = panelBodyRef.current;
    if (!body) return;
    if (first.current) {
      first.current = false;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tween = gsap.fromTo(
      body,
      { clipPath: "inset(0% 0% 100% 0%)", y: 10, opacity: 0.4 },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        y: 0,
        opacity: 1,
        duration: 0.65,
        ease: "expo.out",
        overwrite: true,
      },
    );
    return () => {
      tween.kill();
    };
  }, [activeId]);

  const move = (next: number) => {
    const index = (next + skills.length) % skills.length;
    setActiveId(skills[index].id);
    tabRefs.current[index]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        event.preventDefault();
        move(activeIndex + 1);
        break;
      case "ArrowUp":
      case "ArrowLeft":
        event.preventDefault();
        move(activeIndex - 1);
        break;
      case "Home":
        event.preventDefault();
        move(0);
        break;
      case "End":
        event.preventDefault();
        move(skills.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <section id="skills" className="section shell" aria-labelledby="skills-title">
      <SectionMark
        index="04"
        label="Capabilities"
        note="Working · learning · exploring"
        variant="ledger"
      />

      <div className="index__intro">
        <h2 className="display" id="skills-title" data-lines>
          <span className="line">
            <span>What I work</span>
          </span>
          <span className="line">
            <span>
              with<em>.</em>
            </span>
          </span>
        </h2>
      </div>

      <div className="index">
        <div className="index__list-wrap">
          <span className="index__marker" ref={markerRef} aria-hidden="true" />
          <div
            className="index__list"
            role="tablist"
            aria-label="Skill areas"
            aria-orientation="vertical"
            onKeyDown={onKeyDown}
            ref={listRef}
            data-reveal-group
          >
            {skills.map((group, index) => {
              const selected = group.id === active.id;
              return (
                <button
                  key={group.id}
                  type="button"
                  role="tab"
                  id={`tab-${group.id}`}
                  aria-selected={selected}
                  aria-controls={`panel-${group.id}`}
                  tabIndex={selected ? 0 : -1}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  className="index__row"
                  onClick={() => setActiveId(group.id)}
                  data-reveal-item
                >
                  <span className="index__num">{group.index}</span>
                  <span className="index__label">{group.label}</span>
                  <span className="index__count">
                    {String(group.entries.length).padStart(2, "0")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div
          className="index__panel"
          role="tabpanel"
          id={`panel-${active.id}`}
          aria-labelledby={`tab-${active.id}`}
          tabIndex={0}
        >
          <div className="index__panel-top">
            <span className="mono">{active.label}</span>
            <span className="mono">Index {active.index}</span>
          </div>
          <div ref={panelBodyRef}>
            <p className="index__panel-summary">{active.summary}</p>
            <div className="index__entries">
              {active.entries.map((entry) => (
                <div className="index__entry" key={entry.name}>
                  <span className="index__entry-name">
                    {entry.name}
                    {entry.note ? <small>{entry.note}</small> : null}
                  </span>
                  <span className="index__depth" data-depth={entry.depth}>
                    {depthLabels[entry.depth]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="footnote" data-reveal>
        Depth labels describe how each tool is actually used today — working,
        learning, or exploring. No scores, no invented expertise.
      </p>
    </section>
  );
}
