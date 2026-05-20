import { Factory, FileSpreadsheet, FolderSearch, Bell } from 'lucide-react';
import type { V2Scenario } from '@/types/scenario';
import {
  makeDeviceAnchorId as dev,
  makeSystemAnchorId as sys,
} from '@/types/anchor';

const WS = 'workspace-pc';
const MWS = 'mobile-workspace';

export const scenario: V2Scenario = {
  id: 'gaon-cable-1to1',
  title: '가온전선 SalesBridge',
  subtitle: '카톡 흩어진 파일을 협업 채널 + 통합 파일 라이브러리로',
  summary:
    '본사 영업관리 강승희(Workspace)와 현장 영업 이외근(Mobile Workspace) 두 명이 한 팀으로 움직이며 시공사·구매팀·감리와 각각의 1:1 협업 채널을 운영합니다. SAP 자재 단가·견적 시스템과 연계되고 모든 파일이 통합 파일 라이브러리에 자동 보관되어, 2개월 후 재발주 시 자재번호 한 단어로 과거 파일을 즉시 재활용합니다.',
  industry: '제조',
  participantPattern: '1:1',
  durationMinutes: 8,
  messagingPattern: 'per-guest',
  initialActiveRoomId: 'r-construction',

  beforeNarrative: {
    summary: '개인 카톡 산재 협업의 한계',
    limitations: [
      '거래처별 사양서·견적서·도면이 개인 카톡에 흩어져 보관·검색 불가',
      'SAP 자재 단가·재고와 연동 안 됨 — 매번 수기 확인',
      '담당자 이직 시 과거 파일·이력이 함께 사라짐',
      '재발주 시점에 과거 견적·도면을 찾을 방법 없음',
    ],
  },

  systems: [
    { id: 'sap', label: '자재 마스터', labelEn: 'SAP', icon: Factory, defaultStatus: '대기', activeStatus: '재고·단가 조회', accent: 'indigo' },
    { id: 'quote', label: '견적 시스템', labelEn: 'Quote Engine', icon: FileSpreadsheet, defaultStatus: '대기', activeStatus: '견적서 생성', accent: 'sky' },
    { id: 'library', label: '파일 라이브러리', labelEn: 'File Library', icon: FolderSearch, defaultStatus: '대기', activeStatus: '파일 자동 보관·검색', accent: 'emerald' },
    { id: 'alimtalk', label: '알림톡 발송기', labelEn: 'AlimTalk', icon: Bell, defaultStatus: '대기', activeStatus: '초대장 발송', accent: 'amber' },
  ],

  devices: [
    { id: WS, kind: 'workspace-pc', label: '본사 Workspace', persona: { name: '강승희', role: '본사 영업관리', avatarColor: '#4F46E5' } },
    { id: MWS, kind: 'mobile-workspace', label: '현장 영업 모바일', persona: { name: '이외근', role: '현장 영업 (외근)', avatarColor: '#22D3EE' } },
    { id: 'guest-1', kind: 'guest-mobile', label: '시공사', persona: { name: '미우케이블 박대표', role: '시공사 대표', avatarColor: '#10B981' } },
    { id: 'guest-2', kind: 'guest-mobile', label: '구매팀', persona: { name: 'LS전선 구매팀', role: '구매', avatarColor: '#F59E0B' } },
    { id: 'guest-3', kind: 'guest-mobile', label: '감리', persona: { name: '한국감리', role: '감리', avatarColor: '#A855F7' } },
  ],

  rooms: [
    { id: 'r-construction', name: '미우케이블 시공사', subtitle: 'CC-22-150SQ 9월 발주', participantDeviceIds: [WS, MWS, 'guest-1'], pattern: '1:1' },
    { id: 'r-procurement', name: 'LS전선 구매팀', subtitle: '연간 단가 협상', participantDeviceIds: [WS, MWS, 'guest-2'], pattern: '1:1' },
    { id: 'r-inspection', name: '한국감리', subtitle: '품질 검수 협의', participantDeviceIds: [WS, MWS, 'guest-3'], pattern: '1:1' },
  ],

  connections: [
    { id: 'c-sap-ws', fromAnchorId: sys('sap'), toAnchorId: dev(WS, 'bottom'), direction: 'bidi', label: '자재 단가' },
    { id: 'c-quote-ws', fromAnchorId: sys('quote'), toAnchorId: dev(WS, 'bottom'), direction: 'bidi', label: '견적서' },
    { id: 'c-lib-ws', fromAnchorId: sys('library'), toAnchorId: dev(WS, 'bottom'), direction: 'bidi', label: '파일 자동 보관' },
    { id: 'c-alim-ws', fromAnchorId: sys('alimtalk'), toAnchorId: dev(WS, 'bottom'), direction: 'in', label: '카톡 초대' },
    { id: 'c-ws-mws', fromAnchorId: dev(WS, 'right'), toAnchorId: dev(MWS, 'left'), direction: 'bidi', label: '본사↔영업 동기화' },
    { id: 'c-ws-g1', fromAnchorId: dev(WS, 'bottom'), toAnchorId: dev('guest-1', 'top'), direction: 'bidi' },
    { id: 'c-ws-g2', fromAnchorId: dev(WS, 'bottom'), toAnchorId: dev('guest-2', 'top'), direction: 'bidi' },
    { id: 'c-ws-g3', fromAnchorId: dev(WS, 'bottom'), toAnchorId: dev('guest-3', 'top'), direction: 'bidi' },
  ],

  steps: [
    {
      id: '01', order: 1,
      title: '협업 채널 생성 + 카카오 알림톡 초대',
      description: '본사 강승희가 미우케이블 박대표를 외부 사용자로 선택하고 카카오 알림톡으로 초대 → 박대표가 모바일에서 공식 협업 채널 입장.',
      spotlight: { type: 'multi', ids: ['sys:alimtalk', 'dev:workspace-pc', 'dev:guest-1', 'c-alim-ws', 'c-ws-g1'] },
      activeSystems: ['alimtalk'],
      activeDevices: [WS, 'guest-1'],
      activeConnections: ['c-alim-ws', 'c-ws-g1'],
      activeRoomId: 'r-construction',
      systemStatuses: { alimtalk: '초대장 발송 완료' },
      messageEvents: [
        { roomId: 'r-construction', line: { from: 'system', text: '✓ 미우케이블 박대표 카톡 초대장 수락 — 협업 채널 입장' } },
        { roomId: 'r-construction', line: { from: 'self', author: '강승희 (본사)', text: '박대표님 환영합니다. 9월 발주 사양 검토 도와드릴게요' } },
      ],
    },
    {
      id: '02', order: 2,
      title: '거래처 사양서 PDF → 파일 라이브러리 자동 보관',
      description: '박대표가 모바일에서 CC-22-150SQ 사양서 PDF를 전송하면 협업 채널에 첨부됨과 동시에 통합 파일 라이브러리에 자동 등록됩니다.',
      spotlight: { type: 'multi', ids: ['sys:library', 'dev:guest-1', 'dev:workspace-pc', 'c-lib-ws', 'c-ws-g1'] },
      activeSystems: ['library'],
      activeDevices: [WS, 'guest-1'],
      activeConnections: ['c-lib-ws', 'c-ws-g1'],
      activeRoomId: 'r-construction',
      systemStatuses: { library: 'CC-22-150SQ 사양서 자동 등록' },
      messageEvents: [
        { roomId: 'r-construction', line: { from: 'other', author: '미우케이블 박대표', text: '9월 발주 사양서입니다 📎 미우_CC-22-150SQ_사양서.pdf' } },
      ],
    },
    {
      id: '03', order: 3,
      title: 'SAP 자재 단가 조회 + 견적 시스템 PDF 생성',
      description: '강승희가 채팅에서 /자재조회 CC-22-150SQ로 SAP를 호출 → 재고·단가가 카드로 도착 → 견적 시스템에서 견적 PDF 자동 생성.',
      spotlight: { type: 'multi', ids: ['sys:sap', 'sys:quote', 'dev:workspace-pc', 'c-sap-ws', 'c-quote-ws'] },
      activeSystems: ['sap', 'quote'],
      activeDevices: [WS],
      activeConnections: ['c-sap-ws', 'c-quote-ws'],
      activeRoomId: 'r-construction',
      systemStatuses: { sap: '재고 OK · 단가 1,250원/m', quote: '견적서 PDF 생성' },
      liveCallout: { deviceId: WS, text: '✓ CC-22-150SQ / 재고 OK / 단가 1,250원/m' },
      messageEvents: [
        { roomId: 'r-construction', line: { from: 'self', author: '강승희 (본사)', text: '오늘 오후 4시까지 견적 회신드리겠습니다 (할 일 등록됨)' } },
      ],
    },
    {
      id: '04', order: 4,
      title: '견적서·도면 회신 + 할 일 완료',
      description: '견적서 xlsx + 도면 dwg 두 파일을 한 메시지로 송신. 메시지의 할 일 chip이 "완료"로 갱신됩니다. 모든 파일은 라이브러리에 자동 보관.',
      spotlight: { type: 'multi', ids: ['dev:workspace-pc', 'dev:guest-1', 'sys:library'] },
      activeSystems: ['library'],
      activeDevices: [WS, 'guest-1'],
      activeConnections: ['c-lib-ws', 'c-ws-g1'],
      activeRoomId: 'r-construction',
      messageEvents: [
        { roomId: 'r-construction', line: { from: 'self', author: '강승희 (본사)', text: '견적서 + 도면 보내드립니다 📎 견적서.xlsx 📎 도면.dwg' } },
        { roomId: 'r-construction', line: { from: 'system', text: '✓ 할 일 "9월 출하 견적 회신" 완료' } },
      ],
    },
    {
      id: '05', order: 5,
      title: '본사가 LS전선 구매팀 방으로 전환',
      description: '본사가 좌측 리스트에서 LS전선 구매팀 방을 클릭 → 현장 영업의 모바일도 같은 방으로 자동 합류. 시공사 방 메시지·파일은 그대로 보존됩니다.',
      spotlight: { type: 'multi', ids: ['dev:workspace-pc', 'dev:mobile-workspace', 'dev:guest-2', 'c-ws-mws'] },
      activeSystems: [],
      activeDevices: [WS, MWS, 'guest-2'],
      activeConnections: ['c-ws-mws', 'c-ws-g2'],
      activeRoomId: 'r-procurement',
      messageEvents: [
        { roomId: 'r-procurement', line: { from: 'other', author: 'LS전선 구매팀', text: '연간 단가 협상 미팅 일정 부탁드립니다' } },
        { roomId: 'r-procurement', line: { from: 'self', author: '이외근 (영업)', text: '제가 직접 다음주 화요일 14시 방문 가능합니다' } },
      ],
    },
    {
      id: '06', order: 6,
      title: '2개월 후 재발주 - 자재번호 한 단어 검색',
      description: '11월 박대표가 동일 자재 재발주 요청 → 강승희가 좌측 "대화 조회" 진입 → 메시지 탭에 "CC-22-150SQ" 입력 → 회사 전체 메시지·파일 라이브러리 검색.',
      spotlight: { type: 'multi', ids: ['sys:library', 'dev:workspace-pc', 'dev:guest-1', 'c-lib-ws'] },
      activeSystems: ['library'],
      activeDevices: [WS, 'guest-1'],
      activeConnections: ['c-lib-ws', 'c-ws-g1'],
      activeRoomId: 'r-construction',
      systemStatuses: { library: '"CC-22-150SQ" 8건 검색됨' },
      liveCallout: { deviceId: WS, text: '🔍 7월 견적서 + 9월 도면 = 2건 hit' },
      messageEvents: [
        { roomId: 'r-construction', line: { from: 'other', author: '미우케이블 박대표', text: '같은 사양으로 재발주 부탁드립니다' } },
      ],
    },
    {
      id: '07', order: 7,
      title: '과거 파일 즉시 재첨부 → 회사 자산화',
      description: '검색 결과의 7월 견적서를 현재 방에 그대로 재첨부해 즉시 응대. 담당자 이직·교체와 무관하게 회사 차원의 파일 자산이 보존됩니다.',
      spotlight: { type: 'multi', ids: ['sys:library', 'dev:workspace-pc', 'dev:guest-1', 'c-lib-ws', 'c-ws-g1'] },
      activeSystems: ['library'],
      activeDevices: [WS, 'guest-1'],
      activeConnections: ['c-lib-ws', 'c-ws-g1'],
      activeRoomId: 'r-construction',
      messageEvents: [
        { roomId: 'r-construction', line: { from: 'self', author: '강승희 (본사)', text: '7월 견적서 재첨부 드립니다 📎 미우_CC-22-150SQ_견적서_v1.xlsx' } },
        { roomId: 'r-construction', line: { from: 'other', author: '미우케이블 박대표', text: '바로 처리 부탁드립니다. 감사합니다 🙏' } },
      ],
    },
  ],
};
