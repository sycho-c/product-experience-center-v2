import type { V2Scenario, V2ScenarioMeta } from '@/types/scenario';
import { meta as insuranceMeta } from './insurance-1m/meta';
import { meta as gaonMeta } from './gaon-cable-1to1/meta';
import { meta as rentacarMeta } from './rentacar-nm/meta';
import { meta as manufacturingMeta } from './manufacturing-n1/meta';

export const scenarioMetas: V2ScenarioMeta[] = [
  insuranceMeta,
  gaonMeta,
  rentacarMeta,
  manufacturingMeta,
];

type Loader = () => Promise<{ scenario: V2Scenario }>;

const loaders: Record<string, Loader> = {
  'insurance-1m': () => import('./insurance-1m'),
  'gaon-cable-1to1': () => import('./gaon-cable-1to1'),
  'rentacar-nm': () => import('./rentacar-nm'),
  'manufacturing-n1': () => import('./manufacturing-n1'),
};

export async function loadScenario(id: string): Promise<V2Scenario | null> {
  const loader = loaders[id];
  if (!loader) return null;
  const mod = await loader();
  return mod.scenario;
}

export function listScenarioIds(): string[] {
  return Object.keys(loaders);
}
