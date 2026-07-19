import { differenceInCalendarDays, format, parseISO } from 'date-fns';

const KO_DAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

/** 2026-07-25 → "26.07.25(토)" (원본 검색 조건 표기) */
export function formatConditionDate(iso: string): string {
  const d = parseISO(iso);
  return `${format(d, 'yy.MM.dd')}(${KO_DAYS[d.getDay()]})`;
}

/** "26.07.25(토) ~ 26.07.27(월)" */
export function formatConditionRange(checkIn: string, checkOut: string): string {
  return `${formatConditionDate(checkIn)} ~ ${formatConditionDate(checkOut)}`;
}

/** 달력 헤더 "2026년 07월" */
export function formatMonthTitle(d: Date): string {
  return format(d, 'yyyy년 MM월');
}

/** 체크인 칩 "2026.07.25" */
export function formatItineraryDate(iso: string): string {
  return format(parseISO(iso), 'yyyy.MM.dd');
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  return differenceInCalendarDays(parseISO(checkOut), parseISO(checkIn));
}

export function toIsoDate(d: Date): string {
  return format(d, 'yyyy-MM-dd');
}
