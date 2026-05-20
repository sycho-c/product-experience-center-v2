import { AlertTriangle } from 'lucide-react';
import { useScenarioStore } from '@/features/scenario-v2/store';

export function BeforeNarrative() {
  const scenario = useScenarioStore((s) => s.scenario);
  if (!scenario?.beforeNarrative) {
    return (
      <aside className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-surface-border bg-white/60 p-3 text-center">
        <span className="stage-text-xs text-ink-muted">Before 자료 없음</span>
      </aside>
    );
  }

  const { summary, limitations } = scenario.beforeNarrative;

  return (
    <aside className="flex h-full flex-col gap-2 rounded-2xl border-2 border-rose-200 bg-rose-50/70 p-3">
      <header className="flex items-center gap-1.5">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-rose-600">
          <AlertTriangle className="h-3.5 w-3.5" />
        </span>
        <span className="stage-text-sm font-semibold text-rose-700">{summary}</span>
      </header>
      <ul className="flex flex-1 flex-col gap-1.5">
        {limitations.map((l, i) => (
          <li
            key={i}
            className="flex items-start gap-1.5 rounded-lg bg-white/80 p-2 stage-text-xs text-ink-primary shadow-soft"
          >
            <span className="mt-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
            <span>{l}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
