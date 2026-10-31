"use client";

import { principles } from "@/data/philosophy";

/**
 * Approach — four working principles as a quiet vertical list.
 *
 * This used to be a second horizontal track. Since WORK now owns the page's
 * one sideways journey, the principles read as a plain descending list: a
 * numbered column, a title, a body. Reveals are handled by SiteMotion
 * (`data-lines`, `data-reveal`) so there is no local scroll code here.
 */
export function Creed() {
  return (
    <section id="approach" className="section creed-section reg--paper" aria-labelledby="creed-title">
      <div className="shell">
        <p className="creed__mark mono">
          <span>05</span> Approach — four habits
        </p>

        <div className="creed__intro">
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

        <ol className="creed__list">
          {principles.map((principle) => (
            <li className="creed__panel" key={principle.index} data-reveal>
              <span className="creed__panel-index mono">{principle.index}</span>
              <div className="creed__panel-text">
                <h3 className="creed__panel-title">{principle.title}</h3>
                <p className="creed__panel-body">{principle.body}</p>
              </div>
              <span className="creed__panel-rule" aria-hidden="true" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
