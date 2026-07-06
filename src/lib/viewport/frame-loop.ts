type FrameCallback = (time: number) => boolean | void;

const subscribers = new Set<FrameCallback>();
let rafId = 0;
let running = false;

function tick(time: number) {
  let keepAlive = false;

  for (const cb of subscribers) {
    if (cb(time) === true) keepAlive = true;
  }

  if (keepAlive && !document.hidden) {
    rafId = requestAnimationFrame(tick);
  } else {
    running = false;
    rafId = 0;
  }
}

export function subscribeFrame(callback: FrameCallback) {
  subscribers.add(callback);
  ensureFrameLoop();
  return () => {
    subscribers.delete(callback);
  };
}

export function ensureFrameLoop() {
  if (running || document.hidden) return;
  running = true;
  rafId = requestAnimationFrame(tick);
}

export function cancelFrameLoop() {
  if (!rafId) return;
  cancelAnimationFrame(rafId);
  rafId = 0;
  running = false;
}

if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelFrameLoop();
    else ensureFrameLoop();
  });
}
