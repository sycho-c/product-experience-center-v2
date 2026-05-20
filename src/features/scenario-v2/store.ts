import { create } from 'zustand';
import type { Mode, V2Scenario } from '@/types/scenario';

export interface ScenarioState {
  scenario: V2Scenario | null;
  stepIndex: number;
  isPlaying: boolean;
  mode: Mode;
  /** Whether the spotlight + tour callout layer is shown */
  showTourGuide: boolean;
  /** Playback speed multiplier */
  speed: 0.5 | 1 | 2;
  /** Presentation mode (chrome hidden) */
  presentation: boolean;

  setScenario: (s: V2Scenario | null) => void;
  goToStep: (i: number) => void;
  next: () => void;
  prev: () => void;
  first: () => void;
  last: () => void;
  setPlaying: (p: boolean) => void;
  setMode: (m: Mode) => void;
  toggleTourGuide: () => void;
  setShowTourGuide: (v: boolean) => void;
  setSpeed: (s: 0.5 | 1 | 2) => void;
  setPresentation: (v: boolean) => void;
}

export const useScenarioStore = create<ScenarioState>((set, get) => ({
  scenario: null,
  stepIndex: 0,
  isPlaying: false,
  mode: 'after',
  showTourGuide: true,
  speed: 1,
  presentation: false,

  setScenario: (scenario) =>
    set({ scenario, stepIndex: 0, isPlaying: false }),

  goToStep: (i) => {
    const s = get().scenario;
    if (!s) return;
    const clamped = Math.max(0, Math.min(s.steps.length - 1, i));
    set({ stepIndex: clamped });
  },

  next: () => {
    const { scenario, stepIndex } = get();
    if (!scenario) return;
    if (stepIndex < scenario.steps.length - 1) {
      set({ stepIndex: stepIndex + 1 });
    } else {
      set({ isPlaying: false });
    }
  },

  prev: () => {
    const { stepIndex } = get();
    if (stepIndex > 0) set({ stepIndex: stepIndex - 1 });
  },

  first: () => set({ stepIndex: 0 }),

  last: () => {
    const s = get().scenario;
    if (s) set({ stepIndex: s.steps.length - 1 });
  },

  setPlaying: (p) => set({ isPlaying: p }),
  setMode: (mode) => set({ mode }),
  toggleTourGuide: () => set((state) => ({ showTourGuide: !state.showTourGuide })),
  setShowTourGuide: (v) => set({ showTourGuide: v }),
  setSpeed: (speed) => set({ speed }),
  setPresentation: (v) => set({ presentation: v }),
}));

export const selectCurrentStep = (s: ScenarioState) =>
  s.scenario ? s.scenario.steps[s.stepIndex] ?? null : null;
