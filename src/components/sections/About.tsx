import { site } from "@/data/site";
import { SectionMark } from "@/components/sections/SectionMark";
import { Angel } from "@/components/system/Angel";

/**
 * About — a pinned editorial spread.
 *
 * The left column holds still (CSS sticky, no JS pinning) while the copy
 * scrolls past it, and the vertical rule beside the text draws itself as you
 * read. The lede arrives through a mask rather than a fade, so the section
 * does not repeat the same entrance as everything else.
 */
export function About() {
  const { headingLines, lede, paragraphs, notes } = site.about;

  return (
    <section id="about" className="section shell" aria-labelledby="about-title">
      <Angel variant="about" />

      <SectionMark
        index="01"
        label="About"
        note="Self-taught · two years · still early"
        variant="margin"
      />

      <div className="about__grid">
        <div className="about__sticky">
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

          <p className="about__annotation">
            The fastest way to understand what I can do is to open something
            I&apos;ve built and press on it.
          </p>
          <span className="about__rule" data-grow aria-hidden="true" />
        </div>

        <div className="about__scroll">
          <p className="lede about__lede" data-mask>
            {lede}
          </p>

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
        </div>
      </div>
    </section>
  );
}
