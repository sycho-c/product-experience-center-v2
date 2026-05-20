import { useEffect, useRef } from 'react';
import { useAnchorContext } from './AnchorContext';

/**
 * Returns a ref to attach to a hidden anchor element. The element's center
 * position becomes available in the anchor map under the given id.
 */
export function useAnchor(id: string) {
  const { register } = useAnchorContext();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const unregister = register(id, ref.current);
    return unregister;
  }, [id, register]);

  return ref;
}
