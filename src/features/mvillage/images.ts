/**
 * M Village 이미지 리졸버 — /public/mvillage/img 스톡 풀을 seed로 결정론적 매핑.
 * basePath(GitHub Pages)를 자동 반영. 실서비스화 시 자사 실사진으로 교체.
 */
import type { ImgKind } from '@/mocks/mvillage/data';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const POOLS: Record<ImgKind | 'hero', string[]> = {
  resort: ['resort-1', 'resort-2', 'resort-3', 'resort-4', 'resort-5', 'resort-6', 'resort-7', 'resort-8'],
  beach: ['resort-2', 'resort-4', 'resort-6', 'hero-1', 'hero-2'],
  city: ['resort-1', 'resort-3', 'resort-5', 'resort-7'],
  nature: ['green-1', 'green-2', 'green-3', 'green-4', 'green-5', 'green-6'],
  interior: ['resort-8', 'resort-3', 'resort-5', 'resort-1'],
  suite: ['resort-4', 'resort-6', 'resort-2', 'resort-7'],
  hero: ['hero-1', 'hero-2'],
};

function hash(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) & 0xffffffff;
  return Math.abs(h);
}

export function asset(path: string): string {
  return `${BASE}${path.startsWith('/') ? '' : '/'}${path}`;
}

export function mvImg(seed: string, kind: ImgKind | 'hero' = 'resort'): string {
  const pool = POOLS[kind] ?? POOLS.resort;
  const file = pool[hash(`${kind}:${seed}`) % pool.length];
  return asset(`/mvillage/img/${file}.jpg`);
}
