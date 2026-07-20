import { describe, expect, it } from 'vitest';
import { searchDestinations } from './destination.service';

describe('searchDestinations (자동완성 Mock)', () => {
  it('2자 미만은 빈 배열', async () => {
    expect(await searchDestinations('서')).toEqual([]);
    expect(await searchDestinations(' ')).toEqual([]);
  });

  it('서울 검색: 도시(공항 포함) 우선 → 호텔 순', async () => {
    const results = await searchDestinations('서울');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].nameLn).toBe('서울');
    const firstHotelIdx = results.findIndex((r) => r.type === 'hotel');
    const lastCityIdx = results.map((r) => r.type).lastIndexOf('region');
    if (firstHotelIdx !== -1) expect(lastCityIdx).toBeLessThan(firstHotelIdx);
  });

  it('영문 검색도 매칭', async () => {
    const results = await searchDestinations('seoul');
    expect(results.some((r) => r.nameEn.includes('Seoul'))).toBe(true);
  });

  it('최대 10건 제한', async () => {
    const results = await searchDestinations('서울');
    expect(results.length).toBeLessThanOrEqual(10);
  });
});
