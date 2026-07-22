'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { serializeActivitySearch } from '@/features/search/serializeNonHotel';

const ACTIVITY_CATEGORIES = [
  { cls: 'wifi', label: 'WIFI&SIM카드' },
  { cls: 'ticket', label: '티켓/패스' },
  { cls: 'restaurant', label: '맛집' },
  { cls: 'service', label: '여행서비스' },
  { cls: 'tour', label: '투어' },
  { cls: 'pickup', label: '픽업/샌딩' },
  { cls: 'experience', label: '체험' },
  { cls: 'golf', label: '골프' },
];

/** 액티비티 검색 패널 — 여행지/상품명 입력 + 카테고리 선택 후 검색 */
export default function ActivitySearchPanel() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [category, setCategory] = useState<string | null>(null);

  const canSearch = text.trim().length > 0 || category !== null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSearch) return;
    router.push(serializeActivitySearch({ destinationText: text, category }));
  };

  return (
    <form noValidate onSubmit={submit}>
      <div className="activity-search-condition">
        <ul className="search-condition">
          <li>
            <div className="condition-column">
              <span className="title">
                여행지
                <br />
                상품명
              </span>
              <input
                type="text"
                placeholder="여행지 또는 상품명 입력"
                autoComplete="off"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
          </li>
        </ul>
        <ul className="activity-category">
          {ACTIVITY_CATEGORIES.map((c) => (
            <li key={c.cls}>
              <button
                type="button"
                className={`btn-activity-category-${c.cls}${category === c.label ? ' active' : ''}`}
                onClick={() => setCategory((cur) => (cur === c.label ? null : c.label))}
              >
                <span>{c.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="btn-host app-button-host">
          <button className="btn primary lg" type="submit" disabled={!canSearch}>
            {' '}
            액티비티 검색{' '}
          </button>
        </div>
      </div>
    </form>
  );
}
