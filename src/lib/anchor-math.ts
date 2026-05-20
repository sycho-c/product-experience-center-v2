import type { AnchorPoint } from '@/types/anchor';

/**
 * Generate a cubic-bezier SVG path connecting two anchor points. The control
 * points are pushed horizontally so the curve sweeps naturally even for
 * connections that traverse multiple grid columns.
 */
export function bezierPath(from: AnchorPoint, to: AnchorPoint): string {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const isHorizontal = Math.abs(dx) >= Math.abs(dy);
  if (isHorizontal) {
    const offset = Math.max(40, Math.abs(dx) * 0.45);
    return `M ${from.x},${from.y} C ${from.x + Math.sign(dx) * offset},${from.y} ${to.x - Math.sign(dx) * offset},${to.y} ${to.x},${to.y}`;
  }
  const offset = Math.max(30, Math.abs(dy) * 0.45);
  return `M ${from.x},${from.y} C ${from.x},${from.y + Math.sign(dy) * offset} ${to.x},${to.y - Math.sign(dy) * offset} ${to.x},${to.y}`;
}

/**
 * Rectangle covering both points, padded outwards. Useful for spotlight masks.
 */
export function rectBetween(a: AnchorPoint, b: AnchorPoint, pad = 12) {
  const x = Math.min(a.x, b.x) - pad;
  const y = Math.min(a.y, b.y) - pad;
  const w = Math.abs(a.x - b.x) + pad * 2;
  const h = Math.abs(a.y - b.y) + pad * 2;
  return { x, y, w, h };
}
