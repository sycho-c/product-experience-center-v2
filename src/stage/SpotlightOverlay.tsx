import { useEffect, useState } from 'react';
import { useScenarioStore, selectCurrentStep } from '@/features/scenario-v2/store';
import { useAnchorContext } from './anchors/AnchorContext';

interface SpotlightRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

function findEnclosingSlot(stage: HTMLDivElement, anchorId: string): SpotlightRect | null {
  const anchorEl = stage.querySelector<HTMLElement>(`[data-anchor-id="${anchorId}"]`);
  if (!anchorEl) return null;
  // The slot wrapper is two levels up — fall back gracefully if not found.
  const slot = anchorEl.closest<HTMLElement>('[data-slot-id], [data-system-id]') ?? anchorEl.parentElement;
  if (!slot) return null;
  const stageRect = stage.getBoundingClientRect();
  const rect = slot.getBoundingClientRect();
  return {
    x: rect.left - stageRect.left,
    y: rect.top - stageRect.top,
    w: rect.width,
    h: rect.height,
  };
}

export function SpotlightOverlay() {
  const showTourGuide = useScenarioStore((s) => s.showTourGuide);
  const presentation = useScenarioStore((s) => s.presentation);
  const step = useScenarioStore(selectCurrentStep);
  const { stageRef, anchors } = useAnchorContext();
  const [rects, setRects] = useState<SpotlightRect[]>([]);
  const [stageSize, setStageSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const r = stage.getBoundingClientRect();
    setStageSize({ w: r.width, h: r.height });

    if (!step) {
      setRects([]);
      return;
    }
    const ids = step.spotlight.ids;
    const next: SpotlightRect[] = [];
    ids.forEach((id) => {
      // Resolve "sys:xxx" / "dev:xxx" base ids to an anchor we can find.
      const tryAnchorIds = [
        `${id}:center`,
        `${id}:right`,
        `${id}:left`,
        `${id}:top`,
        `${id}:bottom`,
      ];
      for (const aid of tryAnchorIds) {
        if (anchors[aid]) {
          const rect = findEnclosingSlot(stage, aid);
          if (rect) {
            next.push(rect);
            return;
          }
        }
      }
    });
    setRects(next);
  }, [step, anchors, stageRef]);

  if (!showTourGuide || presentation) return null;
  if (!step || rects.length === 0) return null;

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-20"
      width={stageSize.w}
      height={stageSize.h}
    >
      <defs>
        <mask id="spotlight-mask">
          <rect width="100%" height="100%" fill="white" />
          {rects.map((r, i) => (
            <rect
              key={i}
              x={r.x - 6}
              y={r.y - 6}
              width={r.w + 12}
              height={r.h + 12}
              rx={14}
              fill="black"
            />
          ))}
        </mask>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill="rgba(15, 23, 42, 0.16)"
        mask="url(#spotlight-mask)"
      />
    </svg>
  );
}
