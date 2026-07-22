import { describe, expect, it } from 'vitest';
import {
  serializeActivitySearch,
  serializeFlightSearch,
  serializeRentalcarSearch,
  type FlightSearchForm,
  type RentalcarSearchForm,
} from './serializeNonHotel';

const GMP = { nameLn: '김포', nameEn: '김포', code: 'GMP', countryNameEn: 'Korea' };
const KIX = { nameLn: '오사카', nameEn: '오사카', code: 'KIX', countryNameEn: 'Japan' };

describe('serializeFlightSearch', () => {
  const base: FlightSearchForm = {
    tripType: 'RT',
    directOnly: true,
    origin: GMP,
    destination: KIX,
    departDate: '2026-07-25',
    returnDate: '2026-07-27',
    passengers: { adult: 2, child: 1, infant: 0, seatClass: '비즈니스석' },
  };

  it('왕복: 출발/도착/왕복일자/좌석등급 직렬화', () => {
    const p = new URLSearchParams(serializeFlightSearch(base).split('?')[1]);
    expect(p.get('tripType')).toBe('RT');
    expect(p.get('directOnly')).toBe('true');
    expect(p.get('origin')).toBe('GMP');
    expect(p.get('destination')).toBe('KIX');
    expect(p.get('departDate')).toBe('2026-07-25');
    expect(p.get('returnDate')).toBe('2026-07-27');
    expect(p.get('adultCount')).toBe('2');
    expect(p.get('childCount')).toBe('1');
    expect(p.get('seatClass')).toBe('비즈니스석');
  });

  it('편도: returnDate 없음', () => {
    const p = new URLSearchParams(serializeFlightSearch({ ...base, tripType: 'OW', returnDate: null }).split('?')[1]);
    expect(p.get('tripType')).toBe('OW');
    expect(p.get('returnDate')).toBeNull();
  });

  it('필수값 누락 시 throw', () => {
    expect(() => serializeFlightSearch({ ...base, origin: null })).toThrow();
  });
});

describe('serializeActivitySearch', () => {
  it('검색어+카테고리 직렬화', () => {
    const p = new URLSearchParams(serializeActivitySearch({ destinationText: '오사카', category: '티켓/패스' }).split('?')[1]);
    expect(p.get('keyword')).toBe('오사카');
    expect(p.get('category')).toBe('티켓/패스');
  });
});

describe('serializeRentalcarSearch', () => {
  const base: RentalcarSearchForm = {
    sameReturn: true,
    pickup: { nameLn: '제주', nameEn: '제주', code: 'CJU', countryNameEn: 'Korea' },
    driverBirthday: '19900101',
    pickupDateTime: '2026-07-25',
    returnDateTime: '2026-07-28',
    insurance: 'GN',
  };

  it('인수/반납/보험/생년월일 직렬화', () => {
    const p = new URLSearchParams(serializeRentalcarSearch(base).split('?')[1]);
    expect(p.get('pickup')).toBe('CJU');
    expect(p.get('driverBirthday')).toBe('19900101');
    expect(p.get('pickupDateTime')).toBe('2026-07-25');
    expect(p.get('returnDateTime')).toBe('2026-07-28');
    expect(p.get('insurance')).toBe('GN');
  });

  it('인수 도시/일시 누락 시 throw', () => {
    expect(() => serializeRentalcarSearch({ ...base, pickup: null })).toThrow();
  });
});
