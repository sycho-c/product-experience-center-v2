import { Camera, ClipboardList, Sparkles, CheckCircle2, Loader2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TalkAttachment } from '@/types/scenario';

interface MessageAttachmentProps {
  attachment: TalkAttachment;
  /** Rendering surface — affects font size + spacing. */
  size?: 'pc' | 'mobile' | 'micro';
}

const FILE_COLORS: Record<string, string> = {
  pdf: '#DC2626',
  xlsx: '#047857',
  dwg: '#2563EB',
  docx: '#1D4ED8',
  jpg: '#7C3AED',
  png: '#7C3AED',
  zip: '#A16207',
};

export function MessageAttachment({ attachment, size = 'pc' }: MessageAttachmentProps) {
  if (attachment.kind === 'image') {
    return (
      <div
        className={cn(
          'relative mt-1 flex flex-col items-center justify-end overflow-hidden rounded-md border border-surface-border',
          size === 'pc' ? 'min-h-[68px] px-2 pb-1.5 pt-7' : 'min-h-[52px] px-1.5 pb-1 pt-6'
        )}
        style={{
          background:
            attachment.tone === 'handwritten'
              ? `repeating-linear-gradient(45deg, #E2E8F0 0 6px, #CBD5E1 6px 7px), #94A3B8`
              : 'linear-gradient(135deg, #6366F1 0%, #94A3B8 100%)',
        }}
      >
        <div
          className={cn(
            'absolute left-1/2 top-1 grid -translate-x-1/2 place-items-center rounded-full bg-white/95',
            size === 'pc' ? 'h-6 w-6' : 'h-5 w-5'
          )}
        >
          <Camera className={cn(size === 'pc' ? 'h-3 w-3' : 'h-2.5 w-2.5', 'text-ink-secondary')} />
        </div>
        <div
          className={cn(
            'rounded bg-black/45 font-semibold text-white',
            size === 'pc' ? 'px-1.5 py-0.5 text-[9px]' : 'px-1 py-px text-[8px]'
          )}
        >
          {attachment.label}
        </div>
        {attachment.meta && (
          <div
            className={cn(
              'mt-0.5 text-center text-white/85',
              size === 'pc' ? 'text-[8.5px]' : 'text-[7.5px]'
            )}
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.45)' }}
          >
            {attachment.meta}
          </div>
        )}
      </div>
    );
  }

  if (attachment.kind === 'photo-grid') {
    return (
      <div
        className={cn(
          'mt-1 grid gap-px overflow-hidden rounded-md',
          attachment.photos.length === 1 && 'grid-cols-1',
          attachment.photos.length === 2 && 'grid-cols-2',
          attachment.photos.length >= 3 && 'grid-cols-3'
        )}
      >
        {attachment.photos.map((p, i) => {
          const hueMap: Record<string, string> = {
            blue: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)',
            red: 'linear-gradient(135deg, #B91C1C 0%, #EF4444 100%)',
            green: 'linear-gradient(135deg, #047857 0%, #10B981 100%)',
            amber: 'linear-gradient(135deg, #B45309 0%, #F59E0B 100%)',
          };
          return (
            <div
              key={i}
              className={cn(
                'flex aspect-square items-end justify-center text-center font-semibold text-white',
                size === 'pc' ? 'p-1 text-[8.5px]' : 'p-0.5 text-[7.5px]'
              )}
              style={{
                background: hueMap[p.hue ?? 'blue'],
                textShadow: '0 1px 2px rgba(0,0,0,0.55)',
              }}
            >
              {p.label}
            </div>
          );
        })}
      </div>
    );
  }

  if (attachment.kind === 'file') {
    return (
      <div
        className={cn(
          'mt-1 flex items-center gap-1.5 rounded-md border border-surface-border bg-white',
          size === 'pc' ? 'px-1.5 py-1' : 'px-1 py-0.5'
        )}
      >
        <span
          className={cn(
            'grid place-items-center rounded font-bold text-white',
            size === 'pc' ? 'h-6 w-6 text-[8px]' : 'h-5 w-5 text-[7px]'
          )}
          style={{ backgroundColor: FILE_COLORS[attachment.ext] ?? '#475569' }}
        >
          {attachment.ext.toUpperCase()}
        </span>
        <div className="flex min-w-0 flex-1 flex-col leading-tight">
          <span
            className={cn(
              'truncate font-semibold text-ink-primary',
              size === 'pc' ? 'text-[9.5px]' : 'text-[8.5px]'
            )}
          >
            {attachment.name}
          </span>
          {attachment.size && (
            <span className={cn('text-ink-muted', size === 'pc' ? 'text-[8px]' : 'text-[7px]')}>
              {attachment.size}
            </span>
          )}
        </div>
      </div>
    );
  }

  if (attachment.kind === 'bizform') {
    const statusLabel: Record<string, { text: string; cls: string }> = {
      sent: { text: '발송됨', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
      submitted: { text: '제출 완료', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      approved: { text: '승인 완료', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
      draft: { text: '작성중', cls: 'bg-surface-subtle text-ink-secondary border-surface-border' },
    };
    const st = attachment.status ? statusLabel[attachment.status] : undefined;
    return (
      <div className={cn('mt-1 rounded-md border-2 border-brand-primary bg-white', size === 'pc' ? 'p-1.5' : 'p-1')}>
        <div className="mb-1 flex items-center gap-1">
          <ClipboardList className={cn(size === 'pc' ? 'h-3 w-3' : 'h-2.5 w-2.5', 'text-brand-primary')} />
          <span
            className={cn(
              'flex-1 truncate font-bold text-brand-primary',
              size === 'pc' ? 'text-[10px]' : 'text-[8.5px]'
            )}
          >
            {attachment.title}
          </span>
          {st && (
            <span
              className={cn(
                'shrink-0 rounded border px-1 font-semibold',
                size === 'pc' ? 'text-[8px]' : 'text-[7px]',
                st.cls
              )}
            >
              {st.text}
            </span>
          )}
        </div>
        {attachment.rows && attachment.rows.length > 0 && (
          <div className="flex flex-col gap-0.5">
            {attachment.rows.map((r, i) => (
              <div
                key={i}
                className={cn(
                  'flex items-center justify-between rounded bg-surface-subtle',
                  size === 'pc' ? 'px-1.5 py-0.5 text-[9px]' : 'px-1 py-px text-[8px]'
                )}
              >
                <span className="text-ink-muted">{r.label}</span>
                <span className="ml-1 truncate font-semibold text-ink-primary">{r.value}</span>
              </div>
            ))}
          </div>
        )}
        {attachment.action && (
          <div
            className={cn(
              'mt-1 rounded bg-brand-primary text-center font-bold text-white',
              size === 'pc' ? 'px-1.5 py-1 text-[9px]' : 'px-1 py-0.5 text-[8px]'
            )}
          >
            {attachment.action}
          </div>
        )}
      </div>
    );
  }

  if (attachment.kind === 'extract') {
    return (
      <div className={cn('mt-1 rounded-md border border-indigo-200 bg-indigo-50/60', size === 'pc' ? 'p-1.5' : 'p-1')}>
        <div className="mb-1 flex items-center gap-1">
          <Sparkles className={cn(size === 'pc' ? 'h-3 w-3' : 'h-2.5 w-2.5', 'text-brand-primary')} />
          <span
            className={cn('font-bold text-brand-primary', size === 'pc' ? 'text-[10px]' : 'text-[8.5px]')}
          >
            {attachment.title}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          {attachment.rows.map((r, i) => (
            <div
              key={i}
              className={cn(
                'flex items-center gap-1 rounded bg-white px-1',
                size === 'pc' ? 'py-0.5 text-[9px]' : 'py-px text-[7.5px]'
              )}
            >
              <span
                className={cn(
                  'inline-flex shrink-0 items-center rounded font-bold',
                  r.source === 'OCR'
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-violet-100 text-violet-700',
                  size === 'pc' ? 'px-1 py-px text-[7px]' : 'px-0.5 text-[6.5px]'
                )}
              >
                {r.source}
              </span>
              <span className="shrink-0 text-ink-muted">{r.label}</span>
              <span className="ml-auto truncate font-semibold text-ink-primary">{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (attachment.kind === 'task-chip') {
    const Icon = attachment.status === 'done' ? CheckCircle2 : Loader2;
    return (
      <div
        className={cn(
          'mt-1 inline-flex items-center gap-1 self-start rounded-full font-semibold',
          size === 'pc' ? 'px-1.5 py-0.5 text-[9px]' : 'px-1 py-px text-[7.5px]',
          attachment.status === 'done'
            ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
            : 'border border-amber-200 bg-amber-50 text-amber-700'
        )}
      >
        <Icon
          className={cn(
            size === 'pc' ? 'h-2.5 w-2.5' : 'h-2 w-2',
            attachment.status === 'processing' && 'animate-spin'
          )}
        />
        {attachment.label ?? (attachment.status === 'done' ? '완료' : '처리중')}
      </div>
    );
  }

  if (attachment.kind === 'callout') {
    const palette: Record<string, string> = {
      info: 'border-blue-200 bg-blue-50 text-blue-700',
      success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
      warning: 'border-amber-200 bg-amber-50 text-amber-700',
    };
    return (
      <div
        className={cn(
          'mt-1 flex items-center gap-1 rounded-md border',
          size === 'pc' ? 'px-1.5 py-0.5 text-[9px]' : 'px-1 py-px text-[8px]',
          palette[attachment.tone]
        )}
      >
        <Info className={cn(size === 'pc' ? 'h-2.5 w-2.5' : 'h-2 w-2')} />
        <span className="font-semibold">{attachment.text}</span>
      </div>
    );
  }

  return null;
}
