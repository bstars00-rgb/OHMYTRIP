import type { Category, Destination, GolfCourse, GolfPackage, GolfReview, ItineraryDay, PackageOption } from './types';

export const CATEGORIES: Category[] = [
  { key: 'stay-play', label: 'Stay & Play' },
  { key: 'all-inclusive', label: 'All Inclusive' },
  { key: 'weekend', label: 'Weekend Golf' },
  { key: 'luxury', label: 'Luxury Golf' },
  { key: 'group', label: 'Group Trips' },
  { key: 'women', label: "Women's Golf Trips" },
  { key: 'family', label: 'Family Golf' },
  { key: 'last-minute', label: 'Last Minute' },
];

export const DESTINATIONS: Destination[] = [
  { slug: 'jeju', city: 'Jeju', country: 'South Korea', avgPackageUSD: 780, season: 'Apr – Jun · Sep – Nov', courseCount: 28 },
  { slug: 'danang', city: 'Da Nang', country: 'Vietnam', avgPackageUSD: 690, season: 'Feb – Aug', courseCount: 9 },
  { slug: 'bangkok', city: 'Bangkok', country: 'Thailand', avgPackageUSD: 640, season: 'Nov – Feb', courseCount: 34 },
  { slug: 'okinawa', city: 'Okinawa', country: 'Japan', avgPackageUSD: 820, season: 'Mar – Jun · Oct – Dec', courseCount: 12 },
  { slug: 'hokkaido', city: 'Hokkaido', country: 'Japan', avgPackageUSD: 910, season: 'Jun – Sep', courseCount: 18 },
  { slug: 'algarve', city: 'Algarve', country: 'Portugal', avgPackageUSD: 1180, season: 'Mar – May · Sep – Oct', courseCount: 42 },
];

const REVIEW_AUTHORS = [
  ['James P.', 'United Kingdom'],
  ['Minseok K.', 'South Korea'],
  ['Haruto S.', 'Japan'],
  ['David L.', 'Australia'],
  ['Sophie M.', 'France'],
  ['Wei C.', 'Singapore'],
] as const;

function makeReviews(seed: number, hotel: string, course: string): GolfReview[] {
  const pick = (i: number) => REVIEW_AUTHORS[(seed + i) % REVIEW_AUTHORS.length];
  return [
    {
      author: pick(0)[0],
      country: pick(0)[1],
      date: '2026.05.18',
      target: 'Hotel',
      score: 9.2,
      title: '숙박과 라운드가 매끄러웠어요',
      body: `${hotel}에서 픽업·티타임·조식까지 전부 제시간에 진행됐어요. 객실도 넓고 조용했습니다.`,
    },
    {
      author: pick(2)[0],
      country: pick(2)[1],
      date: '2026.04.30',
      target: 'Course',
      score: 8.8,
      title: `${course} 코스 상태 최고`,
      body: '페어웨이와 그린 관리가 완벽했어요. 캐디도 노련했고 주말인데도 진행 속도가 빨랐습니다.',
    },
    {
      author: pick(4)[0],
      country: pick(4)[1],
      date: '2026.03.22',
      target: 'Hotel',
      score: 8.4,
      title: '가성비 훌륭한 패키지',
      body: '1인당 가격이 완전히 투명했어요. 체크인 때 그린피나 카트 추가 요금이 전혀 없었습니다. 또 예약할게요.',
    },
  ];
}

function itinerary(nights: number, courses: GolfCourse[], destination: string): ItineraryDay[] {
  const days: ItineraryDay[] = [];

  // Day 1 — 도착
  days.push({
    day: 1,
    title: '도착 · 체크인 · 휴식',
    summary: `${destination} 도착 후 전용 차량으로 리조트 이동, 웰컴 & 여유로운 첫날 저녁.`,
    description: `${destination}에 도착하면 전용 차량이 공항에서 리조트까지 모십니다. 체크인 후 웰컴 드링크와 함께 골프 일정·티타임을 안내받고, 수영장과 스파 등 리조트 시설을 즐기며 첫날을 여유롭게 보냅니다. 시차와 이동의 피로를 풀고 본격적인 라운드를 준비하는 날입니다.`,
    highlight: '저녁은 리조트 다이닝에서 가볍게 — 다음 날 이른 티타임을 위해 일찍 휴식하세요.',
    meals: ['석식'],
    items: [
      { time: '오후', text: `${destination} 국제공항 도착`, tag: '이동' },
      { text: '전용 차량 공항 픽업 · 리조트로 이동' },
      { text: '호텔 체크인 · 웰컴 드링크 · 골프 일정/티타임 안내', tag: '체크인' },
      { text: '객실 휴식 · 수영장·스파 등 리조트 시설 자유 이용' },
      { time: '19:00', text: '리조트 레스토랑 웰컴 디너', tag: '식사' },
    ],
  });

  // 라운드 데이
  for (let d = 2; d <= nights; d++) {
    const c = courses[(d - 2) % courses.length];
    days.push({
      day: d,
      title: `${c.name} 18홀 라운드`,
      summary: `${c.name}에서 18홀 · 그린피·카트·캐디·왕복 이동 포함. 라운드 후 자유 시간.`,
      description: `이른 조식 후 ${c.name} 클럽하우스로 이동합니다. 연습 그린과 드라이빙 레인지에서 몸을 풀고, 호텔에서 약 ${c.transferMin}분 거리의 코스에서 18홀 라운드를 즐깁니다. 전반 9홀 후 그늘집에서 잠시 쉬어가고, 라운드를 마치면 클럽하우스 중식과 샤워로 개운하게 마무리한 뒤 호텔로 복귀해 자유롭게 저녁을 보냅니다.`,
      highlight: '그린피·카트·캐디·왕복 이동이 모두 포함되어 현장에서 추가로 결제할 비용이 없습니다.',
      meals: ['조식', '중식'],
      items: [
        { time: '06:00', text: '호텔 조식 (얼리 티타임 시 조식 박스 제공)', tag: '식사' },
        { time: '06:40', text: `${c.name} 클럽하우스로 전용 차량 이동 (약 ${c.transferMin}분)`, tag: '이동' },
        { time: '07:10', text: '클럽하우스 도착 · 체크인 · 연습 그린/드라이빙 레인지' },
        { time: '07:40', text: '1번 홀 티오프 — 전반 9홀', tag: '라운드' },
        { time: '10:00', text: '그늘집(하프하우스) 휴식 · 스낵' },
        { time: '10:20', text: '후반 9홀 라운드' },
        { time: '12:40', text: '클럽하우스 중식 & 샤워', tag: '식사' },
        { time: '14:00', text: '호텔 복귀 · 스파/마사지 또는 자유 시간' },
        { text: '석식 자유 (리조트 다이닝 또는 로컬 맛집 추천)' },
      ],
    });
  }

  // 마지막 날 — 출발
  days.push({
    day: nights + 1,
    title: '체크아웃 · 출발',
    summary: '조식 후 체크아웃, 전용 차량으로 공항 이동해 출국.',
    description: `조식 후 마지막 자유 시간을 보내고 체크아웃합니다. 기념품 쇼핑이나 리조트에서의 여유를 즐긴 뒤, 전용 차량으로 공항까지 편안하게 이동해 ${destination}에서의 골프 여행을 마무리합니다.`,
    highlight: '늦은 항공편이라면 레이트 체크아웃 또는 짐 보관 후 마지막 라운드·관광도 준비해 드립니다.',
    meals: ['조식'],
    items: [
      { time: '07:30', text: '호텔 조식', tag: '식사' },
      { text: '기념품 쇼핑 · 마지막 자유 시간' },
      { time: '11:00', text: '체크아웃', tag: '체크아웃' },
      { text: '전용 차량 공항 이동', tag: '이동' },
      { time: '오후', text: `${destination} 국제공항 도착 · 출국` },
    ],
  });

  return days;
}

function options(base: number, nights: number, rounds: number): PackageOption[] {
  const mk = (n: number, r: number, transfer: boolean, mult: number): PackageOption => ({
    id: `n${n}r${r}${transfer ? 't' : ''}`,
    label: `${n}박 + ${r}라운드${transfer ? ' + 공항 픽업' : ''}`,
    nights: n,
    rounds: r,
    airportTransfer: transfer,
    pricePerPersonUSD: Math.round(base * mult),
    originalPerPersonUSD: Math.round(base * mult * 1.18),
  });
  return [
    mk(nights, rounds, false, 1),
    mk(nights + 1, rounds + 1, false, 1.34),
    mk(nights + 2, rounds + 1, true, 1.52),
  ];
}

const DRESS = '카라 셔츠 · 골프화 필수';

/** 호텔 편의시설 영문 → 한국어 (미등록 항목은 원문 유지) */
const FACILITY_KO: Record<string, string> = {
  'Infinity pool': '인피니티 풀', 'Spa & sauna': '스파 & 사우나', '3 restaurants': '레스토랑 3곳',
  '4 restaurants': '레스토랑 4곳', '2 restaurants': '레스토랑 2곳', 'Beach access': '해변 이용',
  'Fitness center': '피트니스 센터', 'Fitness': '피트니스', 'Kids club': '키즈 클럽', 'Kids pool': '어린이 풀',
  'On-site clubhouse': '클럽하우스', 'Spa': '스파', 'Korean & Western dining': '한식·양식 다이닝',
  'Indoor pool': '실내 수영장', 'Driving range': '드라이빙 레인지', 'Rooftop pool': '루프탑 풀',
  'River-view dining': '리버뷰 다이닝', 'Golf lounge': '골프 라운지', 'Free shuttle': '무료 셔틀',
  'Private beach': '프라이빗 비치', 'Snorkeling': '스노클링', 'Island access': '섬 투어',
  'Water park': '워터파크', 'Buffet dining': '뷔페 다이닝', 'Buffet': '뷔페', 'Pool bar': '풀 바',
  'Onsen': '온천', 'Fine dining': '파인 다이닝', 'Hiking trails': '하이킹 트레일', 'Wine cellar': '와인 셀러',
  'Golf academy': '골프 아카데미', 'Michelin dining': '미쉐린 다이닝', 'Spa & thalasso': '스파 & 탈라소',
  '3 pools': '수영장 3개', 'Tennis': '테니스', 'Wine tasting': '와인 테이스팅', 'Beachfront': '비치프론트',
  'Pool': '수영장', 'Golf bar': '골프 바', 'Late checkout': '레이트 체크아웃', 'Rooftop bar': '루프탑 바',
  'Night market nearby': '야시장 인접', 'Private villa pool': '프라이빗 빌라 풀', 'Cliffside spa': '클리프 스파',
  'Yoga deck': '요가 데크', 'Butler service': '버틀러 서비스', 'Lagoon pool': '라군 풀',
  'Beach shuttle': '해변 셔틀', 'Marina view': '마리나 뷰', 'Seafood dining': '해산물 다이닝',
  'Sauna': '사우나', 'Beach access ': '해변 이용', 'Premier': '프리미어',
};
const faci = (f: string): string => FACILITY_KO[f] ?? f;

interface Seed {
  id: string;
  hotel: string;
  destination: string;
  country: string;
  coords: [number, number];
  hotelRating: number;
  reviewScore: number;
  reviewCount: number;
  roomType: string;
  nights: number;
  rounds: number;
  courses: { name: string; designer: string; par: number; rating: number; diff: GolfCourse['difficulty']; transfer: number; rental: boolean }[];
  transfer: number;
  original: number;
  sale: number;
  season: string;
  tags: string[];
  flags: Partial<Pick<GolfPackage, 'beginnerFriendly' | 'groupFriendly' | 'allInclusive' | 'breakfast' | 'cartIncluded' | 'caddieIncluded' | 'airportTransfer' | 'freeCancellation' | 'instantConfirmation' | 'bestSeller' | 'lastMinute'>>;
  facilities: string[];
}

const SEEDS: Seed[] = [
  {
    id: 'danang-luxury-escape', hotel: 'Ocean Dunes Resort & Spa', destination: 'Da Nang', country: 'Vietnam', coords: [16.05, 108.25],
    hotelRating: 5, reviewScore: 9.1, reviewCount: 842, roomType: 'Ocean View Deluxe', nights: 3, rounds: 2, transfer: 15,
    courses: [
      { name: 'BRG Da Nang Golf Resort', designer: 'Greg Norman', par: 72, rating: 74.1, diff: 'Championship', transfer: 15, rental: true },
      { name: 'Montgomerie Links', designer: 'Colin Montgomerie', par: 72, rating: 73.2, diff: 'Intermediate', transfer: 22, rental: true },
    ],
    original: 980, sale: 790, season: 'Feb – Aug', tags: ['luxury', 'stay-play', 'all-inclusive'],
    flags: { allInclusive: true, breakfast: true, cartIncluded: true, caddieIncluded: true, airportTransfer: true, freeCancellation: true, instantConfirmation: true, groupFriendly: true, bestSeller: true },
    facilities: ['Infinity pool', 'Spa & sauna', '3 restaurants', 'Beach access', 'Fitness center', 'Kids club'],
  },
  {
    id: 'jeju-signature-stayplay', hotel: 'Hallim Bay Golf Hotel', destination: 'Jeju', country: 'South Korea', coords: [33.41, 126.26],
    hotelRating: 5, reviewScore: 9.0, reviewCount: 1204, roomType: 'Fairway Suite', nights: 2, rounds: 2, transfer: 5,
    courses: [
      { name: 'Hallim Ocean Course', designer: 'Robert Trent Jones Jr.', par: 72, rating: 73.8, diff: 'Championship', transfer: 5, rental: true },
      { name: 'Jeju Highland Links', designer: 'Jack Nicklaus', par: 71, rating: 72.6, diff: 'Intermediate', transfer: 12, rental: true },
    ],
    original: 1040, sale: 880, season: 'Apr – Jun · Sep – Nov', tags: ['luxury', 'weekend', 'stay-play'],
    flags: { breakfast: true, cartIncluded: true, caddieIncluded: true, airportTransfer: true, freeCancellation: true, instantConfirmation: true, groupFriendly: true, bestSeller: true },
    facilities: ['On-site clubhouse', 'Spa', 'Korean & Western dining', 'Indoor pool', 'Driving range'],
  },
  {
    id: 'bangkok-value-golf', hotel: 'Riverside Grand Bangkok', destination: 'Bangkok', country: 'Thailand', coords: [13.75, 100.5],
    hotelRating: 4, reviewScore: 8.6, reviewCount: 690, roomType: 'Grand Deluxe', nights: 4, rounds: 3, transfer: 40,
    courses: [
      { name: 'Alpine Golf Club', designer: 'Ronald Fream', par: 72, rating: 73.0, diff: 'Championship', transfer: 40, rental: true },
      { name: 'Thana City Country Club', designer: 'Greg Norman', par: 72, rating: 72.4, diff: 'Intermediate', transfer: 35, rental: true },
    ],
    original: 760, sale: 590, season: 'Nov – Feb', tags: ['all-inclusive', 'group', 'stay-play'],
    flags: { allInclusive: true, breakfast: true, cartIncluded: true, caddieIncluded: true, airportTransfer: true, freeCancellation: true, instantConfirmation: true, groupFriendly: true },
    facilities: ['Rooftop pool', 'Spa', 'River-view dining', 'Golf lounge', 'Free shuttle'],
  },
  {
    id: 'okinawa-oceanfront', hotel: 'Coral Bay Okinawa Resort', destination: 'Okinawa', country: 'Japan', coords: [26.34, 127.8],
    hotelRating: 5, reviewScore: 9.3, reviewCount: 512, roomType: 'Premier Ocean Room', nights: 3, rounds: 2, transfer: 18,
    courses: [
      { name: 'Kanucha Bay Golf Course', designer: 'Yasuhiro Sasaki', par: 72, rating: 72.9, diff: 'Intermediate', transfer: 18, rental: true },
      { name: 'The Southern Links', designer: 'Desmond Muirhead', par: 72, rating: 73.5, diff: 'Championship', transfer: 25, rental: true },
    ],
    original: 1120, sale: 940, season: 'Mar – Jun · Oct – Dec', tags: ['luxury', 'family', 'stay-play'],
    flags: { breakfast: true, cartIncluded: true, caddieIncluded: false, airportTransfer: true, freeCancellation: true, instantConfirmation: true, beginnerFriendly: true, groupFriendly: true },
    facilities: ['Private beach', 'Spa', 'Kids club', '4 restaurants', 'Infinity pool', 'Snorkeling'],
  },
  {
    id: 'natrang-beach-golf', hotel: 'Nha Trang Pearl Resort', destination: 'Nha Trang', country: 'Vietnam', coords: [12.24, 109.19],
    hotelRating: 4, reviewScore: 8.5, reviewCount: 438, roomType: 'Sea View Room', nights: 3, rounds: 2, transfer: 20,
    courses: [
      { name: 'Vinpearl Golf Nha Trang', designer: 'IMG Design', par: 71, rating: 72.0, diff: 'Intermediate', transfer: 20, rental: true },
      { name: 'Diamond Bay Golf', designer: 'Andy Dye', par: 72, rating: 72.8, diff: 'Championship', transfer: 30, rental: true },
    ],
    original: 700, sale: 560, season: 'Feb – Aug', tags: ['all-inclusive', 'weekend', 'family'],
    flags: { allInclusive: true, breakfast: true, cartIncluded: true, caddieIncluded: true, airportTransfer: true, freeCancellation: true, instantConfirmation: true, beginnerFriendly: true, lastMinute: true },
    facilities: ['Island access', 'Water park', 'Spa', 'Buffet dining', 'Pool bar'],
  },
  {
    id: 'hokkaido-highland', hotel: 'Niseko Green Highlands Hotel', destination: 'Hokkaido', country: 'Japan', coords: [42.8, 140.68],
    hotelRating: 5, reviewScore: 9.4, reviewCount: 377, roomType: 'Mountain View Suite', nights: 4, rounds: 3, transfer: 10,
    courses: [
      { name: 'Niseko Village Golf', designer: 'Arnold Palmer', par: 72, rating: 73.6, diff: 'Championship', transfer: 10, rental: true },
      { name: 'Rusutsu Highland Course', designer: 'Robert Trent Jones', par: 72, rating: 73.0, diff: 'Intermediate', transfer: 20, rental: true },
    ],
    original: 1320, sale: 1080, season: 'Jun – Sep', tags: ['luxury', 'group', 'stay-play'],
    flags: { breakfast: true, cartIncluded: true, caddieIncluded: false, airportTransfer: true, freeCancellation: true, instantConfirmation: false, groupFriendly: true, bestSeller: true },
    facilities: ['Onsen', 'Fine dining', 'Spa', 'Hiking trails', 'Wine cellar'],
  },
  {
    id: 'algarve-links-collection', hotel: 'Vale do Sol Golf Resort', destination: 'Algarve', country: 'Portugal', coords: [37.09, -8.25],
    hotelRating: 5, reviewScore: 9.2, reviewCount: 921, roomType: 'Garden Suite', nights: 5, rounds: 3, transfer: 8,
    courses: [
      { name: 'Vale do Sol Championship', designer: 'Nick Faldo', par: 72, rating: 74.4, diff: 'Championship', transfer: 8, rental: true },
      { name: 'Ocean Cliffs Links', designer: 'Arnold Palmer', par: 71, rating: 73.1, diff: 'Intermediate', transfer: 15, rental: true },
    ],
    original: 1480, sale: 1180, season: 'Mar – May · Sep – Oct', tags: ['luxury', 'group', 'all-inclusive'],
    flags: { allInclusive: true, breakfast: true, cartIncluded: true, caddieIncluded: false, airportTransfer: true, freeCancellation: true, instantConfirmation: true, groupFriendly: true, bestSeller: true },
    facilities: ['Golf academy', 'Michelin dining', 'Spa & thalasso', '3 pools', 'Tennis', 'Wine tasting'],
  },
  {
    id: 'pattaya-golf-break', hotel: 'Pattaya Bayview Golf Hotel', destination: 'Pattaya', country: 'Thailand', coords: [12.93, 100.88],
    hotelRating: 4, reviewScore: 8.3, reviewCount: 605, roomType: 'Deluxe Twin', nights: 3, rounds: 3, transfer: 25,
    courses: [
      { name: 'Siam Country Club Old', designer: 'Ichisuke Izumi', par: 72, rating: 73.3, diff: 'Championship', transfer: 25, rental: true },
      { name: 'Laem Chabang International', designer: 'Jack Nicklaus', par: 72, rating: 72.7, diff: 'Intermediate', transfer: 30, rental: true },
    ],
    original: 720, sale: 540, season: 'Nov – Feb', tags: ['weekend', 'group', 'last-minute'],
    flags: { breakfast: true, cartIncluded: true, caddieIncluded: true, airportTransfer: true, freeCancellation: false, instantConfirmation: true, groupFriendly: true, lastMinute: true },
    facilities: ['Beachfront', 'Pool', 'Golf bar', 'Spa', 'Late checkout'],
  },
  {
    id: 'taipei-city-golf', hotel: 'Taipei Skyline Golf Hotel', destination: 'Taipei', country: 'Taiwan', coords: [25.03, 121.56],
    hotelRating: 4, reviewScore: 8.7, reviewCount: 349, roomType: 'City View Deluxe', nights: 2, rounds: 2, transfer: 35,
    courses: [
      { name: 'Linkou International', designer: 'Kinya Fujita', par: 72, rating: 72.5, diff: 'Intermediate', transfer: 35, rental: true },
      { name: 'Taiwan Golf & Country Club', designer: 'C.H. Chen', par: 72, rating: 73.0, diff: 'Championship', transfer: 40, rental: true },
    ],
    original: 640, sale: 520, season: 'Oct – Apr', tags: ['weekend', 'women', 'stay-play'],
    flags: { breakfast: true, cartIncluded: true, caddieIncluded: true, airportTransfer: false, freeCancellation: true, instantConfirmation: true, beginnerFriendly: true },
    facilities: ['Rooftop bar', 'Spa', 'Night market nearby', 'Fitness center'],
  },
  {
    id: 'bali-cliffside-golf', hotel: 'Bali Cliffs Golf & Spa', destination: 'Bali', country: 'Indonesia', coords: [-8.65, 115.13],
    hotelRating: 5, reviewScore: 9.0, reviewCount: 733, roomType: 'Cliff Pool Villa', nights: 4, rounds: 2, transfer: 30,
    courses: [
      { name: 'Bali National Golf', designer: 'Nelson & Haworth', par: 72, rating: 73.4, diff: 'Intermediate', transfer: 30, rental: true },
      { name: 'New Kuta Ocean Course', designer: 'Ronald Fream', par: 72, rating: 73.9, diff: 'Championship', transfer: 20, rental: true },
    ],
    original: 1160, sale: 950, season: 'Apr – Oct', tags: ['luxury', 'women', 'family'],
    flags: { breakfast: true, cartIncluded: true, caddieIncluded: true, airportTransfer: true, freeCancellation: true, instantConfirmation: true, beginnerFriendly: true, groupFriendly: true },
    facilities: ['Private villa pool', 'Cliffside spa', 'Yoga deck', '2 restaurants', 'Butler service'],
  },
  {
    id: 'phuket-island-golf', hotel: 'Phuket Lagoon Golf Resort', destination: 'Phuket', country: 'Thailand', coords: [7.94, 98.34],
    hotelRating: 4, reviewScore: 8.6, reviewCount: 528, roomType: 'Lagoon Access Room', nights: 3, rounds: 2, transfer: 22,
    courses: [
      { name: 'Blue Canyon Canyon Course', designer: 'Yoshikazu Kato', par: 72, rating: 74.0, diff: 'Championship', transfer: 22, rental: true },
      { name: 'Red Mountain Golf', designer: 'Schmidt-Curley', par: 72, rating: 73.2, diff: 'Intermediate', transfer: 28, rental: true },
    ],
    original: 780, sale: 620, season: 'Nov – Apr', tags: ['all-inclusive', 'family', 'last-minute'],
    flags: { allInclusive: true, breakfast: true, cartIncluded: true, caddieIncluded: true, airportTransfer: true, freeCancellation: true, instantConfirmation: true, beginnerFriendly: true, lastMinute: true },
    facilities: ['Lagoon pool', 'Spa', 'Kids pool', 'Beach shuttle', 'Buffet'],
  },
  {
    id: 'busan-coastal-golf', hotel: 'Busan Marina Golf Hotel', destination: 'Busan', country: 'South Korea', coords: [35.15, 129.11],
    hotelRating: 4, reviewScore: 8.8, reviewCount: 462, roomType: 'Marina View Room', nights: 2, rounds: 2, transfer: 18,
    courses: [
      { name: 'Asiad Country Club', designer: 'Song Ho', par: 72, rating: 72.8, diff: 'Intermediate', transfer: 18, rental: true },
      { name: 'Dongrae Benest GC', designer: 'Ronald Fream', par: 71, rating: 72.2, diff: 'Beginner', transfer: 22, rental: true },
    ],
    original: 700, sale: 580, season: 'Apr – Jun · Sep – Nov', tags: ['weekend', 'women', 'stay-play'],
    flags: { breakfast: true, cartIncluded: true, caddieIncluded: true, airportTransfer: false, freeCancellation: true, instantConfirmation: true, beginnerFriendly: true },
    facilities: ['Marina view', 'Spa', 'Seafood dining', 'Sauna', 'Fitness'],
  },
];

const DEFAULT_TEE: import('./types').TeeTime[] = [
  { time: '06:40', bestValue: true },
  { time: '07:20' },
  { time: '08:10' },
  { time: '09:00', soldOut: true },
  { time: '10:30', bestValue: true },
  { time: '12:40' },
  { time: '14:10', soldOut: true },
];

function buildCourses(s: Seed): GolfCourse[] {
  return s.courses.map((c) => ({
    name: c.name,
    designer: c.designer,
    holes: 18,
    par: c.par,
    courseRating: c.rating,
    difficulty: c.diff,
    transferMin: c.transfer,
    dressCode: DRESS,
    rentalClubs: c.rental,
  }));
}

/* ------------------------------------------------------------------ *
 * 목적지별 조합 자동 확장 — 필터(박수·라운드·성급·평점·식사·편의·특가·카테고리)
 * 대부분 조합이 결과를 내도록 목적지마다 5개 변형 패키지를 생성한다.
 * 기본 12개(SEEDS)는 앞에 유지 → 홈 추천/마이트립 인덱스 안정.
 * ------------------------------------------------------------------ */
type SeedFlags = Seed['flags'];
interface VariantSpec {
  key: string;
  hotel: (city: string, base: Seed) => string;
  rating: number; // 0 = 기본 성급 유지
  room: string; // '' = 기본 유지
  nights: number;
  rounds: number;
  saleMult: number;
  discount: number; // 정가 = 판매가 × (1 + discount)
  scoreDelta: number;
  minScore?: number;
  reviewMult: number;
  tags: string[];
  flags: SeedFlags;
}

const VARIANTS: VariantSpec[] = [
  {
    key: 'weekend', hotel: (c) => `${c} Fairway Hotel`, rating: 4, room: '디럭스 트윈',
    nights: 2, rounds: 2, saleMult: 0.72, discount: 0.22, scoreDelta: -0.5, reviewMult: 0.7,
    tags: ['weekend', 'last-minute', 'women'],
    flags: { breakfast: true, cartIncluded: true, freeCancellation: true, instantConfirmation: true, beginnerFriendly: true, lastMinute: true },
  },
  {
    key: 'std3r', hotel: (_c, b) => b.hotel, rating: 0, room: '',
    nights: 3, rounds: 3, saleMult: 1.12, discount: 0.15, scoreDelta: 0, reviewMult: 1.05,
    tags: ['stay-play', 'group'],
    flags: { breakfast: true, cartIncluded: true, caddieIncluded: true, airportTransfer: true, freeCancellation: true, instantConfirmation: true, groupFriendly: true },
  },
  {
    key: 'extended', hotel: (_c, b) => b.hotel, rating: 0, room: '',
    nights: 4, rounds: 3, saleMult: 1.42, discount: 0.18, scoreDelta: 0.1, reviewMult: 0.85,
    tags: ['group', 'stay-play'],
    flags: { breakfast: true, cartIncluded: true, caddieIncluded: true, airportTransfer: true, freeCancellation: true, instantConfirmation: true, groupFriendly: true },
  },
  {
    key: 'grand', hotel: (c) => `${c} Grand Golf Resort`, rating: 5, room: '프리미어 스위트',
    nights: 5, rounds: 3, saleMult: 1.68, discount: 0.2, scoreDelta: 0.3, minScore: 9.0, reviewMult: 0.6,
    tags: ['luxury', 'all-inclusive', 'group'],
    flags: { allInclusive: true, breakfast: true, cartIncluded: true, caddieIncluded: true, airportTransfer: true, freeCancellation: true, instantConfirmation: true, groupFriendly: true, bestSeller: true },
  },
  {
    key: 'ai', hotel: (c) => `${c} Bay All-Inclusive`, rating: 4, room: '올인클루시브 룸',
    nights: 4, rounds: 2, saleMult: 1.24, discount: 0.16, scoreDelta: -0.2, reviewMult: 0.8,
    tags: ['all-inclusive', 'family'],
    flags: { allInclusive: true, breakfast: true, cartIncluded: true, caddieIncluded: true, airportTransfer: true, freeCancellation: true, instantConfirmation: true, beginnerFriendly: true },
  },
];

const round1 = (n: number) => Math.round(n * 10) / 10;
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
const round10 = (n: number) => Math.round(n / 10) * 10;

function expandSeeds(base: Seed[]): Seed[] {
  const out: Seed[] = [];
  for (const s of base) {
    for (const v of VARIANTS) {
      const sale = round10(s.sale * v.saleMult);
      out.push({
        ...s,
        id: `${s.id}-${v.key}`,
        hotel: v.hotel(s.destination, s),
        hotelRating: v.rating || s.hotelRating,
        roomType: v.room || s.roomType,
        nights: v.nights,
        rounds: v.rounds,
        reviewScore: Math.max(v.minScore ?? 0, clamp(round1(s.reviewScore + v.scoreDelta), 7.8, 9.7)),
        reviewCount: Math.max(60, Math.round(s.reviewCount * v.reviewMult)),
        original: round10(sale * (1 + v.discount)),
        sale,
        tags: v.tags,
        flags: v.flags,
      });
    }
  }
  return out;
}

const ALL_SEEDS: Seed[] = [...SEEDS, ...expandSeeds(SEEDS)];

export const PACKAGES: GolfPackage[] = ALL_SEEDS.map((s, idx) => {
  const courses = buildCourses(s);
  const flags = s.flags;
  const inclusions = [
    `${s.hotel} ${s.nights}박 숙박`,
    '매일 조식',
    `18홀 라운드 ${s.rounds}회 (그린피)`,
    ...(flags.caddieIncluded ? ['캐디피'] : []),
    '공용 골프 카트',
    ...(flags.airportTransfer ? ['공항 왕복 픽업'] : []),
    '골프장 왕복 이동',
    ...(flags.allInclusive ? ['전 식사 & 지정 음료'] : []),
  ];
  const exclusions = [
    '국제선 항공권',
    '여행자 보험',
    ...(flags.caddieIncluded ? [] : ['캐디피 (현지 결제)']),
    '개인 경비 & 팁',
    '클럽 렌탈 (요청 시)',
  ];
  return {
    id: s.id,
    hotel: s.hotel,
    destination: s.destination,
    country: s.country,
    coordinates: { lat: s.coords[0], lng: s.coords[1] },
    hotelRating: s.hotelRating,
    reviewScore: s.reviewScore,
    reviewCount: s.reviewCount,
    reviewBreakdown: {
      hotel: s.reviewScore,
      courseCondition: Math.min(10, s.reviewScore + 0.2),
      paceOfPlay: s.reviewScore - 0.3,
      transportation: s.reviewScore - 0.1,
      value: s.reviewScore - 0.4,
      service: s.reviewScore + 0.1,
    },
    roomType: s.roomType,
    nights: s.nights,
    rounds: s.rounds,
    golfCourses: courses,
    teeTimes: DEFAULT_TEE,
    inclusions,
    exclusions,
    transferTimeMin: s.transfer,
    originalPriceUSD: s.original,
    salePriceUSD: s.sale,
    cancellationPolicy: flags.freeCancellation
      ? '체크인 14일 전까지 무료 취소. 7일 전까지 50% 환불.'
      : '환불 불가. 잔여 상황에 따라 날짜 변경 1회 가능.',
    instantConfirmation: Boolean(flags.instantConfirmation),
    recommendedSeason: s.season,
    tags: s.tags,
    beginnerFriendly: Boolean(flags.beginnerFriendly),
    groupFriendly: Boolean(flags.groupFriendly),
    allInclusive: Boolean(flags.allInclusive),
    breakfast: Boolean(flags.breakfast),
    cartIncluded: Boolean(flags.cartIncluded),
    caddieIncluded: Boolean(flags.caddieIncluded),
    airportTransfer: Boolean(flags.airportTransfer),
    freeCancellation: Boolean(flags.freeCancellation),
    images: [s.id, `${s.id}-2`, `${s.id}-3`, `${s.id}-4`, `${s.id}-5`],
    options: options(s.sale, s.nights, s.rounds),
    itinerary: itinerary(s.nights, courses, s.destination),
    hotelFacilities: s.facilities.map(faci),
    reviews: makeReviews(idx, s.hotel, courses[0].name),
    bestSeller: flags.bestSeller,
    lastMinute: flags.lastMinute,
  };
});

export function getPackage(id: string): GolfPackage | undefined {
  return PACKAGES.find((p) => p.id === id);
}

export function discountPct(p: GolfPackage): number {
  return Math.round(((p.originalPriceUSD - p.salePriceUSD) / p.originalPriceUSD) * 100);
}
