import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Users, Building2, Factory } from 'lucide-react';
import { scenarioMetas } from '@/scenarios/_registry';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const PATTERN_LABEL = {
  '1:1': '1:1',
  '1:M': '1:M',
  'N:1': 'N:1',
  'N:M': 'N:M',
} as const;

const INDUSTRY_ICON = {
  보험: Sparkles,
  금융: Sparkles,
  렌터카: Users,
  제조: Factory,
  공공: Building2,
  기타: Building2,
} as const;

export function HomeRoute() {
  return (
    <main className="mx-auto flex max-w-[1600px] flex-col gap-8 px-6 py-10">
      <header className="flex flex-col gap-3">
        <Badge variant="brand" className="self-start">
          v2 · 한 화면에 다 담은 제품체험관
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight text-ink-primary md:text-4xl">
          고객사 시스템부터 다자간 협업까지,
          <br /> 한 무대에서 보는 Cowork+
        </h1>
        <p className="max-w-2xl text-base text-ink-secondary leading-relaxed">
          좌측은 고객사 기간계·채널계·CRM·레거시 시스템, 우측은 Workspace·Mobile·Guest 디바이스 그리드.
          정적 연결선과 펄스 애니메이션으로 데이터 흐름을 보이고, 단계마다 스포트라이트로 시선을 안내합니다.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {scenarioMetas.map((meta) => {
          const Icon = INDUSTRY_ICON[meta.industry ?? '기타'];
          return (
            <Card
              key={meta.id}
              className="group relative flex flex-col gap-3 p-6 transition-all hover:shadow-elev"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-primarySoft text-brand-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="flex items-center gap-1.5">
                  <Badge variant="outline">{meta.industry}</Badge>
                  <Badge variant="brand">{PATTERN_LABEL[meta.participantPattern]}</Badge>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-bold text-ink-primary">{meta.title}</h2>
                {meta.subtitle && (
                  <p className="text-sm text-ink-secondary">{meta.subtitle}</p>
                )}
              </div>
              <p className="text-sm leading-relaxed text-ink-muted">{meta.summary}</p>
              <Link
                to={`/scenario/${meta.id}`}
                className={cn(
                  'mt-auto inline-flex items-center justify-center gap-1.5 rounded-md bg-brand-primary px-3 py-2 text-sm font-medium text-white shadow-soft transition-colors hover:bg-brand-primaryHover'
                )}
              >
                시나리오 체험 시작 <ArrowRight className="h-4 w-4" />
              </Link>
            </Card>
          );
        })}
      </section>
    </main>
  );
}
