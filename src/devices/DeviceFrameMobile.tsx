import type { ReactNode } from 'react';
import { Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeviceFrameMobileProps {
  label?: string;
  active?: boolean;
  children: ReactNode;
}

export function DeviceFrameMobile({
  label = 'Mobile',
  active,
  children,
}: DeviceFrameMobileProps) {
  return (
    <div className="flex h-full w-full min-h-0 flex-col items-center">
      <div className="flex shrink-0 justify-center pb-1">
        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 stage-text-xs font-medium text-ink-secondary shadow-soft">
          <Smartphone className="h-2.5 w-2.5" />
          {label}
        </span>
      </div>
      <div
        className={cn(
          'relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[24px] border-[4px] bg-surface-card shadow-elev transition-all duration-300',
          active
            ? 'border-brand-primary ring-2 ring-brand-primary/30'
            : 'border-ink-primary/85'
        )}
        style={{ aspectRatio: '9 / 19.5' }}
      >
        <div className="relative h-5 shrink-0 bg-surface-card">
          <span className="absolute left-2 top-1 text-[9px] font-medium text-ink-secondary">
            9:41
          </span>
          <span className="absolute left-1/2 top-0.5 h-2.5 w-10 -translate-x-1/2 rounded-full bg-ink-primary/85" />
        </div>
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-surface-canvas">
          {children}
        </div>
      </div>
    </div>
  );
}
