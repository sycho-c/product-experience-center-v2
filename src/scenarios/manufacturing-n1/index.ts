import { Lock, FileSignature, ShieldCheck, Workflow } from 'lucide-react';
import type { V2Scenario } from '@/types/scenario';
import {
  makeDeviceAnchorId as dev,
  makeSystemAnchorId as sys,
} from '@/types/anchor';

const WS = 'workspace-pc';
const ROOM = 'r-ag-gangnam';

// 강남BIZ AG — 모집인 약 70명이 소속된 하나의 영업그룹(AG).
// 대화방 이름은 AG명, 참여자 표시명은 "AG명/이름" 형식.
const AG = '강남BIZ AG';

export const scenario: V2Scenario = {
  id: 'manufacturing-n1',
  title: '우리금융캐피탈 강남BIZ AG 단체방',
  subtitle: '모집인 70명 단일 AG 채널 + 비밀 메시지 + 비즈폼 승인 워크플로우',
  summary:
    '우리캐피탈 렌터카팀 김도윤이 강남BIZ AG 소속 모집인 70명과 운영하는 단일 AG 단체방. 같은 AG의 모집인들이 한 방에서 정보를 공유하면서도, 내부 검토는 비밀 메시지로 보호되고 한도 상향 요청은 비즈폼·승인 워크플로우로 결재됩니다.',
  industry: '금융',
  participantPattern: 'N:M',
  durationMinutes: 6,
  messagingPattern: 'shared-room',
  initialActiveRoomId: ROOM,

  beforeNarrative: {
    summary: '단체 카톡방 운영의 한계',
    limitations: [
      '내부 검토 메시지가 같은 AG 모집인 전원에게 그대로 노출됨',
      '여신·재무 자료를 카톡으로 받아 보안·감사 추적 불가',
      '요청·답변이 채팅 흐름에 묻혀 처리 상태 추적 불가',
      '결재·승인 워크플로우와 채팅이 분리되어 누락 잦음',
    ],
  },

  systems: [
    { id: 'secret', label: '비밀 메시지', labelEn: 'Secret Msg', icon: Lock, defaultStatus: '대기', activeStatus: '대상자만 풀 표시', accent: 'indigo' },
    { id: 'bizform', label: '비즈폼', labelEn: 'BizForm', icon: FileSignature, defaultStatus: '대기', activeStatus: '제출 접수', accent: 'sky' },
    { id: 'credit', label: '신용 평가', labelEn: 'Credit Score', icon: ShieldCheck, defaultStatus: '대기', activeStatus: '한도 검토 중', accent: 'emerald' },
    { id: 'approve', label: '승인 워크플로우', labelEn: 'Approval', icon: Workflow, defaultStatus: '대기', activeStatus: '결재 진행', accent: 'amber' },
  ],

  // overflow 슬롯 없음 — 4명의 모집인만 표시하고, 나머지 66명은
  // 대화방 참여 인원 수(totalParticipants: 70)로만 유추되도록 함.
  devices: [
    { id: WS, kind: 'workspace-pc', label: '렌터카팀 호스트', persona: { name: '김도윤', role: '우리캐피탈 렌터카팀', avatarColor: '#4F46E5' } },
    { id: 'guest-1', kind: 'guest-mobile', label: `${AG} / 홍길동`, persona: { name: `${AG} / 홍길동`, role: '모집인', avatarColor: '#10B981' } },
    { id: 'guest-2', kind: 'guest-mobile', label: `${AG} / 최영수`, persona: { name: `${AG} / 최영수`, role: '모집인', avatarColor: '#F59E0B' } },
    { id: 'guest-3', kind: 'guest-mobile', label: `${AG} / 김지원`, persona: { name: `${AG} / 김지원`, role: '모집인', avatarColor: '#22D3EE' } },
    { id: 'guest-4', kind: 'guest-mobile', label: `${AG} / 박진우`, persona: { name: `${AG} / 박진우`, role: '모집인', avatarColor: '#A855F7' } },
  ],

  rooms: [
    {
      id: ROOM,
      name: `#${AG}`,
      participantDeviceIds: [WS, 'guest-1', 'guest-2', 'guest-3', 'guest-4'],
      pattern: 'group',
      // 70명 = 모집인 68명 + 렌터카팀 2명 (호스트 김도윤 + 백업 1명).
      // 화면에는 대표 4명만 보이고 나머지는 이 숫자로만 표현됨.
      totalParticipants: 70,
    },
  ],

  connections: [
    { id: 'c-sec-ws', fromAnchorId: sys('secret'), toAnchorId: dev(WS, 'bottom'), direction: 'bidi', label: '비밀 메시지' },
    { id: 'c-biz-ws', fromAnchorId: sys('bizform'), toAnchorId: dev(WS, 'bottom'), direction: 'bidi', label: '비즈폼' },
    { id: 'c-cred-ws', fromAnchorId: sys('credit'), toAnchorId: dev(WS, 'bottom'), direction: 'bidi', label: '신용 평가' },
    { id: 'c-apr-ws', fromAnchorId: sys('approve'), toAnchorId: dev(WS, 'bottom'), direction: 'out', label: '승인 트리거' },
    { id: 'c-ws-g1', fromAnchorId: dev(WS, 'bottom'), toAnchorId: dev('guest-1', 'top'), direction: 'bidi' },
    { id: 'c-ws-g2', fromAnchorId: dev(WS, 'bottom'), toAnchorId: dev('guest-2', 'top'), direction: 'bidi' },
    { id: 'c-ws-g3', fromAnchorId: dev(WS, 'bottom'), toAnchorId: dev('guest-3', 'top'), direction: 'bidi' },
    { id: 'c-ws-g4', fromAnchorId: dev(WS, 'bottom'), toAnchorId: dev('guest-4', 'top'), direction: 'bidi' },
  ],

  steps: [
    {
      id: '01', order: 1,
      title: `${AG} 모집인 70명 단일 단체방`,
      description: `호스트 김도윤이 ${AG} 소속 모집인 70명과 운영하는 단일 AG 단체방. 같은 AG의 모집인 4명을 대표로 표시하고, 나머지는 대화방 참여 인원 수(70명)로만 표현됩니다.`,
      spotlight: { type: 'multi', ids: ['dev:workspace-pc', 'dev:guest-1', 'dev:guest-2', 'dev:guest-3', 'dev:guest-4'] },
      activeSystems: ['secret', 'bizform', 'credit', 'approve'],
      activeDevices: [WS, 'guest-1', 'guest-2', 'guest-3', 'guest-4'],
      activeConnections: ['c-ws-g1', 'c-ws-g2', 'c-ws-g3', 'c-ws-g4'],
      systemStatuses: { secret: '준비', bizform: '준비', credit: '준비', approve: '준비' },
    },
    {
      id: '02', order: 2,
      title: '같은 AG 모집인의 한도 상향 요청',
      description: `${AG} 소속 홍길동이 단체방에서 "여신 한도 5천만원 → 1억원 상향 요청" 메시지 전송. 같은 AG의 모집인 70명이 동시에 보는 채널.`,
      spotlight: { type: 'multi', ids: ['dev:guest-1', 'dev:workspace-pc', 'c-ws-g1'] },
      activeSystems: [],
      activeDevices: [WS, 'guest-1', 'guest-2', 'guest-3', 'guest-4'],
      activeConnections: ['c-ws-g1', 'c-ws-g2', 'c-ws-g3', 'c-ws-g4'],
      messageEvents: [
        { roomId: ROOM, line: { from: 'other', author: `${AG} / 홍길동`, text: '여신 한도 5천만원 → 1억원 상향 요청드립니다' } },
        { roomId: ROOM, line: { from: 'self', author: '김도윤 (호스트)', text: '확인했습니다. 신용도 검토 후 안내드리겠습니다 (할 일 등록)' } },
      ],
    },
    {
      id: '03', order: 3,
      title: '비밀 메시지 - 대상자에게만 풀 표시',
      description: `호스트가 신용평가 결과를 홍길동에게만 비밀 메시지로 전달. 같은 AG의 다른 모집인 69명에게는 "🔒 비밀 메시지가 있습니다" placeholder만 보입니다.`,
      spotlight: { type: 'multi', ids: ['sys:secret', 'sys:credit', 'dev:workspace-pc', 'dev:guest-1', 'c-sec-ws', 'c-cred-ws'] },
      activeSystems: ['secret', 'credit'],
      activeDevices: [WS, 'guest-1'],
      activeConnections: ['c-sec-ws', 'c-cred-ws', 'c-ws-g1'],
      systemStatuses: { secret: '홍길동 대상 풀 표시', credit: 'A등급 통과' },
      messageEvents: [
        { roomId: ROOM, line: { from: 'self', author: '김도윤 (호스트)', text: '🔒 [홍길동님께만] 신용 A등급 통과, 한도 상향 가능합니다. 비즈폼으로 추가 자료 요청드릴게요' } },
      ],
    },
    {
      id: '04', order: 4,
      title: '같은 AG의 다른 모집인 시점',
      description: `${AG} 소속의 다른 모집인 최영수·김지원·박진우 등 비대상자들은 같은 위치에 "🔒 비밀 메시지" placeholder만 보입니다. 같은 AG라도 검토 내용은 보호됨.`,
      spotlight: { type: 'multi', ids: ['dev:guest-2', 'dev:guest-3', 'dev:guest-4', 'sys:secret'] },
      activeSystems: ['secret'],
      activeDevices: [WS, 'guest-2', 'guest-3', 'guest-4'],
      activeConnections: ['c-sec-ws'],
      messageEvents: [
        { roomId: ROOM, line: { from: 'system', text: '🔒 비밀 메시지 (대상자에게만 표시)' } },
      ],
    },
    {
      id: '05', order: 5,
      title: '비즈폼 발송 → 사업자등록증·재무제표 첨부',
      description: '호스트가 한도 상향 비즈폼을 채널에 부착 → 홍길동이 모바일에서 견적번호·요청 내용·사업자등록증 PDF 첨부 후 제출 → 채널에 inline 비즈폼 카드 생성.',
      spotlight: { type: 'multi', ids: ['sys:bizform', 'dev:workspace-pc', 'dev:guest-1', 'c-biz-ws', 'c-ws-g1'] },
      activeSystems: ['bizform'],
      activeDevices: [WS, 'guest-1'],
      activeConnections: ['c-biz-ws', 'c-ws-g1'],
      systemStatuses: { bizform: 'WC-2026-00128 제출 완료' },
      messageEvents: [
        { roomId: ROOM, line: { from: 'self', author: '김도윤 (호스트)', text: '한도 상향 비즈폼 부탁드립니다 📋' } },
        { roomId: ROOM, line: { from: 'other', author: `${AG} / 홍길동`, text: '제출 완료 📎 사업자등록증 + 재무제표' } },
      ],
    },
    {
      id: '06', order: 6,
      title: 'RightRail 비즈폼 패널 → 승인 워크플로우',
      description: '호스트가 PC RightRail의 비즈폼 패널에서 제출 내용 확인 → "승인" 클릭 → 승인 워크플로우가 결재 라인으로 전달됨.',
      spotlight: { type: 'multi', ids: ['sys:approve', 'dev:workspace-pc', 'c-apr-ws'] },
      activeSystems: ['approve'],
      activeDevices: [WS],
      activeConnections: ['c-apr-ws'],
      systemStatuses: { approve: '결재 진행 완료' },
      liveCallout: { deviceId: WS, text: '✓ WC-2026-00128 승인 — 1억원 한도' },
    },
    {
      id: '07', order: 7,
      title: '할 일 완료 → AG 단체방 공개 안내',
      description: `결재 완료 후 메시지 chip이 "완료"로 변경되고 ${AG} 단체방에 한도 상향 결과를 공개 메시지로 안내. 비밀 검토는 보호된 채 결과만 70명에게 공유.`,
      spotlight: { type: 'multi', ids: ['dev:workspace-pc', 'dev:guest-1', 'dev:guest-2', 'dev:guest-3', 'dev:guest-4'] },
      activeSystems: [],
      activeDevices: [WS, 'guest-1', 'guest-2', 'guest-3', 'guest-4'],
      activeConnections: ['c-ws-g1', 'c-ws-g2', 'c-ws-g3', 'c-ws-g4'],
      messageEvents: [
        { roomId: ROOM, line: { from: 'system', text: '✓ 할 일 "한도 상향 검토" 완료' } },
        { roomId: ROOM, line: { from: 'self', author: '김도윤 (호스트)', text: `${AG} / 홍길동님 한도 상향 처리 완료 — 1억원 사용 가능합니다` } },
      ],
    },
  ],
};
