'use client';

import type { MockHotel } from '@/mocks/hotels';
import StarRating from '@/components/hotel/StarRating';

/** 원본 .hotel-list-item (850×170 가로 카드) 미러링 */
export default function HotelListItem({ hotel, onSelect }: { hotel: MockHotel; onSelect: () => void }) {
  return (
    <div className="hotel-list-item">
      <div
        className="hotel-image"
        style={{
          backgroundImage: `url("${hotel.imageUrl}"), url("/assets/images/common/ico-nodata-image@2x.png")`,
        }}
      >
        {hotel.recommended && <span className="comm-label rounded primary">추천</span>}
      </div>
      <div className="hotel-information">
        <div className="information">
          <p className="hotel-name" title={hotel.nameLn}>
            {' '}
            {hotel.nameLn}{' '}
          </p>
          <p className="hotel-name2" title={hotel.nameEn}>
            {' '}
            {hotel.nameEn}{' '}
          </p>
          <p className="hotel-option">
            <StarRating starClass={hotel.starClass} starText={hotel.starText} />
          </p>
          <div className="control">
            <div className="price">
              {hotel.originPrice && (
                <div className="origin">
                  <strong className="origin-price">{hotel.originPrice.toLocaleString()} 원</strong>
                </div>
              )}
              <div>
                <strong>{hotel.price.toLocaleString()}</strong>
                <span>원</span>
              </div>
            </div>
            <button type="button" className="btn md line default hover-secondary" onClick={onSelect}>
              {' '}
              선택{' '}
            </button>
          </div>
        </div>
      </div>
      <button type="button" title="관심상품" className="btn-list-wish">
        {' '}
        관심상품{' '}
      </button>
    </div>
  );
}
