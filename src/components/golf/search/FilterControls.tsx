'use client';

import type { GolfFilters } from '@/features/golf/search';
import { priceBounds } from '@/features/golf/search';
import { usePrefs } from '@/features/golf/GolfProviders';

const AMENITY_KEYS = ['allInclusive', 'airportTransfer', 'cartIncluded', 'caddieIncluded', 'freeCancellation', 'instantConfirmation', 'beginnerFriendly', 'groupFriendly'];

const WELLNESS = [
  { key: 'onsen', label: '온천' },
  { key: 'spa', label: '스파·사우나' },
  { key: 'pool', label: '수영장' },
  { key: 'meals', label: '조·석식 포함' },
  { key: 'walkable', label: '클럽하우스 근접' },
];

const toggle = (arr: (string | number)[] | undefined, v: string | number): (string | number)[] => {
  const a = arr ?? [];
  return a.includes(v) ? a.filter((x) => x !== v) : [...a, v];
};

/** 필터 컨트롤 (사이드바 & bottom-sheet 공용) */
export default function FilterControls({ filters, onChange }: { filters: GolfFilters; onChange: (f: GolfFilters) => void }) {
  const { fx, t } = usePrefs();
  const bounds = priceBounds();
  const priceMax = filters.priceMax ?? bounds.max;

  return (
    <>
      <div className="g-filter-group">
        <h4>여성친화 시설</h4>
        <div className="g-wellness-chips">
          {WELLNESS.map((w) => (
            <button
              key={w.key}
              type="button"
              className={`g-wellness-chip${(filters.wellness ?? []).includes(w.key) ? ' is-active' : ''}`}
              onClick={() => onChange({ ...filters, wellness: toggle(filters.wellness, w.key) as string[] })}
            >
              {w.label}
            </button>
          ))}
        </div>
      </div>

      <div className="g-filter-group">
        <h4>{t('filter.price')}</h4>
        <input
          className="g-range"
          type="range"
          min={bounds.min}
          max={bounds.max}
          step={20}
          value={priceMax}
          onChange={(e) => onChange({ ...filters, priceMax: Number(e.target.value) })}
        />
        <div className="g-range-val">
          <span>{fx(bounds.min)}</span>
          <span>{t('filter.upTo', { v: fx(priceMax) })}</span>
        </div>
      </div>

      <div className="g-filter-group">
        <h4>{t('filter.nights')}</h4>
        {[2, 3, 4, 5].map((n) => (
          <label key={n} className="g-check">
            <input type="checkbox" checked={(filters.nights ?? []).includes(n)} onChange={() => onChange({ ...filters, nights: toggle(filters.nights, n) as number[] })} />
            {t('filter.nightsN', { n })}
          </label>
        ))}
      </div>

      <div className="g-filter-group">
        <h4>{t('filter.rounds')}</h4>
        {[2, 3].map((r) => (
          <label key={r} className="g-check">
            <input type="checkbox" checked={(filters.rounds ?? []).includes(r)} onChange={() => onChange({ ...filters, rounds: toggle(filters.rounds, r) as number[] })} />
            {t('filter.roundsN', { n: r })}
          </label>
        ))}
      </div>

      <div className="g-filter-group">
        <h4>{t('filter.hotelRating')}</h4>
        {[5, 4].map((s) => (
          <label key={s} className="g-check">
            <input type="checkbox" checked={(filters.hotelRating ?? []).includes(s)} onChange={() => onChange({ ...filters, hotelRating: toggle(filters.hotelRating, s) as number[] })} />
            {t('filter.starsN', { n: s })}
          </label>
        ))}
      </div>

      <div className="g-filter-group">
        <h4>{t('filter.guestRating')}</h4>
        {[9, 8].map((r) => (
          <label key={r} className="g-check">
            <input type="radio" name="reviewMin" checked={filters.reviewMin === r} onChange={() => onChange({ ...filters, reviewMin: r })} />
            {t('filter.excellent', { n: r })}
          </label>
        ))}
        <label className="g-check">
          <input type="radio" name="reviewMin" checked={!filters.reviewMin} onChange={() => onChange({ ...filters, reviewMin: undefined })} />
          {t('filter.any')}
        </label>
      </div>

      <div className="g-filter-group">
        <h4>{t('filter.meals')}</h4>
        <label className="g-check">
          <input type="checkbox" checked={(filters.meals ?? []).includes('breakfast')} onChange={() => onChange({ ...filters, meals: toggle(filters.meals, 'breakfast') as GolfFilters['meals'] })} />
          {t('filter.breakfast')}
        </label>
        <label className="g-check">
          <input type="checkbox" checked={(filters.meals ?? []).includes('all-inclusive')} onChange={() => onChange({ ...filters, meals: toggle(filters.meals, 'all-inclusive') as GolfFilters['meals'] })} />
          {t('filter.allInclusive')}
        </label>
      </div>

      <div className="g-filter-group">
        <h4>{t('filter.includes')}</h4>
        {AMENITY_KEYS.map((key) => (
          <label key={key} className="g-check">
            <input type="checkbox" checked={(filters.amenities ?? []).includes(key)} onChange={() => onChange({ ...filters, amenities: toggle(filters.amenities, key) as string[] })} />
            {t(`amenity.${key}`)}
          </label>
        ))}
      </div>

      <div className="g-filter-group">
        <h4>{t('filter.maxDrive')}</h4>
        <input
          className="g-range"
          type="range"
          min={5}
          max={45}
          step={5}
          value={filters.maxDriveMin ?? 45}
          onChange={(e) => onChange({ ...filters, maxDriveMin: Number(e.target.value) })}
        />
        <div className="g-range-val">
          <span>{t('filter.minUnit', { n: 5 })}</span>
          <span>{t('filter.upToMin', { n: filters.maxDriveMin ?? 45 })}</span>
        </div>
      </div>
    </>
  );
}
