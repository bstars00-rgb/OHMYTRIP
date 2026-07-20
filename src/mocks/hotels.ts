/**
 * 호텔 Mock — 2026-07 원본 검색결과(서울)에서 실측한 10곳.
 * 이미지는 /public/images/hotels 로컬 미러. 가격 단위: KRW 총액.
 */
export interface MockHotel {
  hotelCode: string;
  nameLn: string;
  nameEn: string;
  /** rate-star 클래스 접미: s1~s5, 반성급은 s2h/s3h... */
  starClass: string;
  starText: string;
  originPrice?: number;
  price: number;
  recommended: boolean;
  imageUrl: string;
}

export const HOTELS: MockHotel[] = [
  { hotelCode: '886479', nameLn: '더 스테이 클래식 호텔 명동', nameEn: 'The Stay Classic Myeongdong', starClass: 's4', starText: '4성급', price: 515661, recommended: true, imageUrl: '/images/hotels/hotel-1.jpg' },
  { hotelCode: '886480', nameLn: '스탠포드호텔 명동', nameEn: 'Stanford Hotel Myeongdong', starClass: 's3h', starText: '3.5성급', price: 616728, recommended: true, imageUrl: '/images/hotels/hotel-2.jpg' },
  { hotelCode: '886481', nameLn: '프레이저 플레이스 남대문 서울', nameEn: 'Fraser Place Namdaemun Seoul', starClass: 's4', starText: '4성급', originPrice: 751308, price: 706230, recommended: true, imageUrl: '/images/hotels/hotel-3.jpg' },
  { hotelCode: '886482', nameLn: '로이넷호텔 서울 마포', nameEn: 'Roynet Hotel Seoul Mapo', starClass: 's3h', starText: '3.5성급', originPrice: 638437, price: 600131, recommended: true, imageUrl: '/images/hotels/hotel-4.jpg' },
  { hotelCode: '886483', nameLn: 'N285 호텔 인사동', nameEn: 'N285 Hotel Insadong', starClass: 's2h', starText: '2.5성급', price: 412476, recommended: true, imageUrl: '/images/hotels/hotel-5.jpg' },
  { hotelCode: '886484', nameLn: '호텔 더 디자이너스 서울역', nameEn: 'Hotel The Designers Seoul Station', starClass: 's2', starText: '2성급', originPrice: 568946, price: 534809, recommended: true, imageUrl: '/images/hotels/hotel-6.jpg' },
  { hotelCode: '886485', nameLn: '사보이 호텔', nameEn: 'Savoy Hotel', starClass: 's3h', starText: '3.5성급', originPrice: 674606, price: 634130, recommended: false, imageUrl: '/images/hotels/hotel-7.jpg' },
  { hotelCode: '886486', nameLn: '나인트리 바이 파르나스 서울 동대문', nameEn: 'NINE TREE BY PARNAS SEOUL DONGDAEMUN', starClass: 's4', starText: '4성급', price: 552259, recommended: false, imageUrl: '/images/hotels/hotel-8.jpg' },
  { hotelCode: '886487', nameLn: '호텔 더 디자이너스 종로', nameEn: 'Hotel The Designers Jongno', starClass: 's3h', starText: '3.5성급', price: 270884, recommended: false, imageUrl: '/images/hotels/hotel-9.jpg' },
  { hotelCode: '886488', nameLn: '트레블로지 명동 을지로 호텔', nameEn: 'Travelodge Myeongdong Euljiro', starClass: 's3h', starText: '3.5성급', originPrice: 479595, price: 450819, recommended: false, imageUrl: '/images/hotels/hotel-10.jpg' },
];

export interface MockRoomType {
  vendorCode: string;
  name: string;
  breakfast: string;
  freeWifi: boolean;
  amenities: string;
  /** 무료취소 마감 표기 또는 null(환불불가) */
  freeCancelUntil: string | null;
  originPrice?: number;
  price: number;
}

/** 원본 886479(더 스테이 클래식 호텔 명동) 룸타입 실측 기반 */
export const ROOM_TYPES: Record<string, MockRoomType[]> = {
  '886479': [
    { vendorCode: '910003', name: 'Double Junior Suite - No Parking Included', breakfast: '조식 미포함', freeWifi: true, amenities: 'Free WiFi, Free fitness center access', freeCancelUntil: null, price: 504794 },
    { vendorCode: '910003', name: 'Double Junior Suite - No Parking Included', breakfast: '조식 미포함', freeWifi: true, amenities: 'Free WiFi, Free fitness center access', freeCancelUntil: '2026.07.21(화) 17:00까지', price: 504794 },
    { vendorCode: '910003', name: 'Junior Double Suite - Accessible, No Parking Included', breakfast: '조식 미포함', freeWifi: true, amenities: 'Free WiFi, Free fitness center access', freeCancelUntil: null, price: 642552 },
    { vendorCode: '999999', name: 'Deluxe Twin (H) No Parking', breakfast: '조식 미포함', freeWifi: true, amenities: 'No Meal', freeCancelUntil: null, originPrice: 1012000, price: 951280 },
  ],
};

export interface MockHotelInfo {
  checkInTime: string;
  checkOutTime: string;
  address: string;
  region: string;
  phone: string;
  landmarks: { name: string; distance: string }[];
  galleryImages: string[];
  extraImageCount: number;
}

export const HOTEL_INFO: Record<string, MockHotelInfo> = {
  '886479': {
    checkInTime: '15:00',
    checkOutTime: '12:00',
    address: '27, Namdaemun-ro, Jung-gu, Seoul, Republic of Korea 대한민국',
    region: '서울에 위치',
    phone: '237897002',
    landmarks: [
      { name: '서울', distance: '0.6km' },
      { name: '김포', distance: '15km' },
      { name: '인천', distance: '46.8km' },
    ],
    galleryImages: [
      '/images/hotels/hotel-1.jpg',
      '/images/hotels/hotel-2.jpg',
      '/images/hotels/hotel-3.jpg',
      '/images/hotels/hotel-4.jpg',
      '/images/hotels/hotel-5.jpg',
    ],
    extraImageCount: 28,
  },
};

export function getHotel(hotelCode: string): MockHotel | undefined {
  return HOTELS.find((h) => h.hotelCode === hotelCode);
}

export function getRoomTypes(hotelCode: string): MockRoomType[] {
  return ROOM_TYPES[hotelCode] ?? ROOM_TYPES['886479'];
}

export function getHotelInfo(hotelCode: string): MockHotelInfo {
  return HOTEL_INFO[hotelCode] ?? HOTEL_INFO['886479'];
}
