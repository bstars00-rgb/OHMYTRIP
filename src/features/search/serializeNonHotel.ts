import type { Airport } from '@/mocks/airports';
import type { FlightPassengers } from '@/components/flight/FlightPassengerPopover';

export type FlightTripType = 'RT' | 'OW' | 'MC'; // 왕복 / 편도 / 다구간

export interface FlightSearchForm {
  tripType: FlightTripType;
  directOnly: boolean;
  origin: Airport | null;
  destination: Airport | null;
  departDate: string | null;
  returnDate: string | null;
  passengers: FlightPassengers;
}

/** 항공 검색 URL 직렬화 — 원본 result 라우트는 미클론이므로 조건 전달용 스킴 */
export function serializeFlightSearch(f: FlightSearchForm): string {
  if (!f.origin || !f.destination || !f.departDate) throw new Error('flight search needs origin/dest/depart');
  const p = new URLSearchParams();
  p.set('tripType', f.tripType);
  p.set('directOnly', String(f.directOnly));
  p.set('origin', f.origin.code);
  p.set('originName', f.origin.nameLn);
  p.set('destination', f.destination.code);
  p.set('destinationName', f.destination.nameLn);
  p.set('departDate', f.departDate);
  if (f.tripType === 'RT' && f.returnDate) p.set('returnDate', f.returnDate);
  p.set('adultCount', String(f.passengers.adult));
  p.set('childCount', String(f.passengers.child));
  p.set('infantCount', String(f.passengers.infant));
  p.set('seatClass', f.passengers.seatClass);
  return `/flight/search-result?${p.toString()}`;
}

export interface ActivitySearchForm {
  destinationText: string;
  category: string | null;
}

export function serializeActivitySearch(f: ActivitySearchForm): string {
  const p = new URLSearchParams();
  if (f.destinationText.trim()) p.set('keyword', f.destinationText.trim());
  if (f.category) p.set('category', f.category);
  return `/activity/search-result?${p.toString()}`;
}

export type InsuranceCode = 'NO' | 'GN' | 'LX' | 'PR';

export interface RentalcarSearchForm {
  sameReturn: boolean;
  pickup: Airport | null;
  driverBirthday: string;
  pickupDateTime: string | null;
  returnDateTime: string | null;
  insurance: InsuranceCode;
}

export function serializeRentalcarSearch(f: RentalcarSearchForm): string {
  if (!f.pickup || !f.pickupDateTime || !f.returnDateTime) throw new Error('rentalcar needs pickup/dates');
  const p = new URLSearchParams();
  p.set('sameReturn', String(f.sameReturn));
  p.set('pickup', f.pickup.code);
  p.set('pickupName', f.pickup.nameLn);
  if (f.driverBirthday) p.set('driverBirthday', f.driverBirthday);
  p.set('pickupDateTime', f.pickupDateTime);
  p.set('returnDateTime', f.returnDateTime);
  p.set('insurance', f.insurance);
  return `/rentalcar/search-result?${p.toString()}`;
}
