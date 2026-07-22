'use client';

import { MAJOR_AIRPORT_COLUMNS, MAJOR_AIRPORT_GROUPS } from '@/mocks/airports';

/** 항공/렌터카 주요 공항 팝오버 — 호텔 MajorCityPopover와 동일 구조, 공항 목록 */
export default function AirportPopover({
  onSelect,
  positionStyle,
}: {
  onSelect: (cityName: string) => void;
  positionStyle?: React.CSSProperties;
}) {
  return (
    <div className="major-city-list-wrap modal-wrap" style={positionStyle ?? { left: 30, top: 103 }}>
      <div className="layer-major-city">
        <h1 className="title">주요 도시 바로 선택</h1>
        <p className="text sub-title">다른 도시를 찾는다면 검색창에 입력해 보세요</p>
        <table className="table-list">
          <caption> 주요공항 리스트 </caption>
          <colgroup>
            {Array.from({ length: MAJOR_AIRPORT_COLUMNS }, (_, i) => (
              <col key={i} />
            ))}
          </colgroup>
          <tbody>
            {MAJOR_AIRPORT_GROUPS.flatMap(({ group, cities }) => {
              const rowCount = Math.ceil(cities.length / MAJOR_AIRPORT_COLUMNS);
              return Array.from({ length: rowCount }, (_, row) => {
                const slice = cities.slice(row * MAJOR_AIRPORT_COLUMNS, (row + 1) * MAJOR_AIRPORT_COLUMNS);
                const cells = [...slice, ...Array.from({ length: MAJOR_AIRPORT_COLUMNS - slice.length }, () => null)];
                return (
                  <tr key={`${group}-${row}`}>
                    {row === 0 && (
                      <th scope="row" rowSpan={rowCount}>
                        {' '}
                        {group}{' '}
                      </th>
                    )}
                    {cells.map((c, i) => (
                      <td key={i}>
                        {c && (
                          <button type="button" title={c} onClick={() => onSelect(c)}>
                            {' '}
                            {c}{' '}
                          </button>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              });
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
