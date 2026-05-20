import type { ReactNode } from 'react';
import { useScenarioStore, selectCurrentStep } from '@/features/scenario-v2/store';
import {
  getActiveRoomId,
  getTalksForDevice,
  getUnreadByRoom,
  selectRoomsByDevice,
} from '@/features/scenario-v2/selectors';
import { cn } from '@/lib/utils';
import { AnchorPoint } from './anchors/AnchorPoint';
import { makeDeviceAnchorId } from '@/types/anchor';
import type { DeviceSlot } from '@/types/scenario';
import { DeviceFramePC } from '@/devices/DeviceFramePC';
import { DeviceFrameMobile } from '@/devices/DeviceFrameMobile';
import { DeviceFrameMobileCompact } from '@/devices/DeviceFrameMobileCompact';
import { WorkspaceMockup } from '@/devices/WorkspaceMockup';
import { MobileEmployeeMockup } from '@/devices/MobileEmployeeMockup';
import { GuestMobileMockup } from '@/devices/GuestMobileMockup';
import { KakaoPCMockup } from '@/devices/KakaoPCMockup';
import { KakaoMobileMockup } from '@/devices/KakaoMobileMockup';
import { Users } from 'lucide-react';

interface SlotWrapperProps {
  slot: DeviceSlot;
  active: boolean;
  children: ReactNode;
  area: string;
}

function SlotWrapper({ slot, active, children, area }: SlotWrapperProps) {
  return (
    <div
      data-slot-id={slot.id}
      className={cn(
        'relative flex min-h-0 min-w-0 flex-col items-center overflow-hidden transition-all duration-300',
        area,
        active ? 'opacity-100' : 'opacity-60'
      )}
    >
      {children}
      <AnchorPoint id={makeDeviceAnchorId(slot.id, 'left')} position="left" />
      <AnchorPoint id={makeDeviceAnchorId(slot.id, 'right')} position="right" />
      <AnchorPoint id={makeDeviceAnchorId(slot.id, 'top')} position="top" />
      <AnchorPoint id={makeDeviceAnchorId(slot.id, 'bottom')} position="bottom" />
      <AnchorPoint id={makeDeviceAnchorId(slot.id, 'center')} position="center" />
    </div>
  );
}

/** Compute grid areas based on which slot kinds are present. */
function computeLayout(hasMobileWorkspace: boolean, guestCount: number, hasOverflow: boolean) {
  // 8-col base, 2 rows
  const workspaceArea = hasMobileWorkspace
    ? 'col-start-1 col-end-6 row-start-1 row-end-2'
    : 'col-start-1 col-end-9 row-start-1 row-end-2';
  const mobileWorkspaceArea = hasMobileWorkspace
    ? 'col-start-6 col-end-9 row-start-1 row-end-2'
    : '';

  // Bottom row: guests + optional overflow
  const totalBottomSlots = guestCount + (hasOverflow ? 1 : 0);
  const cellsPerSlot = totalBottomSlots > 0 ? Math.floor(8 / totalBottomSlots) : 8;
  const guestAreas: string[] = [];
  for (let i = 0; i < guestCount; i++) {
    const start = 1 + i * cellsPerSlot;
    const end = Math.min(start + cellsPerSlot, 9);
    guestAreas.push(`col-start-${start} col-end-${end} row-start-2 row-end-3`);
  }
  const overflowArea = hasOverflow
    ? `col-start-${1 + guestCount * cellsPerSlot} col-end-9 row-start-2 row-end-3`
    : '';

  return { workspaceArea, mobileWorkspaceArea, guestAreas, overflowArea };
}

export function DeviceGrid() {
  const scenario = useScenarioStore((s) => s.scenario);
  const mode = useScenarioStore((s) => s.mode);
  const stepIndex = useScenarioStore((s) => s.stepIndex);
  const step = useScenarioStore(selectCurrentStep);

  if (!scenario) return null;

  const guests = scenario.devices.filter((d) => d.kind === 'guest-mobile');
  const overflow = scenario.devices.find((d) => d.kind === 'overflow');
  const workspace = scenario.devices.find((d) => d.kind === 'workspace-pc');
  const mobileWorkspace = scenario.devices.find((d) => d.kind === 'mobile-workspace');

  const layout = computeLayout(!!mobileWorkspace, guests.length, !!overflow);
  const activeRoomId = getActiveRoomId(scenario, stepIndex);
  const unreadByRoom = getUnreadByRoom(scenario, stepIndex);

  const isActive = (id: string) => step?.activeDevices.includes(id) ?? !step;
  const deviceState = (id: string) => step?.deviceState?.[id];
  const talksFor = (id: string) => getTalksForDevice(scenario, stepIndex, id, activeRoomId);

  return (
    <section className="relative grid h-full min-h-0 min-w-0 grid-cols-8 grid-rows-[62%_38%] stage-gap p-2">
      {workspace && (
        <SlotWrapper slot={workspace} active={isActive(workspace.id)} area={layout.workspaceArea}>
          <DeviceFramePC label={workspace.label} active={isActive(workspace.id)}>
            {mode === 'before' ? (
              <KakaoPCMockup persona={workspace.persona} />
            ) : (
              <WorkspaceMockup
                persona={workspace.persona}
                state={deviceState(workspace.id)}
                rooms={scenario.rooms}
                activeRoomId={activeRoomId}
                talks={talksFor(workspace.id)}
                unreadByRoom={unreadByRoom}
                messagingPattern={scenario.messagingPattern}
                liveCallout={
                  step?.liveCallout?.deviceId === workspace.id
                    ? step.liveCallout.text
                    : undefined
                }
              />
            )}
          </DeviceFramePC>
        </SlotWrapper>
      )}

      {mobileWorkspace && (
        <SlotWrapper
          slot={mobileWorkspace}
          active={isActive(mobileWorkspace.id)}
          area={layout.mobileWorkspaceArea}
        >
          <DeviceFrameMobile
            label={mobileWorkspace.label}
            active={isActive(mobileWorkspace.id)}
          >
            <MobileEmployeeMockup
              persona={mobileWorkspace.persona}
              state={deviceState(mobileWorkspace.id)}
              rooms={selectRoomsByDevice(scenario, mobileWorkspace.id)}
              activeRoomId={activeRoomId}
              talks={talksFor(mobileWorkspace.id)}
              unreadByRoom={unreadByRoom}
            />
          </DeviceFrameMobile>
        </SlotWrapper>
      )}

      {guests.map((guest, idx) => {
        const roomForGuest = scenario.rooms.find((r) =>
          r.participantDeviceIds.includes(guest.id)
        );
        return (
          <SlotWrapper
            key={guest.id}
            slot={guest}
            active={isActive(guest.id)}
            area={layout.guestAreas[idx] ?? ''}
          >
            <DeviceFrameMobileCompact
              label={guest.label}
              persona={guest.persona}
              active={isActive(guest.id)}
            >
              {mode === 'before' ? (
                <KakaoMobileMockup persona={guest.persona} />
              ) : (
                <GuestMobileMockup
                  persona={guest.persona}
                  state={deviceState(guest.id)}
                  talks={talksFor(guest.id)}
                  roomName={roomForGuest?.name}
                />
              )}
            </DeviceFrameMobileCompact>
          </SlotWrapper>
        );
      })}

      {overflow && (
        <SlotWrapper slot={overflow} active={true} area={layout.overflowArea}>
          <div className="relative flex h-full w-full flex-col items-center justify-center rounded-2xl border border-dashed border-surface-border bg-white/70 p-3 shadow-soft">
            <Users className="mb-1 h-5 w-5 text-ink-muted" />
            <div className="stage-text-base font-semibold text-ink-primary">
              +{overflow.overflowCount ?? 0}
            </div>
            <div className="stage-text-xs text-ink-muted">{overflow.label ?? '추가 참여자'}</div>
          </div>
        </SlotWrapper>
      )}
    </section>
  );
}
