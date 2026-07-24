/**
 * 실제 골프 이미지 리졸버 — /public/golf/img 의 실사진을 seed 기준으로 결정적 매핑.
 * (기존 SVG placeholder golfScene 대체) basePath(GitHub Pages)를 자동 반영한다.
 */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const POOLS = {
  hero: ['hero-1.jpg', 'hero-2.jpg'],
  course: ['course-1.jpg', 'course-2.jpg', 'course-3.jpg', 'course-4.jpg', 'course-5.jpg', 'course-6.jpg', 'course-7.jpg', 'course-8.jpg'],
  resort: ['resort-1.jpg', 'resort-2.jpg', 'resort-3.jpg', 'resort-4.jpg', 'resort-5.jpg', 'resort-6.jpg', 'resort-7.jpg', 'resort-8.jpg'],
  green: ['green-1.jpg', 'green-2.jpg', 'green-3.jpg', 'green-4.jpg', 'green-5.jpg', 'green-6.jpg'],
} as const;

export type ImageKind = keyof typeof POOLS;

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) & 0xffffffff;
  return Math.abs(h);
}

/** 정적 자산 경로에 basePath 부여 */
export function asset(path: string): string {
  return `${BASE}${path.startsWith('/') ? '' : '/'}${path}`;
}

/** seed → 실제 골프 이미지 URL (kind 기본: resort) */
export function golfImg(seed: string, kind: ImageKind = 'resort'): string {
  const pool = POOLS[kind];
  const file = pool[hashSeed(`${kind}:${seed}`) % pool.length];
  return asset(`/golf/img/${file}`);
}

export function golfHeroImg(seed = 'hero'): string {
  const pool = POOLS.hero;
  return asset(`/golf/img/${pool[hashSeed(seed) % pool.length]}`);
}

/** 실측 원본 크기 (CLS 방지용 width/height 힌트) */
export const IMG_DIM = { hero: { w: 1600, h: 720 }, card: { w: 800, h: 600 } } as const;
