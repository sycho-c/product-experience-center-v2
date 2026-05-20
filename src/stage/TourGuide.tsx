import { useScenarioStore, selectCurrentStep } from '@/features/scenario-v2/store';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { StepProgressStrip } from './StepProgressStrip';

export function TourGuide() {
  const scenario = useScenarioStore((s) => s.scenario);
  const showTourGuide = useScenarioStore((s) => s.showTourGuide);
  const step = useScenarioStore(selectCurrentStep);
  const stepIndex = useScenarioStore((s) => s.stepIndex);
  const next = useScenarioStore((s) => s.next);
  const prev = useScenarioStore((s) => s.prev);

  if (!scenario) return null;
  const total = scenario.steps.length;
  const progress = Math.round(((stepIndex + 1) / total) * 100);

  if (!showTourGuide) {
    return (
      <aside className="relative z-30 flex h-full flex-col items-center justify-between rounded-2xl bg-white/70 p-2 backdrop-blur-sm">
        <div className="stage-text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
          STEP
        </div>
        <div className="flex flex-col items-center">
          <span className="stage-text-lg font-bold text-brand-primary">
            {String(stepIndex + 1).padStart(2, '0')}
          </span>
          <span className="stage-text-xs text-ink-muted">/ {String(total).padStart(2, '0')}</span>
        </div>
        <StepProgressStrip orientation="vertical" />
      </aside>
    );
  }

  return (
    <aside className="relative z-30 flex h-full flex-col gap-2 rounded-2xl border border-surface-border bg-white p-3 shadow-soft">
      <header className="flex items-center justify-between">
        <span className="stage-text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
          STEP {String(stepIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <Sparkles className="h-3 w-3 text-brand-primary" />
      </header>

      <div className="flex flex-col gap-1">
        <h3 className="stage-text-base font-bold leading-tight text-ink-primary">
          {step?.title}
        </h3>
        <p className="stage-text-xs leading-relaxed text-ink-secondary">
          {step?.description}
        </p>
      </div>

      <div className="my-1 h-1 w-full overflow-hidden rounded-full bg-surface-subtle">
        <div
          className="h-full bg-brand-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={prev}
          disabled={stepIndex === 0}
          className="flex-1"
        >
          <ChevronLeft className="h-3 w-3" /> 이전
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={next}
          disabled={stepIndex >= total - 1}
          className="flex-1"
        >
          다음 <ChevronRight className="h-3 w-3" />
        </Button>
      </div>

      <div
        className={cn(
          'mt-auto flex flex-col gap-1 rounded-lg border border-dashed border-surface-border p-2'
        )}
      >
        <span className="stage-text-xs font-medium text-ink-muted">시나리오 단계</span>
        <StepProgressStrip />
      </div>
    </aside>
  );
}
