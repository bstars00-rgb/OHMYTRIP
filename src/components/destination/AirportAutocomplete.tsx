'use client';

import type { Airport } from '@/mocks/airports';

/** 항공/렌터카 공항 자동완성 — 원본 .search-result-wrap 구조 재사용 (아이콘: 공항) */
export default function AirportAutocomplete({
  results,
  onSelect,
  positionStyle,
}: {
  results: Airport[];
  onSelect: (a: Airport) => void;
  positionStyle?: React.CSSProperties;
}) {
  return (
    <div className="search-result-wrap modal-wrap" style={positionStyle ?? { top: 103 }}>
      <div className="layer-destination">
        <ul>
          {results.map((a) => (
            <li key={`${a.code}-${a.nameEn}`}>
              <button type="button" className="destination-item airport" onClick={() => onSelect(a)}>
                <span className="name">
                  {a.nameLn} ({a.code})
                </span>
                <span className="name2">
                  {' '}
                  {a.nameEn}, {a.countryNameEn}{' '}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
