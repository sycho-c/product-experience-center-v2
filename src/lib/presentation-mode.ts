import { useScenarioStore } from '@/features/scenario-v2/store';

export async function enterPresentation() {
  try {
    if (document.fullscreenElement == null) {
      await document.documentElement.requestFullscreen();
    }
  } catch {
    // Fullscreen denied — still set the store flag so chrome hides.
  }
  useScenarioStore.getState().setPresentation(true);
}

export async function exitPresentation() {
  try {
    if (document.fullscreenElement != null) {
      await document.exitFullscreen();
    }
  } catch {
    // ignore
  }
  useScenarioStore.getState().setPresentation(false);
}

export async function togglePresentation() {
  if (useScenarioStore.getState().presentation) {
    await exitPresentation();
  } else {
    await enterPresentation();
  }
}
