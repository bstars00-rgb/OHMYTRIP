import type { CourseDetail, CourseFee, ScorecardHole, SignatureHole } from './types';
import { PACKAGES } from './data';

/* ------------------------------------------------------------------ *
 * 골프장 상세 레지스트리
 * 패키지에 포함된 모든 골프장을 주소화(slug)하고, 상세 스펙을 결정론적으로
 * 합성한다. monkeytravel 골프텔 상세(전장/그린스피드/잔디/현지요금/플레이조건/
 * 팀구성/운영시간)를 벤치마크해 필드를 구성했다. 실데이터 연동 시 이 파일만 교체.
 * ------------------------------------------------------------------ */

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function courseSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/* 국가별 프로파일: 통화·현지 요금·잔디·플레이 규칙 */
interface CountryProfile {
  greenGrass: string;
  fairwayGrass: string;
  fees: (h: number) => CourseFee[];
  rules: string[];
}

const NOTE_LOCAL = '현지 현금 결제';

const COUNTRY: Record<string, CountryProfile> = {
  Thailand: {
    greenGrass: 'Tif-Eagle 버뮤다그라스',
    fairwayGrass: '시쇼어 파스팔럼',
    fees: () => [
      { label: '카트', amount: '800 THB', note: `1인 · 18홀 · ${NOTE_LOCAL}` },
      { label: '캐디', amount: '400 THB', note: `1인 · 18홀 · ${NOTE_LOCAL}` },
      { label: '캐디 팁', amount: '400 THB', note: `1인 · 18홀 · 권장` },
      { label: '갤러리 피', amount: '1,000 THB', note: '비플레이 동반 시' },
    ],
    rules: ['1인 1카트 의무 이용', '카트 페어웨이 진입 가능 (코스 상황에 따라 제한)', '2인 이상 출발 가능'],
  },
  'South Korea': {
    greenGrass: '벤트그라스 (원그린)',
    fairwayGrass: '중지 (조이시아)',
    fees: () => [
      { label: '카트', amount: '100,000 KRW', note: `팀(4인) · 18홀 · ${NOTE_LOCAL}` },
      { label: '캐디', amount: '150,000 KRW', note: `팀(4인) · 18홀 · ${NOTE_LOCAL}` },
      { label: '락커', amount: '무료', note: '클럽하우스' },
    ],
    rules: ['팀당 카트 1대(4인)', '캐디 동반 필수 (팀당 1명)', '2인 이상 부킹 가능'],
  },
  Japan: {
    greenGrass: '벤트그라스 (원그린)',
    fairwayGrass: '고라이시바',
    fees: () => [
      { label: '카트', amount: '요금 포함', note: '셀프 카트' },
      { label: '캐디 (선택)', amount: '¥3,300', note: `1인 · 18홀 · ${NOTE_LOCAL}` },
      { label: '온천', amount: '요금 포함', note: '라운드 후 이용' },
    ],
    rules: ['캐디 동반은 선택 (셀프 플레이 가능)', '오전 하프 → 점심 → 오후 하프 진행', '2인 이상 출발 가능'],
  },
  Vietnam: {
    greenGrass: 'Seashore 파스팔럼',
    fairwayGrass: '버뮤다그라스',
    fees: () => [
      { label: '캐디', amount: '400,000 VND', note: `1인 · 18홀 · ${NOTE_LOCAL}` },
      { label: '캐디 팁', amount: '200,000 VND', note: '1인 · 18홀 · 권장' },
      { label: '카트', amount: '요금 포함', note: '1인 1카트' },
    ],
    rules: ['1인 1카트 의무 이용', '캐디 동반 필수', '2인 이상 출발 가능'],
  },
  Portugal: {
    greenGrass: '벤트그라스',
    fairwayGrass: '버뮤다 419',
    fees: () => [
      { label: '버기 (카트)', amount: '€45', note: `2인 · 18홀 · ${NOTE_LOCAL}` },
      { label: '캐디 (선택)', amount: '€50', note: '사전 예약 · 1인' },
      { label: '트롤리', amount: '€8', note: '전동 트롤리 대여' },
    ],
    rules: ['셀프 플레이 (캐디 사전 예약 시 동반)', '버기 페어웨이 진입 제한', '1인 부킹 가능'],
  },
  Indonesia: {
    greenGrass: 'Tif-Eagle 버뮤다그라스',
    fairwayGrass: '시쇼어 파스팔럼',
    fees: () => [
      { label: '캐디', amount: 'IDR 200,000', note: `1인 · 18홀 · ${NOTE_LOCAL}` },
      { label: '캐디 팁', amount: 'IDR 100,000', note: '1인 · 권장' },
      { label: '카트', amount: '요금 포함', note: '1인 1카트' },
    ],
    rules: ['1인 1카트 의무 이용', '캐디 동반 필수', '2인 이상 출발 가능'],
  },
  Taiwan: {
    greenGrass: '버뮤다그라스',
    fairwayGrass: '버뮤다그라스',
    fees: () => [
      { label: '캐디', amount: 'NT$1,200', note: `팀 · 18홀 · ${NOTE_LOCAL}` },
      { label: '카트', amount: 'NT$800', note: `팀 · 18홀 · ${NOTE_LOCAL}` },
      { label: '락커', amount: 'NT$100', note: '클럽하우스' },
    ],
    rules: ['팀당 캐디 1명 동반', '카트 페어웨이 진입 제한', '2인 이상 출발 가능'],
  },
};

const FALLBACK: CountryProfile = {
  greenGrass: '벤트그라스',
  fairwayGrass: '버뮤다그라스',
  fees: () => [
    { label: '카트', amount: '요금 포함', note: '' },
    { label: '캐디 (선택)', amount: '현지 요금', note: NOTE_LOCAL },
  ],
  rules: ['2인 이상 출발 가능', '핸디캡 증명서 불필요'],
};

const GREEN_SPEED = ['보통 (약 2.7m)', '빠름 (약 3.0m)', '매우 빠름 (약 3.2m)'];

/* 스코어카드 파 패턴 (합계 72 / 71) */
const FRONT = [4, 5, 4, 3, 4, 4, 5, 3, 4]; // 36
const BACK72 = [4, 4, 3, 5, 4, 4, 3, 5, 4]; // 36
const BACK71 = [4, 4, 3, 5, 4, 4, 3, 4, 4]; // 35
// 스트로크 인덱스: 전반=홀수, 후반=짝수 (표준 배치)
const SI = [7, 3, 15, 17, 1, 13, 5, 11, 9, 8, 4, 16, 18, 2, 14, 6, 10, 12];

function holeYards(par: number, seed: number): number {
  if (par === 3) return 150 + (seed % 56); // 150~205
  if (par === 5) return 500 + (seed % 85); // 500~584
  return 350 + (seed % 110); // 350~459
}

function buildScorecard(name: string, par: number): ScorecardHole[] {
  const h = hash(name);
  const pars = [...FRONT, ...(par === 71 ? BACK71 : BACK72)];
  return pars.map((p, i) => ({
    hole: i + 1,
    par: p,
    yards: holeYards(p, h + (i + 1) * 97),
    si: SI[i],
  }));
}

function buildSignature(name: string, card: ScorecardHole[]): SignatureHole[] {
  const par3s = card.filter((c) => c.par === 3);
  const par5s = card.filter((c) => c.par === 5);
  const h = hash(name);
  const sig3 = par3s[h % par3s.length];
  const sig5 = par5s[(h >> 3) % par5s.length];
  const notes3 = ['그린 앞뒤로 워터해저드가 도사린 시그니처 파3', '바람을 정면으로 맞는 시그니처 아일랜드 파3', '벙커가 그린을 감싼 전략적 파3'];
  const notes5 = ['투온을 노릴 수 있는 리스크&리워드 파5', '도그렉으로 휘어지는 챔피언십 파5', '마지막을 장식하는 롱 피니싱 파5'];
  return [
    { hole: sig3.hole, par: 3, yards: sig3.yards, note: notes3[h % notes3.length] },
    { hole: sig5.hole, par: 5, yards: sig5.yards, note: notes5[(h >> 5) % notes5.length] },
  ].sort((a, b) => a.hole - b.hole);
}

const DIFF_KO: Record<CourseDetail['difficulty'], string> = {
  Beginner: '입문자 친화',
  Intermediate: '중급자 적합',
  Championship: '챔피언십',
};

function buildDescription(name: string, destination: string, designer: string, diff: CourseDetail['difficulty'], sig: SignatureHole[]): string {
  return (
    `${destination}에 자리한 ${name}는 ${designer}가 설계한 18홀 ${DIFF_KO[diff]} 코스입니다. ` +
    `자연 지형을 살린 페어웨이와 정교하게 관리된 그린으로 라운드 내내 다양한 공략 선택지를 제공합니다. ` +
    `특히 ${sig[0].hole}번 파${sig[0].par} 홀은 코스의 백미로 꼽히며, 초보부터 상급자까지 폭넓게 즐길 수 있어 골프텔 패키지 여행지로 인기가 높습니다.`
  );
}

const BASE_FACILITIES = ['클럽하우스', '드라이빙 레인지', '퍼팅 그린', '프로샵', '레스토랑', '락커룸 & 샤워'];
const EXTRA_FACILITIES = ['미니 스파', '피팅 스튜디오', '나이트 라운지', '어프로치 연습장', '벙커 연습장'];

function buildDetail(
  name: string,
  destination: string,
  country: string,
  base: { designer: string; par: number; courseRating: number; difficulty: CourseDetail['difficulty']; transferMin: number; rentalClubs: boolean },
  packageIds: string[],
): CourseDetail {
  const h = hash(name);
  const profile = COUNTRY[country] ?? FALLBACK;
  const scorecard = buildScorecard(name, base.par);
  const yardage = scorecard.reduce((s, c) => s + c.yards, 0);
  const signatureHoles = buildSignature(name, scorecard);
  const slug = courseSlug(name);
  const rangeOpen = ['05:30', '06:00', '06:30'][h % 3];
  const distanceFromHotel =
    base.transferMin <= 6
      ? '골프텔에서 클럽하우스까지 카트로 약 2분 · 도보로 약 5분'
      : `호텔에서 차량으로 약 ${base.transferMin}분`;
  return {
    slug,
    name,
    destination,
    country,
    designer: base.designer,
    holes: 18,
    par: base.par,
    yardage,
    courseRating: base.courseRating,
    slopeRating: Math.min(142, Math.max(118, Math.round(126 + (base.courseRating - 72) * 3 + (h % 9)))),
    difficulty: base.difficulty,
    established: 1990 + (h % 30),
    greenGrass: profile.greenGrass,
    fairwayGrass: profile.fairwayGrass,
    greenSpeed: GREEN_SPEED[h % GREEN_SPEED.length],
    drivingRangeHours: `${rangeOpen} ~ 18:00`,
    restaurantHours: '06:00 ~ 21:00',
    distanceFromHotel,
    transferMin: base.transferMin,
    dressCode: '카라 셔츠 · 골프화 필수 (청바지·민소매 불가)',
    rentalClubs: base.rentalClubs,
    localFees: profile.fees(h),
    playRules: [...profile.rules, '핸디캡 증명서 불필요'],
    teamConfig: [
      { slot: '주중 오전', max: 5 },
      { slot: '주중 오후', max: 5 },
      { slot: '주말 오전', max: 4 },
      { slot: '주말 오후', max: 5 },
    ],
    facilities: [...BASE_FACILITIES, EXTRA_FACILITIES[h % EXTRA_FACILITIES.length]],
    signatureHoles,
    description: buildDescription(name, destination, base.designer, base.difficulty, signatureHoles),
    scorecard,
    images: [slug, `${slug}-2`, `${slug}-3`, `${slug}-4`, `${slug}-5`],
    packageIds,
  };
}

/* 모든 패키지의 골프장을 slug 기준으로 취합 */
const _map = new Map<string, CourseDetail>();
for (const p of PACKAGES) {
  for (const c of p.golfCourses) {
    const slug = courseSlug(c.name);
    const existing = _map.get(slug);
    if (existing) {
      if (!existing.packageIds.includes(p.id)) existing.packageIds.push(p.id);
      continue;
    }
    _map.set(
      slug,
      buildDetail(
        c.name,
        p.destination,
        p.country,
        { designer: c.designer, par: c.par, courseRating: c.courseRating, difficulty: c.difficulty, transferMin: c.transferMin, rentalClubs: c.rentalClubs },
        [p.id],
      ),
    );
  }
}

export const COURSES: CourseDetail[] = Array.from(_map.values());

export function getCourseDetail(slug: string): CourseDetail | undefined {
  return _map.get(slug);
}

export function coursesByDestination(): { destination: string; country: string; courses: CourseDetail[] }[] {
  const byDest = new Map<string, { destination: string; country: string; courses: CourseDetail[] }>();
  for (const c of COURSES) {
    const g = byDest.get(c.destination) ?? { destination: c.destination, country: c.country, courses: [] };
    g.courses.push(c);
    byDest.set(c.destination, g);
  }
  return Array.from(byDest.values());
}
