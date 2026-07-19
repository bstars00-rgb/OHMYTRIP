# API Contract (Mock 우선 — 원본 관찰 기반 역설계)

> 원본 사이트의 XHR 응답 본문은 직접 캡처하지 못했다(같은 오리진 fetch, 레코더 미포착).
> 아래는 **URL/화면에서 관찰된 데이터 구조를 역설계**한 Mock 계약이다. ELLIS/실 API 연동 시 재검증 필요.

## 공통

- 모든 서비스는 `src/services/api/*.service.ts` 인터페이스 뒤에 위치
- `NEXT_PUBLIC_USE_MOCK_API=true`이면 `src/mocks/*` 데이터 반환
- 클라이언트: `src/services/api/client.ts` (fetch 래퍼, 오류 처리 일원화)

## 1. 목적지 검색 (destination.service)

관찰 근거: 자동완성 항목 구조(`.destination-item.city|hotel`, `.name`/`.name2`), 검색 URL의 destination-* 파라미터

```ts
type DestinationType = 'region' | 'hotel';
type DestinationIconType = 'city' | 'hotel' | 'landmark'; // 아이콘 3종 확인됨

interface Destination {
  type: DestinationType;
  iconType: DestinationIconType;
  regionNameLn: string;   // "서울" (현지어/한글)
  regionNameEn: string;   // "Seoul" / "Seoul (ICN-Incheon Intl.)"
  regionCode: string;     // "102514"
  countryNameEn: string;  // "Korea"
  hotelCode?: string;     // type=hotel일 때
}

searchDestinations(query: string): Promise<Destination[]> // 2자 이상에서 호출
getMajorCities(): Promise<Record<RegionGroup, Destination[]>>
// RegionGroup: 국내 | 일본 | 베트남 | 아시아 | 미주/중남미 | 유럽 | 중동 | 대양주
```

## 2. 호텔 검색 (hotel.service)

검색 조건 직렬화(원본 쿼리 스킴 — **그대로 재현**):

```
checkInDate=YYYY-MM-DD
checkOutDate=YYYY-MM-DD
rooms-{i}-adultCount=N
rooms-{i}-childCount=N
rooms-{i}-childAges-{j}=age   // 0(만1세 미만)~11
dynamicRateYn=true
sortOrder=Recommend | (등급/가격 오름·내림 — 원본 값 재확인 필요: UNKNOWN)
limits-0=0&limits-1=10        // 페이지 크기 추정
destination-type=region&destination-iconType=city
destination-regionNameLn=...&destination-regionNameEn=...
destination-regionCode=...&destination-countryNameEn=...
regionCode=...
page=1
```

```ts
interface HotelSummary {
  hotelCode: string;
  nameLn: string;        // 더 스테이 클래식 호텔 명동
  nameEn: string;        // The Stay Classic Myeongdong
  starRating: 1|2|3|4|5; // rate-star s1~s5
  gradeText: string;     // "4성급"
  price: number;         // 530008 (KRW, 총액 노출)
  isRecommended: boolean; // "추천" 배지
  imageUrl: string;
}

interface HotelSearchResult {
  totalCount: number;          // "총 278건"
  hotels: HotelSummary[];
  filters: {
    priceRange: { min: number; max: number };
    starRatings: { grade: number; lowestPrice: number }[];
    propertyTypes: string[];   // Hotel, Hostel/Backpacker, Guesthouse, Motel, Apartment...
    meals: { breakfastIncluded: number; breakfastExcluded: number };
    chains: { name: string; lowestPrice: number }[];
  };
}
```

## 3. 호텔 상세/룸타입 (hotel.service)

`/hotel/search-room-type?hotelCode=...&checkInDate=...&packageAbleYn=true&rooms-...`

```ts
interface RoomType {
  roomCode: string;          // "910003"
  name: string;              // "Double Junior Suite - No Parking Included"
  mealType: string;          // "조식 미포함" | "No Meal" ...
  freeWifi: boolean;
  amenities: string[];       // "Coffee & tea, Free WiFi, ..."
  cancellation:
    | { type: 'free'; deadline: string }   // "2026.07.21(화) 17:00까지"
    | { type: 'nonRefundable' };
  originalPrice?: number;    // 취소선 정가 (1,012,000)
  price: number;             // 판매가 (951,280)
}

interface HotelDetail {
  hotelCode: string; nameLn: string; nameEn: string; starRating: number;
  checkInTime: string;  // "15:00"
  checkOutTime: string; // "12:00"
  address: string; region: string; phone: string;
  nearbyLandmarks: { name: string; distanceKm: number }[];
  description: string;
  roomTypes: RoomType[];
}
```

## 4. 인증 (auth.service) — Mock

- login(email, password) / logout / getSession
- 비밀번호 정책 안내문: "8~16자 영문 대/소문자, 숫자, 특수문자"
- SNS 로그인(카카오/네이버/구글/애플): UI만, Mock 처리

## 5. 예약 (booking.service) — Mock

- 진행 단계: 01 호텔 선택 → 02 룸타입 선택 → 03 여행자 확인 → 04 결제하기
- 03/04 화면 구조는 UNKNOWN(로그인 필요) — 원본 자료 확보 후 확정

## 6. 공지/배너 (mocks)

- notices: { label: '상시'|..., title, date: 'YYYY.MM.DD', id }
- banners: main(585×433×5) / wide(783×232) / promo(387×232×4), 링크 포함
- events: { title, period: 'YYYY.MM.DD ~ YYYY.MM.DD', category: 전체|항공|호텔|액티비티|렌터카|기타, imageUrl }

## 7. 클라이언트 상태 유지 (원본 키 재현)

- sessionStorage `hotel-searchFormData` — 검색 폼 상태(JSON: destination 객체 포함)
- localStorage `recentSearchHotels` — [{ id: uuid, type: 'IC02', queryString: '...' }]
