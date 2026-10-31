/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONTENT — single source of truth for personal details.
 *  Everything here is editable. Replace empty strings with real
 *  values; the UI adapts to whatever is present.
 * ─────────────────────────────────────────────────────────────
 */

/**
 * Where the site is published. Used for canonical + social preview URLs.
 * Set NEXT_PUBLIC_SITE_URL to override (e.g. a custom domain); the GitHub
 * Pages project-site fallback is built from the base path so previews still
 * resolve when the site is served from /portfolio.
 */
const basePath = process.env.NEXT_BASE_PATH ?? "";
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? `https://reger4mv.github.io/portfolio`
).replace(/\/$/, "");

export const site = {
  firstName: "AGASTYA",
  lastName: "VERMA",
  fullName: "Agastya Verma",

  /** Short line used in the hero and metadata. */
  role: "Independent developer",
  location: "Nepal",
  basedIn: "Kathmandu, Nepal",
  timezone: "Asia/Kathmandu",

  heroDescription:
    "I build interfaces, then take them apart to see why they hold. Self-taught, working from Kathmandu.",

  heroMeta: ["Independent developer", "Kathmandu, Nepal", "Interface · Interaction · 3D"],

  /**
   * Contact channels. Leave a value empty to hide it from the site —
   * nothing is invented or filled in automatically.
   */
  email: "",
  availability: "Open to collaboration, experiments and questions I can answer.",

  about: {
    headingLines: ["I learn by", "building the thing."],
    lede: "I'm a self-taught developer from Nepal, fifteen, and still early in the way of things. Most of what I know came from opening an editor, breaking something, and staying with it until the pieces made sense.",
    paragraphs: [
      "I work where engineering meets design: interfaces, motion, interaction, and the systems underneath that make them behave. I like the part of a project where an idea is still a sketch and the shape of it hasn't been decided yet.",
      "My interests move between frontend engineering, backend systems, creative development and interactive 3D on the web. Some of that is years of practice, some of it is a couple of experiments deep — I try to be honest about which is which.",
      "Right now I'm building small products end to end, studying how good interfaces are put together, and treating every project as a reason to learn something I didn't know before.",
    ],
    notes: [
      { label: "Based in", value: "Kathmandu, Nepal" },
      { label: "Practice", value: "Self-taught, ~2 years" },
      { label: "Focus", value: "Interface · Interaction · 3D" },
      { label: "Currently", value: "Building & learning in public" },
    ],
  },

  contact: {
    headingLines: ["Bring me", "a real problem."],
    copy:
      "A concept, an interface, or a build that has stopped behaving. I would rather hear the specifics than the pitch.",
  },

  /** Printed as a colophon — the typefaces this page is actually set in. */
  footerNote: ["Archivo — three widths,", "and Azeret Mono."],

  /** Shown as the page description / social preview. */
  metaDescription:
    "Agastya Verma — self-taught developer in Kathmandu. Interfaces, interaction and the 3D layer between them.",
} as const;

/** Absolute URL for a public asset (siteUrl already carries the base path). */
export const asset = (path: string) => `${siteUrl}${path}`;

/**
 * Prefix a public asset with the base path. Next's metadata `icons` field does
 * not apply basePath automatically, so icon URLs must be built with this.
 */
export const withBase = (path: string) => `${basePath}${path}`;

export const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "experiments", label: "Experiments" },
  { id: "contact", label: "Contact" },
] as const;

export type NavItem = (typeof navItems)[number];
