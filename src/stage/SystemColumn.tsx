import { useScenarioStore, selectCurrentStep } from '@/features/scenario-v2/store';
import { cn } from '@/lib/utils';
import { AnchorPoint } from './anchors/AnchorPoint';
import { makeSystemAnchorId } from '@/types/anchor';
import type { SystemNode } from '@/types/scenario';

const ACCENT_BG: Record<NonNullable<SystemNode['accent']>, string> = {
  indigo: 'bg-indigo-50 text-indigo-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  sky: 'bg-sky-50 text-sky-600',
  rose: 'bg-rose-50 text-rose-600',
  slate: 'bg-slate-100 text-slate-600',
};

export function SystemColumn() {
  const scenario = useScenarioStore((s) => s.scenario);
  const step = useScenarioStore(selectCurrentStep);

  if (!scenario) return null;

  return (
    <aside className="relative flex h-full min-h-0 flex-col gap-1 overflow-hidden rounded-2xl bg-white/60 p-1.5 backdrop-blur-sm">
      <header className="flex items-center justify-between px-0.5">
        <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-ink-muted">
          고객사 시스템
        </span>
        <span className="text-[9px] text-ink-muted">
          {scenario.systems.length}개 연계
        </span>
      </header>

      <ul
        className="grid flex-1 gap-1"
        style={{ gridTemplateColumns: `repeat(${scenario.systems.length}, minmax(0, 1fr))` }}
      >
        {scenario.systems.map((node) => {
          const isActive = step?.activeSystems.includes(node.id) ?? false;
          const status =
            step?.systemStatuses?.[node.id] ??
            (isActive ? node.activeStatus ?? '동작 중' : node.defaultStatus ?? '연동 대기');
          const Icon = node.icon;
          const accent = ACCENT_BG[node.accent ?? 'slate'];
          return (
            <li
              key={node.id}
              data-system-id={node.id}
              className={cn(
                'relative flex min-h-0 min-w-0 flex-col gap-0.5 rounded-lg border bg-white px-1.5 py-1.5 transition-all duration-300',
                isActive
                  ? 'border-brand-primary shadow-spotlight'
                  : 'border-surface-border opacity-90'
              )}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-md',
                    accent
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col leading-tight">
                  <span className="truncate text-[11px] font-semibold text-ink-primary">
                    {node.label}
                  </span>
                  {node.labelEn && (
                    <span className="truncate text-[9px] text-ink-muted">{node.labelEn}</span>
                  )}
                </div>
              </div>
              <span
                className={cn(
                  'flex items-center gap-1 text-[9px] leading-tight',
                  isActive ? 'text-brand-primary' : 'text-ink-muted'
                )}
              >
                <span
                  className={cn(
                    'inline-block h-1 w-1 shrink-0 rounded-full',
                    isActive ? 'animate-pulse-ring bg-brand-primary' : 'bg-ink-subtle'
                  )}
                />
                <span className="truncate">{status}</span>
              </span>
              <AnchorPoint id={makeSystemAnchorId(node.id, 'top')} position="top" />
              <AnchorPoint id={makeSystemAnchorId(node.id, 'bottom')} position="bottom" />
              <AnchorPoint id={makeSystemAnchorId(node.id, 'left')} position="left" />
              <AnchorPoint id={makeSystemAnchorId(node.id, 'right')} position="right" />
              <AnchorPoint id={makeSystemAnchorId(node.id, 'center')} position="center" />
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
