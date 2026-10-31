/**
 * ─────────────────────────────────────────────────────────────
 *  PROJECTS — only the three real personal projects.
 *
 *  Status values are deliberately conservative:
 *    "concept"        → direction explored, nothing shipped
 *    "in-progress"    → actively being built
 *    "ongoing"        → long-running personal project
 *
 *  `build` is optional and points at a standalone page in `public/`
 *  (a real, self-contained build of the project). When present the
 *  panel's action becomes "View the build" and navigates there.
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
  /** Optional standalone build page, relative to the site root. */
  build?: { href: string; label: string };
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
    build: { href: "/work/kaminari.html", label: "View the build" },
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
    build: { href: "/work/totem.html", label: "View the build" },
  },
  {
    slug: "regeracraft",
    index: "03",
    name: "REGERACRAFT",
    tagline: "A voxel world that runs in a browser tab.",
    description:
      "A playable voxel world written in plain HTML, CSS and JavaScript — no engine library, no image textures. Every block face is generated into a canvas at runtime and drawn through WebGL, with a world select, saving to local storage, block breaking and placing, and pointer-lock movement. The build is wrapped in a separate visual shell; the game underneath is its own thing.",
    progress:
      "Playable. It boots, generates terrain, saves worlds locally and can be played start to finish in the browser. Keyboard and mouse only — no touch controls, and no multiplayer.",
    status: "ongoing",
    statusLabel: "Playable",
    discipline: "Identity · Web · Experimentation",
    stack: ["Web development", "Interface design", "Creative coding"],
    accent: "#C1373B",
    mark: "aperture",
    plateCaption: "Playable build · a voxel world in a browser tab",
    link: null,
    build: { href: "/work/minecraft.html", label: "Play the build" },
  },
];
