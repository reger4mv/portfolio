/**
 * Splits a word into per-character spans so hover states can displace letters
 * without a text-animation library. Marked aria-hidden; the accessible name is
 * supplied by the caller (an sr-only span or the element's own text).
 */
export function SplitText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <span className={`split ${className ?? ""}`} aria-hidden="true">
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
