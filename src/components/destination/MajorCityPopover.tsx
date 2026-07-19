'use client';

import { MAJOR_CITY_COLUMNS, MAJOR_CITY_GROUPS } from '@/mocks/destinations';

interface MajorCityPopoverProps {
  onSelectCity: (cityName: string) => void;
}

/**
 * 원본 "주요 도시 바로 선택" 팝오버 미러링:
 * .major-city-list-wrap.modal-wrap > .layer-major-city > table.table-list
 * (그룹명 th rowspan + 5열 버튼 그리드)
 */
export default function MajorCityPopover({ onSelectCity }: MajorCityPopoverProps) {
  return (
    <div className="major-city-list-wrap modal-wrap" style={{ left: 30, top: 103 }}>
      <div className="layer-major-city">
        <h1 className="title">주요 도시 바로 선택</h1>
        <p className="text sub-title">다른 도시를 찾는다면 검색창에 입력해 보세요</p>
        <table className="table-list">
          <caption> 주요도시 리스트 </caption>
          <colgroup>
            {Array.from({ length: MAJOR_CITY_COLUMNS }, (_, i) => (
              <col key={i} />
            ))}
          </colgroup>
          <tbody>
            {MAJOR_CITY_GROUPS.flatMap(({ group, cities }) => {
              const rowCount = Math.ceil(cities.length / MAJOR_CITY_COLUMNS);
              return Array.from({ length: rowCount }, (_, row) => {
                const slice = cities.slice(row * MAJOR_CITY_COLUMNS, (row + 1) * MAJOR_CITY_COLUMNS);
                const cells = [...slice, ...Array.from({ length: MAJOR_CITY_COLUMNS - slice.length }, () => null)];
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
                          <button type="button" title={c} onClick={() => onSelectCity(c)}>
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
