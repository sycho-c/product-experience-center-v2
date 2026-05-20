import { Bell, FileSignature, Database, ArrowLeftRight } from 'lucide-react';
import type { V2Scenario } from '@/types/scenario';
import {
  makeDeviceAnchorId as dev,
  makeSystemAnchorId as sys,
} from '@/types/anchor';

const WS = 'workspace-pc';
const MWS = 'mobile-workspace';

// 영업 정대리가 1:1로 응대하는 4개의 거래처 — 각자 별도 방.
const ROOM_HANSOL = 'r-hansol';
const ROOM_DONGGWANG = 'r-donggwang';
const ROOM_GREENFLOW = 'r-greenflow';
const ROOM_HANVIT = 'r-hanvit';

export const scenario: V2Scenario = {
  id: 'rentacar-nm',
  title: 'SK렌터카 SalesBridge',
  subtitle: '본사 관리자 + 법인폰 영업 + 1:1 고객 — 이직 시 일괄 이관',
  summary:
    '본사 영업관리 차상훈(PC)이 법인폰 영업 정대리(모바일)와 그가 1:1로 응대하는 4개 거래처를 관리합니다. 영업은 카카오 상담톡으로 고객별 1:1 대화방을 운영하고, 본사는 이력·자산화·이관까지 한 화면에서 통제합니다. 영업이 이직해도 모든 1:1 방·파일은 다른 영업에게 100% 강제 승계됩니다.',
  industry: '렌터카',
  participantPattern: 'N:M',
  durationMinutes: 7,
  messagingPattern: 'per-guest',
  initialActiveRoomId: ROOM_HANSOL,

  beforeNarrative: {
    summary: '개인 카톡 영업의 회사 자산 유실',
    limitations: [
      '영업사원 200명이 개인 카톡으로 1:1 응대 → 회사는 거래처 이력을 알 수 없음',
      '영업 이직 시 1:1 카톡방·고객·파일이 함께 사라짐',
      '사업자등록·차량 정보 수기 입력 → 오타·누락',
      '대화·파일이 DB Mart에 적재되지 않아 의사결정 자산화 불가',
    ],
  },

  systems: [
    { id: 'alimtalk', label: '카카오 알림톡', labelEn: 'BizBpurio', icon: Bell, defaultStatus: '대기', activeStatus: '초대장 발송', accent: 'amber' },
    { id: 'bizform', label: '비즈폼', labelEn: 'BizForm', icon: FileSignature, defaultStatus: '대기', activeStatus: '법인 정보 등록', accent: 'sky' },
    { id: 'dbmart', label: 'DB Mart', labelEn: 'Action Power', icon: Database, defaultStatus: '대기', activeStatus: '대화·파일 자동 적재', accent: 'emerald' },
    { id: 'handover', label: '담당자 이관', labelEn: 'Admin Transfer', icon: ArrowLeftRight, defaultStatus: '대기', activeStatus: '12건 일괄 이관', accent: 'indigo' },
  ],

  devices: [
    { id: WS, kind: 'workspace-pc', label: '본사 영업관리', persona: { name: '차상훈', role: '영업1팀장 (본사 관리자)', avatarColor: '#4F46E5' } },
    { id: MWS, kind: 'mobile-workspace', label: '법인폰 영업', persona: { name: '정대리', role: '영업1팀 (법인폰 담당)', avatarColor: '#22D3EE' } },
    { id: 'guest-1', kind: 'guest-mobile', label: '한솔무역 박찬호', persona: { name: '박찬호', role: '한솔무역 대표', avatarColor: '#10B981' } },
    { id: 'guest-2', kind: 'guest-mobile', label: '동광물류 김재석', persona: { name: '김재석', role: '동광물류 운영팀장', avatarColor: '#F59E0B' } },
    { id: 'guest-3', kind: 'guest-mobile', label: '그린플로 이수영', persona: { name: '이수영', role: '그린플로 총무팀', avatarColor: '#A855F7' } },
    { id: 'guest-4', kind: 'guest-mobile', label: '한빛엔지 박지원', persona: { name: '박지원', role: '한빛엔지 임원 비서', avatarColor: '#EF4444' } },
  ],

  // 4개의 1:1 방 — 각 방마다 [본사 관리자(WS), 영업(MWS), 고객(guest)] 구성.
  // 본사 관리자는 모든 방을 모니터링하지만, 실제 1:1 대화는 영업↔고객 중심.
  rooms: [
    {
      id: ROOM_HANSOL,
      name: '한솔무역 박찬호',
      participantDeviceIds: [WS, MWS, 'guest-1'],
      pattern: '1:1',
      subtitle: 'K3 단기렌탈',
    },
    {
      id: ROOM_DONGGWANG,
      name: '동광물류 김재석',
      participantDeviceIds: [WS, MWS, 'guest-2'],
      pattern: '1:1',
      subtitle: '1톤 트럭 5대',
    },
    {
      id: ROOM_GREENFLOW,
      name: '그린플로 이수영',
      participantDeviceIds: [WS, MWS, 'guest-3'],
      pattern: '1:1',
      subtitle: '전기차 10대',
    },
    {
      id: ROOM_HANVIT,
      name: '한빛엔지 박지원',
      participantDeviceIds: [WS, MWS, 'guest-4'],
      pattern: '1:1',
      subtitle: '임원 차량',
    },
  ],

  connections: [
    // 시스템 → 본사 관리자 (PC)
    { id: 'c-alim-ws', fromAnchorId: sys('alimtalk'), toAnchorId: dev(WS, 'bottom'), direction: 'out', label: '알림톡 초대' },
    { id: 'c-biz-ws', fromAnchorId: sys('bizform'), toAnchorId: dev(WS, 'bottom'), direction: 'bidi', label: '비즈폼' },
    { id: 'c-db-ws', fromAnchorId: sys('dbmart'), toAnchorId: dev(WS, 'bottom'), direction: 'in', label: 'DB Mart 적재' },
    { id: 'c-hand-ws', fromAnchorId: sys('handover'), toAnchorId: dev(WS, 'bottom'), direction: 'out', label: '이관 트리거' },
    // 본사 관리자(PC) ↔ 영업(Mobile Workspace) — 관리·이관 흐름
    { id: 'c-ws-mws', fromAnchorId: dev(WS, 'right'), toAnchorId: dev(MWS, 'left'), direction: 'bidi', label: '관리·이관' },
    // 영업(Mobile Workspace) ↔ 1:1 고객 4명 — 실제 영업 대화
    { id: 'c-mws-g1', fromAnchorId: dev(MWS, 'bottom'), toAnchorId: dev('guest-1', 'top'), direction: 'bidi', label: '1:1' },
    { id: 'c-mws-g2', fromAnchorId: dev(MWS, 'bottom'), toAnchorId: dev('guest-2', 'top'), direction: 'bidi', label: '1:1' },
    { id: 'c-mws-g3', fromAnchorId: dev(MWS, 'bottom'), toAnchorId: dev('guest-3', 'top'), direction: 'bidi', label: '1:1' },
    { id: 'c-mws-g4', fromAnchorId: dev(MWS, 'bottom'), toAnchorId: dev('guest-4', 'top'), direction: 'bidi', label: '1:1' },
  ],

  steps: [
    {
      id: '01', order: 1,
      title: '본사 → 영업 → 1:1 고객 4명 구도 소개',
      description:
        '본사 관리자 차상훈이 영업 정대리를 통해 4개의 거래처(한솔/동광/그린플로/한빛)와 1:1 카카오 상담톡 채널을 운영합니다. 영업은 모바일로 응대하고 본사는 PC에서 모든 채널을 모니터링합니다.',
      spotlight: { type: 'multi', ids: ['dev:workspace-pc', 'dev:mobile-workspace', 'dev:guest-1', 'dev:guest-2', 'dev:guest-3', 'dev:guest-4'] },
      activeSystems: ['alimtalk', 'bizform', 'dbmart', 'handover'],
      activeDevices: [WS, MWS, 'guest-1', 'guest-2', 'guest-3', 'guest-4'],
      activeConnections: ['c-ws-mws', 'c-mws-g1', 'c-mws-g2', 'c-mws-g3', 'c-mws-g4'],
      systemStatuses: { alimtalk: '준비', bizform: '준비', dbmart: '준비', handover: '준비' },
      activeRoomId: ROOM_HANSOL,
    },
    {
      id: '02', order: 2,
      title: '카카오 알림톡 초대 → 박찬호와 1:1 방 개설',
      description:
        '정대리가 박찬호 대표를 외부 사용자로 선택하고 카카오 알림톡(비즈뿌리오)으로 초대 → 박찬호가 개인 카톡 초대 카드를 수락해 SK렌터카 공식 카카오 상담톡 채널로 입장. 정대리↔박찬호 1:1 방 생성.',
      spotlight: { type: 'multi', ids: ['sys:alimtalk', 'dev:mobile-workspace', 'dev:guest-1', 'c-alim-ws', 'c-mws-g1'] },
      activeSystems: ['alimtalk'],
      activeDevices: [WS, MWS, 'guest-1'],
      activeConnections: ['c-alim-ws', 'c-ws-mws', 'c-mws-g1'],
      systemStatuses: { alimtalk: '초대장 발송·수락 완료' },
      activeRoomId: ROOM_HANSOL,
      messageEvents: [
        { roomId: ROOM_HANSOL, line: { from: 'system', text: '✓ 한솔무역 박찬호 1:1 방 생성됨' } },
        { roomId: ROOM_HANSOL, line: { from: 'system', text: '✓ 박찬호 대표 카톡 초대장 수락 — 공식 상담톡 입장' } },
      ],
    },
    {
      id: '03', order: 3,
      title: '거래처 견적 문의 + 법인폰 FCM 푸시',
      description:
        '박찬호가 "K3 1년 단기렌탈 월 견적 받아볼까?" 메시지 전송 → 외근 중인 정대리 법인폰에 FCM 푸시 즉시 도착. 본사 차상훈은 PC에서 같은 1:1 방을 모니터링.',
      spotlight: { type: 'multi', ids: ['dev:guest-1', 'dev:mobile-workspace', 'dev:workspace-pc', 'c-mws-g1'] },
      activeSystems: [],
      activeDevices: [WS, MWS, 'guest-1'],
      activeConnections: ['c-mws-g1', 'c-ws-mws'],
      activeRoomId: ROOM_HANSOL,
      messageEvents: [
        { roomId: ROOM_HANSOL, line: { from: 'other', author: '박찬호 (한솔무역)', text: 'K3 1년 단기렌탈 월 견적 받아볼 수 있을까요?' } },
        { roomId: ROOM_HANSOL, line: { from: 'system', text: '🔔 정대리 법인폰 FCM 푸시 도착' } },
      ],
    },
    {
      id: '04', order: 4,
      title: '비즈폼 + 견적서 + DB Mart 자동 적재',
      description:
        '본사가 "법인 정보 등록" 비즈폼을 1:1 채널에 부착 → 박찬호가 모바일에서 사업자번호·법인명·차량용도·사업자등록증 첨부 후 제출. 정대리가 K3 견적서 PDF 회신. 제출 데이터·파일이 DB Mart에 자동 적재됨.',
      spotlight: { type: 'multi', ids: ['sys:bizform', 'sys:dbmart', 'dev:workspace-pc', 'dev:mobile-workspace', 'dev:guest-1', 'c-biz-ws', 'c-db-ws', 'c-mws-g1'] },
      activeSystems: ['bizform', 'dbmart'],
      activeDevices: [WS, MWS, 'guest-1'],
      activeConnections: ['c-biz-ws', 'c-db-ws', 'c-ws-mws', 'c-mws-g1'],
      systemStatuses: { bizform: '법인 정보 비즈폼 제출 완료', dbmart: '사업자·메시지·파일 적재 완료' },
      activeRoomId: ROOM_HANSOL,
      messageEvents: [
        { roomId: ROOM_HANSOL, line: { from: 'system', author: '차상훈 (본사)', text: '📋 법인 정보 등록 비즈폼이 부착되었습니다' } },
        { roomId: ROOM_HANSOL, line: { from: 'other', author: '박찬호 (한솔무역)', text: '제출 완료했습니다 📎 사업자등록증' } },
        { roomId: ROOM_HANSOL, line: { from: 'self', author: '정대리 (법인폰)', text: '견적서 보내드립니다 📎 K3_1년_단기렌탈_38만원.pdf' } },
        { roomId: ROOM_HANSOL, line: { from: 'system', text: '📊 DB Mart 자동 적재 — 한솔무역 신규 고객 등록' } },
      ],
    },
    {
      id: '05', order: 5,
      title: '4개 1:1 동시 응대 — 동광물류 문의 전환',
      description:
        '정대리가 동시에 동광물류 김재석과의 1:1 방에서 1톤 트럭 5대 견적 문의에 응대. 본사 차상훈은 PC에서 활성 방을 한솔→동광으로 전환하며 모니터링. 그린플로/한빛엔지도 같은 영업이 관리하는 1:1 채널.',
      spotlight: { type: 'multi', ids: ['dev:guest-2', 'dev:guest-3', 'dev:guest-4', 'dev:mobile-workspace', 'c-mws-g2', 'c-mws-g3', 'c-mws-g4'] },
      activeSystems: [],
      activeDevices: [WS, MWS, 'guest-2', 'guest-3', 'guest-4'],
      activeConnections: ['c-mws-g2', 'c-mws-g3', 'c-mws-g4', 'c-ws-mws'],
      activeRoomId: ROOM_DONGGWANG,
      messageEvents: [
        { roomId: ROOM_DONGGWANG, line: { from: 'other', author: '김재석 (동광물류)', text: '1톤 트럭 5대 추가 견적 가능할까요?' } },
        { roomId: ROOM_DONGGWANG, line: { from: 'self', author: '정대리 (법인폰)', text: '바로 견적 준비해서 회신드리겠습니다' } },
        { roomId: ROOM_GREENFLOW, line: { from: 'other', author: '이수영 (그린플로)', text: '전기차 10대 충전 인프라 안내 부탁드려요' } },
        { roomId: ROOM_HANVIT, line: { from: 'other', author: '박지원 (한빛엔지)', text: '임원 차량 교체 일정 협의 드립니다' } },
      ],
    },
    {
      id: '06', order: 6,
      title: '영업 이직 → 1:1 방 12개 일괄 이관',
      description:
        '영업1팀 김주임이 동종업계 이직 → 본사 차상훈이 PC 관리자 화면에서 김주임이 소유한 1:1 방 12개·고객 12명·파일 78건을 정대리에게 일괄 이관. 1:1 방의 영업 소유자가 자동 변경되고 고객에게 안내 메시지 발송.',
      spotlight: { type: 'multi', ids: ['sys:handover', 'dev:workspace-pc', 'dev:mobile-workspace', 'c-hand-ws', 'c-ws-mws'] },
      activeSystems: ['handover'],
      activeDevices: [WS, MWS],
      activeConnections: ['c-hand-ws', 'c-ws-mws'],
      systemStatuses: { handover: '12건·78파일 100% 승계' },
      liveCallout: { deviceId: WS, text: '✓ 1:1 방 12개 이관 — 김주임 → 정대리' },
      activeRoomId: ROOM_HANSOL,
      messageEvents: [
        { roomId: ROOM_HANSOL, line: { from: 'system', text: '🔄 (참고) 영업1팀 12개 1:1 방 담당자 변경: 김주임 → 정대리' } },
      ],
    },
    {
      id: '07', order: 7,
      title: '하루 마감 - 외부 채널 0건, 모두 회사 자산',
      description:
        '오늘 응대 32건·신규 고객 5명·메시지 482건·파일 78건이 모두 DB Mart에 적재 완료. 영업의 개인 카톡 사용 0건. 영업이 떠나도 1:1 방·고객·이력은 회사 자산으로 100% 남습니다.',
      spotlight: { type: 'multi', ids: ['sys:dbmart', 'sys:handover', 'dev:workspace-pc', 'dev:mobile-workspace'] },
      activeSystems: ['dbmart', 'handover'],
      activeDevices: [WS, MWS],
      activeConnections: ['c-db-ws', 'c-hand-ws', 'c-ws-mws'],
      systemStatuses: { dbmart: '오늘 482건·78파일 적재 완료', handover: '오늘 이관 12건' },
      liveCallout: { deviceId: WS, text: '✓ 외부 채널 사용 0건 · 모두 회사 자산' },
      activeRoomId: ROOM_HANSOL,
    },
  ],
};
