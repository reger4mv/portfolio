import { Plate, type PlateVariant } from "@/components/ui/Plate";
import { ProjectStudy } from "@/components/projects/studies";
import type { Project } from "@/data/projects";

/**
 * Project imagery.
 *
 * No product screenshots were supplied, so each plate carries an abstract
 * identity study drawn from that project's own geometry — an object, not a
 * fake screenshot. The studies live in `studies.tsx` because the cursor
 * reveal shows the same objects; if a real image is added to `projects.ts`,
 * it replaces the study here and in the preview.
 */

const TREATMENT: Record<string, { variant: PlateVariant; parallax: number; tilt: number }> = {
  kaminari: { variant: "rise", parallax: 11, tilt: 3.5 },
  totem: { variant: "wipe", parallax: 7, tilt: 2 },
  regera: { variant: "scale", parallax: 13, tilt: 4 },
};

export function ProjectPlate({
  project,
  entry = "scroll",
}: {
  project: Project;
  entry?: "scroll" | "manual";
}) {
  const treatment = TREATMENT[project.slug] ?? {
    variant: "rise" as PlateVariant,
    parallax: 10,
    tilt: 3,
  };

  return (
    <Plate
      variant={treatment.variant}
      parallax={entry === "manual" ? 0 : treatment.parallax}
      tilt={treatment.tilt}
      entry={entry}
      className={`project-plate project-plate--${project.slug}`}
      caption={
        <>
          <span className="mono">{project.plateCaption}</span>
          <span className="mono matte__index">{project.index}</span>
        </>
      }
    >
      {project.preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="plate__figure"
          src={project.preview.src}
          alt={project.preview.alt}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <ProjectStudy mark={project.mark} accent={project.accent} />
      )}
    </Plate>
  );
}
