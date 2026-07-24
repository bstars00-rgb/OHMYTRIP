import type { GolfPackage } from '@/mocks/golf/types';
import { PACKAGES, discountPct } from '@/mocks/golf/data';

export type SortKey = 'recommended' | 'price-low' | 'rating' | 'popular' | 'distance' | 'discount';

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'recommended', label: '추천순' },
  { key: 'price-low', label: '낮은 가격순' },
  { key: 'rating', label: '평점 높은순' },
  { key: 'popular', label: '인기순' },
  { key: 'distance', label: '골프장 거리순' },
  { key: 'discount', label: '할인율순' },
];

export interface GolfFilters {
  destination?: string; // city name
  priceMax?: number;
  nights?: number[]; // allowed nights
  rounds?: number[]; // allowed rounds
  hotelRating?: number[]; // e.g. [4,5]
  reviewMin?: number; // reviewScore min
  meals?: ('breakfast' | 'all-inclusive')[];
  amenities?: string[]; // 'airportTransfer','cartIncluded','caddieIncluded','freeCancellation','instantConfirmation','beginnerFriendly','groupFriendly'
  maxDriveMin?: number;
  deals?: boolean;
}

export function filterPackages(all: GolfPackage[], f: GolfFilters): GolfPackage[] {
  return all.filter((p) => {
    if (f.destination && p.destination.toLowerCase() !== f.destination.toLowerCase()) return false;
    if (f.priceMax !== undefined && p.salePriceUSD > f.priceMax) return false;
    if (f.nights && f.nights.length && !f.nights.includes(p.nights)) return false;
    if (f.rounds && f.rounds.length && !f.rounds.includes(p.rounds)) return false;
    if (f.hotelRating && f.hotelRating.length && !f.hotelRating.includes(p.hotelRating)) return false;
    if (f.reviewMin !== undefined && p.reviewScore < f.reviewMin) return false;
    if (f.meals && f.meals.length) {
      if (f.meals.includes('all-inclusive') && !p.allInclusive) return false;
      if (f.meals.includes('breakfast') && !p.breakfast) return false;
    }
    if (f.amenities && f.amenities.length) {
      for (const a of f.amenities) {
        if (a === 'airportTransfer' && !p.airportTransfer) return false;
        if (a === 'cartIncluded' && !p.cartIncluded) return false;
        if (a === 'caddieIncluded' && !p.caddieIncluded) return false;
        if (a === 'freeCancellation' && !p.freeCancellation) return false;
        if (a === 'instantConfirmation' && !p.instantConfirmation) return false;
        if (a === 'beginnerFriendly' && !p.beginnerFriendly) return false;
        if (a === 'groupFriendly' && !p.groupFriendly) return false;
        if (a === 'allInclusive' && !p.allInclusive) return false;
      }
    }
    if (f.maxDriveMin !== undefined && p.transferTimeMin > f.maxDriveMin) return false;
    if (f.deals && discountPct(p) < 18) return false;
    return true;
  });
}

export function sortPackages(list: GolfPackage[], sort: SortKey): GolfPackage[] {
  const arr = [...list];
  switch (sort) {
    case 'price-low':
      return arr.sort((a, b) => a.salePriceUSD - b.salePriceUSD);
    case 'rating':
      return arr.sort((a, b) => b.reviewScore - a.reviewScore);
    case 'popular':
      return arr.sort((a, b) => b.reviewCount - a.reviewCount);
    case 'distance':
      return arr.sort((a, b) => a.transferTimeMin - b.transferTimeMin);
    case 'discount':
      return arr.sort((a, b) => discountPct(b) - discountPct(a));
    default:
      return arr.sort((a, b) => Number(b.bestSeller ?? false) - Number(a.bestSeller ?? false) || b.reviewScore - a.reviewScore);
  }
}

/** URLSearchParams → GolfFilters */
export function parseFilters(params: URLSearchParams): { filters: GolfFilters; sort: SortKey } {
  const num = (v: string | null) => (v ? Number(v) : undefined);
  const list = (v: string | null) => (v ? v.split(',').filter(Boolean) : []);
  const nums = (v: string | null) => list(v).map(Number);
  return {
    filters: {
      destination: params.get('destination') ?? undefined,
      priceMax: num(params.get('priceMax')),
      nights: nums(params.get('nights')),
      rounds: nums(params.get('rounds')),
      hotelRating: nums(params.get('hotelRating')),
      reviewMin: num(params.get('reviewMin')),
      meals: list(params.get('meals')) as GolfFilters['meals'],
      amenities: list(params.get('amenities')),
      maxDriveMin: num(params.get('maxDrive')),
      deals: params.get('deals') === '1',
    },
    sort: (params.get('sort') as SortKey) || 'recommended',
  };
}

export function priceBounds(): { min: number; max: number } {
  const prices = PACKAGES.map((p) => p.salePriceUSD);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}
