/**
 * OHMYTRIP 목적지 팝오버 지역 구조를 골프텔 도시로 매핑.
 * city 값은 PACKAGES.destination(영문)과 일치해야 검색 필터가 동작한다.
 */
export interface GeoCity {
  ko: string;
  city: string; // 검색/데이터 매칭 키 (영문)
  country: string;
}

export interface GeoRegion {
  key: string;
  labelKey: string; // i18n 키 (region.*)
  cities: GeoCity[];
}

export const GEO_REGIONS: GeoRegion[] = [
  {
    key: 'kr',
    labelKey: 'region.kr',
    cities: [
      { ko: '제주', city: 'Jeju', country: '대한민국' },
      { ko: '부산', city: 'Busan', country: '대한민국' },
    ],
  },
  {
    key: 'jp',
    labelKey: 'region.jp',
    cities: [
      { ko: '오키나와', city: 'Okinawa', country: '일본' },
      { ko: '홋카이도', city: 'Hokkaido', country: '일본' },
    ],
  },
  {
    key: 'vn',
    labelKey: 'region.vn',
    cities: [
      { ko: '다낭', city: 'Da Nang', country: '베트남' },
      { ko: '나트랑', city: 'Nha Trang', country: '베트남' },
    ],
  },
  {
    key: 'asia',
    labelKey: 'region.asia',
    cities: [
      { ko: '방콕', city: 'Bangkok', country: '태국' },
      { ko: '파타야', city: 'Pattaya', country: '태국' },
      { ko: '푸켓', city: 'Phuket', country: '태국' },
      { ko: '타이베이', city: 'Taipei', country: '대만' },
      { ko: '발리', city: 'Bali', country: '인도네시아' },
    ],
  },
  { key: 'america', labelKey: 'region.america', cities: [] },
  {
    key: 'europe',
    labelKey: 'region.europe',
    cities: [{ ko: '알가르브', city: 'Algarve', country: '포르투갈' }],
  },
  { key: 'mideast', labelKey: 'region.mideast', cities: [] },
  { key: 'oceania', labelKey: 'region.oceania', cities: [] },
];

export const ALL_GEO_CITIES: GeoCity[] = GEO_REGIONS.flatMap((r) => r.cities);

export function findGeoCity(cityOrKo: string): GeoCity | undefined {
  const q = cityOrKo.trim().toLowerCase();
  return ALL_GEO_CITIES.find((c) => c.city.toLowerCase() === q || c.ko.toLowerCase() === q);
}
