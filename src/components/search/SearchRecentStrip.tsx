'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadRecentSearches, parseRecentSearch, type RecentSearchItem } from '@/features/search/recentSearch';
import { formatConditionRange, nightsBetween } from '@/utils/date';

/**
 * 최근 검색 스트립 — 원본 app-search-recent 위치/클래스 재현.
 * 내부 카드 마크업은 원본 CSS(.recent-contents dl 구조)에서 역추론 (Known Difference).
 */
export default function SearchRecentStrip() {
  const router = useRouter();
  const [items, setItems] = useState<RecentSearchItem[]>([]);

  useEffect(() => {
    // 마운트 후 로드(SSR 불일치 방지)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(loadRecentSearches().slice(0, 3));
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="search-recent-host">
      <div className="search-recent">
        <ul className="list" style={{ display: 'flex', gap: 20 }}>
          {items.map((item) => {
            const info = parseRecentSearch(item.queryString);
            const dateText =
              info.checkIn && info.checkOut
                ? `${formatConditionRange(info.checkIn, info.checkOut)}, ${nightsBetween(info.checkIn, info.checkOut)}박`
                : '';
            const guestText = `객실 ${info.rooms}개 / 성인 ${info.adults}명${info.children ? `, 아동 ${info.children}명` : ''}`;
            return (
              <li key={item.id} style={{ flex: '1 1 0', minWidth: 0 }}>
                <button
                  type="button"
                  className="recent-contents"
                  style={{ width: '100%' }}
                  onClick={() => router.push(`/hotel/search-result?${item.queryString}`)}
                >
                  <dl>
                    <dt>
                      <strong>{info.destination}</strong>
                    </dt>
                    <dd>{dateText}</dd>
                    <dd>{guestText}</dd>
                  </dl>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
