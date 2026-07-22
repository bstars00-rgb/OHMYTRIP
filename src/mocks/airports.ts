/** 항공/렌터카 주요 공항·도시 — 원본 2026-07 항공 탭 팝오버 실측 */
export const MAJOR_AIRPORT_GROUPS: { group: string; cities: string[] }[] = [
  { group: '국내', cities: ['김포', '인천', '제주', '부산', '대구', '광주', '여수', '울산', '원주', '청주', '무안', '포항경주'] },
  { group: '일본', cities: ['도쿄(나리타)', '도쿄(하네다)', '오사카', '후쿠오카', '삿포로', '나고야', '오키나와'] },
  { group: '중국', cities: ['베이징', '상해(푸동)', '상해(홍차오)', '청도', '심양', '연길', '대련', '광저우', '하얼빈'] },
  { group: '아시아', cities: ['방콕(수완나폼)', '방콕(돈무앙)', '홍콩', '타이페이', '마닐라', '세부', '싱가포르', '호치민', '하노이', '다낭', '나트랑', '발리', '울란바토르'] },
  { group: '미주', cities: ['로스앤젤레스', '뉴욕(JFK)', '뉴욕(라구아디아)', '뉴욕(뉴왁)', '샌프란시스코', '호놀룰루(오하우)', '라스베이거스', '애틀란타'] },
  { group: '캐나다', cities: ['밴쿠버', '토론토'] },
  { group: '중남미', cities: ['상파울루', '칸쿤'] },
  { group: '유럽', cities: ['파리', '런던', '로마', '프라하', '프랑크푸르트', '암스테르담', '마드리드', '바르셀로나', '취리히', '이스탄불', '헬싱키'] },
  { group: '대양주', cities: ['괌', '사이판', '시드니', '멜버른', '오클랜드'] },
  { group: '중동/아프리카', cities: ['두바이', '도하', '아부다비', '카이로', '나이로비'] },
];

export const MAJOR_AIRPORT_COLUMNS = 5;

export interface Airport {
  /** 표시명 — 예: "서울/김포(GMP)" 는 요약용, 팝오버 표기는 도시명만 */
  nameLn: string;
  nameEn: string;
  /** IATA 코드(Mock) */
  code: string;
  countryNameEn: string;
}

/** 도시명 → 대표 IATA (일부만 실측, 나머지는 Mock 코드) */
const CODE: Record<string, string> = {
  김포: 'GMP', 인천: 'ICN', 제주: 'CJU', 부산: 'PUS', 대구: 'TAE', 광주: 'KWJ',
  여수: 'RSU', 울산: 'USN', 원주: 'WJU', 청주: 'CJJ', 무안: 'MWX', 포항경주: 'KPO',
  '도쿄(나리타)': 'NRT', '도쿄(하네다)': 'HND', 오사카: 'KIX', 후쿠오카: 'FUK',
  삿포로: 'CTS', 나고야: 'NGO', 오키나와: 'OKA', 홍콩: 'HKG', 타이페이: 'TPE',
  싱가포르: 'SIN', 호치민: 'SGN', 하노이: 'HAN', 다낭: 'DAD', 나트랑: 'CXR',
  방콕: 'BKK', 세부: 'CEB', 발리: 'DPS', 괌: 'GUM', 사이판: 'SPN',
  파리: 'CDG', 런던: 'LHR', 로마: 'FCO', 두바이: 'DXB', 로스앤젤레스: 'LAX',
};

const COUNTRY: Record<string, string> = {
  국내: 'Korea', 일본: 'Japan', 중국: 'China', 아시아: 'Asia', 미주: 'USA',
  캐나다: 'Canada', 중남미: 'Latin America', 유럽: 'Europe', 대양주: 'Oceania', '중동/아프리카': 'Middle East',
};

export const AIRPORTS: Airport[] = MAJOR_AIRPORT_GROUPS.flatMap((g) =>
  g.cities.map((city) => ({
    nameLn: city,
    nameEn: city,
    code: CODE[city] ?? CODE[city.replace(/\(.*\)/, '')] ?? 'XXX',
    countryNameEn: COUNTRY[g.group] ?? 'Korea',
  })),
);

export function searchAirportsSync(query: string): Airport[] {
  const q = query.trim();
  if (q.length < 1) return [];
  return AIRPORTS.filter((a) => a.nameLn.includes(q) || a.code.includes(q.toUpperCase())).slice(0, 10);
}

export function findAirportByName(name: string): Airport | undefined {
  return AIRPORTS.find((a) => a.nameLn === name);
}
