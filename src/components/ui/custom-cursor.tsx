"use client";

import { useEffect, useRef } from "react";
import { getLenis } from "@/lib/viewport/lenis-instance";
import { setPointer } from "@/lib/viewport/pointer-state";

type CursorState = "default" | "hover" | "active" | "secret";

const HOVER_SELECTOR =
  "a, button, [role='button'], input, textarea, select, label, summary, [data-cursor='hover']";

const RING_LERP = 0.38;

export function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarse) return;

    const html = document.documentElement;
    html.classList.add("custom-cursor-active");

    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;
    let state: CursorState = "default";
    let visible = false;
    let raf = 0;
    let running = false;

    const setState = (next: CursorState) => {
      if (state === next) return;
      state = next;
      rootRef.current?.setAttribute("data-state", next);
    };

    const tick = (time: number) => {
      getLenis()?.raf(time);

      const dx = mx - rx;
      const dy = my - ry;
      rx += dx * RING_LERP;
      ry += dy * RING_LERP;

      if (Math.abs(dx) < 0.4 && Math.abs(dy) < 0.4) {
        rx = mx;
        ry = my;
      }

      const ring = ringRef.current;
      const dot = dotRef.current;
      if (ring) {
        ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      }
      if (dot) {
        dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      }

      html.style.setProperty("--grid-x", `${mx}px`);
      html.style.setProperty("--grid-y", `${my}px`);
      if (visible) html.style.setProperty("--grid-active", "1");

      raf = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    const stop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      setPointer(mx, my);
      if (!visible) {
        visible = true;
        rootRef.current?.setAttribute("data-visible", "true");
      }
      start();
    };

    const onOver = (e: MouseEvent) => {
      const target = (e.target as Element | null)?.closest(HOVER_SELECTOR);
      setState(target ? "hover" : "default");
    };

    const onDown = () => setState("active");
    const onUp = (e: MouseEvent) => {
      const target = (e.target as Element | null)?.closest(HOVER_SELECTOR);
      setState(target ? "hover" : "default");
    };

    const onLeave = () => {
      visible = false;
      rootRef.current?.setAttribute("data-visible", "false");
      html.style.setProperty("--grid-active", "0");
    };

    const onEnter = () => {
      if (!coarse && visible) html.style.setProperty("--grid-active", "1");
    };

    const onMushroom = () => setState("secret");
    const onMushroomEnd = () => setState("default");

    mx = window.innerWidth * 0.5;
    my = window.innerHeight * 0.35;
    setPointer(mx, my);
    rx = mx;
    ry = my;
    start();

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    window.addEventListener("moos:mushroom-on", onMushroom);
    window.addEventListener("moos:mushroom-off", onMushroomEnd);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
      html.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("moos:mushroom-on", onMushroom);
      window.removeEventListener("moos:mushroom-off", onMushroomEnd);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="custom-cursor"
      data-state="default"
      data-visible="false"
      aria-hidden
    >
      <div ref={ringRef} className="custom-cursor__ring" />
      <div ref={dotRef} className="custom-cursor__dot" />
    </div>
  );
}
