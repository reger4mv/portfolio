"use client";

import { Component, type ReactNode } from "react";

/**
 * If a WebGL context is lost or context creation throws after mount,
 * the page keeps working and shows the fallback instead of a dead canvas.
 */
export class SceneBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    // Keep the console clean for visitors, but leave a trace for developers.
    if (process.env.NODE_ENV === "development") {
      console.warn("[scene] render failed, showing fallback", error);
    }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
