export const GRID_SIZE = 48;

export type GridWhisper = {
  id: string;
  col: number;
  row: number;
  en: string;
  nl: string;
  secret?: "moos" | "question";
};

/** Hidden labels aligned to grid intersections — lit by the cursor spotlight. */
export const GRID_WHISPERS: GridWhisper[] = [
  { id: "md", col: 5, row: 3, en: "MD", nl: "MD" },
  { id: "layer", col: 3, row: 8, en: "LAYER 01", nl: "LAAG 01" },
  { id: "inf", col: 9, row: 5, en: "∞", nl: "∞" },
  { id: "spore", col: 14, row: 2, en: "SPORE", nl: "SPOOR" },
  { id: "moos", col: 7, row: 11, en: "MOOS", nl: "MOOS", secret: "moos" },
  { id: "fdm", col: 2, row: 14, en: "FDM", nl: "FDM" },
  { id: "be", col: 17, row: 9, en: "BE", nl: "BE" },
  { id: "question", col: 12, row: 13, en: "?", nl: "?", secret: "question" },
];

export function whisperPosition(col: number, row: number) {
  return {
    x: col * GRID_SIZE + GRID_SIZE / 2,
    y: row * GRID_SIZE + GRID_SIZE / 2,
  };
}
