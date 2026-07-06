"use client";

import { useEffect } from "react";
import { revealSecret } from "@/components/ui/secret-toast";
import { GRID_WHISPERS, whisperPosition } from "@/lib/viewport/grid-whispers";
import { getPointer } from "@/lib/viewport/pointer-state";

const VOID_SELECTOR =
  "a, button, input, textarea, select, .landing, header, footer, [data-secret], label";

function localeFromPath() {
  return window.location.pathname.startsWith("/en") ? "en" : "nl";
}

function distance(x1: number, y1: number, x2: number, y2: number) {
  return Math.hypot(x1 - x2, y1 - y2);
}

export function GridSecrets() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarse) return;

    const html = document.documentElement;
    const corners = new Set<number>();
    let cornerTimer = 0;
    let cornerRewarded = false;

    let voidClicks = 0;
    let voidTimer = 0;

    let scanTimer = 0;
    const foundSecrets = new Set<string>();
    const dwellStart: Record<string, number> = {};

    const resetCorners = () => {
      corners.clear();
      if (cornerTimer) window.clearTimeout(cornerTimer);
    };

    const resetVoidClicks = () => {
      voidClicks = 0;
      if (voidTimer) window.clearTimeout(voidTimer);
    };

    const activateScan = () => {
      const locale = localeFromPath();
      html.classList.add("grid-scan");
      revealSecret({
        id: "grid-scan",
        title: locale === "nl" ? "GRID SCAN" : "GRID SCAN",
        message:
          locale === "nl"
            ? "Verborgen labels zichtbaar. 5 seconden."
            : "Hidden labels revealed. 5 seconds.",
      });
      if (scanTimer) window.clearTimeout(scanTimer);
      scanTimer = window.setTimeout(() => {
        html.classList.remove("grid-scan");
      }, 5000);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const active = document.activeElement;
      const typing =
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement ||
        active instanceof HTMLSelectElement;
      if (typing) return;

      if (e.altKey && e.code === "KeyG") {
        e.preventDefault();
        activateScan();
      }
    };

    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target || target.closest(VOID_SELECTOR)) return;

      voidClicks += 1;
      if (voidTimer) window.clearTimeout(voidTimer);
      voidTimer = window.setTimeout(resetVoidClicks, 700);

      if (voidClicks >= 3) {
        resetVoidClicks();
        const locale = localeFromPath();
        revealSecret({
          id: "void-gap",
          title: locale === "nl" ? "LEGE RUIMTE" : "EMPTY SPACE",
          message:
            locale === "nl"
              ? "Tussen de panelen leeft de grid."
              : "Between the panels, the grid lives.",
        });
        html.classList.add("moos-pulse");
        window.setTimeout(() => html.classList.remove("moos-pulse"), 700);
      }
    };

    const tick = () => {
      const { mx, my } = getPointer();
      const locale = localeFromPath();
      const margin = 48;

      if (!cornerRewarded) {
        if (mx < margin && my < margin) corners.add(0);
        if (mx > window.innerWidth - margin && my < margin) corners.add(1);
        if (mx < margin && my > window.innerHeight - margin) corners.add(2);
        if (mx > window.innerWidth - margin && my > window.innerHeight - margin) corners.add(3);

        if (corners.size === 1 && !cornerTimer) {
          cornerTimer = window.setTimeout(resetCorners, 14000);
        }

        if (corners.size >= 4) {
          cornerRewarded = true;
          resetCorners();
          revealSecret({
            id: "perimeter",
            title: locale === "nl" ? "PERIMETER" : "PERIMETER",
            message:
              locale === "nl"
                ? "Je hebt de rand van het veld afgetast."
                : "You traced the edge of the field.",
          });
          html.classList.add("grid-scan");
          window.setTimeout(() => html.classList.remove("grid-scan"), 4000);
        }
      }

      for (const whisper of GRID_WHISPERS) {
        if (!whisper.secret || foundSecrets.has(whisper.id)) continue;

        const { x, y } = whisperPosition(whisper.col, whisper.row);
        const near = distance(mx, my, x, y) < 72;

        if (!near) {
          delete dwellStart[whisper.id];
          continue;
        }

        if (!dwellStart[whisper.id]) {
          dwellStart[whisper.id] = performance.now();
          continue;
        }

        const dwellMs = performance.now() - dwellStart[whisper.id];

        if (whisper.secret === "moos" && dwellMs > 1800) {
          foundSecrets.add(whisper.id);
          revealSecret({
            id: "grid-moos",
            title: locale === "nl" ? "GRID WOORD" : "GRID WORD",
            message:
              locale === "nl"
                ? "Je vond MOOS in de concrete."
                : "You found MOOS in the concrete.",
          });
          html.classList.add("moos-pulse");
          window.setTimeout(() => html.classList.remove("moos-pulse"), 700);
        }

        if (whisper.secret === "question" && dwellMs > 1400) {
          foundSecrets.add(whisper.id);
          revealSecret({
            id: "grid-question",
            title: locale === "nl" ? "VERDER" : "KEEP GOING",
            message:
              locale === "nl"
                ? "Niet alles staat op de grid. Sommige dingen moet je typen."
                : "Not everything is on the grid. Some things you have to type.",
          });
        }
      }
    };

    const interval = window.setInterval(tick, 120);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("click", onClick);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("click", onClick);
      if (cornerTimer) window.clearTimeout(cornerTimer);
      if (voidTimer) window.clearTimeout(voidTimer);
      if (scanTimer) window.clearTimeout(scanTimer);
      html.classList.remove("grid-scan");
    };
  }, []);

  return null;
}
