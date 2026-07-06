"use client";

import { useLocale } from "next-intl";
import { GRID_SIZE, GRID_WHISPERS } from "@/lib/viewport/grid-whispers";

export function GridWhispers() {
  const locale = useLocale();

  return (
    <div className="interactive-grid-bg__whispers" aria-hidden>
      {GRID_WHISPERS.map((whisper) => (
        <span
          key={whisper.id}
          data-grid-whisper={whisper.id}
          className="grid-whisper"
          style={{
            left: whisper.col * GRID_SIZE + GRID_SIZE / 2,
            top: whisper.row * GRID_SIZE + GRID_SIZE / 2,
          }}
        >
          {locale === "nl" ? whisper.nl : whisper.en}
        </span>
      ))}
    </div>
  );
}
