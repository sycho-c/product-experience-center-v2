import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  Play,
  Pause,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useScenarioStore } from '@/features/scenario-v2/store';
import { cn } from '@/lib/utils';

export function PlaybackControls() {
  const scenario = useScenarioStore((s) => s.scenario);
  const stepIndex = useScenarioStore((s) => s.stepIndex);
  const isPlaying = useScenarioStore((s) => s.isPlaying);
  const speed = useScenarioStore((s) => s.speed);
  const showTourGuide = useScenarioStore((s) => s.showTourGuide);
  const presentation = useScenarioStore((s) => s.presentation);
  const setShowTourGuide = useScenarioStore((s) => s.setShowTourGuide);
  const setSpeed = useScenarioStore((s) => s.setSpeed);
  const setPlaying = useScenarioStore((s) => s.setPlaying);
  const next = useScenarioStore((s) => s.next);
  const prev = useScenarioStore((s) => s.prev);
  const first = useScenarioStore((s) => s.first);
  const last = useScenarioStore((s) => s.last);

  if (!scenario || presentation) return null;
  const total = scenario.steps.length;
  const progress = ((stepIndex + 1) / total) * 100;

  return (
    <div className="mx-auto flex w-full max-w-[1600px] items-center gap-4 px-6 py-3">
      <div className="hidden items-center gap-2 sm:flex">
        <span className="text-xs font-medium text-ink-muted">시나리오 진행 컨트롤</span>
        <span className="rounded bg-surface-subtle px-2 py-0.5 text-xs font-semibold text-ink-secondary">
          {String(stepIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>

      <div className="hidden flex-1 items-center gap-2 md:flex">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-subtle">
          <div
            className="h-full bg-brand-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="w-9 text-xs font-medium text-ink-muted">{Math.round(progress)}%</span>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={first} aria-label="처음으로">
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={prev} aria-label="이전">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="primary"
          size="icon"
          onClick={() => setPlaying(!isPlaying)}
          aria-label={isPlaying ? '일시정지' : '재생'}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={next} aria-label="다음">
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={last} aria-label="끝으로">
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {[0.5, 1, 2].map((s) => (
          <button
            key={s}
            onClick={() => setSpeed(s as 0.5 | 1 | 2)}
            className={cn(
              'rounded-md px-2 py-1 text-xs font-medium transition-colors',
              speed === s
                ? 'bg-brand-primarySoft text-brand-primary'
                : 'text-ink-muted hover:bg-surface-subtle'
            )}
          >
            {s}×
          </button>
        ))}
      </div>

      <label className="flex items-center gap-2 text-xs font-medium text-ink-secondary">
        단계 설명 보기
        <Switch checked={showTourGuide} onCheckedChange={setShowTourGuide} />
      </label>
    </div>
  );
}
