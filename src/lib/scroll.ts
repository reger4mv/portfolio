import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis() {
  return instance;
}

/** Scroll to a section id ("top" returns to the start), using Lenis when running. */
export function scrollToId(id: string) {
  const element = id === "top" ? null : document.getElementById(id);

  if (instance) {
    instance.scrollTo(element ?? 0, {
      duration: 1.35,
      easing: (t: number) => 1 - Math.pow(1 - t, 3.2),
    });
    return;
  }

  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

export function stopScroll() {
  instance?.stop();
  document.documentElement.classList.add("lenis-stopped");
}

export function startScroll() {
  instance?.start();
  document.documentElement.classList.remove("lenis-stopped");
}
