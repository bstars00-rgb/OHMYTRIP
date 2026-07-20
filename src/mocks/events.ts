/** 기획전 Mock — 원본 2026-07 노출분(이미지 4종 로컬 미러, 이후 항목은 이미지 재사용) */
export type EventCategory = 'ALL' | 'IC01' | 'IC02' | 'IC04' | 'IC03' | 'OTH';

export const EVENT_CATEGORIES: { value: EventCategory; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'IC01', label: '항공' },
  { value: 'IC02', label: '호텔' },
  { value: 'IC04', label: '액티비티' },
  { value: 'IC03', label: '렌터카' },
  { value: 'OTH', label: '기타' },
];

export interface MockEvent {
  id: string;
  title: string;
  text: string;
  period: string;
  category: EventCategory;
  imageUrl: string;
}

export const EVENTS: MockEvent[] = [
  { id: 'ev-1', title: '일본 소도시 기획전', text: '', period: '2026.07.15 ~ 2026.08.31', category: 'IC02', imageUrl: '/images/events/event-1.png' },
  { id: 'ev-2', title: '일본 대표 호텔 브랜드 기획전', text: '', period: '2026.07.15 ~ 2026.07.31', category: 'IC02', imageUrl: '/images/events/event-2.png' },
  { id: 'ev-3', title: '모던 빌리지 라이프스타일 베트남 브랜드관 호텔 특가 추천', text: '', period: '2026.07.08 ~ 2026.09.30', category: 'IC02', imageUrl: '/images/events/event-3.png' },
  { id: 'ev-4', title: '[여름방학 해외 여행지 추천] 홍콩ㆍ태국ㆍ대만', text: '', period: '2026.07.15 ~ 2026.08.31', category: 'IC02', imageUrl: '/images/events/event-4.png' },
  { id: 'ev-5', title: '오키나와 3개 섬 여행｜오키나와·미야코지마·이시가키지마', text: '', period: '2026.07.01 ~ 2026.09.01', category: 'IC02', imageUrl: '/images/events/event-1.png' },
  { id: 'ev-6', title: '[여름 베트남 여행] 휴양지 리조트 추천', text: '', period: '2026.07.01 ~ 2026.08.31', category: 'IC02', imageUrl: '/images/events/event-2.png' },
  { id: 'ev-7', title: '[여름 일본 여행] 호캉스 호텔 라인업', text: '', period: '2026.07.01 ~ 2026.08.31', category: 'IC02', imageUrl: '/images/events/event-3.png' },
  { id: 'ev-8', title: '제주도 항공권 최저가', text: '항공 발권대행 수수료 무료', period: '2026.07.01 ~ 2026.08.31', category: 'IC01', imageUrl: '/images/events/event-4.png' },
];
