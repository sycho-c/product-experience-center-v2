import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { MessageAttachment } from './MessageAttachment';
import type { DevicePersona, DeviceScreenState, TalkLine } from '@/types/scenario';

interface GuestMobileMockupProps {
  persona?: DevicePersona;
  state?: DeviceScreenState;
  talks?: TalkLine[];
  roomName?: string;
}

const FALLBACK_TALKS: TalkLine[] = [
  { from: 'system', text: '환영합니다' },
];

export function GuestMobileMockup({ persona, state, talks: talksProp, roomName }: GuestMobileMockupProps) {
  const rawTalks = talksProp ?? state?.talks ?? FALLBACK_TALKS;
  // Scenarios are authored from the workspace (host) viewpoint: `from: 'self'` = host, `from: 'other'` = guest.
  // From this guest's viewpoint those roles are reversed — flip self↔other so author bubbles land on the right side.
  const talks: TalkLine[] = rawTalks.map((t) => ({
    ...t,
    from: t.from === 'self' ? 'other' : t.from === 'other' ? 'self' : 'system',
  }));
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [talks.length]);

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-1 border-b border-surface-border bg-white px-1.5 py-1">
        <span
          className="flex h-3 w-3 items-center justify-center rounded-full text-[8px] font-bold text-white"
          style={{ backgroundColor: persona?.avatarColor ?? '#4F46E5' }}
        >
          {persona?.name?.slice(0, 1) ?? 'G'}
        </span>
        <div className="flex min-w-0 flex-col leading-none">
          <span className="text-[9px] font-semibold text-ink-primary">담당자</span>
          {roomName && (
            <span className="line-clamp-1 text-[8px] text-ink-muted">{roomName}</span>
          )}
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto bg-surface-canvas p-1">
        {talks.map((t, i) => {
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
                    'rounded-md px-1.5 py-0.5 text-[9px] leading-tight',
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
              {t.attachment && <MessageAttachment attachment={t.attachment} size="mobile" />}
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <footer className="flex items-center gap-1 border-t border-surface-border bg-white p-1">
        <div className="flex-1 rounded-sm bg-surface-subtle px-1 py-0.5 text-[8px] text-ink-muted">
          메시지
        </div>
      </footer>
    </div>
  );
}
