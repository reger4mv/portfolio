"use client";

import { scrollToId } from "@/lib/scroll";

export function BackToTop() {
  return (
    <button
      type="button"
      className="footer__top-link"
      onClick={() => scrollToId("top")}
    >
      Back to top
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path
          d="M6 11V1M6 1 1.8 5.2M6 1l4.2 4.2"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
