'use client';

import type { GolfFilters } from '@/features/golf/search';
import { priceBounds } from '@/features/golf/search';
import { usePrefs } from '@/features/golf/GolfProviders';

const AMENITIES: { key: string; label: string }[] = [
  { key: 'allInclusive', label: 'All Inclusive' },
  { key: 'airportTransfer', label: 'Airport Transfer' },
  { key: 'cartIncluded', label: 'Cart Included' },
  { key: 'caddieIncluded', label: 'Caddie Included' },
  { key: 'freeCancellation', label: 'Free Cancellation' },
  { key: 'instantConfirmation', label: 'Instant Confirmation' },
  { key: 'beginnerFriendly', label: 'Beginner Friendly' },
  { key: 'groupFriendly', label: 'Group Friendly' },
];

const toggle = (arr: (string | number)[] | undefined, v: string | number): (string | number)[] => {
  const a = arr ?? [];
  return a.includes(v) ? a.filter((x) => x !== v) : [...a, v];
};

/** 필터 컨트롤 (사이드바 & bottom-sheet 공용) */
export default function FilterControls({ filters, onChange }: { filters: GolfFilters; onChange: (f: GolfFilters) => void }) {
  const { fx } = usePrefs();
  const bounds = priceBounds();
  const priceMax = filters.priceMax ?? bounds.max;

  return (
    <>
      <div className="g-filter-group">
        <h4>Price (per person)</h4>
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
          <span>Up to {fx(priceMax)}</span>
        </div>
      </div>

      <div className="g-filter-group">
        <h4>Nights</h4>
        {[2, 3, 4, 5].map((n) => (
          <label key={n} className="g-check">
            <input type="checkbox" checked={(filters.nights ?? []).includes(n)} onChange={() => onChange({ ...filters, nights: toggle(filters.nights, n) as number[] })} />
            {n} nights
          </label>
        ))}
      </div>

      <div className="g-filter-group">
        <h4>Rounds</h4>
        {[2, 3].map((r) => (
          <label key={r} className="g-check">
            <input type="checkbox" checked={(filters.rounds ?? []).includes(r)} onChange={() => onChange({ ...filters, rounds: toggle(filters.rounds, r) as number[] })} />
            {r} rounds
          </label>
        ))}
      </div>

      <div className="g-filter-group">
        <h4>Hotel rating</h4>
        {[5, 4].map((s) => (
          <label key={s} className="g-check">
            <input type="checkbox" checked={(filters.hotelRating ?? []).includes(s)} onChange={() => onChange({ ...filters, hotelRating: toggle(filters.hotelRating, s) as number[] })} />
            {s} stars
          </label>
        ))}
      </div>

      <div className="g-filter-group">
        <h4>Guest rating</h4>
        {[9, 8].map((r) => (
          <label key={r} className="g-check">
            <input type="radio" name="reviewMin" checked={filters.reviewMin === r} onChange={() => onChange({ ...filters, reviewMin: r })} />
            {r}+ Excellent
          </label>
        ))}
        <label className="g-check">
          <input type="radio" name="reviewMin" checked={!filters.reviewMin} onChange={() => onChange({ ...filters, reviewMin: undefined })} />
          Any
        </label>
      </div>

      <div className="g-filter-group">
        <h4>Meals</h4>
        <label className="g-check">
          <input type="checkbox" checked={(filters.meals ?? []).includes('breakfast')} onChange={() => onChange({ ...filters, meals: toggle(filters.meals, 'breakfast') as GolfFilters['meals'] })} />
          Breakfast included
        </label>
        <label className="g-check">
          <input type="checkbox" checked={(filters.meals ?? []).includes('all-inclusive')} onChange={() => onChange({ ...filters, meals: toggle(filters.meals, 'all-inclusive') as GolfFilters['meals'] })} />
          All inclusive
        </label>
      </div>

      <div className="g-filter-group">
        <h4>Package includes</h4>
        {AMENITIES.map((a) => (
          <label key={a.key} className="g-check">
            <input type="checkbox" checked={(filters.amenities ?? []).includes(a.key)} onChange={() => onChange({ ...filters, amenities: toggle(filters.amenities, a.key) as string[] })} />
            {a.label}
          </label>
        ))}
      </div>

      <div className="g-filter-group">
        <h4>Max drive to course</h4>
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
          <span>5 min</span>
          <span>Up to {filters.maxDriveMin ?? 45} min</span>
        </div>
      </div>
    </>
  );
}
