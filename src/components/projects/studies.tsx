import { useId } from "react";

import type { ProjectMark } from "@/data/projects";

/**
 * THE STUDIES
 *
 * One abstract identity study per project, drawn from that project's own
 * geometry. They are the only imagery the site owns — no stock photography, no
 * invented screenshots — so they are shared here rather than duplicated: the
 * work plates and the cursor reveal must show the same object.
 *
 * Each study keeps its own composition (portrait / wide / square); nothing is
 * cropped to a house ratio.
 */

function SignalArc({ accent, fadeId }: { accent: string; fadeId: string }) {
  return (
    <svg
      className="plate__figure"
      viewBox="0 0 600 750"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Identity study: concentric arcs and a vertical signal line"
    >
      <defs>
        <linearGradient id={fadeId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.9" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="#8a8a8a" strokeWidth="1" opacity="0.5">
        {Array.from({ length: 8 }).map((_, i) => (
          <circle key={i} cx="300" cy="392" r={40 + i * 38} />
        ))}
      </g>
      <g stroke="#cfcfcf" strokeWidth="1" opacity="0.32">
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
        <path d="M186 392a114 114 0 0 0 228 0" stroke="#e8e8e8" opacity="0.45" />
        <path d="M238 392a62 62 0 0 0 124 0" stroke={accent} opacity="0.4" />
      </g>
      <path d="M300 74v318" stroke={`url(#${fadeId})`} strokeWidth="1.4" />
      <g fill={accent}>
        <circle cx="300" cy="74" r="4.5" />
        <circle cx="300" cy="182" r="2.5" opacity="0.7" />
        <circle cx="300" cy="258" r="2.5" opacity="0.42" />
      </g>
      <g stroke="#cfcfcf" strokeWidth="0.75" opacity="0.3">
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
              fill="#151515"
              stroke="#4a4336"
              strokeWidth="1"
              opacity={0.95 - p * 0.12}
            />
            <rect
              x={600 - w}
              y={y}
              width={w * 2}
              height="3"
              fill={p === 0 ? accent : "#e8e8e8"}
              opacity={p === 0 ? 0.95 : 0.28}
            />
          </g>
        );
      })}
      <path
        d="M600 96v324"
        stroke="#cfcfcf"
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
          fill={n === 0 ? accent : "#8a8a8a"}
        />
      ))}
      <g fill="none" stroke="#8a8a8a" strokeWidth="0.75" opacity="0.4">
        <path d="M120 96h960M120 420h960" />
        <path d="M120 96v324M1080 96v324" />
      </g>
      <text
        x="132"
        y="118"
        fill="#8a8a8a"
        fontSize="10"
        letterSpacing="4"
        fontFamily="var(--font-mono)"
      >
        PROMPT
      </text>
      <text
        x="132"
        y="404"
        fill="#8a8a8a"
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
      <circle cx="300" cy="300" r="248" fill="none" stroke="#3d372c" strokeWidth="1" />
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
            stroke="#e8e8e8"
            strokeOpacity={0.22}
            strokeWidth="1"
            opacity={0.95}
          />
        );
      })}
      <circle cx="300" cy="300" r="34" fill="#0a0a0a" stroke="#6b6355" strokeWidth="1" />
      <path
        d="M300 52v40M300 508v40M52 300h40M508 300h40"
        stroke="#8a8a8a"
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


export const studyMarks = {
  "signal-arc": SignalArc,
  "node-stack": NodeStack,
  aperture: Aperture,
} as const;

/** Intrinsic proportions of each study, used to size the floating preview. */
export const studyRatios: Record<ProjectMark, number> = {
  "signal-arc": 600 / 750,
  "node-stack": 1200 / 515,
  aperture: 1,
};

export function ProjectStudy({
  mark,
  accent,
  label = true,
}: {
  mark: ProjectMark;
  accent: string;
  /** The preview is decorative; the plate keeps its accessible label. */
  label?: boolean;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const Mark = studyMarks[mark];
  return (
    <span className="study" aria-hidden={label ? undefined : "true"}>
      <Mark accent={accent} fadeId={`study-fade-${uid}`} />
    </span>
  );
}
