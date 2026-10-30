/**
 * ─────────────────────────────────────────────────────────────
 *  SITE CONTENT — single source of truth for personal details.
 *  Everything here is editable. Replace empty strings with real
 *  values; the UI adapts to whatever is present.
 * ─────────────────────────────────────────────────────────────
 */

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
    "Creative developer exploring the intersection of code, design and interactive experiences.",

  heroMeta: ["Independent developer", "Nepal", "Building on the internet"],

  /**
   * Contact channels. Leave a value empty to hide it from the site —
   * nothing is invented or filled in automatically.
   */
  email: "",
  availability: "Open to collaboration, experiments and good conversation.",

  about: {
    headingLines: ["CURIOUS BY NATURE.", "BUILT THROUGH CODE."],
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
    headingLines: ["HAVE SOMETHING", "INTERESTING IN MIND?"],
    copy: "Let's turn an interesting idea into something worth experiencing.",
  },

  footerNote: ["Designed with intention.", "Built with curiosity."],

  /** Shown as the page description / social preview. */
  metaDescription:
    "Agastya Verma — self-taught creative developer from Nepal building interactive web experiences at the intersection of code, design and 3D.",
} as const;

export const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "experiments", label: "Experiments" },
  { id: "contact", label: "Contact" },
] as const;

export type NavItem = (typeof navItems)[number];
