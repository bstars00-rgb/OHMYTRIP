import type { Destination } from '@/types/search';
import { DESTINATIONS } from '@/mocks/destinations';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API !== 'false';

/**
 * 목적지 자동완성 검색.
 * 원본 동작: 2자 이상 입력 시 노출, 도시(공항 포함) 우선 → 호텔 순.
 */
export async function searchDestinations(query: string): Promise<Destination[]> {
  if (!USE_MOCK) {
    // TODO: 실제 API 연동 (docs/api-contract.md)
    throw new Error('Real destination API is not wired yet.');
  }
  const q = query.trim();
  if (q.length < 2) return [];
  const matches = DESTINATIONS.filter(
    (d) => d.nameLn.includes(q) || d.nameEn.toLowerCase().includes(q.toLowerCase()),
  );
  return [
    ...matches.filter((d) => d.type === 'region'),
    ...matches.filter((d) => d.type === 'hotel'),
  ].slice(0, 10);
}
