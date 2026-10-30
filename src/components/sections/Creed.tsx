import { principles } from "@/data/philosophy";
import { SectionHeading } from "@/components/sections/SectionHeading";

export function Creed() {
  return (
    <section id="approach" className="section shell" aria-labelledby="creed-title">
      <SectionHeading index="05" label="Approach" note="Four working principles" />

      <div className="creed">
        <div className="creed__statement">
          <h2 id="creed-title" data-lines>
            <span className="line">
              <span>Good design</span>
            </span>
            <span className="line">
              <span>isn&apos;t just how</span>
            </span>
            <span className="line">
              <span>it looks.</span>
            </span>
            <span className="line">
              <span>
                It&apos;s how it <em>feels.</em>
              </span>
            </span>
          </h2>
          <p data-reveal>
            I don&apos;t have a manifesto. These are simply the four habits that
            keep showing up in the work — the things I check a project against
            before I call it done.
          </p>
        </div>

        <dl className="creed__list" data-reveal-group>
          {principles.map((principle) => (
            <div className="creed__item" key={principle.index} data-reveal-item>
              <dt>{principle.index}</dt>
              <div>
                <h3 className="creed__item-title">{principle.title}</h3>
                <p>{principle.body}</p>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
