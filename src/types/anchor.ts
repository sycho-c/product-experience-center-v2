export type AnchorSide = 'left' | 'right' | 'top' | 'bottom' | 'center';

export interface AnchorPoint {
  x: number;
  y: number;
}

export type AnchorMap = Record<string, AnchorPoint>;

/**
 * Anchor id convention:
 *   system right edge → `sys:{nodeId}:right`
 *   device left/right/top/bottom → `dev:{slotId}:{side}`
 */
export function makeSystemAnchorId(nodeId: string, side: AnchorSide = 'top') {
  return `sys:${nodeId}:${side}`;
}

export function makeDeviceAnchorId(slotId: string, side: AnchorSide) {
  return `dev:${slotId}:${side}`;
}
