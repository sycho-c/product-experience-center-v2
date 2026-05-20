import { Bell, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LogoMark } from '@/components/Logo';
import { MessageAttachment } from './MessageAttachment';
import type { DevicePersona, DeviceScreenState, Room, TalkLine } from '@/types/scenario';

interface MobileEmployeeMockupProps {
  persona?: DevicePersona;
  state?: DeviceScreenState;
  rooms?: Room[];
  activeRoomId?: string;
  talks?: TalkLine[];
  unreadByRoom?: Record<string, number>;
}

export function MobileEmployeeMockup({
  persona,
  state,
  rooms = [],
  activeRoomId,
  talks: talksProp,
  unreadByRoom = {},
}: MobileEmployeeMockupProps) {
  const talks = talksProp ?? state?.talks ?? [];
  const activeRoom = rooms.find((r) => r.id === activeRoomId);

  return (
    <div className="flex h-full flex-col gap-1 p-1.5">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <LogoMark className="h-3 w-3" />
          <span className="text-[10px] font-bold text-ink-primary">Cowork+</span>
        </div>
        <Bell className="h-3 w-3 text-ink-muted" />
      </header>

      <div
        className="flex items-center gap-1.5 rounded-lg px-1.5 py-1"
        style={{
          backgroundColor: persona?.avatarColor
            ? `${persona.avatarColor}1A`
            : '#EEF2FF',
        }}
      >
        <span
          className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold text-white"
          style={{ backgroundColor: persona?.avatarColor ?? '#4F46E5' }}
        >
          {persona?.name?.slice(0, 1) ?? 'M'}
        </span>
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="text-[10px] font-semibold text-ink-primary">
            {persona?.name ?? '직원'}
          </span>
          <span className="text-[8px] text-ink-muted">{persona?.role ?? '담당자'}</span>
        </div>
      </div>

      {activeRoom ? (
        <>
          <div className="rounded-md bg-brand-primarySoft px-1.5 py-0.5 text-[9px] font-semibold text-brand-primary">
            {activeRoom.name}
          </div>
          <div className="flex flex-1 flex-col gap-0.5 overflow-hidden rounded-md bg-surface-canvas p-1">
            {talks.slice(-5).map((t, i) => {
              const isSystem = t.from === 'system';
              const isSelf = t.from === 'self';
              return (
                <div
                  key={i}
                  className={cn(
                    'flex max-w-[88%] animate-fade-in flex-col',
                    isSelf ? 'self-end items-end' : isSystem ? 'self-center items-center' : 'self-start items-start'
                  )}
                >
                  {t.text && (
                    <div
                      className={cn(
                        'rounded px-1 py-0.5 text-[8px] leading-tight',
                        isSelf
                          ? 'bg-brand-primary text-white'
                          : isSystem
                            ? 'bg-surface-subtle text-ink-muted'
                            : 'border border-surface-border bg-white text-ink-primary'
                      )}
                    >
                      {t.text}
                    </div>
                  )}
                  {t.attachment && <MessageAttachment attachment={t.attachment} size="micro" />}
                </div>
              );
            })}
            {talks.length === 0 && (
              <div className="flex flex-1 items-center justify-center text-center text-[8px] text-ink-muted">
                메시지를 기다리는 중
              </div>
            )}
          </div>
        </>
      ) : (
        <ul className="flex flex-1 flex-col gap-1 overflow-hidden">
          {rooms.length === 0 && (
            <li className="rounded p-1 text-center text-[8px] text-ink-muted">
              참여 중인 방이 없습니다
            </li>
          )}
          {rooms.map((r) => (
            <li key={r.id} className="flex items-center gap-1 rounded-md bg-white p-1 shadow-soft">
              <MessageSquare className="h-3 w-3 text-brand-primary" />
              <span className="flex-1 text-[9px] font-semibold text-ink-primary">{r.name}</span>
              {(unreadByRoom[r.id] ?? 0) > 0 && (
                <span className="rounded-full bg-accent-danger px-1 text-[7px] font-bold text-white">
                  {unreadByRoom[r.id]}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {state?.banner && (
        <div className="rounded-md bg-emerald-50 px-1.5 py-1 text-[9px] font-medium text-emerald-700">
          {state.banner}
        </div>
      )}
    </div>
  );
}
