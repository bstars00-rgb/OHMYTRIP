import { describe, expect, it } from 'vitest';
import { serializeHotelSearch, summarizeRooms } from './serializeHotelSearch';
import type { HotelSearchForm } from '@/types/search';

const SEOUL = {
  type: 'region' as const,
  iconType: 'city' as const,
  nameLn: '서울',
  nameEn: 'Seoul',
  regionCode: '102514',
  countryNameEn: 'Korea',
};

const baseForm: HotelSearchForm = {
  destination: SEOUL,
  checkInDate: '2026-07-25',
  checkOutDate: '2026-07-27',
  rooms: [{ adultCount: 2, childAges: [5] }],
};

describe('serializeHotelSearch (원본 URL 스킴 재현)', () => {
  it('원본과 동일한 키 구성으로 직렬화한다', () => {
    const url = serializeHotelSearch(baseForm);
    const [path, qs] = url.split('?');
    const p = new URLSearchParams(qs);
    expect(path).toBe('/hotel/search-result');
    expect(p.get('checkInDate')).toBe('2026-07-25');
    expect(p.get('checkOutDate')).toBe('2026-07-27');
    expect(p.get('rooms-0-adultCount')).toBe('2');
    expect(p.get('rooms-0-childCount')).toBe('1');
    expect(p.get('rooms-0-childAges-0')).toBe('5');
    expect(p.get('dynamicRateYn')).toBe('true');
    expect(p.get('sortOrder')).toBe('Recommend');
    expect(p.get('limits-0')).toBe('0');
    expect(p.get('limits-1')).toBe('10');
    expect(p.get('destination-type')).toBe('region');
    expect(p.get('destination-iconType')).toBe('city');
    expect(p.get('destination-regionNameLn')).toBe('서울');
    expect(p.get('destination-regionCode')).toBe('102514');
    expect(p.get('regionCode')).toBe('102514');
    expect(p.get('page')).toBe('1');
  });

  it('객실 2개 직렬화: rooms-1-* 키 생성', () => {
    const url = serializeHotelSearch({
      ...baseForm,
      rooms: [
        { adultCount: 2, childAges: [] },
        { adultCount: 1, childAges: [0, 11] },
      ],
    });
    const p = new URLSearchParams(url.split('?')[1]);
    expect(p.get('rooms-1-adultCount')).toBe('1');
    expect(p.get('rooms-1-childCount')).toBe('2');
    expect(p.get('rooms-1-childAges-0')).toBe('0');
    expect(p.get('rooms-1-childAges-1')).toBe('11');
  });

  it('나이 미선택(null)은 childAges 키를 만들지 않는다', () => {
    const url = serializeHotelSearch({ ...baseForm, rooms: [{ adultCount: 2, childAges: [null] }] });
    const p = new URLSearchParams(url.split('?')[1]);
    expect(p.get('rooms-0-childCount')).toBe('1');
    expect(p.get('rooms-0-childAges-0')).toBeNull();
  });

  it('필수값 누락 시 throw', () => {
    expect(() => serializeHotelSearch({ ...baseForm, destination: null })).toThrow();
    expect(() => serializeHotelSearch({ ...baseForm, checkInDate: null })).toThrow();
  });
});

describe('summarizeRooms (원본 요약 문구)', () => {
  it('기본: 객실 1개 / 성인 2명', () => {
    expect(summarizeRooms([{ adultCount: 2, childAges: [] }])).toBe('객실 1개 / 성인 2명');
  });

  it('아동 포함: 객실 1개 / 성인 2명, 아동 1명', () => {
    expect(summarizeRooms([{ adultCount: 2, childAges: [5] }])).toBe('객실 1개 / 성인 2명, 아동 1명');
  });

  it('다객실 합산', () => {
    expect(
      summarizeRooms([
        { adultCount: 2, childAges: [3] },
        { adultCount: 1, childAges: [null] },
      ]),
    ).toBe('객실 2개 / 성인 3명, 아동 2명');
  });
});
