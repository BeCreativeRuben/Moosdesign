"use client";

import { useEffect } from "react";
import { GridWhispers } from "@/components/ui/grid-whispers";

/**
 * Grid layers only — pointer tracking lives in CustomCursor (shared rAF with Lenis).
 */
export function InteractiveGridBackground() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      root.style.setProperty("--grid-x", "50%");
      root.style.setProperty("--grid-y", "40%");
      root.style.setProperty("--grid-active", "0.4");
    } else {
      root.style.setProperty("--grid-x", `${window.innerWidth * 0.5}px`);
      root.style.setProperty("--grid-y", `${window.innerHeight * 0.35}px`);
      root.style.setProperty("--grid-active", "1");
    }
  }, []);

  return (
    <div className="interactive-grid-bg" aria-hidden>
      <div className="interactive-grid-bg__base" />
      <div className="interactive-grid-bg__spotlight" />
      <GridWhispers />
      <div className="interactive-grid-bg__grain" />
    </div>
  );
}
