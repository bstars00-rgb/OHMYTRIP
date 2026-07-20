import { HOTELS, getHotel, getHotelInfo, getRoomTypes } from '@/mocks/hotels';
import type { MockHotel, MockHotelInfo, MockRoomType } from '@/mocks/hotels';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API !== 'false';

export type SortOrder = '추천순' | '높은 등급 순' | '낮은 등급 순' | '높은 가격 순' | '낮은 가격 순';

export interface HotelSearchOptions {
  sort: SortOrder;
  keyword?: string;
  starFilters?: string[]; // starText 목록
  priceMin?: number;
  priceMax?: number;
}

const starValue = (h: MockHotel) => parseFloat(h.starText) || 0;

export async function searchHotels(options: HotelSearchOptions): Promise<MockHotel[]> {
  if (!USE_MOCK) throw new Error('Real hotel API is not wired yet.');
  let list = [...HOTELS];
  if (options.keyword) {
    const q = options.keyword.trim().toLowerCase();
    list = list.filter((h) => h.nameLn.toLowerCase().includes(q) || h.nameEn.toLowerCase().includes(q));
  }
  if (options.starFilters && options.starFilters.length > 0) {
    list = list.filter((h) => options.starFilters!.includes(h.starText));
  }
  if (options.priceMin !== undefined) list = list.filter((h) => h.price >= options.priceMin!);
  if (options.priceMax !== undefined) list = list.filter((h) => h.price <= options.priceMax!);
  switch (options.sort) {
    case '높은 등급 순':
      list.sort((a, b) => starValue(b) - starValue(a));
      break;
    case '낮은 등급 순':
      list.sort((a, b) => starValue(a) - starValue(b));
      break;
    case '높은 가격 순':
      list.sort((a, b) => b.price - a.price);
      break;
    case '낮은 가격 순':
      list.sort((a, b) => a.price - b.price);
      break;
    default:
      // 추천순: recommended 우선, 원본 노출 순 유지
      list.sort((a, b) => Number(b.recommended) - Number(a.recommended));
  }
  return list;
}

export async function getHotelDetail(hotelCode: string): Promise<{
  hotel: MockHotel | undefined;
  roomTypes: MockRoomType[];
  info: MockHotelInfo;
}> {
  if (!USE_MOCK) throw new Error('Real hotel API is not wired yet.');
  return { hotel: getHotel(hotelCode), roomTypes: getRoomTypes(hotelCode), info: getHotelInfo(hotelCode) };
}
