"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { setLenis } from "@/lib/viewport/lenis-instance";
import { ensureFrameLoop, subscribeFrame } from "@/lib/viewport/frame-loop";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarse) return;

    const lenis = new Lenis({
      lerp: 0.12,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.2,
      autoRaf: false,
    });

    setLenis(lenis);
    document.documentElement.classList.add("lenis");

    const unsubscribe = subscribeFrame((time) => {
      lenis.raf(time);
      return lenis.isSmooth || Math.abs(lenis.velocity) > 0.05;
    });

    const wake = () => ensureFrameLoop();
    lenis.on("scroll", wake);

    return () => {
      unsubscribe();
      lenis.destroy();
      setLenis(null);
      document.documentElement.classList.remove("lenis");
    };
  }, []);

  return <>{children}</>;
}
