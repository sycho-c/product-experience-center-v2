import { MessageCircle, ScanLine, Database, FileSignature } from 'lucide-react';
import type { V2Scenario } from '@/types/scenario';
import {
  makeDeviceAnchorId as dev,
  makeSystemAnchorId as sys,
} from '@/types/anchor';

const WS = 'workspace-pc';
const ROOM_KIM = 'r-kim';
const ROOM_PARK = 'r-park';
const ROOM_JUNG = 'r-jung';
const ROOM_HAN = 'r-han';

export const scenario: V2Scenario = {
  id: 'insurance-1m',
  title: '하나손해보험 GA 협업 채널',
  subtitle: '손글씨 사진 한 장이 자동 할 일·고객 등록·청약 PDF까지',
  summary:
    '설계매니저 김도윤이 4명의 영업가족과 각각 1:1 협업 채널을 동시에 운영합니다. 손글씨 고객정보 사진 + 운전자보험 요청 텍스트에서 OCR이 고객 5개 필드를, NER이 보험 종류·납입액을 자동 추출해 한 건의 할 일로 묶고, SFA 고객 등록 → 비즈폼 동의서 → 청약 PDF 자동 생성까지 한 흐름으로 이어집니다.',
  industry: '보험',
  participantPattern: '1:M',
  durationMinutes: 8,
  messagingPattern: 'per-guest',
  initialActiveRoomId: ROOM_KIM,

  beforeNarrative: {
    summary: '카카오톡으로는 이 흐름이 불가능합니다',
    limitations: [
      '비정형 손글씨 사진을 디지털 정보로 변환할 자동화 없음',
      '메시지에서 고객 정보·요청을 추출해 할 일로 등록 불가',
      'SFA 고객 등록까지 수기 입력 — 누락·오타 위험',
      '청약 PDF 생성·전달 후 진행 상태 추적 불가',
    ],
  },

  systems: [
    { id: 'alim', label: '카카오 알림톡', labelEn: 'AlimTalk', icon: MessageCircle, defaultStatus: '대기', activeStatus: '초대 카드 발송', accent: 'amber' },
    { id: 'smart', label: 'OCR · NER', labelEn: 'Smart Extract', icon: ScanLine, defaultStatus: '대기', activeStatus: '사진·텍스트 자동 추출', accent: 'indigo' },
    { id: 'sfa', label: 'SFA 고객 시스템', labelEn: 'SFA', icon: Database, defaultStatus: '대기', activeStatus: '고객 자동 등록', accent: 'emerald' },
    { id: 'policy', label: '가입설계 시스템', labelEn: 'Policy Engine', icon: FileSignature, defaultStatus: '대기', activeStatus: '청약 PDF 생성', accent: 'sky' },
  ],

  devices: [
    { id: WS, kind: 'workspace-pc', label: '설계매니저 Workspace', persona: { name: '김도윤', role: '하나손보 GA 설계지원', avatarColor: '#4F46E5' } },
    { id: 'guest-1', kind: 'guest-mobile', label: '김철수 설계사', persona: { name: '김철수', role: '영업가족 5250223', avatarColor: '#10B981' } },
    { id: 'guest-2', kind: 'guest-mobile', label: '박영희 설계사', persona: { name: '박영희', role: '영업가족 5250247', avatarColor: '#F59E0B' } },
    { id: 'guest-3', kind: 'guest-mobile', label: '정민호 설계사', persona: { name: '정민호', role: '영업가족 5250261', avatarColor: '#22D3EE' } },
    { id: 'guest-4', kind: 'guest-mobile', label: '한지원 설계사', persona: { name: '한지원', role: '영업가족 5250282', avatarColor: '#EF4444' } },
  ],

  rooms: [
    { id: ROOM_KIM, name: '김철수 설계사', subtitle: '운전자보험 설계 요청', participantDeviceIds: [WS, 'guest-1'], pattern: '1:1' },
    { id: ROOM_PARK, name: '박영희 설계사', subtitle: '암보험 설계', participantDeviceIds: [WS, 'guest-2'], pattern: '1:1' },
    { id: ROOM_JUNG, name: '정민호 설계사', subtitle: '연금보험 검토', participantDeviceIds: [WS, 'guest-3'], pattern: '1:1' },
    { id: ROOM_HAN, name: '한지원 설계사', subtitle: '자녀보험 설계', participantDeviceIds: [WS, 'guest-4'], pattern: '1:1' },
  ],

  connections: [
    { id: 'c-alim-ws', fromAnchorId: sys('alim'), toAnchorId: dev(WS, 'bottom'), direction: 'out', label: '알림톡 발송' },
    { id: 'c-smart-ws', fromAnchorId: sys('smart'), toAnchorId: dev(WS, 'bottom'), direction: 'bidi', label: '자동 추출' },
    { id: 'c-sfa-ws', fromAnchorId: sys('sfa'), toAnchorId: dev(WS, 'bottom'), direction: 'out', label: '고객 등록' },
    { id: 'c-pol-ws', fromAnchorId: sys('policy'), toAnchorId: dev(WS, 'bottom'), direction: 'bidi', label: '청약 PDF' },
    { id: 'c-ws-g1', fromAnchorId: dev(WS, 'bottom'), toAnchorId: dev('guest-1', 'top'), direction: 'bidi' },
    { id: 'c-ws-g2', fromAnchorId: dev(WS, 'bottom'), toAnchorId: dev('guest-2', 'top'), direction: 'bidi' },
    { id: 'c-ws-g3', fromAnchorId: dev(WS, 'bottom'), toAnchorId: dev('guest-3', 'top'), direction: 'bidi' },
    { id: 'c-ws-g4', fromAnchorId: dev(WS, 'bottom'), toAnchorId: dev('guest-4', 'top'), direction: 'bidi' },
  ],

  steps: [
    // ─── 01. 새 대화방 만들기 ─────────────────────────────────────
    {
      id: '01', order: 1,
      title: '새 대화방 만들기 → 외부 참여자 검색',
      description:
        '설계매니저 김도윤이 Workspace 우상단 "새 대화방" 버튼을 눌러 대화방 생성 모달을 열고, 외부 탭에서 영업가족 김철수(5250223)를 검색합니다.',
      spotlight: { type: 'multi', ids: ['dev:workspace-pc'] },
      activeSystems: [],
      activeDevices: [WS],
      activeConnections: [],
      activeRoomId: ROOM_KIM,
      liveCallout: { deviceId: WS, text: '＋ 새 대화방 → 외부 참여자 → "김철수" 검색' },
    },

    // ─── 02. 영업가족 선택 + 채널 선택 ───────────────────────────
    {
      id: '02', order: 2,
      title: '김철수 선택 + 카카오 알림톡 채널 지정',
      description:
        '검색 결과에서 김철수 영업가족(5250223 · 에즈금융서비스 TM)을 선택하고, 초대 채널로 "카카오 알림톡"을 지정합니다.',
      spotlight: { type: 'multi', ids: ['sys:alim', 'dev:workspace-pc', 'c-alim-ws'] },
      activeSystems: ['alim'],
      activeDevices: [WS],
      activeConnections: ['c-alim-ws'],
      activeRoomId: ROOM_KIM,
      systemStatuses: { alim: '초대 채널 선택됨' },
      liveCallout: { deviceId: WS, text: '✓ 김철수 영업가족 5250223 · 채널: 카카오 알림톡' },
    },

    // ─── 03. 알림톡 발송 → 김철수 모바일 도착 ────────────────────
    {
      id: '03', order: 3,
      title: '카카오 알림톡 발송 → 김철수 모바일 도착',
      description:
        '협업 채널이 생성되고 카카오 알림톡 초대 카드가 김철수 모바일로 발송됩니다. 알림톡에는 "초대 수락 · 채널 입장" 버튼이 포함되어 있습니다.',
      spotlight: { type: 'multi', ids: ['sys:alim', 'dev:workspace-pc', 'dev:guest-1', 'c-alim-ws', 'c-ws-g1'] },
      activeSystems: ['alim'],
      activeDevices: [WS, 'guest-1'],
      activeConnections: ['c-alim-ws', 'c-ws-g1'],
      activeRoomId: ROOM_KIM,
      systemStatuses: { alim: '초대 카드 발송 완료' },
      liveCallout: { deviceId: WS, text: '✓ 알림톡 발송 — 김철수 (010-4521-9821)' },
      messageEvents: [
        {
          roomId: ROOM_KIM,
          line: {
            from: 'system',
            text: '카카오 알림톡 발송 (수신: 김철수)',
            attachment: {
              kind: 'bizform',
              title: '하나손해보험 협업 채널 초대',
              rows: [
                { label: '발신', value: '김도윤 설계매니저' },
                { label: '수신', value: '김철수 (영업가족 5250223)' },
                { label: '채널', value: '하나손보 GA 협업' },
              ],
              status: 'sent',
              action: '초대 수락 · 채널 입장',
            },
          },
        },
      ],
    },

    // ─── 04. 초대 수락 → 채널 입장 ──────────────────────────────
    {
      id: '04', order: 4,
      title: '김철수 초대 수락 → 협업 채널 입장',
      description:
        '김철수가 알림톡의 "초대 수락" 버튼을 눌러 하나손보 협업 채널에 입장합니다. 채널에는 시스템 메시지로 입장 사실이 자동 기록됩니다.',
      spotlight: { type: 'multi', ids: ['dev:guest-1', 'dev:workspace-pc', 'c-ws-g1'] },
      activeSystems: ['alim'],
      activeDevices: [WS, 'guest-1'],
      activeConnections: ['c-ws-g1'],
      activeRoomId: ROOM_KIM,
      systemStatuses: { alim: '초대 수락 완료' },
      messageEvents: [
        { roomId: ROOM_KIM, line: { from: 'system', text: '김철수님이 채널에 입장했습니다' } },
      ],
    },

    // ─── 05. 인사 교환 + 4채널 운영 ────────────────────────────
    {
      id: '05', order: 5,
      title: '인사 교환 + 4채널 동시 운영 소개',
      description:
        '매니저와 김철수가 짧은 인사를 주고받습니다. 같은 방식으로 박영희·정민호·한지원과도 1:1 채널을 운영하므로, 매니저 Workspace 좌측 대화방 목록에는 4개의 채널이 모두 보입니다.',
      spotlight: { type: 'multi', ids: ['dev:workspace-pc', 'dev:guest-1', 'dev:guest-2', 'dev:guest-3', 'dev:guest-4'] },
      activeSystems: [],
      activeDevices: [WS, 'guest-1', 'guest-2', 'guest-3', 'guest-4'],
      activeConnections: ['c-ws-g1', 'c-ws-g2', 'c-ws-g3', 'c-ws-g4'],
      activeRoomId: ROOM_KIM,
      messageEvents: [
        { roomId: ROOM_KIM, line: { from: 'self', text: '안녕하세요 김철수님! 협업 채널 만들었습니다 👋' } },
        { roomId: ROOM_KIM, line: { from: 'other', author: '김철수', text: '안녕하세요 매니저님, 잘 부탁드립니다 🙏' } },
      ],
    },

    // ─── 06. 손글씨 사진 전송 ────────────────────────────────────
    {
      id: '06', order: 6,
      title: '김철수 — 손글씨 고객정보 사진 전송',
      description:
        '김철수가 신규 고객 김민수님의 손글씨 정보 사진을 전송합니다. 사진에는 이름·주민번호·전화·주소·직업 5개 필드가 적혀 있습니다.',
      spotlight: { type: 'multi', ids: ['dev:guest-1', 'dev:workspace-pc', 'c-ws-g1'] },
      activeSystems: [],
      activeDevices: [WS, 'guest-1'],
      activeConnections: ['c-ws-g1'],
      activeRoomId: ROOM_KIM,
      messageEvents: [
        {
          roomId: ROOM_KIM,
          line: {
            from: 'other',
            author: '김철수',
            text: '신규 고객님 정보입니다!',
            attachment: {
              kind: 'image',
              label: '손글씨 고객정보',
              meta: '이름 · 주민번호 · 전화 · 주소 · 직업',
              tone: 'handwritten',
            },
          },
        },
      ],
    },

    // ─── 07. 운전자보험 설계 요청 텍스트 ─────────────────────────
    {
      id: '07', order: 7,
      title: '운전자보험 설계 요청 텍스트 도착',
      description:
        '이어서 김철수가 "월 1만원 내외 운전자보험으로 설계 부탁드려요" 텍스트 메시지를 보냅니다. 매니저 화면에는 사진 + 텍스트 두 건이 누적되어 보입니다.',
      spotlight: { type: 'multi', ids: ['dev:guest-1', 'dev:workspace-pc', 'c-ws-g1'] },
      activeSystems: [],
      activeDevices: [WS, 'guest-1'],
      activeConnections: ['c-ws-g1'],
      activeRoomId: ROOM_KIM,
      messageEvents: [
        { roomId: ROOM_KIM, line: { from: 'other', author: '김철수', text: '월 1만원 내외 운전자보험으로 설계 부탁드려요 🙏' } },
      ],
    },

    // ─── 08. 단일 메시지 ⋮ 메뉴 시연 (OCR만) ─────────────────────
    {
      id: '08', order: 8,
      title: '단일 메시지 ⋮ 메뉴 — 한 건만으로도 할 일 생성 가능',
      description:
        '매니저는 사진 메시지 한 건만의 ⋮ 메뉴에서도 "할 일 생성"을 누를 수 있습니다. 이 경우 OCR이 사진의 5개 필드만 추출하고 NER은 동작하지 않아 보험·납입액은 비어 있습니다.',
      spotlight: { type: 'multi', ids: ['sys:smart', 'dev:workspace-pc', 'c-smart-ws'] },
      activeSystems: ['smart'],
      activeDevices: [WS],
      activeConnections: ['c-smart-ws'],
      activeRoomId: ROOM_KIM,
      systemStatuses: { smart: 'OCR 단독 호출 — 5필드만 추출' },
      liveCallout: { deviceId: WS, text: '⋮ 사진 1건 → 할 일 생성 (NER 없음, 보험·납입액 공란)' },
      messageEvents: [
        {
          roomId: ROOM_KIM,
          line: {
            from: 'system',
            text: '단일 메시지 모드 데모 (OCR만)',
            attachment: {
              kind: 'extract',
              title: 'OCR 단독 결과 — 5필드 추출',
              rows: [
                { source: 'OCR', label: '고객명', value: '김민수' },
                { source: 'OCR', label: '주민번호', value: '910415-1******' },
                { source: 'OCR', label: '전화', value: '010-4521-9821' },
                { source: 'OCR', label: '주소', value: '서울 강남구 테헤란로' },
                { source: 'OCR', label: '직업', value: '회사원' },
              ],
            },
          },
        },
      ],
    },

    // ─── 09. 다중 메시지 선택 → 할 일 생성 모달 ─────────────────
    {
      id: '09', order: 9,
      title: '다중 메시지 선택 → 할 일 생성 모달',
      description:
        '메인 흐름은 다중 선택입니다. 매니저가 사진 + 텍스트 두 메시지를 함께 선택하고 "할 일 생성"을 누르면, OCR과 NER이 동시에 호출되도록 모달이 열립니다.',
      spotlight: { type: 'multi', ids: ['dev:workspace-pc'] },
      activeSystems: [],
      activeDevices: [WS],
      activeConnections: [],
      activeRoomId: ROOM_KIM,
      liveCallout: { deviceId: WS, text: '메시지 2건 선택 → 할 일 생성 → 모달 오픈' },
    },

    // ─── 10. OCR + NER 자동 추출 ─────────────────────────────────
    {
      id: '10', order: 10,
      title: 'OCR · NER 자동 추출 (5필드 + 보험·납입액)',
      description:
        '5초 내에 OCR이 사진에서 5개 필드를, NER이 텍스트에서 보험종류·월납입을 자동 추출해 할 일 양식 7개 필드를 모두 채웁니다.',
      spotlight: { type: 'multi', ids: ['sys:smart', 'dev:workspace-pc', 'c-smart-ws'] },
      activeSystems: ['smart'],
      activeDevices: [WS],
      activeConnections: ['c-smart-ws'],
      activeRoomId: ROOM_KIM,
      systemStatuses: { smart: '✓ OCR 5필드 + NER 2필드 추출 완료 (4.8초)' },
      liveCallout: { deviceId: WS, text: '✓ OCR 5필드 + NER 보험·납입액 — 메시지 2건 묶음 자동 입력' },
      messageEvents: [
        {
          roomId: ROOM_KIM,
          line: {
            from: 'system',
            text: 'OCR · NER 자동 추출 결과 (메시지 2건 묶음)',
            attachment: {
              kind: 'extract',
              title: '할 일 자동 입력 — 운전자보험 설계 회신',
              rows: [
                { source: 'OCR', label: '고객명', value: '김민수' },
                { source: 'OCR', label: '주민번호', value: '910415-1******' },
                { source: 'OCR', label: '전화', value: '010-4521-9821' },
                { source: 'OCR', label: '주소', value: '서울 강남구 테헤란로' },
                { source: 'OCR', label: '직업', value: '회사원' },
                { source: 'NER', label: '보험종류', value: '운전자보험' },
                { source: 'NER', label: '월납입', value: '10,000원' },
              ],
            },
          },
        },
      ],
    },

    // ─── 11. 할 일 저장 → 처리중 chip 부착 + RightRail 등록 ─────
    {
      id: '11', order: 11,
      title: '할 일 저장 → 사진 메시지에 "처리중" chip 부착',
      description:
        '모달의 "저장"을 누르면 사진 메시지 하단에 처리중 chip이 부착되고, 우측 RightRail의 할 일 패널에도 항목이 추가됩니다.',
      spotlight: { type: 'multi', ids: ['dev:workspace-pc'] },
      activeSystems: [],
      activeDevices: [WS],
      activeConnections: [],
      activeRoomId: ROOM_KIM,
      messageEvents: [
        {
          roomId: ROOM_KIM,
          line: {
            from: 'system',
            text: '할 일 등록 — 운전자보험 설계 회신',
            attachment: { kind: 'task-chip', status: 'processing', label: '처리중 · 마감 오늘 18:00' },
          },
        },
      ],
    },

    // ─── 12. SFA 고객 자동 등록 ──────────────────────────────────
    {
      id: '12', order: 12,
      title: 'SFA 고객 자동 등록 — 김민수 #CST-2026-0413',
      description:
        '할 일 상세에서 "고객 등록" 버튼을 누르면 SFA에 김민수 고객이 자동 등록됩니다. 5개 OCR 필드가 그대로 신규 고객 레코드로 들어가 누락·오타 가능성을 없앱니다.',
      spotlight: { type: 'multi', ids: ['sys:sfa', 'dev:workspace-pc', 'c-sfa-ws'] },
      activeSystems: ['sfa'],
      activeDevices: [WS],
      activeConnections: ['c-sfa-ws'],
      activeRoomId: ROOM_KIM,
      systemStatuses: { sfa: '김민수 고객 등록 완료 · #CST-2026-0413' },
      liveCallout: { deviceId: WS, text: '✓ SFA #CST-2026-0413 — 신규 고객 자동 등록' },
      messageEvents: [
        {
          roomId: ROOM_KIM,
          line: {
            from: 'self',
            text: '✓ 김민수 고객 등록 완료. 운전자보험 설계 진행하겠습니다',
            attachment: { kind: 'callout', tone: 'success', text: 'SFA #CST-2026-0413 — 신규 고객 등록' },
          },
        },
      ],
    },

    // ─── 13. 가입설계동의서 비즈폼 발송 ─────────────────────────
    {
      id: '13', order: 13,
      title: '가입설계동의서 비즈폼 발송 → 김철수 수신',
      description:
        '할 일 패널의 "동의서 요청" 버튼을 누르면 가입설계동의서 비즈폼이 김철수 모바일에 inline 카드로 도착합니다. 작성·서명·제출 흐름이 채팅 안에서 끝납니다.',
      spotlight: { type: 'multi', ids: ['dev:workspace-pc', 'dev:guest-1', 'c-ws-g1'] },
      activeSystems: [],
      activeDevices: [WS, 'guest-1'],
      activeConnections: ['c-ws-g1'],
      activeRoomId: ROOM_KIM,
      messageEvents: [
        {
          roomId: ROOM_KIM,
          line: {
            from: 'self',
            text: '가입설계동의서 보내드려요. 동의·서명 부탁드립니다',
            attachment: {
              kind: 'bizform',
              title: '가입설계동의서',
              rows: [
                { label: '고객', value: '김민수' },
                { label: '상품', value: '운전자보험' },
                { label: '월납입', value: '10,000원' },
                { label: '설계자', value: '김철수 영업가족' },
              ],
              status: 'sent',
              action: '동의 · 전자서명 · 제출',
            },
          },
        },
      ],
    },

    // ─── 14. 동의·서명·제출 → 매니저 수신 ───────────────────────
    {
      id: '14', order: 14,
      title: '김철수 동의·서명·제출 → 매니저 수신',
      description:
        '김철수가 비즈폼에서 동의·전자서명·제출을 완료하면, 매니저의 협업 채널에 제출 완료 카드가 자동으로 들어오고 RightRail 상태가 갱신됩니다.',
      spotlight: { type: 'multi', ids: ['dev:guest-1', 'dev:workspace-pc', 'c-ws-g1'] },
      activeSystems: [],
      activeDevices: [WS, 'guest-1'],
      activeConnections: ['c-ws-g1'],
      activeRoomId: ROOM_KIM,
      messageEvents: [
        {
          roomId: ROOM_KIM,
          line: {
            from: 'other',
            author: '김철수',
            text: '서명 완료해서 제출했습니다 ✍️',
            attachment: {
              kind: 'bizform',
              title: '가입설계동의서',
              status: 'submitted',
              rows: [
                { label: '서명자', value: '김민수 (전자서명)' },
                { label: '제출 시각', value: '14:32' },
              ],
            },
          },
        },
      ],
    },

    // ─── 15. 장기 가입 설계 → 청약 PDF 자동 생성·전달 ───────────
    {
      id: '15', order: 15,
      title: '장기 가입 설계 → 청약 PDF 자동 생성·전달',
      description:
        '할 일 패널의 "장기 가입 설계" 버튼을 누르면 외부 가입설계 시스템이 자동 실행되어 운전자보험 청약 PDF가 생성되고 협업 채널로 자동 전송됩니다.',
      spotlight: { type: 'multi', ids: ['sys:policy', 'dev:workspace-pc', 'dev:guest-1', 'c-pol-ws', 'c-ws-g1'] },
      activeSystems: ['policy'],
      activeDevices: [WS, 'guest-1'],
      activeConnections: ['c-pol-ws', 'c-ws-g1'],
      activeRoomId: ROOM_KIM,
      systemStatuses: { policy: '청약 PDF 생성·전달 완료 (3.2초)' },
      liveCallout: { deviceId: WS, text: '✓ Policy Engine — 청약 PDF 자동 생성·채팅 전달' },
      messageEvents: [
        { roomId: ROOM_KIM, line: { from: 'system', text: 'Policy Engine: 청약 PDF 생성 완료 (3.2초)' } },
        {
          roomId: ROOM_KIM,
          line: {
            from: 'self',
            text: '청약 PDF 자동 생성되어 전달드립니다 📄',
            attachment: {
              kind: 'file',
              ext: 'pdf',
              name: 'plan_김민수_운전자_2026.pdf',
              size: '348 KB',
            },
          },
        },
        {
          roomId: ROOM_KIM,
          line: {
            from: 'other',
            author: '김철수',
            text: '감사합니다! 고객님께 안내드리겠습니다 🙏',
          },
        },
      ],
    },

    // ─── 16. 할 일 "완료" + 4채널 컨텍스트 보존 ──────────────────
    {
      id: '16', order: 16,
      title: '할 일 chip "완료" + 4채널 컨텍스트 보존',
      description:
        '청약 PDF 회신이 끝나면 할 일 chip이 "완료"로 갱신됩니다. 매니저가 박영희·정민호·한지원 채널로 전환해도 김철수 방의 메시지 누적과 chip 상태가 그대로 유지되며, 4명 동시 설계가 단절 없이 이어집니다.',
      spotlight: { type: 'multi', ids: ['dev:workspace-pc', 'dev:guest-1', 'dev:guest-2', 'dev:guest-3', 'dev:guest-4'] },
      activeSystems: [],
      activeDevices: [WS, 'guest-1', 'guest-2', 'guest-3', 'guest-4'],
      activeConnections: ['c-ws-g1', 'c-ws-g2', 'c-ws-g3', 'c-ws-g4'],
      activeRoomId: ROOM_PARK,
      messageEvents: [
        {
          roomId: ROOM_KIM,
          line: {
            from: 'system',
            text: '할 일 완료',
            attachment: { kind: 'task-chip', status: 'done', label: '운전자보험 설계 회신 — 완료' },
          },
        },
        { roomId: ROOM_PARK, line: { from: 'other', author: '박영희', text: '암보험 견적 부탁드려요' } },
        { roomId: ROOM_JUNG, line: { from: 'other', author: '정민호', text: '연금 시뮬레이션 가능하실까요?' } },
        { roomId: ROOM_HAN, line: { from: 'other', author: '한지원', text: '자녀보험 상품 추천 부탁드립니다' } },
      ],
    },
  ],
};
