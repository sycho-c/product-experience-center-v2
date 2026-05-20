import type { V2ScenarioMeta } from '@/types/scenario';

export const meta: V2ScenarioMeta = {
  id: 'manufacturing-n1',
  title: '우리금융캐피탈 거래처 단체방',
  subtitle: '70명 협력사 N:M + 비밀 메시지 + 비즈폼 승인 워크플로우',
  summary:
    '렌터카팀 호스트 2명이 70명 협력사와 운영하는 단체 협업 채널. 외부 거래처는 공개 메시지를 함께 보면서도 내부 검토는 비밀 메시지로 보호되고, 한도 상향 요청은 비즈폼·승인 워크플로우로 추적·결재됩니다.',
  industry: '금융',
  participantPattern: 'N:M',
  durationMinutes: 6,
};
