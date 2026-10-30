export interface Principle {
  index: string;
  title: string;
  body: string;
}

export const principles: Principle[] = [
  {
    index: "01",
    title: "Curiosity",
    body: "Explore how things work and how they can be improved. Most of what I know started as a question I couldn't leave alone.",
  },
  {
    index: "02",
    title: "Experimentation",
    body: "Try the unconventional idea instead of repeating a familiar pattern. Not every experiment survives — the ones that do earn their place.",
  },
  {
    index: "03",
    title: "Precision",
    body: "Small details make a significant difference. A two-pixel shift, the timing on a transition, the weight of a line — these are the work.",
  },
  {
    index: "04",
    title: "Functionality",
    body: "An experience should work as beautifully as it looks. If it only holds up in a screenshot, it isn't finished.",
  },
];
