import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { DevicePersona } from '@/types/scenario';

interface DeviceFrameMobileCompactProps {
  label?: string;
  persona?: DevicePersona;
  active?: boolean;
  children: ReactNode;
}

export function DeviceFrameMobileCompact({
  label,
  persona,
  active,
  children,
}: DeviceFrameMobileCompactProps) {
  return (
    <div className="flex h-full w-full min-h-0 flex-col items-center">
      <div className="flex shrink-0 items-center gap-1 pb-1">
        {persona?.avatarColor && (
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ backgroundColor: persona.avatarColor }}
          />
        )}
        <span className="stage-text-xs font-medium text-ink-secondary">
          {label ?? persona?.name ?? 'Guest'}
        </span>
      </div>
      <div
        className={cn(
          'relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[18px] border-[3px] bg-surface-card shadow-elev transition-all duration-300',
          active
            ? 'border-brand-primary ring-2 ring-brand-primary/30'
            : 'border-ink-primary/85'
        )}
        style={{ aspectRatio: '9 / 17' }}
      >
        <div className="relative h-3 shrink-0 bg-surface-card">
          <span className="absolute left-1/2 top-0.5 h-1.5 w-6 -translate-x-1/2 rounded-full bg-ink-primary/85" />
        </div>
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-surface-canvas">
          {children}
        </div>
      </div>
    </div>
  );
}
