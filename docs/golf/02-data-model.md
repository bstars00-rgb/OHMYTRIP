# 02. 데이터 모델 (Data Model)

> `src/mocks/golf/types.ts` 기준. 실서비스화 시 이 스키마가 API 응답 계약의 출발점.
> 목데이터: `data.ts`(패키지·목적지·카테고리) · `courses.ts`(골프장) · `stories.ts`(블로그) · `regions.ts`(목적지 지역).

---

## 1. 핵심 엔티티 관계

```
Destination(목적지) ──< GolfPackage(패키지) >── PackageOption(옵션: N박N라운드)
                              │
                              ├──< GolfCourse(코스 요약, 패키지 내장)
                              │        └── slug ─→ CourseDetail(코스 상세, courses.ts)
                              ├──< TeeTime(티타임 슬롯)
                              ├──< ItineraryDay(일정)
                              └──< GolfReview / ReviewBreakdown(후기)
Story(블로그) ──(relatedDestination/relatedTags)──> GolfPackage
Category(카테고리 key) ──(tags)──> GolfPackage
```

---

## 2. GolfPackage (패키지) — 상품의 중심

| 필드 | 타입 | 설명 | 실연동 시 소스 |
|---|---|---|---|
| `id` | string | 패키지 식별자 | ELLIS 상품ID |
| `hotel` | string | 골프텔/호텔명 | 상품 |
| `destination` / `country` | string | 도시/국가(검색 필터 키) | 상품 |
| `coordinates` | {lat,lng} | 지도 | 상품 |
| `hotelRating` | 1~5 | 성급 | 상품 |
| `reviewScore` / `reviewCount` | number | 평점(0~10)/후기수 | 리뷰 시스템 |
| `reviewBreakdown` | 6개 항목 | 호텔/코스상태/진행/이동/가치/서비스 | 리뷰 |
| `roomType` | string | 객실 타입 | 상품 |
| `nights` / `rounds` | number | 기준 박수/라운드(필터 키) | 상품 |
| `golfCourses` | GolfCourse[] | 포함 골프장 요약 | 상품↔코스 |
| `teeTimes` | TeeTime[] | 선택 가능 티타임 | **티타임 API** |
| `inclusions` / `exclusions` | string[] | 포함/불포함 | 상품 |
| `transferTimeMin` | number | 대표 이동시간(분) | 상품 |
| `originalPriceUSD` / `salePriceUSD` | number | 1인당 정가/판매가 | **가격 API** |
| `cancellationPolicy` | string | 취소 정책 | 상품 |
| `instantConfirmation` | boolean | 즉시확정/견적형 | 상품/재고 |
| `recommendedSeason` | string | 추천 시즌 | 상품 |
| `tags` | string[] | 카테고리 key(아래) | 상품 분류 |
| `beginnerFriendly`/`groupFriendly`/`allInclusive`/`breakfast`/`cartIncluded`/`caddieIncluded`/`airportTransfer`/`freeCancellation` | boolean | 필터·표기 플래그 | 상품 |
| `images` | string[] | 이미지 seed | **이미지 CMS** |
| `options` | PackageOption[] | 박·라운드 조합가 | 상품/가격 |
| `itinerary` | ItineraryDay[] | 일정 | 상품 |
| `hotelFacilities` | string[] | 편의시설 | 상품 |
| `reviews` | GolfReview[] | 후기 | 리뷰 |
| `bestSeller`/`lastMinute` | boolean? | 뱃지 | 머천다이징 |

**PackageOption**: `{ id, label, nights, rounds, airportTransfer, pricePerPersonUSD, originalPerPersonUSD }`
**TeeTime**: `{ time, bestValue?, soldOut? }` → **실 재고/티타임 API로 대체 필수**

---

## 3. GolfCourse (패키지 내장 요약) & CourseDetail (골프장 상세)

**GolfCourse** (패키지에 내장): `{ name, designer, holes, par, courseRating, difficulty, transferMin, dressCode, rentalClubs }`

**CourseDetail** (`courses.ts`, slug로 주소화 — monkeytravel 골프텔 상세 벤치마크):

| 그룹 | 필드 |
|---|---|
| 기본 | `slug, name, destination, country, designer, holes, par, yardage(전장), courseRating, slopeRating, difficulty, established` |
| 코스 상태 | `greenGrass, fairwayGrass, greenSpeed` |
| 운영 | `drivingRangeHours, restaurantHours, distanceFromHotel, transferMin, dressCode, rentalClubs` |
| 요금 | `localFees: {label, amount, note}[]` — **국가별 통화**(THB/KRW/JPY/VND/EUR/IDR/TWD), 현지 결제 |
| 플레이 | `playRules[](1인1카트·캐디동반 등), teamConfig[]{slot,max}` |
| 콘텐츠 | `signatureHoles[]{hole,par,yards,note}, description, scorecard: ScorecardHole[](18홀 {hole,par,yards,si})` |
| 연결 | `images[], packageIds[]` |

> ⚠️ 현재 `courses.ts`는 패키지의 코스 요약을 기반으로 **국가별 규칙에 따라 결정론적으로 상세를 합성**(전장/스코어카드/요금 등). 실서비스화 시 골프장별 **실제 스펙·요금·야디지**로 교체.

---

## 4. ItineraryDay (여행 일정)
`{ day, title, summary?, description?(서술), highlight?(팁), meals?[](조식/중식/석식), items: {time?, text, tag?}[] }`
- 생성 로직(`data.ts itinerary()`): 도착일 → 라운드일(라운드별 코스) → 출발일. 실서비스화 시 상품별 실제 일정으로 대체 가능.

---

## 5. Story (블로그 아티클) — `stories.ts`
`{ slug, title, category, excerpt, heroSeed, author, authorRole, date, readMin, tags[], sections: {heading?, paragraphs[], imageSeed?, imageKind?, caption?}[], relatedDestination?, relatedTags? }`
- 현재 4편(베트남 가이드·서울 주말·입문자 추천·일본 럭셔리). CMS/블로그 백엔드로 이관 가능.

---

## 6. 목적지 · 카테고리 · 지역

**Destination**(`data.ts`): `{ slug, city, country, avgPackageUSD, season, courseCount }` — 6개(제주·다낭·방콕·오키나와·홋카이도·알가르브).

**Category key**(필터/태그): `stay-play · all-inclusive · weekend · luxury · group · women · family · last-minute`.

**GeoRegion**(`regions.ts`, 목적지 팝오버): 국내·일본·베트남·아시아·미주/중남미·유럽·중동·대양주. 각 지역에 골프 도시(GeoCity `{ko, city, country}`) 매핑. `city`값은 패키지 `destination`(영문)과 일치해야 검색 필터 동작.

---

## 7. 목데이터 현황 (2026-07-29)

| 데이터 | 수량 | 비고 |
|---|---|---|
| 패키지 | **72** | 목적지 12개 × 변형 6종(기본 + 주말/스탠다드/익스텐디드/그랜드/올인클루시브). 박수 2~5·라운드 2~3·성급 4/5·평점 8/9+ 조합 커버 |
| 골프장(CourseDetail) | **24** | 패키지 코스 취합, slug 주소화 |
| 블로그 아티클 | **4** | 관련 패키지 CTA 연결 |
| 통화 | 5 | USD/KRW/JPY/VND/EUR |
| 언어(UI) | 4 | ko/en/ja/zh (본문 콘텐츠는 미번역) |
| 이미지 | `/public/golf/img` 풀 | CC 스톡 — **일부 골프 무관 이미지 존재(교체 필요)** |

**주의**: 가격은 USD 기준 고정 목값. 통화 전환은 프로토타입 고정 환율 사용. → 실환율/가격은 [03 문서].
