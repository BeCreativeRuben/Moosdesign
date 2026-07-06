/**
 * Lightweight static backdrop — no per-frame mask updates.
 * Landing sections use their own opaque surfaces; this only tints the canvas.
 */
export function InteractiveGridBackground() {
  return <div className="site-backdrop" aria-hidden />;
}
