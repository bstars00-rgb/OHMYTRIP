'use client';

import { useState } from 'react';
import { HOTELS } from '@/mocks/hotels';

interface FilterSidebarProps {
  keyword: string;
  onKeywordChange: (v: string) => void;
  starFilters: string[];
  onToggleStar: (starText: string) => void;
  onReset: () => void;
}

/** 성급 필터 — 원본은 5→1성급 고정 노출. 최저가는 Mock 데이터에서 산출(없으면 생략) */
const STAR_ROWS = ['5성급', '4성급', '3성급', '2성급', '1성급'].map((label) => {
  const grade = parseFloat(label);
  const prices = HOTELS.filter((h) => Math.round(parseFloat(h.starText)) === grade).map((h) => h.price);
  return { label, lowest: prices.length ? Math.min(...prices) : null };
});

const PROPERTY_TYPES = ['Hotel', 'Guesthouse', 'Motel', 'Aparthotel', 'Hostel/Backpacker Accommodation'];
const MEALS = [
  { label: '조식 포함', count: 15 },
  { label: '조식 미포함', count: 263 },
];
const CHAINS = [
  { name: 'NINE TREE', lowest: 483465 },
  { name: 'Designers', lowest: 186807 },
  { name: 'Hotel Story', lowest: 144640 },
  { name: 'Accor', lowest: 592638 },
  { name: 'Yanolja', lowest: 109173 },
];

const priceBounds = {
  min: Math.min(...HOTELS.map((h) => h.price)),
  max: Math.max(...HOTELS.map((h) => h.price)),
};

/** 원본 article#aside.filter 미러링 (가격 슬라이더는 정적 표현 + 입력 적용) */
export default function FilterSidebar({ keyword, onKeywordChange, starFilters, onToggleStar, onReset }: FilterSidebarProps) {
  const [searchText, setSearchText] = useState(keyword);

  return (
    <article id="aside" className="filter">
      <button type="button" className="btn-map-view">
        <span>지도에서 보기</span>
      </button>
      <div className="filter-title">
        <strong>결과 내 검색</strong>
        <button
          type="button"
          className="btn-filter-reset"
          onClick={() => {
            setSearchText('');
            onReset();
          }}
        >
          {' '}
          초기화{' '}
        </button>
      </div>
      <div className="filter-search">
        <div className="input search lg line">
          <input
            type="text"
            placeholder="찾고 있는 호텔명을 입력하세요."
            autoComplete="off"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onKeywordChange(searchText)}
          />
          <button className="ico-search" onClick={() => onKeywordChange(searchText)} />
        </div>
      </div>
      <details open className="accordion filter">
        <summary className="accordion-header">가격대</summary>
        <div className="accordion-body">
          <div className="range">
            <div className="range-inputs">
              <div className="input-wrapper">
                <div className="input md">
                  <input type="text" placeholder={priceBounds.min.toLocaleString()} style={{ padding: '0px 10px' }} />
                </div>
              </div>
              <span className="range-inputs-separator">~</span>
              <div className="input-wrapper">
                <div className="input md">
                  <input type="text" placeholder={priceBounds.max.toLocaleString()} style={{ padding: '0px 10px' }} />
                </div>
              </div>
              <button className="range-search-btn" type="button">
                적용
              </button>
            </div>
            <div className="custom-slider">
              <div className="ngx-slider animate">
                <span className="ngx-slider-span ngx-slider-bar-wrapper ngx-slider-full-bar">
                  <span className="ngx-slider-span ngx-slider-bar" />
                </span>
                <span
                  className="ngx-slider-span ngx-slider-bar-wrapper ngx-slider-selection-bar"
                  style={{ left: 6, width: 296 }}
                >
                  <span className="ngx-slider-span ngx-slider-bar ngx-slider-selection" />
                </span>
                <span className="ngx-slider-span ngx-slider-pointer ngx-slider-pointer-min" style={{ left: 0 }} />
                <span className="ngx-slider-span ngx-slider-pointer ngx-slider-pointer-max" style={{ left: 296 }} />
                <span className="ngx-slider-span ngx-slider-bubble ngx-slider-limit ngx-slider-floor" style={{ left: 0 }}>
                  {priceBounds.min.toLocaleString()}원
                </span>
                <span className="ngx-slider-span ngx-slider-bubble ngx-slider-limit ngx-slider-ceil" style={{ left: 228 }}>
                  {priceBounds.max.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>
        </div>
      </details>
      <details open className="accordion filter">
        <summary className="accordion-header">호텔 성급</summary>
        <div className="accordion-body">
          <ul className="vertical ul-filter-list price">
            {STAR_ROWS.map((r) => (
              <div key={r.label} className="checkbox-host">
                <li>
                  <label className="checkbox md ltr">
                    <input
                      className="control-input"
                      type="checkbox"
                      id={`starRatings_${r.label}`}
                      checked={starFilters.includes(r.label)}
                      onChange={() => onToggleStar(r.label)}
                    />
                    <span className="control-text" title={r.label}>
                      {' '}
                      {r.label}{' '}
                    </span>
                  </label>
                  {r.lowest !== null && <span className="price">₩ {r.lowest.toLocaleString()} ~</span>}
                </li>
              </div>
            ))}
          </ul>
        </div>
      </details>
      <details open className="accordion filter">
        <summary className="accordion-header">숙소 유형</summary>
        <div className="accordion-body">
          <ul className="vertical ul-filter-list shorten">
            {PROPERTY_TYPES.map((t) => (
              <div key={t} className="checkbox-host">
                <li>
                  <label className="checkbox md ltr">
                    <input className="control-input" type="checkbox" id={`hotelTypes_${t}`} />
                    <span className="control-text" title={t}>
                      {' '}
                      {t}{' '}
                    </span>
                  </label>
                </li>
              </div>
            ))}
          </ul>
          <button type="button" className="btn-filter-extend">
            {' '}
            더보기{' '}
          </button>
        </div>
      </details>
      <details open className="accordion filter">
        <summary className="accordion-header">식사</summary>
        <div className="accordion-body">
          <ul className="vertical ul-filter-list price">
            {MEALS.map((m) => (
              <li key={m.label}>
                <label className="checkbox md ltr">
                  <input className="control-input" type="checkbox" id={`meals_${m.label}`} />
                  <span className="control-text" title={m.label}>
                    {' '}
                    {m.label}{' '}
                  </span>
                </label>
                <span className="price">{m.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </details>
      <details open className="accordion filter">
        <summary className="accordion-header">호텔 체인</summary>
        <div className="accordion-body">
          <ul className="vertical ul-filter-list price shorten">
            {CHAINS.map((c) => (
              <div key={c.name} className="checkbox-host">
                <li>
                  <label className="checkbox md ltr">
                    <input className="control-input" type="checkbox" id={`chains_${c.name}`} />
                    <span className="control-text" title={c.name}>
                      {' '}
                      {c.name}{' '}
                    </span>
                  </label>
                  <span className="price">₩ {c.lowest.toLocaleString()} ~</span>
                </li>
              </div>
            ))}
          </ul>
          <button type="button" className="btn-filter-extend">
            {' '}
            더보기{' '}
          </button>
        </div>
      </details>
    </article>
  );
}
