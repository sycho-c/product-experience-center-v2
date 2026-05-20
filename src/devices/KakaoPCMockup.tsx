import type { DevicePersona } from '@/types/scenario';

interface KakaoPCMockupProps {
  persona?: DevicePersona;
}

export function KakaoPCMockup({ persona }: KakaoPCMockupProps) {
  return (
    <div className="flex h-full flex-col bg-kakao-bg">
      <header className="flex items-center justify-between border-b border-black/10 bg-white/70 px-3 py-1.5">
        <span className="stage-text-sm font-semibold text-ink-primary">카카오톡</span>
        <span className="stage-text-xs text-ink-muted">상담사: {persona?.name ?? '이설계'}</span>
      </header>
      <div className="flex flex-1 flex-col gap-1.5 overflow-hidden p-3">
        <div className="max-w-[70%] self-start rounded-lg bg-white px-2 py-1 stage-text-xs text-ink-primary shadow-sm">
          청약서 양식 보내드릴게요
        </div>
        <div className="max-w-[70%] self-end rounded-lg bg-kakao-bubble px-2 py-1 stage-text-xs text-ink-primary shadow-sm">
          네 확인 부탁드려요
        </div>
        <div className="self-center rounded bg-white/60 px-2 py-0.5 text-[10px] text-ink-muted">
          ⚠ 1:1 채팅 — 코어 시스템 조회 불가
        </div>
      </div>
    </div>
  );
}
