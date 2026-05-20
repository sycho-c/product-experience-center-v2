import type { LucideIcon } from 'lucide-react';

export type ParticipantPattern = '1:1' | '1:M' | 'N:1' | 'N:M';
export type Industry = '보험' | '금융' | '렌터카' | '제조' | '공공' | '기타';

export interface SystemNode {
  id: string;
  label: string;
  labelEn?: string;
  icon: LucideIcon;
  description?: string;
  defaultStatus?: string;
  activeStatus?: string;
  /** Optional accent color override for the node icon */
  accent?: 'indigo' | 'emerald' | 'amber' | 'sky' | 'rose' | 'slate';
}

export type DeviceSlotKind =
  | 'workspace-pc'
  | 'mobile-workspace'
  | 'guest-mobile'
  | 'overflow';

export interface DevicePersona {
  name: string;
  role: string;
  /** Tailwind-compatible hex; falls back to brand.primary */
  avatarColor?: string;
}

export interface DeviceSlot {
  id: string;
  kind: DeviceSlotKind;
  label: string;
  persona?: DevicePersona;
  /** Only used when kind === 'overflow' */
  overflowCount?: number;
  /** Mockup variant identifier — interpreted by the matching Mockup component */
  mockupVariant?: string;
}

export interface Connection {
  id: string;
  /** Anchor id format: `sys:{nodeId}:{side}` or `dev:{slotId}:{side}` */
  fromAnchorId: string;
  toAnchorId: string;
  curve?: 'straight' | 'bezier' | 'orthogonal';
  direction: 'in' | 'out' | 'bidi';
  label?: string;
}

export interface SpotlightTarget {
  type: 'system' | 'device' | 'connection' | 'multi';
  ids: string[];
  /** Optional anchor id used for callout positioning */
  tooltipAnchor?: string;
}

export type TalkActor = 'self' | 'other' | 'system';

/** Attachment shapes for rich message rendering.
 *  All mockup components render these via the shared MessageAttachment component. */
export type TalkAttachment =
  | {
      kind: 'image';
      label: string;
      /** secondary line below label (e.g. "이름 · 주민 · 주소") */
      meta?: string;
      /** visual treatment hint: handwritten (paper texture) vs photo (gradient) */
      tone?: 'handwritten' | 'photo';
    }
  | {
      kind: 'photo-grid';
      photos: Array<{ label: string; hue?: 'blue' | 'red' | 'green' | 'amber' }>;
    }
  | {
      kind: 'file';
      ext: 'pdf' | 'xlsx' | 'dwg' | 'docx' | 'jpg' | 'png' | 'zip';
      name: string;
      size?: string;
    }
  | {
      kind: 'bizform';
      title: string;
      rows?: Array<{ label: string; value: string }>;
      status?: 'sent' | 'submitted' | 'approved' | 'draft';
      action?: string;
    }
  | {
      kind: 'extract';
      title: string;
      rows: Array<{ source: 'OCR' | 'NER'; label: string; value: string }>;
    }
  | {
      kind: 'task-chip';
      status: 'processing' | 'done';
      label?: string;
    }
  | {
      kind: 'callout';
      tone: 'info' | 'success' | 'warning';
      text: string;
    };

export interface TalkLine {
  from: TalkActor;
  author?: string;
  text: string;
  time?: string;
  /** Optional rich attachment rendered below the text. */
  attachment?: TalkAttachment;
}

export interface DeviceScreenState {
  screen?: 'chat-list' | 'room' | 'notice' | 'biz-form' | 'kakao-room' | 'kakao-list';
  activeRoomId?: string;
  roomTitle?: string;
  typing?: boolean;
  unreadCount?: number;
  talks?: TalkLine[];
  notice?: { title: string; body: string };
  /** Optional banner shown above the chat */
  banner?: string;
}

export type DeviceStateMap = Record<string, DeviceScreenState>;

export interface LiveCallout {
  deviceId: string;
  text: string;
}

export interface Room {
  id: string;
  name: string;
  /** Device slot IDs participating in this room */
  participantDeviceIds: string[];
  /** Visual indicator only — does not affect message routing */
  pattern?: '1:1' | 'group';
  /** Optional short subtitle (e.g. company name) shown under the room name */
  subtitle?: string;
  /** Conceptual total participants (e.g. 70 for an AG group room with only 4 visible guests).
   *  When set, takes precedence over participantDeviceIds.length for display purposes. */
  totalParticipants?: number;
}

export interface MessageEvent {
  roomId: string;
  line: TalkLine;
}

export type MessagingPattern = 'shared-room' | 'per-guest';

export interface V2Step {
  id: string;
  order: number;
  title: string;
  description: string;
  durationMs?: number;
  spotlight: SpotlightTarget;
  activeSystems: string[];
  activeDevices: string[];
  activeConnections: string[];
  deviceState?: DeviceStateMap;
  systemStatuses?: Record<string, string>;
  liveCallout?: LiveCallout;
  /** For per-guest pattern: which room workspace is currently viewing */
  activeRoomId?: string;
  /** Messages added at this step (accumulates with previous steps) */
  messageEvents?: MessageEvent[];
}

export interface BeforeNarrative {
  summary: string;
  limitations: string[];
}

export interface V2Scenario {
  id: string;
  title: string;
  subtitle?: string;
  summary: string;
  industry?: Industry;
  participantPattern: ParticipantPattern;
  durationMinutes?: number;
  systems: SystemNode[];
  devices: DeviceSlot[];
  connections: Connection[];
  steps: V2Step[];
  /** Conversation rooms — defines which devices share a chat window */
  rooms: Room[];
  /** shared-room: single broadcast room. per-guest: workspace has one room per guest. */
  messagingPattern: MessagingPattern;
  /** Initially active room id (for per-guest scenarios) */
  initialActiveRoomId?: string;
  beforeNarrative?: BeforeNarrative;
}

export interface V2ScenarioMeta {
  id: string;
  title: string;
  subtitle?: string;
  summary: string;
  industry?: Industry;
  participantPattern: ParticipantPattern;
  durationMinutes?: number;
}

export type Mode = 'before' | 'after';
