/** 공지사항 Mock — 원본 2026-07 목록 실측(제목/날짜/조회수) */
export type NoticeCategory = '전체' | '호텔' | '항공' | '액티비티' | '렌터카' | '기타';

export interface Notice {
  id: string;
  label: '상시' | '공지';
  category: NoticeCategory;
  title: string;
  date: string; // YYYY.MM.DD
  views: number;
  body: string[];
}

const MOCK_BODY = [
  '안녕하세요, 오마이트립입니다.',
  '자세한 내용은 고객센터로 문의해 주시기 바랍니다.',
  '감사합니다.',
];

export const NOTICES: Notice[] = [
  { id: '200352', label: '상시', category: '호텔', title: '[호텔] 개인정보처리방침 변경 안내', date: '2026.05.21', views: 540, body: MOCK_BODY },
  { id: '200351', label: '상시', category: '항공', title: '[항공] [공지] 서버 및 네트워크 장비 교체 작업 안내', date: '2026.03.17', views: 48, body: MOCK_BODY },
  { id: '200350', label: '상시', category: '호텔', title: '[호텔] 개인정보처리방침 변경 안내', date: '2026.02.13', views: 153, body: MOCK_BODY },
  { id: '200349', label: '상시', category: '호텔', title: '[호텔] 이용약관 변경 사항 안내', date: '2026.02.13', views: 119, body: MOCK_BODY },
  { id: '200346', label: '상시', category: '호텔', title: '[호텔] 자산양수도에 따른 개인정보 이전 안내', date: '2026.02.13', views: 627, body: MOCK_BODY },
  { id: '200342', label: '상시', category: '호텔', title: '[호텔] 설 연휴 기간 CS 업무 안내', date: '2026.02.11', views: 21, body: MOCK_BODY },
  { id: '200339', label: '상시', category: '호텔', title: '[호텔] OHMYHOTEL 입력 시 추가 1만원 더!', date: '2026.01.16', views: 242, body: MOCK_BODY },
  { id: '200322', label: '상시', category: '항공', title: '[항공] 항공권 취소 방법 안내', date: '2024.10.17', views: 503, body: MOCK_BODY },
  { id: '200301', label: '상시', category: '항공', title: '[항공] [해외] E-TICKET 열람 시 승객 인증절차 추가 안내', date: '2024.02.23', views: 464, body: MOCK_BODY },
  { id: '200297', label: '상시', category: '항공', title: '[항공] [국내] 신분확인 절차 강화 및 유효한 신분증 종류 안내', date: '2024.01.29', views: 521, body: MOCK_BODY },
];

/** 메인 페이지 최근 공지 3건 */
export const RECENT_NOTICES = NOTICES.slice(0, 3).map((n) => ({
  id: n.id,
  label: n.label,
  // 메인 노출 제목은 카테고리 접두 없이 표기 (원본 실측)
  title: n.title.replace(/^\[[^\]]+\]\s*/, ''),
  date: n.date,
}));
