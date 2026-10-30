import { Plate, type PlateVariant } from "@/components/ui/Plate";
import type { Project } from "@/data/projects";

/**
 * Project imagery.
 *
 * No product screenshots were supplied, so each plate carries an abstract
 * identity study drawn from that project's own geometry — an object, not a
 * fake screenshot. If a real image is added to `projects.ts`, it replaces the
 * study and inherits the same plate treatment.
 */

function SignalArc({ accent }: { accent: string }) {
  return (
    <svg
      className="plate__figure"
      viewBox="0 0 600 750"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Identity study: concentric arcs and a vertical signal line"
    >
      <defs>
        <linearGradient id="kam-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.9" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="#858585" strokeWidth="1" opacity="0.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <circle key={i} cx="300" cy="392" r={40 + i * 38} />
        ))}
      </g>
      <g stroke="#B9B9B9" strokeWidth="1" opacity="0.32">
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i / 24) * Math.PI * 2;
          const inner = 330;
          const outer = i % 6 === 0 ? 346 : 340;
          return (
            <line
              key={i}
              x1={300 + Math.cos(angle) * inner}
              y1={392 + Math.sin(angle) * inner}
              x2={300 + Math.cos(angle) * outer}
              y2={392 + Math.sin(angle) * outer}
            />
          );
        })}
      </g>
      <g fill="none" strokeWidth="1.6">
        <path d="M120 392a180 180 0 0 0 360 0" stroke={accent} opacity="0.9" />
        <path d="M186 392a114 114 0 0 0 228 0" stroke="#EAE8E2" opacity="0.45" />
        <path d="M238 392a62 62 0 0 0 124 0" stroke={accent} opacity="0.4" />
      </g>
      <path d="M300 74v318" stroke="url(#kam-fade)" strokeWidth="1.4" />
      <g fill={accent}>
        <circle cx="300" cy="74" r="4.5" />
        <circle cx="300" cy="182" r="2.5" opacity="0.7" />
        <circle cx="300" cy="258" r="2.5" opacity="0.42" />
      </g>
      <g stroke="#B9B9B9" strokeWidth="0.75" opacity="0.3">
        <path d="M300 392h-268M300 392h268" strokeDasharray="2 7" />
      </g>
    </svg>
  );
}

function NodeStack({ accent }: { accent: string }) {
  return (
    <svg
      className="plate__figure"
      viewBox="0 0 1200 515"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Identity study: floating planes connected by an axis"
    >
      {[0, 1, 2, 3].map((p) => {
        const y = 150 + p * 62;
        const w = 210 - p * 26;
        return (
          <g key={p}>
            <rect
              x={600 - w}
              y={y}
              width={w * 2}
              height="46"
              fill="#111111"
              stroke="#4a4a4a"
              strokeWidth="1"
              opacity={0.95 - p * 0.12}
            />
            <rect
              x={600 - w}
              y={y}
              width={w * 2}
              height="3"
              fill={p === 0 ? accent : "#EAE8E2"}
              opacity={p === 0 ? 0.95 : 0.28}
            />
          </g>
        );
      })}
      <path
        d="M600 96v324"
        stroke="#B9B9B9"
        strokeWidth="1"
        strokeDasharray="3 6"
        opacity="0.5"
      />
      {[0, 1, 2, 3].map((n) => (
        <circle
          key={n}
          cx="600"
          cy={173 + n * 62}
          r={n === 0 ? 5 : 3}
          fill={n === 0 ? accent : "#858585"}
        />
      ))}
      <g fill="none" stroke="#858585" strokeWidth="0.75" opacity="0.4">
        <path d="M120 96h960M120 420h960" />
        <path d="M120 96v324M1080 96v324" />
      </g>
      <text
        x="132"
        y="118"
        fill="#858585"
        fontSize="10"
        letterSpacing="4"
        fontFamily="var(--font-mono)"
      >
        PROMPT
      </text>
      <text
        x="132"
        y="404"
        fill="#858585"
        fontSize="10"
        letterSpacing="4"
        fontFamily="var(--font-mono)"
      >
        RESPONSE
      </text>
      <text
        x="1068"
        y="118"
        textAnchor="end"
        fill={accent}
        fontSize="10"
        letterSpacing="4"
        fontFamily="var(--font-mono)"
      >
        MULTI-PROVIDER
      </text>
    </svg>
  );
}

function Aperture({ accent }: { accent: string }) {
  const blades = 7;
  const points = Array.from({ length: blades }).map((_, i) => {
    const a = (i / blades) * Math.PI * 2 - Math.PI / 2;
    return [300 + Math.cos(a) * 214, 300 + Math.sin(a) * 214] as const;
  });
  return (
    <svg
      className="plate__figure"
      viewBox="0 0 600 600"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Identity study: a seven-blade aperture"
    >
      <circle cx="300" cy="300" r="248" fill="none" stroke="#414145" strokeWidth="1" />
      <circle
        cx="300"
        cy="300"
        r="196"
        fill="none"
        stroke={accent}
        strokeWidth="1"
        opacity="0.5"
      />
      <circle cx="300" cy="300" r="120" fill="none" stroke={accent} strokeWidth="1.4" />
      {points.map(([x, y], i) => {
        const next = points[(i + 1) % blades];
        return (
          <path
            key={i}
            d={`M300 300 L${x} ${y} A214 214 0 0 1 ${next[0]} ${next[1]} Z`}
            fill={i % 2 === 0 ? "#0a0a0a" : "#1e1e21"}
            stroke="#EAE8E2"
            strokeOpacity={0.22}
            strokeWidth="1"
            opacity={0.95}
          />
        );
      })}
      <circle cx="300" cy="300" r="34" fill="#090909" stroke="#5a5a5a" strokeWidth="1" />
      <path
        d="M300 52v40M300 508v40M52 300h40M508 300h40"
        stroke="#858585"
        strokeWidth="1"
        opacity="0.45"
      />
    </svg>
  );
}

const marks = {
  "signal-arc": SignalArc,
  "node-stack": NodeStack,
  aperture: Aperture,
};

const TREATMENT: Record<string, { variant: PlateVariant; parallax: number; tilt: number }> = {
  kaminari: { variant: "rise", parallax: 11, tilt: 3.5 },
  totem: { variant: "wipe", parallax: 7, tilt: 2 },
  regera: { variant: "scale", parallax: 13, tilt: 4 },
};

export function ProjectPlate({ project }: { project: Project }) {
  const Mark = marks[project.mark];
  const treatment = TREATMENT[project.slug] ?? {
    variant: "rise" as PlateVariant,
    parallax: 10,
    tilt: 3,
  };

  return (
    <Plate
      variant={treatment.variant}
      parallax={treatment.parallax}
      tilt={treatment.tilt}
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
        <Mark accent={project.accent} />
      )}
    </Plate>
  );
}
