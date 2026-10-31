/**
 * ─────────────────────────────────────────────────────────────
 *  PROJECTS — only the three real personal projects.
 *
 *  Status values are deliberately conservative:
 *    "concept"        → direction explored, nothing shipped
 *    "in-progress"    → actively being built
 *    "ongoing"        → long-running personal project
 *
 *  `preview` is optional. No product screenshots were supplied for
 *  any project, so each panel renders an abstract identity study
 *  instead. Drop a real screenshot into /public and point
 *  `preview.src` at it to replace the study — the layout adapts.
 *
 *  `stack` lists technologies used or being explored. Keep it to
 *  things that are actually true; edit freely.
 * ─────────────────────────────────────────────────────────────
 */

export type ProjectStatus = "concept" | "in-progress" | "ongoing";

export type ProjectMark = "signal-arc" | "node-stack" | "aperture";

export interface Project {
  slug: string;
  index: string;
  name: string;
  tagline: string;
  description: string;
  /** What has actually been made so far. */
  progress: string;
  status: ProjectStatus;
  statusLabel: string;
  discipline: string;
  stack: string[];
  accent: string;
  mark: ProjectMark;
  /** Caption printed on the plate — describes what the panel actually is. */
  plateCaption: string;
  /** Optional real destination; null renders an honest "no public link" state. */
  link: { label: string; href: string } | null;
  preview?: { src: string; alt: string };
}

export const projects: Project[] = [
  {
    slug: "kaminari",
    index: "01",
    name: "KAMINARI",
    tagline: "Food discovery, reimagined for Nepal.",
    description:
      "A Nepali food discovery and ordering platform concept. The direction combines restaurant discovery, food-related content, reviews and interaction, restaurant ordering, and promotions or rewards — exploring what happens when discovery, social life and ordering live in one place instead of three.",
    progress:
      "Concept and direction. Interface studies and platform architecture are being explored; nothing is publicly released yet.",
    status: "concept",
    statusLabel: "Concept",
    discipline: "Product · Interface · Platform",
    stack: ["React", "Next.js", "Responsive UI", "Product thinking"],
    accent: "#B6FF3B",
    mark: "signal-arc",
    plateCaption: "Direction study · discovery, social, ordering",
    link: null,
  },
  {
    slug: "totem",
    index: "02",
    name: "TOTEM",
    tagline: "An AI assistant worth talking to.",
    description:
      "An AI assistant and product concept built around conversation. The work considers assistant interfaces, working across multiple AI providers, conversational flows and AI-assisted productivity — with the interface treated as a product problem rather than a chat box with a coat of paint.",
    progress:
      "Work in progress. Provider integration and interface patterns are being prototyped; the product is not launched.",
    status: "in-progress",
    statusLabel: "In progress",
    discipline: "AI · Interface · Product",
    stack: ["React", "TypeScript", "AI provider APIs", "Conversation design"],
    accent: "#EDEDED",
    mark: "node-stack",
    plateCaption: "Interface study · the conversation layer",
    link: null,
  },
  {
    slug: "regera",
    index: "03",
    name: "REGERA",
    tagline: "A place for the work to live.",
    description:
      "A personal digital identity and development project — part studio, part experiment. It is where digital identity, personal branding, interface design and small creative technical projects get tested in public, and where a lot of the ideas on this site were first tried out.",
    progress:
      "Ongoing. A continuing personal project that grows with each experiment rather than a finished product.",
    status: "ongoing",
    statusLabel: "Ongoing",
    discipline: "Identity · Web · Experimentation",
    stack: ["Web development", "Interface design", "Creative coding"],
    accent: "#C1373B",
    mark: "aperture",
    plateCaption: "Identity study · the aperture system",
    link: { label: "github.com/reger4mv", href: "https://github.com/reger4mv" },
  },
];
