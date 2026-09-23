/**
 * M VILLAGE (Modern Village Lifestyle) 브랜드관 목데이터.
 * 출처: OhMyHotel × Modern Village Lifestyle 한국 GSA 전략 제안서 / GTM Deck v0.3 (2026.09).
 * 실데이터·요율·재고 미연동 — 브랜드 인지용 랜딩(브랜드 전용 존) 프로토타입.
 */

export type Tone = 'forest' | 'terracotta' | 'gold' | 'sage';

/** 목적별 컬렉션 — "호텔이 아니라 베트남 라이프스타일 컬렉션으로 판매" (GTM Positioning) */
export interface Collection {
  key: string;
  name: string;      // Premium Escape
  nameKo: string;    // 프리미엄 이스케이프
  icon: 'sunrise' | 'city' | 'bed' | 'laptop';
  tone: Tone;
  purpose: string;   // 허니문 · 기념일 · 프리미엄 휴식
  message: string;   // 한국 판매 메시지 예시
  blurb: string;
  brandKeys: string[];
}

export const COLLECTIONS: Collection[] = [
  {
    key: 'premium-escape',
    name: 'Premium Escape',
    nameKo: '프리미엄 이스케이프',
    icon: 'sunrise',
    tone: 'forest',
    purpose: '허니문 · 기념일 · 프리미엄 휴식',
    message: '“머물고 싶은 베트남”',
    blurb: '바다와 자연을 품은 시그니처 리조트에서 보내는 특별한 하루. 허니문과 기념일에 어울리는 최상위 컬렉션.',
    brandKeys: ['grand-signature', 'signature'],
  },
  {
    key: 'urban-discovery',
    name: 'Urban Discovery',
    nameKo: '어반 디스커버리',
    icon: 'city',
    tone: 'terracotta',
    purpose: '2030 자유여행 · 도시 경험',
    message: '“도심 감성 스테이”',
    blurb: '로컬의 삶 속으로 들어가는 도심형 라이프스타일 스테이. 감성 부티크와 트렌디한 동네를 즐기는 2030 여행자를 위한 컬렉션.',
    brandKeys: ['savvy', 'mvillage-hotel', 'premier'],
  },
  {
    key: 'smart-city-stay',
    name: 'Smart City Stay',
    nameKo: '스마트 시티 스테이',
    icon: 'bed',
    tone: 'sage',
    purpose: '가성비 · 실속형 출장 / 단기 체류',
    message: '“출장과 휴식을 함께”',
    blurb: '합리적인 가격에 필요한 것만 똑똑하게. 출장·단기 체류에 최적화된 실속형 컬렉션.',
    brandKeys: ['express'],
  },
  {
    key: 'work-live',
    name: 'Work & Live',
    nameKo: '워크 & 리브',
    icon: 'laptop',
    tone: 'gold',
    purpose: '장기투숙 · 워크케이션 · 프로젝트 체류',
    message: '“일과 삶이 머무는 곳”',
    blurb: '한 달 살기부터 워크케이션, 프로젝트 체류까지. 주방·업무 공간을 갖춘 레지던스형 컬렉션.',
    brandKeys: ['premier', 'express', 'harmony'],
  },
];

/** 브랜드 포트폴리오 — 멀티브랜드 체제(2026.05~). 상위→하위 피라미드 */
export interface Brand {
  key: string;
  name: string;
  tierLabel: string;   // 최상위 / 상위 / 도심형 / 실속 / 레지던스
  tierRank: number;    // 1(최상위) … 5
  tone: Tone;
  target: string;      // 허니문 · 프리미엄
  tagline: string;
  blurb: string;
  facilities: number | null;  // 전체 시설 수 (null = 신규 준비)
  omhOpen: number | null;     // 오마이호텔 채널 개방 시설 수
  cities: string[];
}

export const BRANDS: Brand[] = [
  {
    key: 'grand-signature', name: 'Grand Signature', tierLabel: '최상위 · 시그니처', tierRank: 1, tone: 'forest',
    target: '허니문 · 프리미엄 휴식',
    tagline: '가장 특별한 순간을 위한 시그니처 리조트',
    blurb: '그룹 최상위 브랜드. 바다·자연을 배경으로 한 프리미엄 리조트로, 한국 채널 판매분의 20.2%를 차지하는 최고 단가 재고.',
    facilities: 3, omhOpen: 3, cities: ['다낭', '나트랑'],
  },
  {
    key: 'signature', name: 'Signature', tierLabel: '상위 · 프리미엄', tierRank: 2, tone: 'gold',
    target: '커플 · 기념일 FIT',
    tagline: '취향이 머무는 프리미엄 스테이',
    blurb: '감각적인 디자인과 서비스를 갖춘 상위 브랜드. 커플·기념일 여행에 어울리는 프리미엄 라인.',
    facilities: 9, omhOpen: 3, cities: ['다낭', '호이안'],
  },
  {
    key: 'savvy', name: 'Savvy', tierLabel: '도심형 · 부티크', tierRank: 3, tone: 'terracotta',
    target: '2030 감성 부티크',
    tagline: '지금 가장 트렌디한 동네에서',
    blurb: '2025년 12월 런칭한 감성 부티크 브랜드. 런칭 8개월 만에 한국에서 즉시 반응 — 소개만 되면 통하는 브랜드.',
    facilities: 2, omhOpen: 1, cities: ['호치민', '하노이'],
  },
  {
    key: 'mvillage-hotel', name: 'M Village Hotel', tierLabel: '도심형 · 라이프스타일', tierRank: 3, tone: 'forest',
    target: '2030 도심 스테이',
    tagline: '로컬처럼 머무는 도심 라이프스타일',
    blurb: '도심 한가운데 자리한 라이프스타일 호텔. 채우기 어려운 도심 재고를 한국 채널이 채우는 핵심 브랜드.',
    facilities: 12, omhOpen: 9, cities: ['하노이', '호치민', '달랏'],
  },
  {
    key: 'premier', name: 'Premier', tierLabel: '레지던스 · 프리미엄', tierRank: 3, tone: 'sage',
    target: '프리미엄 레지던스',
    tagline: '집처럼, 그러나 더 특별하게',
    blurb: '주방·리빙을 갖춘 프리미엄 레지던스. 워크케이션과 장기 체류를 위한 상위 라인.',
    facilities: 1, omhOpen: 0, cities: ['호치민'],
  },
  {
    key: 'express', name: 'Express', tierLabel: '실속 · 스마트', tierRank: 4, tone: 'sage',
    target: '실속 · 단기 체류',
    tagline: '필요한 것만, 똑똑하게',
    blurb: '합리적 가격의 실속형 브랜드. 32개 시설이 하나의 이름으로 묶이면 낱개 숙소가 아닌 포트폴리오가 된다.',
    facilities: 32, omhOpen: 1, cities: ['호치민', '하노이', '다낭'],
  },
  {
    key: 'harmony', name: 'Harmony Living Suites', tierLabel: '레지던스 · 롱스테이', tierRank: 5, tone: 'gold',
    target: '워크케이션 · 장기 거주',
    tagline: '오래 머물수록 편안한 스위트',
    blurb: '한 달 살기·프로젝트 체류를 위한 롱스테이 스위트. 업무와 생활이 자연스럽게 이어지는 공간.',
    facilities: null, omhOpen: null, cities: ['호치민'],
  },
];

export interface Destination {
  key: string;
  city: string;      // 다낭 · 호이안
  cityEn: string;
  hook: string;      // 한국 시장 소구 포인트
  facilities: string; // "6곳 · 481실" or "신규 오픈 준비"
  isNew?: boolean;
  imgKind: ImgKind;
}

export const DESTINATIONS: Destination[] = [
  { key: 'danang', city: '다낭 · 호이안', cityEn: 'Da Nang · Hoi An', hook: '외국인 입국의 20.55%가 한국인 — 단독 1위', facilities: '6곳 · 481실', imgKind: 'resort' },
  { key: 'hanoi', city: '하노이', cityEn: 'Hanoi', hook: '2026년 8월 좌석 공급 +12.2% · 동남아 최고 증가', facilities: '6곳 · 478실', imgKind: 'city' },
  { key: 'nhatrang', city: '나트랑', cityEn: 'Nha Trang', hook: '국제객의 약 40%가 한국인 · 1일 19편 3,100석', facilities: '신규 오픈 준비', isNew: true, imgKind: 'beach' },
  { key: 'dalat', city: '달랏', cityEn: 'Da Lat', hook: '2026년 12월 인천 직항 주 4회 · 첫 브랜드 선점 기회', facilities: '3곳 · 199실 (2026 신규)', isNew: true, imgKind: 'nature' },
  { key: 'hcmc', city: '호치민', cityEn: 'Ho Chi Minh', hook: '비즈니스 · 경유 허브 · 에어프레미아 11월 복항', facilities: '45곳 · 1,426실', imgKind: 'city' },
  { key: 'phuquoc', city: '푸꾸옥', cityEn: 'Phu Quoc', hook: '국제객 +93.6% 전국 최고 성장 · 인천/부산 직항', facilities: '신규 오픈 준비', isNew: true, imgKind: 'beach' },
];

export type ImgKind = 'resort' | 'city' | 'beach' | 'nature' | 'interior' | 'suite';

export interface Property {
  id: string;
  name: string;
  brandKey: string;
  collectionKeys: string[];
  city: string;
  cityEn: string;
  blurb: string;
  features: string[];
  fromKRW: number;   // 1박 최저가(지표성 목값)
  imgKind: ImgKind;
  badges?: string[]; // 신규 / 베스트셀러 / 한국 인기 / 오픈예정
  seed: string;      // 이미지 결정용
}

export const PROPERTIES: Property[] = [
  {
    id: 'ms-kim-ma', name: 'M Village Kim Ma', brandKey: 'mvillage-hotel', collectionKeys: ['urban-discovery'],
    city: '하노이', cityEn: 'Hanoi',
    blurb: '하노이 도심 한복판, 로컬처럼 머무는 라이프스타일 호텔. 한국 채널 최다 판매 시설.',
    features: ['도심 중심 입지', '루프탑 라운지', '조식 포함', '워크 데스크'], fromKRW: 62000,
    imgKind: 'interior', badges: ['한국 인기', '베스트셀러'], seed: 'kim-ma',
  },
  {
    id: 'gs-danang', name: 'Grand Signature Da Nang', brandKey: 'grand-signature', collectionKeys: ['premium-escape'],
    city: '다낭', cityEn: 'Da Nang',
    blurb: '미케 비치를 마주한 시그니처 리조트. 허니문과 프리미엄 휴식을 위한 최상위 컬렉션.',
    features: ['오션뷰 풀', '스파', '파인다이닝', '공항 픽업'], fromKRW: 218000,
    imgKind: 'resort', badges: ['프리미엄'], seed: 'gs-danang',
  },
  {
    id: 'sig-hoian', name: 'Signature Hoi An', brandKey: 'signature', collectionKeys: ['premium-escape'],
    city: '호이안', cityEn: 'Hoi An',
    blurb: '올드타운 감성과 프리미엄 서비스가 만나는 곳. 커플·기념일 여행에 어울리는 스테이.',
    features: ['가든 풀', '자전거 대여', '조식 포함', '올드타운 근접'], fromKRW: 128000,
    imgKind: 'resort', badges: ['커플 추천'], seed: 'sig-hoian',
  },
  {
    id: 'savvy-saigon', name: 'Savvy Saigon', brandKey: 'savvy', collectionKeys: ['urban-discovery'],
    city: '호치민', cityEn: 'Ho Chi Minh',
    blurb: '2025년 런칭한 감성 부티크. 트렌디한 카페 거리 한가운데에서 즐기는 2030 도심 스테이.',
    features: ['부티크 디자인', '루프탑 바', '로컬 카페 거리', '포토 스팟'], fromKRW: 74000,
    imgKind: 'interior', badges: ['신규', '2030 감성'], seed: 'savvy-saigon',
  },
  {
    id: 'exp-oldquarter', name: 'Express Hanoi Old Quarter', brandKey: 'express', collectionKeys: ['smart-city-stay'],
    city: '하노이', cityEn: 'Hanoi',
    blurb: '하노이 구시가 도보권의 실속형 스테이. 필요한 것만 똑똑하게 담은 스마트 시티 스테이.',
    features: ['가성비', '셀프 체크인', '구시가 도보권', '무료 Wi-Fi'], fromKRW: 39000,
    imgKind: 'city', badges: ['실속'], seed: 'exp-oldquarter',
  },
  {
    id: 'harmony-hcmc', name: 'Harmony Living Suites HCMC', brandKey: 'harmony', collectionKeys: ['work-live'],
    city: '호치민', cityEn: 'Ho Chi Minh',
    blurb: '주방·업무 공간을 갖춘 롱스테이 스위트. 워크케이션과 한 달 살기에 최적화.',
    features: ['풀 키친', '워크 스페이스', '피트니스', '주 단위 요금'], fromKRW: 96000,
    imgKind: 'suite', badges: ['워크케이션'], seed: 'harmony-hcmc',
  },
  {
    id: 'gs-nhatrang', name: 'Grand Signature Nha Trang', brandKey: 'grand-signature', collectionKeys: ['premium-escape'],
    city: '나트랑', cityEn: 'Nha Trang',
    blurb: '나트랑 해변가 신규 시그니처 리조트. 국제객의 40%가 한국인인 시장에 곧 오픈.',
    features: ['비치프론트', '인피니티 풀', '키즈 클럽', '스파'], fromKRW: 189000,
    imgKind: 'beach', badges: ['오픈예정'], seed: 'gs-nhatrang',
  },
  {
    id: 'ms-dalat', name: 'M Village Da Lat', brandKey: 'mvillage-hotel', collectionKeys: ['urban-discovery'],
    city: '달랏', cityEn: 'Da Lat',
    blurb: '2026년 문을 연 달랏 신규 라이프스타일 호텔. 12월 인천 직항으로 첫 시즌을 선점.',
    features: ['소나무 숲 전망', '카페 라운지', '선선한 고원 기후', '포토 스팟'], fromKRW: 71000,
    imgKind: 'nature', badges: ['신규', '직항 예정'], seed: 'ms-dalat',
  },
  {
    id: 'premier-riverside', name: 'Premier Riverside HCMC', brandKey: 'premier', collectionKeys: ['urban-discovery', 'work-live'],
    city: '호치민', cityEn: 'Ho Chi Minh',
    blurb: '사이공 강변의 프리미엄 레지던스. 리빙과 업무가 어우러지는 상위 라인.',
    features: ['리버뷰', '풀 키친', '라운지', '피트니스'], fromKRW: 132000,
    imgKind: 'suite', badges: ['레지던스'], seed: 'premier-riverside',
  },
  {
    id: 'sig-danang-beach', name: 'Signature Da Nang Beach', brandKey: 'signature', collectionKeys: ['premium-escape'],
    city: '다낭', cityEn: 'Da Nang',
    blurb: '미케 비치 도보권의 프리미엄 스테이. 커플 여행에 어울리는 오션뷰 객실.',
    features: ['오션뷰', '루프탑 풀', '조식 포함', '비치 도보권'], fromKRW: 116000,
    imgKind: 'resort', badges: ['커플 추천'], seed: 'sig-danang-beach',
  },
  {
    id: 'exp-benthanh', name: 'Express Ben Thanh', brandKey: 'express', collectionKeys: ['smart-city-stay'],
    city: '호치민', cityEn: 'Ho Chi Minh',
    blurb: '벤탄 시장 인근 실속형 스테이. 출장·단기 체류에 최적인 스마트 시티 스테이.',
    features: ['가성비', '시내 중심', '셀프 체크인', '무료 Wi-Fi'], fromKRW: 41000,
    imgKind: 'city', badges: ['실속'], seed: 'exp-benthanh',
  },
  {
    id: 'ms-phuquoc', name: 'M Village Phu Quoc', brandKey: 'mvillage-hotel', collectionKeys: ['urban-discovery', 'premium-escape'],
    city: '푸꾸옥', cityEn: 'Phu Quoc',
    blurb: '전국 최고 성장세의 푸꾸옥 신규 라이프스타일 스테이. 인천·부산 직항으로 접근성 우수.',
    features: ['비치 근접', '가든 풀', '선셋 라운지', '조식 포함'], fromKRW: 84000,
    imgKind: 'beach', badges: ['오픈예정'], seed: 'ms-phuquoc',
  },
];

/** 그룹 지표 (전략 제안서 / GTM 기준) */
export const STATS = [
  { value: '60', unit: '개 시설', label: '베트남 전역 포트폴리오' },
  { value: '2,584', unit: '실', label: '전체 객실' },
  { value: '6', unit: '개 브랜드', label: 'One Vietnam. Six lifestyles.' },
  { value: '7', unit: '개 도시', label: '다낭·하노이·나트랑·달랏·호치민·푸꾸옥' },
];

/** 브랜드 가치 (GTM 키 메시지) */
export const VALUES = [
  { en: 'Good People, Better Stays', ko: '좋은 사람과 더 나은 머무름', desc: '사람이 중심이 되는 환대. 머무는 순간이 여행의 이유가 됩니다.' },
  { en: 'Local Living, Global Connections', ko: '현지의 삶, 세계와의 연결', desc: '관광지가 아닌 로컬의 일상 속으로. 베트남을 사는 방식으로 머뭅니다.' },
  { en: 'Stay · Work · Explore · Belong', ko: '머물고 · 일하고 · 탐험하고 · 속하다', desc: '여행과 일, 휴식과 발견이 하나의 공간에서 이어집니다.' },
];

export const brandByKey = (k: string) => BRANDS.find((b) => b.key === k);
export const collectionByKey = (k: string) => COLLECTIONS.find((c) => c.key === k);
export const propsByCollection = (k: string) => PROPERTIES.filter((p) => p.collectionKeys.includes(k));
export const wonKR = (n: number) => `₩${n.toLocaleString('ko-KR')}`;
