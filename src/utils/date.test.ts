import { describe, expect, it } from 'vitest';
import {
  formatConditionDate,
  formatConditionRange,
  formatItineraryDate,
  formatMonthTitle,
  nightsBetween,
  toIsoDate,
} from './date';

describe('date utils (원본 표기 재현)', () => {
  it('검색 조건 날짜: 26.07.25(토)', () => {
    expect(formatConditionDate('2026-07-25')).toBe('26.07.25(토)');
  });

  it('검색 조건 범위: 26.07.25(토) ~ 26.07.27(월)', () => {
    expect(formatConditionRange('2026-07-25', '2026-07-27')).toBe('26.07.25(토) ~ 26.07.27(월)');
  });

  it('달력 헤더: 2026년 07월', () => {
    expect(formatMonthTitle(new Date(2026, 6, 1))).toBe('2026년 07월');
  });

  it('체크인 칩: 2026.07.25', () => {
    expect(formatItineraryDate('2026-07-25')).toBe('2026.07.25');
  });

  it('숙박 박수 계산', () => {
    expect(nightsBetween('2026-07-25', '2026-07-27')).toBe(2);
    expect(nightsBetween('2026-07-31', '2026-08-01')).toBe(1);
    expect(nightsBetween('2026-12-30', '2027-01-02')).toBe(3);
  });

  it('ISO 변환', () => {
    expect(toIsoDate(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
});
