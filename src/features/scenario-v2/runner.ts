import { useEffect } from 'react';
import { useScenarioStore } from './store';

const DEFAULT_STEP_DURATION_MS = 6_000;

/**
 * Drives auto-advancing playback. Each step's optional `durationMs` overrides
 * the default. Speed multiplier scales the wait time.
 */
export function useScenarioRunner() {
  const scenario = useScenarioStore((s) => s.scenario);
  const isPlaying = useScenarioStore((s) => s.isPlaying);
  const stepIndex = useScenarioStore((s) => s.stepIndex);
  const speed = useScenarioStore((s) => s.speed);
  const next = useScenarioStore((s) => s.next);

  useEffect(() => {
    if (!scenario || !isPlaying) return;
    const step = scenario.steps[stepIndex];
    if (!step) return;
    const dur = (step.durationMs ?? DEFAULT_STEP_DURATION_MS) / speed;
    const handle = window.setTimeout(() => next(), dur);
    return () => window.clearTimeout(handle);
  }, [scenario, isPlaying, stepIndex, speed, next]);
}

/** Keyboard shortcuts for prev/next during presentations. */
export function useKeyboardControls() {
  const next = useScenarioStore((s) => s.next);
  const prev = useScenarioStore((s) => s.prev);
  const setPlaying = useScenarioStore((s) => s.setPlaying);
  const isPlaying = useScenarioStore((s) => s.isPlaying);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      } else if (e.key === 'p' || e.key === 'P') {
        setPlaying(!isPlaying);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev, setPlaying, isPlaying]);
}
