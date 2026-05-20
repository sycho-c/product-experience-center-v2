import { cn } from '@/lib/utils';
import { useScenarioStore } from '@/features/scenario-v2/store';
import { AnchorProvider, useAnchorContext } from './anchors/AnchorContext';
import { SystemColumn } from './SystemColumn';
import { DeviceGrid } from './DeviceGrid';
import { ConnectionCanvas } from './ConnectionCanvas';
import { TourGuide } from './TourGuide';
import { SpotlightOverlay } from './SpotlightOverlay';
import { BeforeNarrative } from './BeforeNarrative';
import { PresentationHint } from './PresentationHint';

function StageInner() {
  const showTourGuide = useScenarioStore((s) => s.showTourGuide);
  const mode = useScenarioStore((s) => s.mode);
  const { stageRef } = useAnchorContext();

  return (
    <div className="mx-auto w-full max-w-[1600px] px-6">
      <div
        ref={stageRef}
        className={cn(
          'relative aspect-video w-full overflow-hidden rounded-2xl border border-surface-border bg-surface-canvas shadow-elev',
          'stage-padding'
        )}
        style={{
          display: 'grid',
          gridTemplateColumns: showTourGuide ? '1fr 20%' : '1fr 12%',
          gridTemplateRows: '1fr 26%',
          gridTemplateAreas: `"devices tour" "systems tour"`,
          gap: 'clamp(8px, 1.1vw, 16px)',
          transition: 'grid-template-columns 300ms ease',
          minHeight: 0,
        }}
      >
        <div style={{ gridArea: 'devices', minHeight: 0, minWidth: 0 }}>
          <DeviceGrid />
        </div>
        <div style={{ gridArea: 'tour', minHeight: 0, minWidth: 0 }}>
          <TourGuide />
        </div>
        <div style={{ gridArea: 'systems', minHeight: 0, minWidth: 0 }}>
          {mode === 'before' ? <BeforeNarrative /> : <SystemColumn />}
        </div>
        <ConnectionCanvas />
        <SpotlightOverlay />
        <PresentationHint />
      </div>
    </div>
  );
}

export function Stage() {
  return (
    <AnchorProvider>
      <StageInner />
    </AnchorProvider>
  );
}
