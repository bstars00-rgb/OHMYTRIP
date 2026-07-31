/**
 * 실시간 티타임 재고(mock) — GORA 벤치마크.
 * 실 API 대신 (코스·날짜·시간) 해시로 잔여 팀수를 결정론적으로 산출.
 * 실서비스화 시 이 모듈을 티타임 재고 API 어댑터로 교체.
 */
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export interface TeeAvail {
  soldOut: boolean;
  remaining: number; // 잔여 팀수 (0 = 마감)
}

/** 코스·날짜·시간별 잔여 재고 */
export function teeAvailability(courseName: string, dateISO: string, time: string, baseSoldOut = false): TeeAvail {
  if (!dateISO) return { soldOut: baseSoldOut, remaining: baseSoldOut ? 0 : 2 };
  const key = `${courseName}|${dateISO}|${time}`;
  const n = hash(key) % 10;
  if (n < 2) return { soldOut: true, remaining: 0 }; // ~20% 마감
  return { soldOut: false, remaining: 1 + (hash(key + 'r') % 3) }; // 잔여 1~3팀
}

export interface TeeDate {
  iso: string;
  label: string; // 8/1(금)
  isWeekend: boolean;
}

/** 오늘부터 count일간의 선택 가능 날짜 (클라이언트에서만 호출 — new Date 사용) */
export function makeTeeDates(count = 14): TeeDate[] {
  const WD = ['일', '월', '화', '수', '목', '금', '토'];
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  const out: TeeDate[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    out.push({ iso, label: `${d.getMonth() + 1}/${d.getDate()}(${WD[d.getDay()]})`, isWeekend: d.getDay() === 0 || d.getDay() === 6 });
  }
  return out;
}
