export function SectionHeading({
  index,
  label,
  note,
}: {
  index: string;
  label: string;
  note?: string;
}) {
  return (
    <div className="section-head">
      <div className="section-head__index">
        <span className="roll">
          <strong data-roll>{index}</strong>
        </span>
        <span className="section-head__label" data-wipe>
          {label}
        </span>
      </div>
      {note ? (
        <p className="section-head__note" data-wipe>
          {note}
        </p>
      ) : null}
      <span className="section-head__rule" data-draw aria-hidden="true" />
    </div>
  );
}
