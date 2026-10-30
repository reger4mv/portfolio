import { site } from "@/data/site";
import { SectionHeading } from "@/components/sections/SectionHeading";

export function About() {
  const { headingLines, lede, paragraphs, notes } = site.about;

  return (
    <section id="about" className="section shell" aria-labelledby="about-title">
      <SectionHeading
        index="01"
        label="About"
        note="Self-taught · Nepal · Learning in public"
      />

      <h2 className="display about__heading" id="about-title" data-lines>
        <span className="line">
          <span>{headingLines[0]}</span>
        </span>
        <span className="line">
          <span>
            {headingLines[1].replace(".", "")}
            <em>.</em>
          </span>
        </span>
      </h2>

      <div className="about__body">
        <p className="lede about__lede" data-reveal>
          {lede}
        </p>

        <div className="about__spine" aria-hidden="true">
          <span className="about__spine-rule" />
          <span className="mono">Still learning, on purpose</span>
          <span className="about__spine-rule" />
        </div>

        <div className="about__copy" data-reveal-group>
          {paragraphs.map((paragraph) => (
            <p className="body-copy" key={paragraph.slice(0, 24)} data-reveal-item>
              {paragraph}
            </p>
          ))}
        </div>

        <dl className="about__notes" data-reveal-group>
          {notes.map((note) => (
            <div className="about__note" key={note.label} data-reveal-item>
              <dt>{note.label}</dt>
              <dd>{note.value}</dd>
            </div>
          ))}
        </dl>

        <div className="about__aside">
          <p data-reveal>
            The fastest way to understand what I can do is to open something
            I&apos;ve built and press on it.
          </p>
        </div>
      </div>
    </section>
  );
}
