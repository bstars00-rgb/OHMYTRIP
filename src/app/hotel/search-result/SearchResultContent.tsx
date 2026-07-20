'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { MockHotel } from '@/mocks/hotels';
import type { SortOrder } from '@/services/api/hotel.service';
import { searchHotels } from '@/services/api/hotel.service';
import { formatConditionRange } from '@/utils/date';
import { nightsBetween } from '@/utils/date';
import PageStepHeader from '@/components/hotel/PageStepHeader';
import FilterSidebar from '@/components/hotel/FilterSidebar';
import HotelListItem from '@/components/hotel/HotelListItem';
import Pagination from '@/components/common/Pagination';

const SORT_OPTIONS: SortOrder[] = ['추천순', '높은 등급 순', '낮은 등급 순', '높은 가격 순', '낮은 가격 순'];

/** 원본 총 건수 표기 재현(Mock 규모와 무관하게 원본 실측값 노출 시 오해 소지 → Mock 건수 사용) */
export default function SearchResultContent() {
  const router = useRouter();
  const params = useSearchParams();
  const destinationLn = params.get('destination-regionNameLn') ?? '';
  const destinationEn = params.get('destination-regionNameEn') ?? '';
  const checkIn = params.get('checkInDate');
  const checkOut = params.get('checkOutDate');

  const [sort, setSort] = useState<SortOrder>('추천순');
  const [keyword, setKeyword] = useState('');
  const [starFilters, setStarFilters] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [hotels, setHotels] = useState<MockHotel[]>([]);

  useEffect(() => {
    let alive = true;
    searchHotels({ sort, keyword, starFilters })
      .then((list) => {
        if (alive) setHotels(list);
      })
      .catch(() => {
        if (alive) setHotels([]);
      });
    return () => {
      alive = false;
    };
  }, [sort, keyword, starFilters]);

  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;
  const dateText = checkIn && checkOut ? formatConditionRange(checkIn, checkOut) : '';
  const guestText = (() => {
    let adults = 0;
    let children = 0;
    let rooms = 0;
    for (let i = 0; i < 9; i++) {
      const a = params.get(`rooms-${i}-adultCount`);
      if (a === null) break;
      rooms += 1;
      adults += Number(a);
      children += Number(params.get(`rooms-${i}-childCount`) ?? 0);
    }
    if (rooms === 0) return '객실 1개 / 성인 2명';
    const base = `객실 ${rooms}개 / 성인 ${adults}명`;
    return children > 0 ? `${base}, 아동 ${children}명` : base;
  })();

  const selectHotel = (hotel: MockHotel) => {
    const q = new URLSearchParams(params.toString());
    q.set('hotelCode', hotel.hotelCode);
    q.set('packageAbleYn', 'true');
    router.push(`/hotel/search-room-type?${q.toString()}`);
  };

  return (
    <>
      <section id="result-research-area">
        <article className="result-condition hotel">
          <div className="condition-column">
            <span className="title">목적지</span>
            <div className="text" title={`${destinationLn}(${destinationEn})`}>
              {' '}
              {destinationLn}({destinationEn}){' '}
            </div>
          </div>
          <div className="condition-column">
            <span className="title">여행일정</span>
            <div className="text" title={`${dateText}, ${nights}박`}>
              {' '}
              {dateText}, {nights}박{' '}
            </div>
          </div>
          <div className="condition-column">
            <span className="title">여행인원</span>
            <div className="text" title={guestText}>
              {' '}
              {guestText}{' '}
            </div>
          </div>
          <button type="button" className="btn-change-condition" onClick={() => router.push('/hotel')}>
            {' '}
            검색 변경{' '}
          </button>
        </article>
      </section>
      <section id="contents-area" className="search-result">
        <PageStepHeader activeStep={1}>
          <h1 className="title">
            <strong>{destinationLn}</strong>에서 묵을 호텔을 선택해 주세요.{' '}
          </h1>
          <p className="text">{dateText}</p>
        </PageStepHeader>
        <FilterSidebar
          keyword={keyword}
          onKeywordChange={(v) => {
            setKeyword(v);
            setPage(1);
          }}
          starFilters={starFilters}
          onToggleStar={(s) => {
            setStarFilters((f) => (f.includes(s) ? f.filter((x) => x !== s) : [...f, s]));
            setPage(1);
          }}
          onReset={() => {
            setKeyword('');
            setStarFilters([]);
            setPage(1);
          }}
        />
        <article className="contents">
          <div className="tab-header type2 between">
            {SORT_OPTIONS.map((s) => (
              <label key={s} className="tab-header-item">
                <input
                  type="radio"
                  className="tab-input"
                  name="sortType"
                  checked={sort === s}
                  onChange={() => setSort(s)}
                />
                <span className="tab-text">{s}</span>
              </label>
            ))}
          </div>
          <div className="list-summary mg-b20">
            <div className="total">
              {' '}
              총 <span className="num">{hotels.length}</span>건의 검색 결과{' '}
            </div>
            <button type="button" className="btn-compare">
              {' '}
              비교하기{' '}
            </button>
          </div>
          {hotels.map((h) => (
            <HotelListItem key={h.hotelCode} hotel={h} onSelect={() => selectHotel(h)} />
          ))}
          {hotels.length === 0 && (
            <div className="list-summary" style={{ justifyContent: 'center', padding: '60px 0' }}>
              <div className="total">검색 결과가 없습니다.</div>
            </div>
          )}
          <Pagination page={page} totalPages={Math.max(1, Math.ceil(hotels.length / 10))} onChange={setPage} />
        </article>
      </section>
    </>
  );
}
