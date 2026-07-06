let mx = 0;
let my = 0;

export function setPointer(x: number, y: number) {
  mx = x;
  my = y;
}

export function getPointer() {
  return { mx, my };
}
