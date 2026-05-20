import type { V2ScenarioMeta } from '@/types/scenario';

export const meta: V2ScenarioMeta = {
  id: 'rentacar-nm',
  title: 'SK렌터카 SalesBridge',
  subtitle: '법인폰 + 카카오 상담톡 + 비즈폼 + DB Mart 자산화',
  summary:
    '본사 영업관리(Workspace)와 법인폰 영업(Mobile Workspace)이 한 팀으로 움직이며, 카카오 알림톡으로 거래처를 공식 상담톡 채널에 초대하고 사진·비즈폼·견적서를 한 흐름으로 처리합니다. 모든 대화·파일·메타데이터가 DB Mart에 자동 적재돼 이직 시에도 100% 회사 자산으로 강제 승계됩니다.',
  industry: '렌터카',
  participantPattern: 'N:M',
  durationMinutes: 7,
};
