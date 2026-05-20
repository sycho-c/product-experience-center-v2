import type { V2ScenarioMeta } from '@/types/scenario';

export const meta: V2ScenarioMeta = {
  id: 'insurance-1m',
  title: '하나손해보험 GA 협업 채널',
  subtitle: '손글씨 사진 한 장이 자동 할 일·고객 등록·청약 PDF까지',
  summary:
    '설계매니저가 4명의 영업가족과 각각 1:1 협업 채널을 동시에 운영하며, 손글씨 사진 + 텍스트 메시지에서 OCR/NER로 고객 정보를 자동 추출해 할 일·SFA·청약 PDF까지 한 흐름으로 연결합니다.',
  industry: '보험',
  participantPattern: '1:M',
  durationMinutes: 7,
};
