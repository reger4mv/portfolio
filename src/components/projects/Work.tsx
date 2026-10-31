"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { projects, type Project } from "@/data/projects";
import { ProjectPlate } from "@/components/projects/ProjectPlate";
import { ProjectStudy, studyRatios } from "@/components/projects/studies";
import { Angel } from "@/components/system/Angel";
import { CursorImageReveal, type RevealPreview } from "@/components/interaction/CursorImageReveal";
import { SplitText } from "@/components/ui/SplitText";
import { scrollToY } from "@/lib/scroll";

gsap.registerPlugin(ScrollTrigger);

/**
 * WORK — a horizontal journey.
 *
 * Vertical scroll moves a track of near-full-viewport panels sideways. The
 * section is a tall stage holding a `position: sticky` viewport; the stage's
 * extra height *is* the horizontal travel, calculated from the track's real
 * scrollWidth so it stays correct at any viewport size.
 *
 * Deliberate choices:
 *  · No pinning. A sticky viewport can't desync from the page, survives
 *    `overflow-x: clip`, and if the JS never runs the stage simply collapses
 *    and every panel stacks vertically — the content is never trapped.
 *  · Native scrolling is untouched: no wheel listeners, no hijacking. Scroll
 *    speed and direction are whatever the visitor's device does.
 *  · Below 1024px, on coarse pointers, or with reduced motion the same markup
 *    becomes a normal vertical stack of full-height panels.
 */
export function Work() {
  const stageRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const jumpRef = useRef<(slug: string) => void>(() => {});

  /* One preview per project — the same studies the plates show, plus any real
     screenshot once `preview` is filled in on a project. */
  const previews = useMemo<RevealPreview[]>(
    () =>
      projects.map((project) => ({
        id: project.slug,
        label: project.name,
        ratio: studyRatios[project.mark],
        media: project.preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={project.preview.src} alt="" loading="lazy" decoding="async" />
        ) : (
          <ProjectStudy mark={project.mark} accent={project.accent} label={false} />
        ),
      })),
    [],
  );

  const preload = useMemo(
    () => projects.flatMap((project) => (project.preview ? [project.preview.src] : [])),
    [],
  );

  useEffect(() => {
    const stage = stageRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!stage || !viewport || !track) return;
    const pin = viewport.closest<HTMLElement>(".sequence__pin");

    // Fallback: when the track is stacked, jumping is just a vertical scroll.
    jumpRef.current = (slug: string) => {
      const panel = track.querySelector<HTMLElement>(`[data-panel="${slug}"]`);
      if (!panel) return;
      scrollToY(panel.getBoundingClientRect().top + window.scrollY);
    };

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (min-height: 600px) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      let tween: gsap.core.Timeline | null = null;
      let frame = 0;
      let jumpPoints: Record<string, number> = {};

      const panels = () =>
        Array.from(track.querySelectorAll<HTMLElement>(".panel"));

      const build = () => {
        // Real travel: how far the track overflows its own viewport.
        const travel = Math.max(track.scrollWidth - viewport.clientWidth, 0);

        // Stage carries one held viewport plus the travel. Measured from the
        // sticky element itself so the numbers can never disagree.
        const hold = pin?.offsetHeight ?? viewport.clientHeight;
        stage.style.height = travel > 0 ? `${Math.round(hold + travel)}px` : "";

        if (tween) {
          tween.scrollTrigger?.kill();
          tween.kill();
        }
        gsap.set(track, { x: 0 });

        if (travel <= 0) return;

        const vw = viewport.clientWidth;

        // Where each project sits along the journey, in document pixels: the
        // stage top plus the panel's own offset. No magic numbers — this is
        // the same geometry the scroll trigger uses.
        const stageTop = stage.getBoundingClientRect().top + window.scrollY;
        jumpPoints = {};
        panels().forEach((panel) => {
          const slug = panel.dataset.panel;
          if (slug) jumpPoints[slug] = stageTop + panel.offsetLeft;
        });
        jumpRef.current = (slug: string) => {
          const y = jumpPoints[slug];
          if (y != null) scrollToY(y + 2);
        };
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.7,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (barRef.current) {
                barRef.current.style.transform = `scaleX(${self.progress.toFixed(4)})`;
              }
            },
          },
        });

        // 1) the journey itself — the only source of horizontal motion
        tl.to(track, { x: -travel, ease: "none", duration: 1 }, 0);

        // 2) per-panel inner motion, timed against the same 0→1 progress so it
        //    stays locked to the track no matter how many panels there are.
        panels().forEach((panel) => {
          const start = panel.offsetLeft;
          const width = panel.offsetWidth;

          // Panel is on screen between these two progress values.
          const inAt = Math.max(0, (start - vw) / travel);
          const outAt = Math.min(1, (start + width) / travel);
          const span = outAt - inAt;
          if (span <= 0) return;

          const media = panel.querySelector<HTMLElement>(".matte__media");
          const type = panel.querySelector<HTMLElement>("[data-drift]");
          const frame = panel.querySelector<HTMLElement>(".matte__frame");

          if (media) {
            tl.fromTo(
              media,
              { xPercent: 9 },
              { xPercent: -9, ease: "none", duration: span },
              inAt,
            );
          }

          if (type) {
            // Type drifts *against* the track, so words sit still while the
            // world slides — the visual moves faster than the page.
            tl.fromTo(
              type,
              { xPercent: -5 },
              { xPercent: 5, ease: "none", duration: span },
              inAt,
            );
          }

          if (frame) {
            // Controlled scale: panels settle as they take focus, ease off as
            // they leave. Never more than 4%.
            tl.fromTo(
              frame,
              { scale: 1.045 },
              { scale: 1, ease: "power1.out", duration: span * 0.45 },
              inAt,
            ).to(frame, { scale: 0.975, ease: "power1.in", duration: span * 0.4 }, inAt + span * 0.6);
          }
        });

        tween = tl;
      };

      build();
      ScrollTrigger.refresh();

      const onResize = () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          build();
          ScrollTrigger.refresh();
        });
      };

      window.addEventListener("resize", onResize);
      document.fonts?.ready.then(onResize);

      return () => {
        window.removeEventListener("resize", onResize);
        cancelAnimationFrame(frame);
        tween?.scrollTrigger?.kill();
        tween?.kill();
        stage.style.removeProperty("height");
        jumpRef.current = (slug: string) => {
          const panel = track.querySelector<HTMLElement>(`[data-panel="${slug}"]`);
          if (!panel) return;
          scrollToY(panel.getBoundingClientRect().top + window.scrollY);
        };
        gsap.set(track, { clearProps: "transform" });
        gsap.set(
          track.querySelectorAll(".matte__media, [data-drift], .matte__frame"),
          { clearProps: "transform" },
        );
        if (barRef.current) barRef.current.style.removeProperty("transform");
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="work"
      className="section shell sequence reg--ink"
      aria-labelledby="work-title"
    >

      <div className="sequence__stage" ref={stageRef}>
        <div className="sequence__pin">
          <div className="sequence__viewport" ref={viewportRef}>
            <div className="sequence__track" ref={trackRef}>
              {/* 01 — title card */}
              <article className="panel panel--intro">
                <Angel variant="work" />
                <div className="panel__inner">
                  <p className="panel__eyebrow mono">02 — Selected work</p>
                  <h2 className="panel__display" id="work-title">
                    <span className="line">
                      <span>Things I&apos;m</span>
                    </span>
                    <span className="line">
                      <span>
                        building<em>.</em>
                      </span>
                    </span>
                  </h2>
                  <p className="panel__lede">
                    Three projects, at three different stages. Each one is
                    labelled for what it is right now rather than what it might
                    become.
                  </p>
                </div>
                <span className="panel__edge mono" aria-hidden="true">
                  Concept · In progress · Ongoing
                </span>
              </article>

              {/* 02–04 — one panel per project, each composed differently */}
              {projects.map((project, index) => (
                <ProjectPanel key={project.slug} project={project} position={index} />
              ))}

              {/* 05 — index / handoff: the work as type, until the cursor
                  asks for the image. */}
              <article className="panel panel--outro">
                <div className="panel__inner panel__inner--index">
                  <header className="panel__index-head">
                    <p className="panel__eyebrow mono">Index — end of sequence</p>
                    <p className="panel__closing">
                      Three things in three different states, labelled honestly.
                    </p>
                    <p className="panel__hint mono">
                      <span className="panel__hint--pointer">
                        Hover a name to pull it back to the cursor · click to jump
                      </span>
                      <span className="panel__hint--touch">
                        Tap a name to jump to it
                      </span>
                    </p>
                  </header>

                  <CursorImageReveal items={previews} preload={preload}>
                    <ol className="reveal-list">
                      {projects.map((project, index) => (
                        <li key={project.slug}>
                          <a
                            className="reveal-item"
                            href={`#panel-${project.slug}`}
                            data-reveal-id={project.slug}
                            data-cursor="link"
                            data-cursor-accent={project.accent}
                            onClick={(event) => {
                              event.preventDefault();
                              jumpRef.current(project.slug);
                            }}
                          >
                            <span className="reveal-item__num mono">
                              {String(index + 2).padStart(2, "0")}
                            </span>
                            <span className="reveal-item__name">{project.name}</span>
                            <span className="reveal-item__status mono">
                              {project.statusLabel}
                            </span>
                            <span className="reveal-item__thumb" aria-hidden="true">
                              <ProjectStudy
                                mark={project.mark}
                                accent={project.accent}
                                label={false}
                              />
                            </span>
                            <span className="reveal-item__arrow" aria-hidden="true">
                              →
                            </span>
                          </a>
                        </li>
                      ))}
                    </ol>
                  </CursorImageReveal>

                  <a className="panel__next" href="#experiments">
                    Next — the live 3D scene
                    <span aria-hidden="true">↓</span>
                  </a>
                </div>
              </article>
            </div>
          </div>

          <div className="sequence__bar" aria-hidden="true">
            <span className="mono">0</span>
            <span className="sequence__bar-track">
              <span className="sequence__bar-fill" ref={barRef} />
            </span>
            <span className="mono">100</span>
          </div>
        </div>
      </div>

      <p className="sr-only">
        {`Sequence of ${projects.length} projects: ${projects
          .map((project) => project.name)
          .join(", ")}.`}
      </p>
    </section>
  );
}

function ProjectPanel({ project, position }: { project: Project; position: number }) {
  return (
    <article
      className={`panel panel--project panel--${project.slug}`}
      data-panel={project.slug}
      aria-labelledby={`panel-${project.slug}`}
      style={
        { ["--project-accent" as string]: project.accent } as React.CSSProperties
      }
    >
      <header className="panel__head">
        <span className="mono panel__index">{project.index}</span>
        <span className="mono panel__discipline">{project.discipline}</span>
        <span className="panel__status mono">
          <span className="panel__dot" aria-hidden="true" />
          {project.statusLabel}
        </span>
      </header>

      <div className="panel__grid">
        <div className="panel__type" data-drift>
          <h3 className="panel__title" id={`panel-${project.slug}`}>
            <span className="sr-only">{project.name}</span>
            <SplitText text={project.name} />
          </h3>
          <p className="panel__tagline">{project.tagline}</p>
          <p className="panel__desc">{project.description}</p>

          <dl className="panel__facts">
            <div>
              <dt className="mono">Status</dt>
              <dd>{project.statusLabel}</dd>
            </div>
            <div>
              <dt className="mono">Built so far</dt>
              <dd>{project.progress}</dd>
            </div>
            <div>
              <dt className="mono">Stack</dt>
              <dd>{project.stack.join(" / ")}</dd>
            </div>
            <div>
              <dt className="mono">Link</dt>
              <dd>
                {project.link ? (
                  <a
                    className="panel__link"
                    href={project.link.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    data-cursor="link"
                  >
                    {project.link.label}
                    <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <span className="panel__link panel__link--none">
                    No public build yet
                  </span>
                )}
              </dd>
            </div>
          </dl>

          <span className="panel__step mono" aria-hidden="true">
            {String(position + 2).padStart(2, "0")} / 05
          </span>
        </div>

        <div className="panel__visual">
          <ProjectPlate project={project} entry="manual" />
        </div>
      </div>
    </article>
  );
}
