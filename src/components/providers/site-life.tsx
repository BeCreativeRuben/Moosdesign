"use client";

import { useEffect } from "react";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { SecretToast, revealSecret } from "@/components/ui/secret-toast";
import { GridSecrets } from "@/components/providers/grid-secrets";
import { GridWhispers } from "@/components/ui/grid-whispers";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
] as const;

const MOOS = "moos";

function localeFromPath() {
  return window.location.pathname.startsWith("/en") ? "en" : "nl";
}

function copy(locale: "en" | "nl") {
  return {
    mushroom: {
      id: "mushroom",
      title: locale === "nl" ? "SPORENMODUS" : "MUSHROOM MODE",
      message:
        locale === "nl"
          ? "De grid ademt. Alles voelt een beetje vreemder."
          : "The grid breathes. Everything feels a little stranger.",
    },
    spores: {
      id: "spores",
      title: locale === "nl" ? "SPOREN GEVONDEN" : "SPORES FOUND",
      message:
        locale === "nl"
          ? "Je hebt het goede pad gevonden."
          : "You found the right path.",
    },
    logo: {
      id: "logo",
      title: locale === "nl" ? "KERN GEACTIVEERD" : "CORE ACTIVATED",
      message:
        locale === "nl"
          ? "Moosdesign zit in de filament."
          : "Moosdesign lives in the filament.",
    },
  };
}

function activateMushroom(durationMs = 14000) {
  const html = document.documentElement;
  if (html.classList.contains("mushroom-mode")) return;

  html.classList.add("mushroom-mode");
  window.dispatchEvent(new Event("moos:mushroom-on"));

  window.setTimeout(() => {
    html.classList.remove("mushroom-mode");
    window.dispatchEvent(new Event("moos:mushroom-off"));
  }, durationMs);
}

function logConsoleHints() {
  if (typeof window === "undefined") return;
  const locale = localeFromPath();
  const hint =
    locale === "nl"
      ? "probeer moos. probeer ↑↑↓↓←→←→BA. de grid onthoudt. alt+G."
      : "try moos. try ↑↑↓↓←→←→BA. the grid remembers. alt+G.";

  console.info(
    "%c Moosdesign %c 🍄 ",
    "background:#1a1a1a;color:#ece8df;padding:2px 6px;font-family:monospace;",
    "background:#d62828;color:#ece8df;padding:2px 6px;font-family:monospace;",
    hint,
  );
}

export function SiteLife() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    logConsoleHints();

    if (reduced || coarse) return;

    let konamiStep = 0;
    let moosBuffer = "";
    let moosTimer = 0;
    let archiveClicks = 0;
    let archiveTimer = 0;
    let logoClicks = 0;
    let logoTimer = 0;

    const resetArchive = () => {
      archiveClicks = 0;
      if (archiveTimer) window.clearTimeout(archiveTimer);
    };

    const resetLogo = () => {
      logoClicks = 0;
      if (logoTimer) window.clearTimeout(logoTimer);
    };

    const isTyping = () => {
      const active = document.activeElement;
      return (
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement ||
        active instanceof HTMLSelectElement ||
        active?.getAttribute("contenteditable") === "true"
      );
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const locale = localeFromPath();
      const t = copy(locale);

      if (!isTyping()) {
        if (e.code === KONAMI[konamiStep]) {
          konamiStep += 1;
          if (konamiStep === KONAMI.length) {
            konamiStep = 0;
            revealSecret(t.mushroom);
            activateMushroom();
          }
          return;
        }
        konamiStep = e.code === KONAMI[0] ? 1 : 0;

        if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
          moosBuffer = (moosBuffer + e.key.toLowerCase()).slice(-MOOS.length);
          if (moosTimer) window.clearTimeout(moosTimer);
          moosTimer = window.setTimeout(() => {
            moosBuffer = "";
          }, 2400);

          if (moosBuffer === MOOS) {
            moosBuffer = "";
            revealSecret(t.spores);
            activateMushroom(9000);
            htmlPulse();
          }
        }
      }

      if (e.shiftKey) {
        document.documentElement.classList.add("grid-scan");
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (!e.shiftKey) {
        document.documentElement.classList.remove("grid-scan");
      }
    };

    const htmlPulse = () => {
      document.documentElement.classList.add("moos-pulse");
      window.setTimeout(() => {
        document.documentElement.classList.remove("moos-pulse");
      }, 700);
    };

    const onClick = (e: MouseEvent) => {
      const locale = localeFromPath();
      const t = copy(locale);
      const target = e.target as Element | null;
      if (!target) return;

      const secret = target.closest("[data-secret]");
      const id = secret?.getAttribute("data-secret");
      if (!id) return;

      if (id === "archive") {
        archiveClicks += 1;
        if (archiveTimer) window.clearTimeout(archiveTimer);
        archiveTimer = window.setTimeout(resetArchive, 2800);
        if (archiveClicks >= 3) {
          resetArchive();
          revealSecret({
            id: "void",
            title: locale === "nl" ? "LEGE LAAG" : "EMPTY LAYER",
            message:
              locale === "nl"
                ? "Soms is de mooiste print degene die je niet ziet."
                : "Sometimes the best print is the one you never see.",
          });
          activateMushroom(6000);
        }
        return;
      }

      if (id === "logo") {
        logoClicks += 1;
        if (logoTimer) window.clearTimeout(logoTimer);
        logoTimer = window.setTimeout(resetLogo, 2400);
        if (logoClicks >= 4) {
          resetLogo();
          revealSecret(t.logo);
          htmlPulse();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("click", onClick);
      if (moosTimer) window.clearTimeout(moosTimer);
      if (archiveTimer) window.clearTimeout(archiveTimer);
      if (logoTimer) window.clearTimeout(logoTimer);
    };
  }, []);

  return (
    <>
      <CustomCursor />
      <GridWhispers />
      <GridSecrets />
      <SecretToast />
    </>
  );
}
