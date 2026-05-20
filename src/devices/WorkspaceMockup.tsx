import { useEffect, useRef } from 'react';
import {
  MessageSquare,
  Search,
  ListTodo,
  BookOpen,
  UserPlus,
  UserPlus2,
  Settings,
  Sparkles,
  Users,
  Eye,
  Info,
  Plus,
  Paperclip,
  Send,
  Square,
  SlidersHorizontal,
  ArrowDownNarrowWide,
  ChevronsLeft,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LogoMark } from '@/components/Logo';
import { MessageAttachment } from './MessageAttachment';
import type { DevicePersona, DeviceScreenState, Room, TalkLine } from '@/types/scenario';

interface WorkspaceMockupProps {
  persona?: DevicePersona;
  state?: DeviceScreenState;
  liveCallout?: string;
  rooms?: Room[];
  activeRoomId?: string;
  talks?: TalkLine[];
  unreadByRoom?: Record<string, number>;
  messagingPattern?: 'shared-room' | 'per-guest';
}

const NAV_ITEMS = [
  { id: 'talk', icon: MessageSquare, label: '대화', active: true },
  { id: 'search', icon: Search, label: '대화 조회' },
  { id: 'todo', icon: ListTodo, label: '할 일' },
  { id: 'kb', icon: BookOpen, label: '지식' },
  { id: 'ext', icon: UserPlus, label: '외부 사용자' },
  { id: 'cfg', icon: Settings, label: '설정' },
];

function authorInitial(name?: string) {
  if (!name) return 'M';
  return name.replace(/[()\s].*$/, '').slice(0, 1);
}

export function WorkspaceMockup({
  persona,
  state,
  liveCallout,
  rooms = [],
  activeRoomId,
  talks: talksProp,
  unreadByRoom = {},
  messagingPattern = 'shared-room',
}: WorkspaceMockupProps) {
  const talks = talksProp ?? state?.talks ?? [];
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [talks.length]);
  const activeRoom = rooms.find((r) => r.id === activeRoomId);
  const roomTitle = activeRoom?.name ?? state?.roomTitle ?? '협업 대화방';
  const roomSubtitle = activeRoom?.subtitle;
  const participantCount =
    activeRoom?.totalParticipants ?? activeRoom?.participantDeviceIds.length ?? 0;
  const isShared = messagingPattern === 'shared-room';

  return (
    <div className="flex h-full min-h-0 w-full">
      {/* ── Sidebar — v1 wordmark + horizontal nav ─────────────────── */}
      <aside className="flex w-[112px] shrink-0 flex-col gap-2 bg-brand-sidebar px-2 py-2.5 text-brand-sidebarText">
        <div className="flex items-center justify-between px-0.5">
          <div className="flex items-center gap-1">
            <LogoMark className="h-4 w-4" />
            <span className="text-[11px] font-bold text-white">Cowork+</span>
          </div>
          <button className="text-brand-sidebarText/80 hover:text-white">
            <ChevronsLeft className="h-3 w-3" />
          </button>
        </div>

        <nav className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[10.5px] transition-colors',
                  item.active
                    ? 'bg-brand-sidebarActive text-white'
                    : 'text-brand-sidebarText hover:bg-brand-sidebarHover'
                )}
              >
                <Icon className="h-3 w-3 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto flex items-center gap-1.5 px-0.5">
          <span
            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold text-white"
            style={{ backgroundColor: persona?.avatarColor ?? '#94A3B8' }}
          >
            {authorInitial(persona?.name)}
          </span>
          <span className="truncate text-[9.5px] text-brand-sidebarText/85">
            {persona?.name ?? '사용자'}
          </span>
        </div>
      </aside>

      {/* ── Talk room list — v1 styling ─────────────────────────────── */}
      <section className="flex w-[28%] min-w-[180px] flex-col gap-2 border-r border-surface-border bg-surface-card p-2.5">
        <header className="flex items-center justify-between">
          <h4 className="text-[13px] font-bold text-ink-primary">대화</h4>
          <button className="flex items-center gap-1 rounded-md bg-brand-primary px-2 py-1 text-[10px] font-medium text-white shadow-soft hover:bg-brand-primaryHover">
            <Plus className="h-2.5 w-2.5" />
            새 대화방
          </button>
        </header>

        <div className="flex items-center gap-1 rounded-md border border-surface-border bg-white px-2 py-1.5">
          <Search className="h-3 w-3 text-ink-muted" />
          <span className="flex-1 text-[10px] text-ink-muted">
            고객/대화방/내용 검색
          </span>
          <SlidersHorizontal className="h-3 w-3 text-ink-muted" />
          <ArrowDownNarrowWide className="h-3 w-3 text-ink-muted" />
        </div>

        <div className="flex items-center gap-1">
          <span className="flex items-center gap-0.5 rounded-full bg-brand-sidebar px-2 py-0.5 text-[10px] font-semibold text-white">
            전체
          </span>
          <button className="grid h-5 w-5 place-items-center rounded-full text-ink-muted hover:bg-surface-subtle">
            <Plus className="h-2.5 w-2.5" />
          </button>
        </div>

        <ul className="flex flex-1 flex-col gap-0.5 overflow-hidden">
          {rooms.length === 0 && (
            <li className="rounded p-2 text-[10px] leading-snug text-ink-muted">
              대화방이 없습니다. 우상단 "새 대화방"으로 시작하세요.
            </li>
          )}
          {rooms.map((room) => {
            const isActive = room.id === activeRoomId;
            const unread = unreadByRoom[room.id] ?? 0;
            const roomParticipantCount =
              room.totalParticipants ?? room.participantDeviceIds.length;
            return (
              <li
                key={room.id}
                className={cn(
                  'flex cursor-pointer items-center gap-2 rounded-md p-1.5',
                  isActive ? 'bg-brand-primarySoft' : 'hover:bg-surface-subtle'
                )}
              >
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-50 text-brand-primary">
                  {isShared ? <Users className="h-3.5 w-3.5" /> : <MessageSquare className="h-3.5 w-3.5" />}
                </div>
                <div className="flex min-w-0 flex-1 items-center gap-1.5">
                  <span
                    className={cn(
                      'truncate text-[11px] font-semibold',
                      isActive ? 'text-brand-primary' : 'text-ink-primary'
                    )}
                  >
                    {room.name}
                  </span>
                  <span className="inline-flex shrink-0 items-center gap-0.5 text-[9.5px] font-medium text-ink-muted">
                    <Users className="h-2.5 w-2.5" />
                    {roomParticipantCount}
                  </span>
                </div>
                {unread > 0 && !isActive && (
                  <span className="shrink-0 rounded-full bg-accent-danger px-1 py-px text-[8px] font-bold leading-tight text-white">
                    {unread}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* ── Main chat ───────────────────────────────────────────────── */}
      <main className="flex min-w-0 flex-1 flex-col bg-surface-canvas">
        <header className="flex items-center gap-1.5 border-b border-surface-border bg-surface-card px-2.5 py-1.5">
          <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-50 text-brand-primary">
            {isShared ? <Users className="h-3.5 w-3.5" /> : <MessageSquare className="h-3.5 w-3.5" />}
          </div>
          <div className="flex min-w-0 flex-1 items-center gap-1">
            <span className="truncate text-[12px] font-semibold text-ink-primary">
              {roomTitle}
            </span>
            <span className="inline-flex shrink-0 items-center gap-0.5 text-[9.5px] font-normal text-ink-muted">
              <Users className="h-2.5 w-2.5" />
              {participantCount}
            </span>
            {roomSubtitle && (
              <span className="truncate text-[9.5px] text-ink-muted">· {roomSubtitle}</span>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-0.5 text-ink-muted">
            <button className="grid h-5 w-5 place-items-center rounded hover:bg-surface-subtle">
              <Square className="h-3 w-3" />
            </button>
            <button className="grid h-5 w-5 place-items-center rounded hover:bg-surface-subtle">
              <Eye className="h-3 w-3" />
            </button>
            <button className="grid h-5 w-5 place-items-center rounded hover:bg-surface-subtle">
              <UserPlus2 className="h-3 w-3" />
            </button>
            <button className="grid h-5 w-5 place-items-center rounded hover:bg-surface-subtle">
              <Info className="h-3 w-3" />
            </button>
          </div>
        </header>

        <div className="relative flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto p-2">
          {talks.length === 0 && (
            <div className="flex flex-1 flex-col items-center justify-center gap-1.5">
              <Sparkles className="h-5 w-5 text-brand-primary opacity-70" />
              <p className="text-[12px] font-semibold text-brand-primary">
                좋은 하루 보내세요. 🙂
              </p>
              <p className="text-[10px] text-ink-muted">
                새 메시지를 기다리는 중
              </p>
              <button className="mt-1 flex items-center gap-1 rounded-md border border-brand-primary/30 bg-white px-2.5 py-1 text-[10px] font-medium text-brand-primary">
                <Plus className="h-2.5 w-2.5" />
                새 대화방 만들기
              </button>
            </div>
          )}
          {talks.map((t, i) => {
            if (t.from === 'system') {
              return (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <div className="self-center rounded-full bg-surface-subtle px-2.5 py-0.5 text-[9.5px] text-ink-muted">
                    {t.text}
                  </div>
                  {t.attachment && (
                    <div className="w-full max-w-[60%]">
                      <MessageAttachment attachment={t.attachment} size="pc" />
                    </div>
                  )}
                </div>
              );
            }
            const isSelf = t.from === 'self';
            return (
              <div
                key={i}
                className={cn(
                  'flex max-w-[88%] animate-fade-in gap-1',
                  isSelf ? 'self-end flex-row-reverse' : 'self-start'
                )}
              >
                <span
                  className={cn(
                    'mt-2.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold',
                    isSelf ? 'bg-brand-primary text-white' : 'bg-blue-100 text-blue-600'
                  )}
                >
                  {authorInitial(t.author ?? (isSelf ? persona?.name : undefined))}
                </span>
                <div className="flex min-w-0 flex-col">
                  {t.author && (
                    <span
                      className={cn(
                        'px-1 text-[9px] font-medium text-ink-muted',
                        isSelf && 'text-right'
                      )}
                    >
                      {t.author}
                    </span>
                  )}
                  {t.text && (
                    <div
                      className={cn(
                        'rounded-lg px-2 py-1 text-[10.5px] leading-snug',
                        isSelf
                          ? 'bg-brand-primarySoft text-ink-primary'
                          : 'border border-surface-border bg-white text-ink-primary'
                      )}
                    >
                      {t.text}
                    </div>
                  )}
                  {t.attachment && <MessageAttachment attachment={t.attachment} size="pc" />}
                </div>
              </div>
            );
          })}
          <div ref={endRef} />
          {liveCallout && (
            <div className="absolute bottom-2 left-2 right-2 flex animate-fade-in items-center gap-1 rounded-md border border-brand-primary/40 bg-white px-2 py-1 shadow-elev">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-medium text-ink-primary">{liveCallout}</span>
            </div>
          )}
        </div>

        <footer className="flex items-center gap-1.5 border-t border-surface-border bg-surface-card px-2.5 py-2">
          <button className="grid h-6 w-6 place-items-center rounded text-ink-muted hover:bg-surface-subtle">
            <Paperclip className="h-3 w-3" />
          </button>
          <div className="flex flex-1 items-center rounded-full border border-surface-border bg-white px-3 py-1 text-[10px] text-ink-muted">
            메시지 입력
            <ChevronDown className="ml-auto h-2.5 w-2.5" />
          </div>
          <button className="grid h-6 w-6 place-items-center rounded-full bg-brand-primary text-white">
            <Send className="h-3 w-3" />
          </button>
        </footer>
      </main>
    </div>
  );
}
