/** The site mark: an aperture ring cut by an A-frame. */
export function Monogram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
      focusable="false"
    >
      <circle
        cx="16"
        cy="16"
        r="13.5"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.55"
        strokeDasharray="2.6 3.2"
      />
      <path
        d="M16 5.5 24.5 26.5"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
      <path
        d="M16 5.5 7.5 26.5"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path
        d="M11.6 19.2h8.8"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
      <circle cx="16" cy="5.5" r="2.1" fill="var(--accent)" />
    </svg>
  );
}
