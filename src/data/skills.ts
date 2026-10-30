/**
 * ─────────────────────────────────────────────────────────────
 *  SKILLS — presented as an index, not a score.
 *  No percentages, no invented proficiency levels. Each entry
 *  carries an honest `depth` note describing how it is actually used.
 * ─────────────────────────────────────────────────────────────
 */

export type Depth = "working" | "learning" | "exploring";

export interface SkillEntry {
  name: string;
  depth: Depth;
  note?: string;
}

export interface SkillGroup {
  id: string;
  label: string;
  index: string;
  summary: string;
  entries: SkillEntry[];
}

export const skills: SkillGroup[] = [
  {
    id: "frontend",
    index: "01",
    label: "Frontend",
    summary:
      "Where most of my time goes: building interfaces that hold up on real devices, with layouts and states designed rather than defaulted.",
    entries: [
      { name: "HTML", depth: "working" },
      { name: "CSS", depth: "working", note: "Layout, motion, responsive type" },
      { name: "JavaScript", depth: "working" },
      { name: "React", depth: "learning", note: "Fundamentals, component design" },
      { name: "Next.js", depth: "learning" },
      { name: "Responsive systems", depth: "working" },
    ],
  },
  {
    id: "backend",
    index: "02",
    label: "Backend",
    summary:
      "Interested in the parts a visitor never sees — data models, APIs and the logic that keeps an interface honest.",
    entries: [
      { name: "Node.js", depth: "learning" },
      { name: "REST APIs", depth: "learning" },
      { name: "Authentication flows", depth: "exploring" },
      { name: "Databases", depth: "exploring", note: "Schema and query basics" },
    ],
  },
  {
    id: "creative",
    index: "03",
    label: "Creative development",
    summary:
      "The reason I started. Drawing with code, then making the drawing respond to a person.",
    entries: [
      { name: "Canvas API", depth: "working" },
      { name: "Creative coding", depth: "working" },
      { name: "Animation & motion", depth: "working", note: "GSAP, CSS, frame loops" },
      { name: "Generative graphics", depth: "learning" },
    ],
  },
  {
    id: "three-d",
    index: "04",
    label: "3D & interactive",
    summary:
      "An area of active exploration. Materials, lighting and camera behaviour, learned by building scenes like the one on this page.",
    entries: [
      { name: "Three.js", depth: "learning" },
      { name: "React Three Fiber", depth: "learning" },
      { name: "Materials & lighting", depth: "exploring" },
      { name: "Interaction design", depth: "working" },
    ],
  },
  {
    id: "design",
    index: "05",
    label: "Design tools",
    summary:
      "Design as part of development, not a separate hand-off stage that happens before it.",
    entries: [
      { name: "Figma", depth: "working" },
      { name: "Typography", depth: "working" },
      { name: "Git", depth: "working" },
      { name: "GitHub", depth: "working" },
    ],
  },
];

export const depthLabels: Record<Depth, string> = {
  working: "Working",
  learning: "Learning",
  exploring: "Exploring",
};
