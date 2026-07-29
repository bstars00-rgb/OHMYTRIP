# 03. 실서비스화 연동 스펙 (Integration / ELLIS)

> 프로토타입(목데이터) → 실서비스 전환에 필요한 연동 지점·스키마·시스템 요구사항.
> 목표: **화면·플로우는 유지**하고 데이터 레이어만 교체.

---

## 1. 아키텍처 원칙

현재는 컴포넌트가 `mocks/golf/*`를 직접 import. 실연동 시 **서비스 레이어**(`services/golf/*`)를 두고 컴포넌트는 그 인터페이스만 바라보게 한다(오마이트립 본 클론의 `services/api/*` 패턴 동일).

```
[컴포넌트] → [services/golf/*.ts (인터페이스)] → ┬ mock 어댑터(현재)
                                                └ ELLIS/파트너 API 어댑터(실서비스)
```

교체 시 컴포넌트 수정 없이 어댑터만 바꾸면 됨.

---

## 2. mock → API 교체 지점

| 현재(목) | 대체(실) | 담당 시스템 |
|---|---|---|
| `data.ts` `PACKAGES / getPackage()` | 패키지 목록·상세 API | ELLIS 골프텔 상품 |
| `search.ts` `filterPackages/sortPackages` | 검색 API(서버 필터/정렬/페이징) | 검색 서버 |
| `data.ts` `TeeTime[]` (고정) | **티타임 실시간 조회 API** | 골프장/파트너 |
| `PackageOption.price*`, `salePriceUSD` | **가격/견적 API**(날짜·인원별) | 요금 엔진 |
| `courses.ts` `COURSES` (합성) | 골프장 마스터(실 스펙·요금) | 골프장 DB |
| `checkout` `confirm()` (URL 이동) | **결제(PG) + 예약 생성 API** | PG·예약 |
| `GolfProviders` 위시/비교/최근(localStorage) | 회원 계정 동기화 | 회원/마이페이지 |
| `fx()` 고정 환율 | 실시간 환율 API | 환율 |
| `i18n.ts` (UI만) | 콘텐츠 번역/다국어 상품 | CMS/번역 |
| `images.ts` seed→CC 풀 | 자사 이미지 CDN | 이미지 CMS |
| `stories.ts` | 블로그/CMS | 콘텐츠 |

---

## 3. ELLIS 골프텔 스키마 (신설 요청 필드)

[02 데이터 모델]을 API 계약으로 바꿀 때 **ELLIS에 새로 필요한** 골프텔 특화 필드:

### 3.1 상품(패키지)
- 숙박 + 라운드 결합 구조: `nights`, `rounds`, `options[](박·라운드·픽업·1인가)`
- 즉시확정/견적형 구분(`instantConfirmation`)
- 포함/불포함 명세(`inclusions/exclusions`), 현지 결제 항목 분리
- 카테고리 태그(stay-play/all-inclusive/weekend/luxury/group/women/family/last-minute)

### 3.2 골프장 마스터 (신규 도메인)
- 코스 스펙: `holes, par, yardage, courseRating, slopeRating, difficulty, designer, established, greenGrass, fairwayGrass, greenSpeed`
- 운영: `drivingRangeHours, restaurantHours, dressCode, rentalClubs, distanceFromHotel`
- **현지 결제 요금**: 카트/캐디/캐디팁/갤러리 — **통화·단위(1인/팀·18홀)** 포함
- 플레이 규칙·팀 구성(주중/주말 AM/PM 최대 인원)
- 스코어카드(홀별 par/yards/S.I.), 시그니처홀
- 골프장↔골프텔 거리(카트/도보 분)

### 3.3 티타임/재고 (신규 도메인)
- 날짜·코스·시간대별 **슬롯 재고**(마감 여부), 추천가/성수기 표시
- 팀 인원 제약(2인 출발 등), 대회일 티타임 제한
- 홀드/확정 트랜잭션(예약 시 슬롯 점유)

### 3.4 가격/정산
- 1인당 패키지가 + 현지 결제 항목 분리
- 날짜·인원·옵션별 동적 가격
- 비골퍼(동반) 요금 규칙(현재 프로토타입: 골퍼가 × 0.6 가정 — 정책 확정 필요)

---

## 4. 결제(PG) 연동

- 현재 `/golf/checkout` 3스텝은 **UI 시뮬레이션**(카드/애플/구글/계좌 선택만). 실 결제 없음.
- 필요: PG사 연동(국내/해외 카드·간편결제), 결제 후 **예약 생성 API**, 실패/취소/부분환불 처리, 영수증/바우처 발급.
- 보안: 결제/개인정보는 서버·PG에서 처리(프론트에 비밀정보 미저장). 현 프로토타입은 카드번호 입력이 UI 예시일 뿐 전송 없음.

---

## 5. 회원/인증

- 현재 위시리스트·비교·최근검색은 **localStorage**(비로그인). 로그인 버튼은 UI만.
- 필요: 오마이트립 회원 SSO, 위시/예약/견적의 **계정 동기화**, 마이트립 실 예약 내역 연동.

---

## 6. 다국어(i18n) / 콘텐츠

- 현재: UI 문자열만 사전(`i18n.ts`, ko 기본). 상품명·코스명·블로그 본문은 미번역(한/영 혼재).
- 필요: 상품/코스 **다국어 필드**, 블로그 번역, 통화별 가격 표기 정책.

---

## 7. 이미지

- 현재: `images.ts`가 seed를 해시해 `/public/golf/img` **CC 스톡 풀**에서 선택. 일부 골프 무관 이미지(예: 건물/동물) 노출됨.
- 필요: 자사 보유/라이선스 **실사진**(호텔·코스·홀별), CDN·webp 최적화, `next/image` 도입 검토.

---

## 8. 비기능/기술 고려

- **렌더링**: 현재 정적 export(SEO 유리, CDN 배포). 실시간 재고·가격은 **CSR fetch** 또는 SSR/ISR 전환 필요 → 라우팅 전략 재검토.
- **성능**: 히어로 eager+LCP, 이하 lazy 적용됨. 실이미지 도입 시 사이즈·webp 관리.
- **접근성**: 현 통과 수준 유지(키보드·라벨·h1) — [04 문서].
- **분석/로그**: 전환 퍼널(검색→상세→예약) 이벤트 설계 필요(현재 없음).

---

## 9. 최소 실서비스화(MVP) 우선순위 제안

1. 골프장 마스터 + 상품(패키지) 실데이터 (ELLIS 스키마 신설)
2. 티타임 조회(요청형이라도) + 가격 확정
3. 결제(PG) + 예약 생성 + 마이트립 연동
4. 회원 SSO
5. 실이미지·다국어·실시간 환율 (품질 고도화)
