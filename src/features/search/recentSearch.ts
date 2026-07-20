/**
 * 최근 검색 저장 — 원본 localStorage 키/구조 재현:
 * recentSearchHotels: [{ id, type: 'IC02', queryString }]
 */
const KEY = 'recentSearchHotels';
const MAX_ITEMS = 10;

export interface RecentSearchItem {
  id: string;
  type: 'IC02';
  queryString: string;
}

export function loadRecentSearches(): RecentSearchItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed = raw ? (JSON.parse(raw) as RecentSearchItem[]) : [];
    return Array.isArray(parsed) ? parsed.filter((i) => typeof i?.queryString === 'string') : [];
  } catch {
    return [];
  }
}

export function saveRecentSearch(queryString: string): void {
  if (typeof window === 'undefined') return;
  try {
    const list = loadRecentSearches().filter((i) => i.queryString !== queryString);
    list.unshift({ id: crypto.randomUUID(), type: 'IC02', queryString });
    window.localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX_ITEMS)));
  } catch {
    // storage unavailable
  }
}

/** queryString → 표시 라벨 파싱 */
export function parseRecentSearch(queryString: string): {
  destination: string;
  checkIn: string | null;
  checkOut: string | null;
  adults: number;
  children: number;
  rooms: number;
} {
  const p = new URLSearchParams(queryString);
  let adults = 0;
  let children = 0;
  let rooms = 0;
  for (let i = 0; i < 9; i++) {
    const a = p.get(`rooms-${i}-adultCount`);
    if (a === null) break;
    rooms += 1;
    adults += Number(a);
    children += Number(p.get(`rooms-${i}-childCount`) ?? 0);
  }
  return {
    destination: `${p.get('destination-regionNameLn') ?? ''}(${p.get('destination-regionNameEn') ?? ''})`,
    checkIn: p.get('checkInDate'),
    checkOut: p.get('checkOutDate'),
    adults,
    children,
    rooms,
  };
}
