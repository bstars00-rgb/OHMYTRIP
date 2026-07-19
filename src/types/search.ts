export type DestinationIconType = 'city' | 'hotel' | 'landmark';

export interface Destination {
  type: 'region' | 'hotel';
  iconType: DestinationIconType;
  /** 현지어(한글) 표기 — 예: "서울" */
  nameLn: string;
  /** 영문 표기 — 예: "Seoul" / "Seoul (ICN-Incheon Intl.)" */
  nameEn: string;
  regionCode: string;
  countryNameEn: string;
  hotelCode?: string;
}

export interface RoomOption {
  adultCount: number;
  /** 아동 나이 목록. null = 아직 선택 안 함 (0 = 만 1세 미만) */
  childAges: (number | null)[];
}

export interface HotelSearchForm {
  destination: Destination | null;
  /** yyyy-MM-dd */
  checkInDate: string | null;
  /** yyyy-MM-dd */
  checkOutDate: string | null;
  rooms: RoomOption[];
}

export const createDefaultRoom = (): RoomOption => ({ adultCount: 2, childAges: [] });

export const createDefaultForm = (): HotelSearchForm => ({
  destination: null,
  checkInDate: null,
  checkOutDate: null,
  rooms: [createDefaultRoom()],
});
