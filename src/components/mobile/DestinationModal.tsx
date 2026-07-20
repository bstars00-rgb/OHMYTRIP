'use client';

import { useState } from 'react';
import type { Destination } from '@/types/search';
import { MAJOR_CITY_GROUPS, findCityByName } from '@/mocks/destinations';
import { searchDestinations } from '@/services/api/destination.service';

interface DestinationModalProps {
  onSelect: (d: Destination) => void;
  onClose: () => void;
}

/** 검색어 강조 (원본 span.focus) */
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
 * 원본 m. 목적지 검색 전체 화면 모달 미러링:
 * .modal.md.type1 > .modal-contents > .modal-header + .modal-body >
 *   .mo-search-destination(.input-destination) + .major-city-list(.city-group×8) | .result-destination
 */
export default function DestinationModal({ onSelect, onClose }: DestinationModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Destination[]>([]);

  const handleChange = async (value: string) => {
    setQuery(value);
    if (value.trim().length >= 2) {
      setResults(await searchDestinations(value));
    } else {
      setResults([]);
    }
  };

  const selectCity = (name: string) => {
    const d = findCityByName(name);
    if (d) onSelect(d);
  };

  const showResults = query.trim().length >= 2 && results.length > 0;

  return (
    <div className="modal md type1">
      <div className="modal-contents">
        <div className="modal-header">
          <h1 className="title">목적지 검색</h1>
          <button type="button" title="닫기" className="btn-modal-close" onClick={onClose}>
            {' '}
            닫기{' '}
          </button>
        </div>
        <div className="modal-body">
          <div className="mo-search-destination">
            <div className="destination-header">
              <div className="input-destination">
                <input
                  type="text"
                  placeholder="도시명 또는 호텔명 입력"
                  value={query}
                  onChange={(e) => handleChange(e.target.value)}
                />
                {query && (
                  <button type="button" className="btn-input-clear" onClick={() => handleChange('')}>
                    {' '}
                    입력값삭제{' '}
                  </button>
                )}
              </div>
            </div>
          </div>
          {showResults ? (
            <div className="result-destination">
              <h2 className="title">검색 결과</h2>
              <ul className="destination-list">
                {results.map((d) => (
                  <li key={`${d.type}-${d.regionCode}-${d.hotelCode ?? d.nameEn}`}>
                    <button type="button" className={`destination-item ${d.iconType}`} onClick={() => onSelect(d)}>
                      <HighlightedName name={d.nameLn} query={query.trim()} />
                      <span className="name2">
                        {' '}
                        {d.nameEn}, {d.countryNameEn}{' '}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="major-city-list">
              <h1 className="title">주요 도시 바로 선택</h1>
              <p className="text sub-title">다른 도시를 찾는다면 검색창에 입력해 보세요</p>
              {MAJOR_CITY_GROUPS.map(({ group, cities }) => (
                <div key={group} className="city-group">
                  <h2 className="contents-title lg">
                    <strong>{group}</strong>
                  </h2>
                  <ul className="city-list">
                    {cities.map((c) => (
                      <li key={c}>
                        <button type="button" className="btn-city" onClick={() => selectCity(c)}>
                          <span>{c}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
