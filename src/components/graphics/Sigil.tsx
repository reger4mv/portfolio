/**
 * SIGILS
 *
 * A small kit of drawn marks — no clip art, no generated imagery, no
 * decoration for its own sake. Every path is authored by hand on a 200×200
 * grid so the set shares one stroke weight, one symmetry logic and one
 * proportion. They take `currentColor` and a non-scaling hairline, so the same
 * mark reads at 40 px in a corner and at 600 px behind a headline.
 *
 * House rule: at most one sigil per composition, placed where the layout is
 * genuinely empty. They are punctuation, not wallpaper.
 */
type SigilName = "spear" | "wings" | "knot" | "halo" | "barb";

const paths: Record<SigilName, React.ReactNode> = {
  /* A barbed spine — the primary mark. */
  spear: (
    <>
      <path d="M100 6v188" />
      <path d="M100 6 88 34h24z" />
      <path d="M100 60c-20 8-30 22-30 44 12-6 22-16 30-30" />
      <path d="M100 60c20 8 30 22 30 44-12-6-22-16-30-30" />
      <path d="M100 130c-14 6-21 16-21 32 8-4 15-12 21-22" />
      <path d="M100 130c14 6 21 16 21 32-8-4-15-12-21-22" />
      <path d="M70 88 100 74l30 14" />
      <path d="M64 192h72" />
      <circle cx="100" cy="98" r="3.2" />
    </>
  ),

  /* Feathered wings around a hard cross. */
  wings: (
    <>
      <path d="M100 30v150" />
      <path d="M78 68h44M88 84h24" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <path d={`M92 ${70 + i * 18}c-16-10-30-8-40 4 12 8 26 8 40 0`} />
          <path d={`M108 ${70 + i * 18}c16-10 30-8 40 4-12 8-26 8-40 0`} />
        </g>
      ))}
      <path d="M86 180h28" />
    </>
  ),

  /* Interlocking loops with a ticked ring. */
  knot: (
    <>
      <circle cx="100" cy="100" r="58" />
      <path d="M42 100c0-32 26-58 58-58s58 26 58 58-26 58-58 58-58-26-58-58z" transform="rotate(45 100 100)" />
      <path d="M100 42c22 22 22 94 0 116M100 42c-22 22-22 94 0 116" />
      <path d="M100 14v20M100 166v20M14 100h20M166 100h20" />
      <path d="M52 52l9 9M148 148l-9-9M148 52l-9 9M52 148l9-9" />
    </>
  ),

  /* A spiked sun — used once, behind the contact heading. */
  halo: (
    <>
      <circle cx="100" cy="100" r="46" />
      <circle cx="100" cy="100" r="70" />
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i * Math.PI * 2) / 16;
        const long = i % 2 === 0;
        const r1 = long ? 70 : 74;
        const r2 = long ? 99 : 84;
        return (
          <path
            key={i}
            d={`M${100 + Math.cos(a) * r1} ${100 + Math.sin(a) * r1}L${100 + Math.cos(a) * r2} ${100 + Math.sin(a) * r2}`}
          />
        );
      })}
      <path d="M100 54l6 12-6 8-6-8z" />
    </>
  ),

  /* A distorted cross with barbed terminals. */
  barb: (
    <>
      <path d="M100 10v180M10 100h180" />
      <path d="M100 10 92 30h16zM100 190l-8-20h16zM10 100l20-8v16zM190 100l-20-8v16z" />
      <circle cx="100" cy="100" r="26" />
      <path d="M74 74l52 52M126 74l-52 52" />
    </>
  ),
};

export function Sigil({
  name = "spear",
  className,
  strokeWidth = 1,
}: {
  name?: SigilName;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      className={className ? `sigil ${className}` : "sigil"}
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}

export type { SigilName };
