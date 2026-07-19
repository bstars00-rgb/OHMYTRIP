'use client';

import type { Destination } from '@/types/search';

interface AutocompletePopoverProps {
  query: string;
  results: Destination[];
  onSelect: (d: Destination) => void;
}

/** 검색어 일치 부분을 span.focus로 강조 (원본 동작) */
function HighlightedName({ name, query }: { name: string; query: string }) {
  const idx = name.indexOf(query);
  if (idx === -1 || !query) return <span className="name">{name}</span>;
  return (
    <span className="name">
      {name.slice(0, idx)}
      <span className="focus">{name.slice(idx, idx + query.length)}</span>
      {name.slice(idx + query.length)}
    </span>
  );
}

/**
 * 원본 자동완성 팝오버 미러링:
 * .search-result-wrap.modal-wrap > .layer-destination > ul > li >
 * button.destination-item.(city|hotel) > span.name + span.name2
 */
export default function AutocompletePopover({ query, results, onSelect }: AutocompletePopoverProps) {
  return (
    <div className="search-result-wrap modal-wrap" style={{ top: 103 }}>
      <div className="layer-destination">
        <ul>
          {results.map((d) => (
            <li key={`${d.type}-${d.regionCode}-${d.hotelCode ?? d.nameEn}`}>
              <button
                type="button"
                className={`destination-item ${d.iconType}`}
                onClick={() => onSelect(d)}
              >
                <HighlightedName name={d.nameLn} query={query} />
                <span className="name2">
                  {' '}
                  {d.nameEn}, {d.countryNameEn}{' '}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
