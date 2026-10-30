"use client";

import { useRef, useState } from "react";

import { depthLabels, skills } from "@/data/skills";
import { SectionHeading } from "@/components/sections/SectionHeading";

export function Skills() {
  const [activeId, setActiveId] = useState(skills[0].id);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const active = skills.find((group) => group.id === activeId) ?? skills[0];
  const activeIndex = skills.findIndex((group) => group.id === active.id);

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
      <SectionHeading
        index="04"
        label="Capabilities"
        note="Working · Learning · Exploring"
      />

      <h2 className="display work__heading" id="skills-title" data-lines>
        <span className="line">
          <span>What I work</span>
        </span>
        <span className="line">
          <span>
            with<em>.</em>
          </span>
        </span>
      </h2>

      <div className="index">
        <div
          className="index__list"
          role="tablist"
          aria-label="Skill areas"
          aria-orientation="vertical"
          onKeyDown={onKeyDown}
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

      <p className="footnote" data-reveal>
        Depth labels describe how each tool is actually used today — working,
        learning, or exploring. No scores, no invented expertise.
      </p>
    </section>
  );
}
