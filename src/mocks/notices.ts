/** 공지사항 Mock — 원본 2026-07 노출분 */
export interface Notice {
  id: string;
  label: '상시' | '공지';
  title: string;
  date: string; // YYYY.MM.DD
}

export const RECENT_NOTICES: Notice[] = [
  { id: '200352', label: '상시', title: '개인정보처리방침 변경 안내', date: '2026.05.21' },
  { id: '200351', label: '상시', title: '[공지] 서버 및 네트워크 장비 교체 작업 안내', date: '2026.03.17' },
  { id: '200350', label: '상시', title: '개인정보처리방침 변경 안내', date: '2026.02.13' },
];
