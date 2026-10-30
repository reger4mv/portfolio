import { projects, type Project } from "@/data/projects";
import { ProjectPlate } from "@/components/projects/ProjectPlate";
import { SectionHeading } from "@/components/sections/SectionHeading";

const VARIANTS: Record<string, string> = { "01": "a", "02": "b", "03": "c" };

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

  const heading = (
    <>
      <h3 className="project__title" id={`project-${project.slug}`} data-reveal>
        {project.name}
      </h3>
      <p className="project__tagline" data-reveal>
        {project.tagline}
      </p>
      <p className="project__desc" data-reveal>
        {project.description}
      </p>
    </>
  );

  const plate = (
    <div className="project__plate-wrap">
      <ProjectPlate project={project} caption={project.plateCaption} />
    </div>
  );

  return (
    <article
      className={`project project--${variant}`}
      aria-labelledby={`project-${project.slug}`}
      style={
        { ["--project-accent" as string]: project.accent } as React.CSSProperties
      }
    >
      <div className="project__head">
        <span className="project__index">{project.index}</span>
        <span className="project__discipline">{project.discipline}</span>
        <span className="project__status">{project.statusLabel}</span>
      </div>

      {variant === "b" ? (
        <div className="project__body">
          {plate}
          <div className="project__meta-grid">
            <div className="project__text">{heading}</div>
            <Facts project={project} />
          </div>
        </div>
      ) : (
        <div className="project__body">
          <div className="project__text">
            {heading}
            <Facts project={project} />
          </div>
          {plate}
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

      <div className="work__list">
        {projects.map((project) => (
          <ProjectEntry key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
