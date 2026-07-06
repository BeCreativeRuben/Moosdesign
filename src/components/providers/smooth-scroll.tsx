"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { setLenis } from "@/lib/viewport/lenis-instance";
import { subscribeFrame } from "@/lib/viewport/frame-loop";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarse) return;

    const lenis = new Lenis({
      lerp: 0.2,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      autoRaf: false,
    });

    setLenis(lenis);
    document.documentElement.classList.add("lenis");

    const unsubscribe = subscribeFrame((time) => {
      lenis.raf(time);
      return lenis.isSmooth || Math.abs(lenis.velocity) > 0.02;
    });

    return () => {
      unsubscribe();
      lenis.destroy();
      setLenis(null);
      document.documentElement.classList.remove("lenis");
    };
  }, []);

  return <>{children}</>;
}
