'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { MockHotel, MockHotelInfo, MockRoomType } from '@/mocks/hotels';
import { getHotelDetail } from '@/services/api/hotel.service';
import { formatItineraryDate } from '@/utils/date';
import PageStepHeader from '@/components/hotel/PageStepHeader';

const KO_DAYS = ['일', '월', '화', '수', '목', '금', '토'];
const dayLabel = (iso: string) => `${formatItineraryDate(iso)}(${KO_DAYS[new Date(`${iso}T00:00:00`).getDay()]})`;

export default function RoomTypeContent() {
  const params = useSearchParams();
  const hotelCode = params.get('hotelCode') ?? '886479';
  const checkIn = params.get('checkInDate');
  const checkOut = params.get('checkOutDate');

  const [detail, setDetail] = useState<{ hotel?: MockHotel; roomTypes: MockRoomType[]; info: MockHotelInfo } | null>(null);
  const [tab, setTab] = useState<'rooms' | 'info'>('rooms');

  useEffect(() => {
    let alive = true;
    getHotelDetail(hotelCode).then((d) => {
      if (alive) setDetail(d);
    });
    return () => {
      alive = false;
    };
  }, [hotelCode]);

  if (!detail) return null;
  const { hotel, roomTypes, info } = detail;

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

  return (
    <section id="contents-area" className="room-type">
      <PageStepHeader activeStep={2}>
        {hotel && (
          <p className="comm-rating mg-b10">
            <span aria-hidden="true" className={`rate-star md ${hotel.starClass}`}>
              {hotel.starText}
            </span>
          </p>
        )}
        <h1 className="title">
          <strong>{hotel?.nameLn ?? '호텔'}</strong>
        </h1>
        <p className="text"> {hotel?.nameEn} </p>
      </PageStepHeader>

      <article className="roomtype-thumb-gallery">
        <div className="main-thumb">
          <button
            type="button"
            title="상세이미지 보기"
            className="btn-thumb-view"
            style={{ backgroundImage: `url("${info.galleryImages[0]}"), url("/assets/images/common/ico-nodata-image@2x.png")` }}
          />
        </div>
        <ul className="sub-thumb">
          {info.galleryImages.slice(1).map((src) => (
            <li key={src}>
              <button
                type="button"
                title="상세이미지 보기"
                className="btn-thumb-view"
                count-num={`+${info.extraImageCount}`}
                style={{ backgroundImage: `url("${src}"), url("/assets/images/common/ico-nodata-image@2x.png")` }}
              />
            </li>
          ))}
        </ul>
      </article>

      <div className="tab-header type1">
        <label className="tab-header-item">
          <input type="radio" name="tab1" className="tab-input" checked={tab === 'rooms'} onChange={() => setTab('rooms')} />
          <span className="tab-text">객실요금</span>
        </label>
        <label className="tab-header-item">
          <input type="radio" name="tab1" className="tab-input" checked={tab === 'info'} onChange={() => setTab('info')} />
          <span className="tab-text">호텔정보</span>
        </label>
      </div>

      <article id="roomtype-list" className="repetition-item black" style={{ scrollMargin: 30 }}>
        <h2 className="contents-title line">
          {' '}
          객실요금<span>(세금, 봉사료 포함)</span>
        </h2>
        <form noValidate onSubmit={(e) => e.preventDefault()}>
          <div className="roomtype-search">
            <button type="button" className="btn-search-option">
              {' '}
              {guestText}{' '}
            </button>
            <button type="button" className="btn-search-option">
              {' '}
              체크인 {checkIn ? dayLabel(checkIn) : '-'}{' '}
            </button>
            <button type="button" className="btn-search-option">
              {' '}
              체크아웃 {checkOut ? dayLabel(checkOut) : '-'}{' '}
            </button>
            <button type="submit" className="btn lg inline primary">
              {' '}
              객실 검색{' '}
            </button>
          </div>
        </form>
        <div className="contents-item-box lg rounded-big">
          <ul className="roomtype-list">
            {roomTypes.map((r, i) => (
              <li key={`${r.vendorCode}-${i}`}>
                <div className="roomtype-list-item">
                  <span className="room-vendor-code">{r.vendorCode}</span>
                  <div className="room-information">
                    <p className="name">
                      <strong>{r.name}</strong>
                    </p>
                    <div className="room-option">
                      <span className="breakfast">{r.breakfast}</span>
                      {r.freeWifi && <span className="wifi">무료 WIFI</span>}
                    </div>
                    <div className="room-option">
                      <span> {r.amenities} </span>
                    </div>
                  </div>
                  <div className="refund-date"> {r.freeCancelUntil ?? '환불불가'} </div>
                  <div className="price">
                    {r.originPrice && (
                      <div className="origin">
                        <strong className="origin-price">{r.originPrice.toLocaleString()} 원</strong>
                      </div>
                    )}
                    <div>
                      <strong>{r.price.toLocaleString()}</strong>
                      <span>원</span>
                    </div>
                  </div>
                  <button type="button" title="장바구니" className="btn-cart md">
                    {' '}
                    장바구니{' '}
                  </button>
                  <div className="control">
                    <button type="button" className="btn md hover-secondary border">
                      {' '}
                      예약{' '}
                    </button>
                    {r.freeCancelUntil ? (
                      <strong className="available-refund">무료취소</strong>
                    ) : (
                      <strong className="unavailable-refund">환불불가</strong>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </article>

      <article id="roomtype-hotel-information" className="repetition-item black" style={{ scrollMargin: 30 }}>
        <h2 className="contents-title line">호텔정보</h2>
        <div className="contents-item-box rounded-big detail">
          <div className="map-area">
            {/* 원본은 Google Maps(agm-map) — 지도 연동은 upgrade-backlog, 자리표시 이미지 사용 */}
            <div
              style={{
                width: '100%',
                height: 465,
                background: `var(--c-gray-1) url(/omt-assets/bg-map-view.31e8f0527979f1ba.png) 50% 50% / cover no-repeat`,
                borderRadius: 'var(--radius-light)',
              }}
              aria-label="지도 자리표시"
            />
          </div>
          <div className="hotel-detail-information">
            <div className="available-time">
              <strong className="time">체크인 : {info.checkInTime}</strong>
              <strong className="time">체크아웃 : {info.checkOutTime}</strong>
            </div>
            <dl>
              <dt>주소</dt>
              <dd>{info.address}</dd>
            </dl>
            <dl>
              <dt>지역</dt>
              <dd>{info.region}</dd>
            </dl>
            <dl className="twin">
              <dt>전화</dt>
              <dd>{info.phone}</dd>
            </dl>
            <dl>
              <dt>인근명소</dt>
              {info.landmarks.map((l) => (
                <dd key={l.name} className="landmark">
                  <span className="name" title={l.name}>
                    {l.name}
                  </span>
                  <span className="distance"> {l.distance} </span>
                </dd>
              ))}
            </dl>
          </div>
        </div>
      </article>
    </section>
  );
}
