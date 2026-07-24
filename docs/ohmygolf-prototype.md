# OHMYGOLF — 골프텔 예약 프로토타입

OHMYTRIP 클론과 **완전히 격리된** 실험용 프로토타입. 회사 방향과 맞지 않으면
아래 "롤백" 항목의 경로만 삭제하면 원상복구된다.

라이브: `/golf` (OHMYTRIP 메인 검색 패널의 **골프텔** 탭으로 진입)

## 1. 프로젝트 구조

```
src/app/golf/
  layout.tsx                     격리 레이아웃(Playfair 폰트 + GolfShell)
  page.tsx                       Home
  search/                        Search Results
  package/[id]/                  Package Detail (12개 SSG)
  compare/                       Compare (최대 3개)
  build/                         Build My Trip (7-step 견적)
  checkout/                      Checkout (3-step)
  booking-complete/              Booking Complete
  my-trips/                      My Trips (4 tabs)

src/components/golf/
  layout/   GolfShell·GolfHeader·GolfFooter
  home/     GolfHome (Hero·Categories·Destinations·Packages·Why·Build·Editorial·Trust)
  search/   GolfSearch·FilterControls
  detail/   PackageDetail
  compare/  GolfCompare
  build/    BuildWizard
  checkout/ GolfCheckout·BookingComplete
  mytrips/  MyTrips
  common/   ui.tsx (StarRating·Wishlist·Compare·Modal·BottomSheet·EmptyState·Skeleton)
  PackageCard·SearchBox·CompareTray·flight...

src/features/golf/
  GolfProviders.tsx  Currency·Language·Wishlist·Compare 컨텍스트(localStorage)
  search.ts          필터/정렬/직렬화 로직
  scenery.ts         SVG 골프풍경 placeholder 생성기

src/mocks/golf/
  types.ts  data.ts  (패키지 12개 + 목적지 6 + 카테고리 8)

src/styles/ohmygolf.css, ohmygolf-pages.css   (.ohmygolf 스코프 디자인시스템)
```

## 2. 실행

```bash
npm run dev      # http://localhost:3000/golf
npm run build    # 정적 export (12개 패키지 SSG)
```

## 3. 격리 방식 (중요)

- GolfShell이 마운트 시 `body`에서 `omt-desktop`/`omt-mobile`을 제거하고 `ohmygolf-body`를 부여 → OHMYTRIP 전역 CSS 리셋이 골프 페이지에 새지 않음.
- 모든 골프 스타일은 `.ohmygolf` 하위로 스코프 → 반대 방향 누수도 없음.
- 진입점은 OHMYTRIP `MainSearchPanel`의 골프텔 탭 1개(`btn-golf-entry`).

## 4. 구현된 기능 (모두 동작)

목적지 자동완성 · 날짜 선택 · 골퍼/비골퍼/객실/라운드 카운터 · 필터 · 정렬 6종 ·
Wishlist · 최대 3개 비교(차이 하이라이트) · List/Map 전환 · 패키지 라운드 옵션 비교 ·
티타임 선택(Best Value/마감) · 이미지 갤러리 모달 · 일정 accordion · 견적 7-step ·
Checkout 3-step · 통화 변환(USD/KRW/JPY/VND/EUR) · 언어 UI · 모바일 bottom sheet ·
empty state · 예약완료 확인.

## 5. Mock 데이터 구조

`GolfPackage`: hotel·destination·coordinates·hotelRating·reviewScore·reviewCount·
reviewBreakdown·roomType·nights·rounds·golfCourses[]·teeTimes[]·inclusions·exclusions·
transferTime·originalPrice·salePrice·cancellationPolicy·instantConfirmation·
recommendedSeason·tags·options[]·itinerary[]·hotelFacilities·reviews[]

12개 지역: 다낭·제주·방콕·오키나와·나트랑·홋카이도·Algarve·파타야·타이베이·발리·푸켓·부산.
가상 호텔명·demo 데이터만 사용(실제 브랜드 미복제).

## 6. 실제 API 연동 시 교체 지점

| 현재(Mock) | 교체 대상 |
|---|---|
| `src/mocks/golf/data.ts` PACKAGES | 골프텔 상품/재고 API |
| `src/features/golf/search.ts` filter/sort | 서버 검색 API |
| `src/features/golf/scenery.ts` (SVG) | 실제 호텔/골프장 사진 CDN |
| `GolfCheckout` confirm() | 결제(PG) + 예약 생성 API |
| `CURRENCIES` 고정 환율 | 실시간 환율 API |
| `BuildWizard` submit | 견적 요청(리드) 저장 API |
| My Trips 데모 예약 | 회원 예약 조회 API(ELLIS 연동) |

## 7. 이후 개발 우선순위

1. 결제(PG) 실연동 + 예약 생성/바우처 발급
2. 상품/재고/티타임 실시간 API (ELLIS 골프텔 스키마 신설)
3. 실제 호텔·골프장 이미지/지도(Google Maps) 연동
4. 로그인·회원(예약/위시/견적) 서버 동기화
5. 다국어(i18n) 실번역, 다중 통화 정산
6. 골프장 상세(코스 레이아웃·홀 정보)·리뷰 수집

## 8. 기술 참고

요청 스택은 Tailwind + shadcn/ui였으나, **OHMYTRIP 클론과의 완전 격리 및 무손실 롤백**을
위해 전역 preflight를 유발하지 않는 `.ohmygolf` 스코프 전용 CSS 디자인시스템으로 구현했다
(클론이 이미 채택한 패턴). 아이콘은 lucide-react. 실제 채택 시 Tailwind/shadcn 이관 가능.

## 9. 롤백 방법

```
삭제: src/app/golf, src/components/golf, src/features/golf, src/mocks/golf,
      src/styles/ohmygolf.css, src/styles/ohmygolf-pages.css
되돌리기: layout.tsx 임포트 2줄, MainSearchPanel 골프텔 <li>,
          app-overrides.css 골프 진입점 블록, eslint.config golf override,
          package.json lucide-react
```
