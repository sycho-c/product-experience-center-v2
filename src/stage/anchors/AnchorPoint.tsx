import type { CSSProperties } from 'react';
import { useAnchor } from './useAnchor';

interface AnchorPointProps {
  id: string;
  /** Position the anchor relative to its parent's bounds */
  position?: 'left' | 'right' | 'top' | 'bottom' | 'center';
}

/**
 * Hidden 1x1 element that registers a named anchor position. Drop one inside any
 * container whose center/edge you want connection lines to attach to. The parent
 * must be `position: relative`.
 */
export function AnchorPoint({ id, position = 'center' }: AnchorPointProps) {
  const ref = useAnchor(id);
  const style: CSSProperties = {
    position: 'absolute',
    width: 1,
    height: 1,
    pointerEvents: 'none',
  };
  if (position === 'left') {
    style.left = 0;
    style.top = '50%';
  } else if (position === 'right') {
    style.right = 0;
    style.top = '50%';
  } else if (position === 'top') {
    style.top = 0;
    style.left = '50%';
  } else if (position === 'bottom') {
    style.bottom = 0;
    style.left = '50%';
  } else {
    style.top = '50%';
    style.left = '50%';
  }
  return <div ref={ref} data-anchor-id={id} style={style} aria-hidden />;
}
