import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from 'react';
import type { AnchorMap, AnchorPoint } from '@/types/anchor';

interface AnchorContextValue {
  /** Register an anchor element. Returns an unregister callback. */
  register: (id: string, el: HTMLElement | null) => () => void;
  /** Mounted anchor positions, relative to the stage root. */
  anchors: AnchorMap;
  /** Trigger an immediate recomputation (e.g. after route/scenario change). */
  recompute: () => void;
  /** Ref pointing at the stage root — anchor positions are computed relative to its bounding rect. */
  stageRef: MutableRefObject<HTMLDivElement | null>;
}

const AnchorContext = createContext<AnchorContextValue | null>(null);

export function AnchorProvider({ children }: { children: ReactNode }) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const elementsRef = useRef<Map<string, HTMLElement>>(new Map());
  const [anchors, setAnchors] = useState<AnchorMap>({});
  const rafRef = useRef<number | null>(null);

  const compute = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const stageRect = stage.getBoundingClientRect();
    const next: AnchorMap = {};
    elementsRef.current.forEach((el, id) => {
      if (!el.isConnected) return;
      const rect = el.getBoundingClientRect();
      const point: AnchorPoint = {
        x: rect.left + rect.width / 2 - stageRect.left,
        y: rect.top + rect.height / 2 - stageRect.top,
      };
      next[id] = point;
    });
    setAnchors((prev) => {
      const prevKeys = Object.keys(prev);
      const nextKeys = Object.keys(next);
      if (prevKeys.length === nextKeys.length) {
        let same = true;
        for (const k of nextKeys) {
          const a = prev[k];
          const b = next[k];
          if (!a || Math.abs(a.x - b.x) > 0.5 || Math.abs(a.y - b.y) > 0.5) {
            same = false;
            break;
          }
        }
        if (same) return prev;
      }
      return next;
    });
  }, []);

  const scheduleCompute = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      compute();
    });
  }, [compute]);

  const register = useCallback(
    (id: string, el: HTMLElement | null) => {
      if (!el) return () => {};
      elementsRef.current.set(id, el);
      scheduleCompute();
      return () => {
        const current = elementsRef.current.get(id);
        if (current === el) {
          elementsRef.current.delete(id);
          scheduleCompute();
        }
      };
    },
    [scheduleCompute]
  );

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const ro = new ResizeObserver(scheduleCompute);
    ro.observe(stage);
    const onScroll = () => scheduleCompute();
    window.addEventListener('resize', scheduleCompute);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', scheduleCompute);
      window.removeEventListener('scroll', onScroll, true);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [scheduleCompute]);

  const value = useMemo<AnchorContextValue>(
    () => ({ register, anchors, recompute: compute, stageRef }),
    [register, anchors, compute]
  );

  return <AnchorContext.Provider value={value}>{children}</AnchorContext.Provider>;
}

export function useAnchorContext() {
  const ctx = useContext(AnchorContext);
  if (!ctx) {
    throw new Error('useAnchorContext must be used within <AnchorProvider>');
  }
  return ctx;
}
