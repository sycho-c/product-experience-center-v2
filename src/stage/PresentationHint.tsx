import { useEffect, useState } from 'react';
import { Maximize2 } from 'lucide-react';
import { useScenarioStore } from '@/features/scenario-v2/store';

export function PresentationHint() {
  const presentation = useScenarioStore((s) => s.presentation);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setVisible(false), 4500);
    return () => window.clearTimeout(t);
  }, []);

  if (presentation || !visible) return null;

  return (
    <div className="pointer-events-none absolute right-3 top-3 z-30 flex animate-fade-in items-center gap-1 rounded-full border border-surface-border bg-white/90 px-2.5 py-1 stage-text-xs text-ink-secondary shadow-soft backdrop-blur">
      <Maximize2 className="h-3 w-3 text-brand-primary" />
      <span>발표 모드는 우상단 아이콘 또는 F11</span>
    </div>
  );
}
