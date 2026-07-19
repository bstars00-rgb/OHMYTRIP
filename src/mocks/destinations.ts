import type { Destination } from '@/types/search';

/**
 * 주요 도시 바로 선택 그룹 — 원본 사이트 2026-07 기준 실측 데이터.
 * regionCode는 서울(102514)만 원본 URL에서 확인됨. 나머지는 Mock 코드
 * (M-접두)이며 실제 API 연동 시 교체한다.
 */
export const MAJOR_CITY_GROUPS: { group: string; cities: string[] }[] = [
  { group: '국내', cities: ['서울', '제주', '서귀포', '부산', '강릉', '속초', '여수', '인천', '경기', '강원', '경남', '경북', '전북', '전남', '충북', '충남'] },
  { group: '일본', cities: ['오사카', '도쿄', '후쿠오카', '삿포로', '교토', '오키나와(현)', '고베', '나고야', '벳푸', '나가사키', '구마모토', '가나자와'] },
  { group: '베트남', cities: ['호치민', '나트랑', '다낭', '달랏', '푸꾸옥', '하노이', '판티엣', '사 빠'] },
  { group: '아시아', cities: ['방콕', '타이베이', '홍콩', '싱가포르', '상하이', '베이징', '세부', '발리'] },
  { group: '미주/중남미', cities: ['뉴욕', '로스앤젤레스', '토론토', '상파울로', '칸쿤', '밴쿠버', '하와이'] },
  { group: '유럽', cities: ['런던', '파리', '로마', '바르셀로나'] },
  { group: '중동', cities: ['두바이', '아부다비'] },
  { group: '대양주', cities: ['시드니', '오클랜드', '괌'] },
];

/** 주요 도시별 그리드 열 수 (원본 테이블 5열) */
export const MAJOR_CITY_COLUMNS = 5;

const city = (nameLn: string, nameEn: string, regionCode: string, countryNameEn = 'Korea'): Destination => ({
  type: 'region',
  iconType: 'city',
  nameLn,
  nameEn,
  regionCode,
  countryNameEn,
});

const hotel = (nameLn: string, nameEn: string, hotelCode: string, countryNameEn = 'Korea'): Destination => ({
  type: 'hotel',
  iconType: 'hotel',
  nameLn,
  nameEn,
  regionCode: '',
  countryNameEn,
  hotelCode,
});

/**
 * 자동완성 Mock 데이터 — "서울" 검색 결과는 원본과 동일한 순서/표기.
 * 그 외 도시는 대표 표기만 수록. 실제 API 연동 시 destination.service가 교체된다.
 */
export const DESTINATIONS: Destination[] = [
  city('서울', 'Seoul', '102514'),
  city('서울 (GMP-김포국제공항)', 'Seoul (GMP-Gimpo Intl.)', 'M-GMP'),
  city('서울 (ICN-인천국제공항)', 'Seoul (ICN-Incheon Intl.)', 'M-ICN'),
  city('서울(및 인근 지역)', 'Seoul (and vicinity)', 'M-SEL-V'),
  hotel('서울 올림픽 파크텔', 'Seoul Olympic Parktel', 'M-886001'),
  hotel('메이필드호텔 서울', 'Mayfield Hotel Seoul', 'M-886002'),
  hotel('스탠포드 호텔 서울', 'Stanford Hotel Seoul', 'M-886003'),
  hotel('라마다 서울', 'Ramada Seoul', 'M-886004'),
  hotel('더 스테이 클래식 호텔 명동', 'The Stay Classic Myeongdong', '886479'),
  city('제주', 'Jeju', 'M-JEJU'),
  city('서귀포', 'Seogwipo', 'M-SGP'),
  city('부산', 'Busan', 'M-PUS'),
  city('강릉', 'Gangneung', 'M-GN'),
  city('속초', 'Sokcho', 'M-SOK'),
  city('여수', 'Yeosu', 'M-YEO'),
  city('인천', 'Incheon', 'M-INC'),
  city('오사카', 'Osaka', 'M-OSA', 'Japan'),
  city('도쿄', 'Tokyo', 'M-TYO', 'Japan'),
  city('후쿠오카', 'Fukuoka', 'M-FUK', 'Japan'),
  city('삿포로', 'Sapporo', 'M-SPK', 'Japan'),
  city('교토', 'Kyoto', 'M-KYO', 'Japan'),
  city('다낭', 'Da Nang', 'M-DAD', 'Vietnam'),
  city('나트랑', 'Nha Trang', 'M-NHA', 'Vietnam'),
  city('호치민', 'Ho Chi Minh', 'M-SGN', 'Vietnam'),
  city('방콕', 'Bangkok', 'M-BKK', 'Thailand'),
  city('타이베이', 'Taipei', 'M-TPE', 'Taiwan'),
  city('홍콩', 'Hong Kong', 'M-HKG', 'Hong Kong'),
  city('싱가포르', 'Singapore', 'M-SIN', 'Singapore'),
  city('파리', 'Paris', 'M-PAR', 'France'),
  city('런던', 'London', 'M-LON', 'United Kingdom'),
  city('괌', 'Guam', 'M-GUM', 'Guam'),
];

/** 주요 도시 버튼 클릭 → Destination 해석 (nameLn 기준) */
export function findCityByName(nameLn: string): Destination | undefined {
  return DESTINATIONS.find((d) => d.type === 'region' && d.nameLn === nameLn);
}
