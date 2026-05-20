import type { ReactNode } from 'react';
import { Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DeviceFramePCProps {
  label?: string;
  active?: boolean;
  children: ReactNode;
}

export function DeviceFramePC({ label = 'Workspace', active, children }: DeviceFramePCProps) {
  return (
    <div className="flex h-full w-full min-h-0 min-w-0 flex-col items-center">
      <div className="flex shrink-0 justify-center pb-1">
        <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 stage-text-xs font-medium text-ink-secondary shadow-soft">
          <Monitor className="h-2.5 w-2.5" />
          {label}
        </span>
      </div>
      <div
        className={cn(
          'relative flex min-h-0 min-w-0 w-full flex-1 flex-col overflow-hidden rounded-lg border bg-surface-card shadow-soft transition-all duration-300',
          active ? 'border-brand-primary ring-2 ring-brand-primary/30' : 'border-surface-border'
        )}
      >
        {children}
      </div>
    </div>
  );
}
