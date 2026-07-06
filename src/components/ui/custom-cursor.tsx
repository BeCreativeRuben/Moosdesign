"use client";

import { useEffect, useRef } from "react";
import { ensureFrameLoop, subscribeFrame } from "@/lib/viewport/frame-loop";
import { getLenis } from "@/lib/viewport/lenis-instance";
import { setPointer } from "@/lib/viewport/pointer-state";

type CursorState = "default" | "hover" | "active" | "secret";

const HOVER_SELECTOR =
  "a, button, [role='button'], input, textarea, select, label, summary, [data-cursor='hover']";

const RING_LERP = 0.28;
const IDLE_MS = 120;

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

    let mx = window.innerWidth * 0.5;
    let my = window.innerHeight * 0.35;
    let rx = mx;
    let ry = my;
    let state: CursorState = "default";
    let visible = false;
    let lastMove = performance.now();
    let hoverTarget: Element | null = null;

    const setState = (next: CursorState) => {
      if (state === next) return;
      state = next;
      rootRef.current?.setAttribute("data-state", next);
    };

    const syncHover = (target: Element | null) => {
      const next = target?.closest(HOVER_SELECTOR) ?? null;
      if (hoverTarget === next) return;
      hoverTarget = next;
      setState(next ? "hover" : "default");
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;

      mx = e.clientX;
      my = e.clientY;
      lastMove = performance.now();
      setPointer(mx, my);

      if (!visible) {
        visible = true;
        rootRef.current?.setAttribute("data-visible", "true");
      }

      syncHover(e.target as Element | null);
      ensureFrameLoop();
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      setState("active");
    };

    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      syncHover(e.target as Element | null);
    };

    const onLeave = () => {
      visible = false;
      rootRef.current?.setAttribute("data-visible", "false");
    };

    const onEnter = () => {
      if (visible) rootRef.current?.setAttribute("data-visible", "true");
    };

    const onMushroom = () => setState("secret");
    const onMushroomEnd = () => setState(hoverTarget ? "hover" : "default");

    const unsubscribe = subscribeFrame(() => {
      const ring = ringRef.current;
      const dot = dotRef.current;
      const scrolling = getLenis()?.isSmooth === true;

      const dx = mx - rx;
      const dy = my - ry;
      const moving = Math.abs(dx) > 0.35 || Math.abs(dy) > 0.35;
      const recent = performance.now() - lastMove < IDLE_MS;

      if (scrolling) {
        rx = mx;
        ry = my;
      } else if (moving) {
        rx += dx * RING_LERP;
        ry += dy * RING_LERP;
      } else {
        rx = mx;
        ry = my;
      }

      if (ring) {
        ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      }
      if (dot) {
        dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      }

      if (scrolling) return false;

      return moving || recent || state === "active";
    });

    setPointer(mx, my);
    ensureFrameLoop();

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.documentElement.addEventListener("pointerenter", onEnter);
    window.addEventListener("moos:mushroom-on", onMushroom);
    window.addEventListener("moos:mushroom-off", onMushroomEnd);

    return () => {
      unsubscribe();
      html.classList.remove("custom-cursor-active");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.removeEventListener("pointerenter", onEnter);
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
      <div ref={ringRef} className="custom-cursor__ring">
        <span className="custom-cursor__crosshair" aria-hidden />
      </div>
      <div ref={dotRef} className="custom-cursor__dot" />
    </div>
  );
}
