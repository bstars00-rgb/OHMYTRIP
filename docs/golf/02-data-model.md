# 02. 데이터 모델 (Data Model)

> `src/mocks/golf/types.ts` + `data.ts` 기준. 실서비스화 시 이 스키마가 API 응답 계약의 출발점. · 갱신 2026-08-11
> 목데이터: `data.ts`(패키지·목적지·카테고리·프리셋·애드온·가격 헬퍼) · `courses.ts`(골프장 상세) · `stories.ts`(블로그) · `regions.ts`(목적지 지역).

---

## 1. 핵심 엔티티 관계

```
Destination(목적지) ──< GolfPackage(패키지) >── PackageOption(옵션: N박N라운드)
                              │
                              ├──< GolfCourse(코스 요약, 패키지 내장)
                              │        └── slug ─→ CourseDetail(코스 상세, courses.ts) ※ 패키지 상세에 인라인 표시(별도 페이지 없음)
                              ├──< TeeTime(티타임 슬롯)
                              ├──< ItineraryDay(일정)
                              └──< GolfReview / ReviewBreakdown(후기)
Story(블로그) ──(relatedDestination/relatedTags)──> GolfPackage
Category(카테고리 key) ──(tags)──> GolfPackage
[예약 파생] PartyPreset · StayAddon · 가격 헬퍼(effectivePerPerson / golfPoints) ──> 예약 카드/체크아웃
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
| `originalPriceUSD` / `salePriceUSD` | number | 1인당 정가/판매가(기준) | **가격 API** |
| `cancellationPolicy` | string | 취소 정책 | 상품 |
| `instantConfirmation` | boolean | 즉시확정/견적형 | 상품/재고 |
| `recommendedSeason` | string | 추천 시즌 | 상품 |
| `tags` | string[] | 카테고리 key(아래) | 상품 분류 |
| `beginnerFriendly`/`groupFriendly`/`allInclusive`/`breakfast`/`cartIncluded`/`caddieIncluded`/`airportTransfer`/`freeCancellation` | boolean | 필터·표기 플래그 | 상품 |
| `images` | string[] | 이미지 seed | **이미지 CMS** |
| `options` | PackageOption[] | 박·라운드 조합가 | 상품/가격 |
| `itinerary` | ItineraryDay[] | 일정 | 상품 |
| `hotelFacilities` | string[] | 편의시설(온천/스파 등 → 여성친화 필터·태그 판정) | 상품 |
| `reviews` | GolfReview[] | 후기 | 리뷰 |
| `bestSeller`/`lastMinute` | boolean? | 뱃지 | 머천다이징 |

**PackageOption**: `{ id, label, nights, rounds, airportTransfer, pricePerPersonUSD, originalPerPersonUSD }`
**TeeTime**: `{ time, bestValue?, soldOut? }` → **실 재고/티타임 API로 대체 필수**

---

## 3. 파생 데이터 · 예약 헬퍼 (`data.ts`) — 여성 골퍼 UX / 가격

> 아래는 상품 원본이 아니라 **패키지에서 파생**되거나 **예약 UX용 상수**. 실서비스화 시 일부는 상품 스키마/요금 엔진으로 이전.

### 3.1 요금·배지·태그
| 함수/상수 | 산출 | 실연동 시 |
|---|---|---|
| `feeBadges(p)` | 그린피(항상 포함)·카트·캐디·공항픽업 → 포함/현지결제 배지 | 상품 요금 구성 |
| `golfTags(p)` | N색M홀·온천·스파·초보 추천·석식포함·베스트셀러·얼리버드(최대 4) | 상품 태그 |
| `SOLO_TEAM_SURCHARGE` | **0.15** (단독팀 할증률) | 요금 정책 |
| `smallGroupMult(golfers)` | 2인 **1.2** · 3인 **1.1** · 4인+ 1.0 (소인원 할증) | 요금 정책 |
| `effectivePerPerson(base,golfers,soloTeam)` | `base × 소인원할증 × (단독팀?1.15:1)` → 유효 1인가 | 요금 엔진 |
| `golfPoints(usd)` | `round(usd × 1350 × 0.02)` → 적립 포인트 | **포인트/마일리지 시스템** |
| `POINT_BALANCE`(mock) | 데모용 보유 포인트 | 회원 포인트 잔액 |

### 3.2 인원 프리셋 — `PartyPreset` / `PARTY_PRESETS`
`{ key, label, golfers, solo, hint }`
| key | label | golfers | solo(단독) | hint |
|---|---|--:|:--:|---|
| couple | 부부 2인 | 2 | ✔ | 단독팀·프라이빗 |
| friends | 친구 4인 | 4 | ✔ | 한 팀 단독 |
| group | 모임 6인 | 6 | ✔ | 동호회·단체 |
| solo | 혼골 1인 | 1 | ✘ | 조인·안심 케어 |

### 3.3 스테이 애드온 — `StayAddon` / `STAY_ADDONS`
`{ key, icon(spa|massage|food|pickup), label, priceUSD, unit, note, desc }`
| key | label | 가격 | 단위 |
|---|---|--:|---|
| spa | 스파 & 온천 바우처 | $40 | 1인 |
| massage | 전신 아로마 마사지 | $30 | 1인 |
| food | 야시장 미식 투어 | $25 | 1인 |
| pickup | 프라이빗 픽업 업그레이드 | $20 | 팀 |
→ 상세 카드(설명)·수량 담기, 예약 총액·체크아웃에 합산.

### 3.4 안심 케어 · 상품 소개 · 출발 요일
- `safetyCare(p)`: 공항 전용 픽업(픽업 여부) · 한국어 현지 지원 · 여성 캐디 요청 · 조인팀 안전 매칭 · 24시간 컨시어지 → `{label,on}[]`.
- `packageIntro(p)`: 국가·호텔·박/라운드·코스·시설·힐링/안심 포인트를 담은 서술 문단(자동 생성).
- `departureDays(p)`: 출발 가능 요일(전세기·배차 mock, 0=일…6=토).

---

## 4. GolfCourse (패키지 내장 요약) & CourseDetail (골프장 상세 · 인라인)

**GolfCourse** (패키지에 내장): `{ name, designer, holes, par, courseRating, difficulty, transferMin, dressCode, rentalClubs }`

**CourseDetail** (`courses.ts`, `COURSES`는 패키지 코스에서 결정론적으로 합성 · **패키지 상세 안 인라인 표시**, 별도 라우트 없음 — monkeytravel 골프텔 상세 벤치마크):

| 그룹 | 필드 |
|---|---|
| 기본 | `slug, name, destination, country, designer, holes, par, yardage(전장), courseRating, slopeRating, difficulty, established` |
| 코스 상태 | `greenGrass, fairwayGrass, greenSpeed` |
| 운영 | `drivingRangeHours, restaurantHours, distanceFromHotel, transferMin, dressCode, rentalClubs` |
| 요금 | `localFees: {label, amount, note}[]` — **국가별 통화**(THB/KRW/JPY/VND/EUR/IDR/TWD), 현지 결제 |
| 플레이 | `playRules[](1인1카트·캐디동반 등), teamConfig[]{slot,max}` |
| 콘텐츠 | `signatureHoles[]{hole,par,yards,note}, description, scorecard: ScorecardHole[](18홀 {hole,par,yards,si})` |
| 연결 | `images[], packageIds[]` |

> ⚠️ 현재 `courses.ts`는 코스 요약 기반으로 **국가별 규칙에 따라 상세를 결정론적으로 합성**(전장/스코어카드/요금 등). 실서비스화 시 골프장별 **실제 스펙·요금·야디지**로 교체.

---

## 5. ItineraryDay (여행 일정)
`{ day, title, summary?, description?, highlight?(팁), meals?[](조식/중식/석식), items: {time?, text, tag?}[] }`
- 생성 로직(`data.ts itinerary()`): 도착일 → 라운드일(라운드별 코스) → 출발일. 실서비스화 시 상품별 실제 일정으로 대체 가능.

---

## 6. Story (블로그 아티클) — `stories.ts`
`{ slug, title, category, excerpt, heroSeed, author, authorRole, date, readMin, tags[], sections: {heading?, paragraphs[], imageSeed?, imageKind?, caption?}[], relatedDestination?, relatedTags? }`
- 현재 4편. CMS/블로그 백엔드로 이관 가능.

---

## 7. 목적지 · 카테고리 · 지역 · 여성친화 필터

**Destination**(`data.ts`): `{ slug, city, country, avgPackageUSD, season, courseCount }` — 6개(제주·다낭·방콕·오키나와·홋카이도·알가르브).

**Category key**(필터/태그, **노출 순서 = 타깃 반영**): `women · luxury · family · stay-play · all-inclusive · weekend · group · last-minute`.

**여성친화 시설 필터(WELLNESS)**(`FilterControls` + `search.ts` `GolfFilters.wellness`): `onsen(온천) · spa(스파·사우나) · pool(수영장) · meals(조·석식 포함) · walkable(클럽하우스 근접)` — 패키지 `hotelFacilities`/플래그로 매칭.

**GeoRegion**(`regions.ts`, 목적지 팝오버): 국내·일본·베트남·아시아·미주/중남미·유럽·중동·대양주. `city`값은 패키지 `destination`(영문)과 일치해야 검색 필터 동작.

---

## 8. 목데이터 현황 (2026-08-11)

| 데이터 | 수량 | 비고 |
|---|---|---|
| 패키지 | **72** | SEEDS 12개 × (기본 + 변형 5종). 박수 2~5·라운드 2~3·성급 4/5·평점 8/9+ 조합 커버 |
| 골프장(CourseDetail) | **24** | 패키지 코스 취합, 패키지 상세에 인라인 |
| 블로그 아티클 | **4** | 관련 패키지 CTA 연결 |
| 인원 프리셋 | 4 | 부부2인/친구4인/모임6인/혼골1인 |
| 스테이 애드온 | 4 | 스파/마사지/미식/픽업 |
| 통화 | 5 | USD/KRW/JPY/VND/EUR |
| 언어(UI) | 4 | ko/en/ja/zh (본문 콘텐츠는 미번역) |
| 이미지 | `/public/golf/img` 풀 | CC 스톡 — **일부 골프 무관 이미지 존재(교체 필요)** |

**주의**: 가격은 USD 기준 고정 목값. 통화 전환·할증률·적립률·비골퍼 요금은 **프로토타입 가정값**. → 실환율/가격/포인트는 [03 문서].
