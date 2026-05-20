import { useScenarioStore } from '@/features/scenario-v2/store';
import { cn } from '@/lib/utils';

interface StepProgressStripProps {
  orientation?: 'horizontal' | 'vertical';
  showNumbers?: boolean;
}

export function StepProgressStrip({
  orientation = 'horizontal',
  showNumbers = true,
}: StepProgressStripProps) {
  const scenario = useScenarioStore((s) => s.scenario);
  const stepIndex = useScenarioStore((s) => s.stepIndex);
  const goToStep = useScenarioStore((s) => s.goToStep);
  if (!scenario) return null;

  const isVertical = orientation === 'vertical';

  return (
    <div
      className={cn(
        'flex items-center',
        isVertical ? 'flex-col gap-1' : 'flex-wrap gap-1'
      )}
    >
      {scenario.steps.map((step, i) => {
        const isCurrent = i === stepIndex;
        const isVisited = i < stepIndex;
        return (
          <button
            key={step.id}
            onClick={() => goToStep(i)}
            className={cn(
              'group relative flex items-center justify-center rounded-full transition-all',
              isCurrent && 'scale-110',
              !isVertical && (showNumbers ? 'h-5 w-5' : 'h-2.5 w-2.5'),
              isVertical && 'h-2.5 w-2.5',
              isVisited && 'bg-brand-primary text-white',
              isCurrent && 'bg-brand-primary text-white ring-2 ring-brand-primary/30',
              !isCurrent && !isVisited && 'bg-surface-subtle text-ink-muted border border-surface-border'
            )}
            aria-label={`단계 ${i + 1}: ${step.title}`}
          >
            {!isVertical && showNumbers && (
              <span className="text-[9px] font-bold leading-none">
                {String(i + 1).padStart(2, '0')}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
