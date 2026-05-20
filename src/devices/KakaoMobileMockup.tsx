import type { DevicePersona } from '@/types/scenario';

interface KakaoMobileMockupProps {
  persona?: DevicePersona;
}

export function KakaoMobileMockup({ persona }: KakaoMobileMockupProps) {
  return (
    <div className="flex h-full flex-col bg-kakao-bg">
      <header className="border-b border-black/10 bg-white/70 px-1.5 py-1">
        <span className="text-[9px] font-semibold text-ink-primary">
          {persona?.name ?? '고객'}
        </span>
      </header>
      <div className="flex flex-1 flex-col gap-0.5 overflow-hidden p-1">
        <div className="max-w-[85%] self-start rounded-md bg-white px-1.5 py-0.5 text-[9px] text-ink-primary">
          청약서 받았습니다
        </div>
        <div className="max-w-[85%] self-end rounded-md bg-kakao-bubble px-1.5 py-0.5 text-[9px] text-ink-primary">
          감사합니다
        </div>
      </div>
    </div>
  );
}
