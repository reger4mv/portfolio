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
        <strong>{index}</strong>
        <span className="section-head__label">{label}</span>
      </div>
      {note ? <p className="section-head__note">{note}</p> : null}
    </div>
  );
}
