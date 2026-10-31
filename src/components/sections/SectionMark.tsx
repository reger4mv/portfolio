/**
 * Section marks.
 *
 * A section does not need to announce itself the same way every time. Each
 * variant is a different editorial gesture, so the page never reads as one
 * template stamped six times:
 *
 *   margin  a number in the margin, the name set small in the display face
 *   ledger  the mark sits at the right edge, above a left-aligned statement
 *   seam    a full-bleed hairline with the number and the name on it
 */
export type SectionMarkVariant = "margin" | "ledger" | "seam";

export function SectionMark({
  index,
  label,
  note,
  variant = "margin",
}: {
  index: string;
  label: string;
  note?: string;
  variant?: SectionMarkVariant;
}) {
  return (
    <div className={`smark smark--${variant}`}>
      <span className="smark__num mono">{index}</span>
      <span className="smark__label">{label}</span>
      {note ? <span className="smark__note">{note}</span> : null}
    </div>
  );
}
