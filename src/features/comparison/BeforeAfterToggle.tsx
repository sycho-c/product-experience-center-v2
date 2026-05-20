import { cn } from '@/lib/utils';
import { useScenarioStore } from '@/features/scenario-v2/store';

export function BeforeAfterToggle() {
  const mode = useScenarioStore((s) => s.mode);
  const setMode = useScenarioStore((s) => s.setMode);

  return (
    <div className="grid grid-cols-2 gap-1 rounded-lg border border-surface-border bg-white p-0.5">
      <button
        onClick={() => setMode('before')}
        className={cn(
          'flex flex-col items-center justify-center rounded-md px-2.5 py-1 text-[10px] font-medium leading-tight transition-colors',
          mode === 'before'
            ? 'bg-rose-500 text-white'
            : 'text-ink-secondary hover:bg-surface-subtle'
        )}
      >
        <span className="font-bold">BEFORE</span>
        <span>카카오톡</span>
      </button>
      <button
        onClick={() => setMode('after')}
        className={cn(
          'flex flex-col items-center justify-center rounded-md px-2.5 py-1 text-[10px] font-medium leading-tight transition-colors',
          mode === 'after'
            ? 'bg-brand-primary text-white'
            : 'text-ink-secondary hover:bg-surface-subtle'
        )}
      >
        <span className="font-bold">AFTER</span>
        <span>제품 (Cowork+)</span>
      </button>
    </div>
  );
}
