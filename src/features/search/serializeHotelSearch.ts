import type { HotelSearchForm } from '@/types/search';

/**
 * 원본 사이트의 호텔 검색 URL 쿼리 직렬화 재현.
 * 실측 예:
 * /hotel/search-result?checkInDate=2026-07-25&checkOutDate=2026-07-27
 *   &rooms-0-adultCount=2&rooms-0-childCount=1&rooms-0-childAges-0=5
 *   &dynamicRateYn=true&sortOrder=Recommend&limits-0=0&limits-1=10
 *   &destination-type=region&destination-iconType=city
 *   &destination-regionNameLn=서울&destination-regionNameEn=Seoul
 *   &destination-regionCode=102514&destination-countryNameEn=Korea
 *   &regionCode=102514&page=1
 */
export function serializeHotelSearch(form: HotelSearchForm): string {
  const { destination, checkInDate, checkOutDate, rooms } = form;
  if (!destination || !checkInDate || !checkOutDate) {
    throw new Error('serializeHotelSearch requires destination and dates');
  }
  const params = new URLSearchParams();
  params.set('checkInDate', checkInDate);
  params.set('checkOutDate', checkOutDate);
  rooms.forEach((room, i) => {
    params.set(`rooms-${i}-adultCount`, String(room.adultCount));
    params.set(`rooms-${i}-childCount`, String(room.childAges.length));
    room.childAges.forEach((age, j) => {
      if (age !== null) params.set(`rooms-${i}-childAges-${j}`, String(age));
    });
  });
  params.set('dynamicRateYn', 'true');
  params.set('sortOrder', 'Recommend');
  params.set('limits-0', '0');
  params.set('limits-1', '10');
  params.set('destination-type', destination.type);
  params.set('destination-iconType', destination.iconType);
  params.set('destination-regionNameLn', destination.nameLn);
  params.set('destination-regionNameEn', destination.nameEn);
  params.set('destination-regionCode', destination.regionCode);
  params.set('destination-countryNameEn', destination.countryNameEn);
  if (destination.hotelCode) params.set('destination-hotelCode', destination.hotelCode);
  params.set('regionCode', destination.regionCode);
  params.set('page', '1');
  return `/hotel/search-result?${params.toString()}`;
}

/** 원본 요약 문구: "객실 1개 / 성인 2명" · "객실 1개 / 성인 2명, 아동 1명" */
export function summarizeRooms(rooms: HotelSearchForm['rooms']): string {
  const adults = rooms.reduce((n, r) => n + r.adultCount, 0);
  const children = rooms.reduce((n, r) => n + r.childAges.length, 0);
  const base = `객실 ${rooms.length}개 / 성인 ${adults}명`;
  return children > 0 ? `${base}, 아동 ${children}명` : base;
}
