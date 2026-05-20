import type { Room, TalkLine, V2Scenario } from '@/types/scenario';
import type { ScenarioState } from './store';

/**
 * Accumulate all message events from step 0 up to (and including) the given index.
 * Returns a map keyed by roomId.
 */
export function getRoomTalksUpToStep(
  scenario: V2Scenario,
  stepIndex: number
): Record<string, TalkLine[]> {
  const acc: Record<string, TalkLine[]> = {};
  for (let i = 0; i <= stepIndex && i < scenario.steps.length; i++) {
    const events = scenario.steps[i].messageEvents;
    if (!events) continue;
    events.forEach((e) => {
      if (!acc[e.roomId]) acc[e.roomId] = [];
      acc[e.roomId].push(e.line);
    });
  }
  return acc;
}

/**
 * Determine which room is currently active in the workspace.
 * Priority: step.activeRoomId > scenario.initialActiveRoomId > first room.
 */
export function getActiveRoomId(
  scenario: V2Scenario,
  stepIndex: number
): string | undefined {
  for (let i = stepIndex; i >= 0; i--) {
    const id = scenario.steps[i]?.activeRoomId;
    if (id) return id;
  }
  return scenario.initialActiveRoomId ?? scenario.rooms[0]?.id;
}

/**
 * Talks visible to a specific device at the current step.
 * - Workspace (per-guest): only the active room's talks.
 * - Workspace (shared-room): the single shared room's talks.
 * - Mobile workspace: mirrors workspace (same active room).
 * - Guest mobile: only their own room's talks.
 */
export function getTalksForDevice(
  scenario: V2Scenario,
  stepIndex: number,
  deviceId: string,
  activeRoomId?: string
): TalkLine[] {
  const allRoomTalks = getRoomTalksUpToStep(scenario, stepIndex);
  const device = scenario.devices.find((d) => d.id === deviceId);
  if (!device) return [];

  if (device.kind === 'workspace-pc' || device.kind === 'mobile-workspace') {
    if (scenario.messagingPattern === 'shared-room') {
      // The single shared room — pick the one this device participates in.
      const room = scenario.rooms.find((r) =>
        r.participantDeviceIds.includes(deviceId)
      );
      return room ? allRoomTalks[room.id] ?? [] : [];
    }
    // per-guest: show the active room's talks
    if (activeRoomId && allRoomTalks[activeRoomId]) {
      return allRoomTalks[activeRoomId];
    }
    return [];
  }

  if (device.kind === 'guest-mobile') {
    // A guest typically belongs to a single room
    const room = scenario.rooms.find((r) =>
      r.participantDeviceIds.includes(deviceId)
    );
    return room ? allRoomTalks[room.id] ?? [] : [];
  }

  return [];
}

/**
 * Unread count per room for the workspace list. Counts incoming ('other' or 'system') lines
 * not authored by the workspace itself, simply by tallying all events so far.
 * (This is a presentation aid for the per-guest workspace sidebar.)
 */
export function getUnreadByRoom(
  scenario: V2Scenario,
  stepIndex: number
): Record<string, number> {
  const allRoomTalks = getRoomTalksUpToStep(scenario, stepIndex);
  const out: Record<string, number> = {};
  Object.entries(allRoomTalks).forEach(([roomId, lines]) => {
    out[roomId] = lines.filter((l) => l.from === 'other').length;
  });
  return out;
}

/** Convenience selector usable on the store directly. */
export function selectActiveRoomId(s: ScenarioState): string | undefined {
  if (!s.scenario) return undefined;
  return getActiveRoomId(s.scenario, s.stepIndex);
}

export function selectAllRoomTalks(s: ScenarioState): Record<string, TalkLine[]> {
  if (!s.scenario) return {};
  return getRoomTalksUpToStep(s.scenario, s.stepIndex);
}

export function selectRoomsByDevice(scenario: V2Scenario, deviceId: string): Room[] {
  return scenario.rooms.filter((r) => r.participantDeviceIds.includes(deviceId));
}
