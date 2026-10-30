import { projects, type Project } from "@/data/projects";
import { ProjectPlate } from "@/components/projects/ProjectPlate";
import { SectionHeading } from "@/components/sections/SectionHeading";

const VARIANTS: Record<string, "a" | "b" | "c"> = { "01": "a", "02": "b", "03": "c" };

/** Splits a word so hover can displace alternate characters. Cheap, no library. */
function SplitChars({ text }: { text: string }) {
  return (
    <span className="split" aria-hidden="true">
      {text.split("").map((char, index) => (
        <span
          className="split__char"
          key={`${char}-${index}`}
          style={{ "--i": index } as React.CSSProperties}
        >
          {char === " " ? "\u00a0" : char}
        </span>
      ))}
    </span>
  );
}

function Facts({ project }: { project: Project }) {
  return (
    <dl className="project__facts" data-reveal-group>
      <div className="project__fact" data-reveal-item>
        <dt>Status</dt>
        <dd>{project.statusLabel}</dd>
      </div>
      <div className="project__fact" data-reveal-item>
        <dt>Built so far</dt>
        <dd>{project.progress}</dd>
      </div>
      <div className="project__fact" data-reveal-item>
        <dt>Stack</dt>
        <dd>
          <ul className="project__stack">
            {project.stack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </dd>
      </div>
      <div className="project__fact" data-reveal-item>
        <dt>Link</dt>
        <dd>
          {project.link ? (
            <a
              className="project__link"
              href={project.link.href}
              target="_blank"
              rel="noreferrer noopener"
              data-cursor="link"
            >
              {project.link.label}
              <span aria-hidden="true">↗</span>
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ) : (
            <span className="project__link project__link--none">
              No public build yet
            </span>
          )}
        </dd>
      </div>
    </dl>
  );
}

function ProjectEntry({ project }: { project: Project }) {
  const variant = VARIANTS[project.index] ?? "a";

  const text = (
    <div className="project__text">
      <h3 className="project__title" id={`project-${project.slug}`}>
        <span className="sr-only">{project.name}</span>
        <SplitChars text={project.name} />
      </h3>
      <p className="project__tagline" data-reveal>
        {project.tagline}
      </p>
      <p className="project__desc" data-reveal>
        {project.description}
      </p>
      <Facts project={project} />
    </div>
  );

  return (
    <article
      className={`project project--${variant}`}
      aria-labelledby={`project-${project.slug}`}
      style={
        { ["--project-accent" as string]: project.accent } as React.CSSProperties
      }
      id={`work-${project.slug}`}
    >
      <header className="project__head">
        <span className="roll">
          <span className="project__index" data-roll>
            {project.index}
          </span>
        </span>
        <span className="project__discipline" data-wipe>
          {project.discipline}
        </span>
        <span className="project__status">{project.statusLabel}</span>
      </header>

      {variant === "b" ? (
        <div className="project__body project__body--split">
          <div className="project__sticky">
            <ProjectPlate project={project} />
          </div>
          {text}
        </div>
      ) : (
        <div className={`project__body project__body--${variant}`}>
          {text}
          <div className="project__plate-wrap">
            <ProjectPlate project={project} />
          </div>
        </div>
      )}
    </article>
  );
}

export function Work() {
  return (
    <section id="work" className="section shell" aria-labelledby="work-title">
      <SectionHeading
        index="02"
        label="Selected work"
        note="Concept · In progress · Ongoing"
      />

      <div className="work__intro">
        <h2 className="display work__heading" id="work-title" data-lines>
          <span className="line">
            <span>Things I&apos;m</span>
          </span>
          <span className="line">
            <span>
              building<em>.</em>
            </span>
          </span>
        </h2>
        <p className="work__note" data-reveal>
          Three projects, at three different stages. Each one is labelled for
          what it is right now rather than what it might become.
        </p>
      </div>

      <div className="work__list">
        {projects.map((project) => (
          <ProjectEntry key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
