# 01. 기능 명세 (Functional Spec)

> M VILLAGE 브랜드관 프로토타입 · 라우트·페이지·유저플로우·상태 로직 · 갱신 2026-10-02
> 성격: 프론트엔드 프로토타입(실판매·요율·재고·PG 미연동). GSA 전략 제안서의 “브랜드 전용 존”을 화면으로 구현.
> 출처: 「Modern Village Group 전략 제안서 3rd Draft」 / 「OMH_MVillage_Korea_GSA_GTM_Client_Deck_v0.3」 (2026.09)

---

## 1. 정보구조(IA) / 라우트 맵

| # | 라우트 | 화면 | 컴포넌트 | 정적/동적 |
|---|---|---|---|---|
| 1 | `/mvillage` | 브랜드관 홈(원페이지 랜딩) | `MVillageHall` | 정적 |
| 2 | `/mvillage/brand/[key]` | 브랜드 상세·스토리 | `MVillageBrand` | 동적 **7개**(generateStaticParams) |
| 3 | `/mvillage/book/[id]` | 시설 예약(실시간 OTA) | `MVillageBooking` | 동적 **12개**(generateStaticParams) |
| 4 | `/mvillage/partner` | 제휴 문의(B2B) | `MVillagePartner` | 정적 |

**공통 레이아웃**: `app/mvillage/layout.tsx` → `MVillageShell`(격리 래퍼 + i18n Provider) → `MVillageHeader` / `MVillageFooter`. 레이아웃에서 `mvillage.css` + `mvillage-pages.css` + Pretendard 로드.

> **설계 결정 — 브랜드관은 “인지·탐색·전환”의 3층 구조.** 원페이지 랜딩(`/mvillage`)에서 브랜드/컬렉션을 **인지**하고, 브랜드 상세(`/brand/[key]`)에서 스토리로 **탐색**하며, 예약(`/book/[id]`)·제휴(`/partner`)에서 **전환**한다. 예약과 제휴는 성격이 다르므로(개인 OTA vs B2B) 완전히 다른 페이지로 분리.

### 1.1 헤더 (`MVillageHeader`)
- **로고 클러스터**: `← 오마이트립` 복귀 링크 + `M VILLAGE` 워드마크(Fraunces). 로고 → `/mvillage`.
- **글로벌 앵커 내비**: 라이프스타일 컬렉션(`/mvillage#collections`) · 브랜드(`#brands`) · 목적지(`#destinations`) · 제휴 문의(`/mvillage/partner`).
- **언어 스위처**(우측): Globe 아이콘 + 현재 언어 + 드롭다운 → **한국어 / English / 日本語 / 中文** 4개. 선택 시 전역 상태·`localStorage(mv-lang)`·`<html lang>` 갱신(새로고침 불필요, 전 페이지 즉시 반영).
- 모바일: 언어 스위처는 `margin-left:auto`로 우측 정렬, 현재 언어 라벨 숨김(아이콘만).

### 1.2 오마이(호텔/트립) 진입점
- 오마이 메인 홈 **하단(호텔 검색 아래)** 에 `MVillageBanner` 삽입(데스크톱 `HomeMain` + 모바일 `MobileHomeMain` 2곳). `NEW` 배지 · 중앙 정렬 · 클릭 시 `/mvillage`.
- 격리 전환: 브랜드관 진입 시 body 클래스 `omt-desktop/omt-mobile` 제거 → `mvillage-body` 부여, 이탈 시 원복(`MVillageShell` 언마운트 시 복원).

---

## 2. 유저 플로우

### F1. 인지 → 탐색 → 예약 (핵심 전환)
```
오마이 메인 → [M Village 배너: NEW] → /mvillage (브랜드관)
 히어로/지표 → 4 목적별 컬렉션 → (컬렉션 클릭) 대표 시설 그리드 필터
   → 시설 카드 → 상세 모달(사진·특징·브랜드 소개)
     → [예약하기] → /mvillage/book/[id]
       → (날짜·객실수·인원) → 객실 타입 선택 → 예약자 정보·결제수단
         → [즉시 예약] → 예약 확정(예약번호·바우처 안내)
```

### F2. 브랜드 탐색 → 예약
```
/mvillage #brands 브랜드 카드 → /mvillage/brand/[key]
 브랜드 히어로(티어·태그라인) → 브랜드 스토리 → 소속 컬렉션 칩
   → 대표 시설(해당 브랜드 시설만) → [예약하기] → /mvillage/book/[id]
또는 히어로 [이 브랜드 예약하기] → 대표 시설 1호 예약 바로가기
```

### F3. 제휴 문의 (B2B, 예약과 분리)
```
/mvillage #cta [제휴 문의하기] 또는 헤더 ‘제휴 문의’ → /mvillage/partner
 제휴 유형(여행사/기업·MICE/단체/기타) → 회사·담당자·연락처·내용 → [문의하기]
   → 접수 확인(참조번호 MVP-xxxx)
```

### F4. 다국어
언어 스위처(헤더) → UI·콘텐츠 동시 전환(ko/en/ja/zh) → `localStorage(mv-lang)` 유지 → 재방문·타 페이지 이동 시 선택 언어 지속.

---

## 3. 페이지별 기능 명세

### 3.1 브랜드관 홈 `/mvillage` (`MVillageHall`)
- **A. 히어로**: M VILLAGE 워드마크 · “A MORE MEANINGFUL STAY” eyebrow · 고객 마케팅 카피(`hero.title`을 `|`로 줄 분할, 2번째 줄 오렌지 강조) · 서브카피 · CTA(컬렉션 둘러보기 / 브랜드 보기) · 태그(Local Living · Global Connections · Stay·Work·Explore·Belong) · “Vietnam Lives Here” 배지 · 히어로 켄번스.
- **B. 지표**: 4개 STAT(60개 시설 · 2,584실 · 6개 브랜드 · 7개 도시). **스크롤 리빌 + 카운트업**(`setInterval` 이징), 하단 악센트 바 `transform: scaleX`.
- **C. 4 목적별 컬렉션**: Premium Escape / Urban Discovery / Smart City Stay / Work & Live — 이미지·아이콘(톤 원형, 카드 좌상단 고정 정렬)·목적·판매 메시지·소속 브랜드 칩. **클릭 시 대표 시설 필터**(`#stays`로 스크롤).
- **D. 대표 시설**: 컬렉션 필터(전체+4) + 카드 그리드. 카드 = 이미지·배지(한국 인기/베스트셀러/신규/오픈예정)·브랜드 태그·도시·소개·1박 지표가 → **상세 모달**.
  - **모달**: 사진·브랜드 태그·도시·소개·브랜드 태그라인+소개·특징 리스트·1박가 → **[예약하기]**(→ `/mvillage/book/[id]`) / 닫기.
- **E. 브랜드 포트폴리오**: 7개 브랜드 **카드(→ `/mvillage/brand/[key]` 링크)** — 순번·브랜드명·티어·타깃·소개·시설수·도시. 상위→하위.
- **F. 인기 목적지**: 6개(다낭·호이안 / 하노이 / 나트랑 / 달랏 / 호치민 / 푸꾸옥) — 한국 시장 소구 훅·시설수·`NEW`.
- **G. 브랜드 가치**: Good People Better Stays · Local Living Global Connections · Stay·Work·Explore·Belong.
- **H. 제휴 CTA**: 제휴 문의(`/mvillage/partner`) + 전체 시설 보기.

### 3.2 브랜드 상세 `/mvillage/brand/[key]` (`MVillageBrand`)
- **히어로**: 브랜드별 키비주얼(결정론적 톤)·오버레이 · `← 브랜드 전체 보기` · 순번 배지 · 티어 · **브랜드명(Fraunces)** · 태그라인 · 메타(도시·시설수·타깃 pill) · **[이 브랜드 예약하기]**(대표 시설 1호 예약 바로가기).
- **브랜드 스토리**: eyebrow(브랜드 스토리) · 브랜드명 · **스토리 문단**(`tstory`, 4개 언어) · 소개 문단 · **소속 컬렉션 칩**(중복 라벨 방지: 영문명과 번역명이 같으면 1개만) · **팩트 사이드바**(등급·타깃·시설수·도시, sticky).
- **대표 시설**: 해당 브랜드 소속 시설만(`PROPERTIES.filter(brandKey)`) 카드 그리드 → **각 카드 = `/mvillage/book/[id]` 링크**(예약하기).
- **CTA**: 더 많은 브랜드 보기(`#brands`) + 제휴 문의.
- 잘못된 key → “브랜드를 찾을 수 없습니다” + 브랜드 전체 보기(단, 7개는 빌드시 정적 생성되므로 정상 경로는 404 없음).

### 3.3 예약 — 실시간(OTA) `/mvillage/book/[id]` (`MVillageBooking`)
- **헤더**: `← 목록으로` · “Real-time Booking” eyebrow · 시설명 · 도시·브랜드·**즉시확정 배지**.
- **검색 바**(상단): **날짜(체크인/체크아웃)** = `MVillageDateBox`(오마이트립 체크인 박스 UX 통일, 2개월 범위 캘린더) · 객실수 스텝퍼(1~9) · 인원 스텝퍼(1~20). 마운트 시 기본값 = 오늘+14박~+16박.
- **객실 선택**: 3종(스탠다드/디럭스/스위트) — 사진·최대 투숙·조식·퍽스·잔여실(1실 이하 urgent 강조)·**1박 실시간 요율**(= `fromKRW × mult`, 천원 반올림). 선택 시 하이라이트.
- **예약자 정보**: 이름*·연락처·이메일*.
- **결제 수단**: 카드 / KakaoPay / NaverPay / Toss (칩 선택, UI).
- **예약 요약**(aside, sticky): 사진·시설명·일정·객실/인원·객실타입·`요율 × 박 × 객실`·세금(10%)·**총 결제금액** → **[즉시 예약]**(총액 표시). 필수 미입력 또는 박=0 시 비활성.
- **완료 상태**: 체크 아이콘·즉시확정 배지·시설/객실/일정 요약·**예약번호(`MV{ID3}{num}`)**·결제액·바우처 안내 → 브랜드관 돌아가기 / 다시 예약.
- 잘못된 id → “시설을 찾을 수 없습니다” + 브랜드관으로.
- ⚠️ 실 결제·실재고 없음(시뮬레이션). 연동은 [03 문서].

### 3.4 제휴 문의 `/mvillage/partner` (`MVillagePartner`)
- `← 브랜드관으로` · “Partnership Inquiry” eyebrow · 타이틀·리드.
- **제휴 가치 3카드**: 한국 브랜드 채널 · 포트폴리오 단위 요율 · 시즌 공동 기획전.
- **문의 폼**: 제휴 유형 칩(여행사/기업·MICE/단체/기타) · 회사명* · 담당자* · 연락처* · 이메일 · 내용 → **[문의하기]**(회사·담당자·연락처 필수).
- **사이드(aside)**: 빠른 상담(카카오·전화) · 신뢰 문구(OhMyHotel × M Village).
- **완료 상태**: 접수 확인·참조번호(`MVP-xxxx`)·안내 → 브랜드관 / 새 문의.

---

## 4. 상태 · 로직

| 상태 | 저장 | 설명 |
|---|---|---|
| 언어(Language) | React Context + `localStorage(mv-lang)` | ko(기본)/en/ja/zh · `MVillageI18nProvider`/`useMV()` · `<html lang>` 동기화 |
| 컬렉션 필터 | `MVillageHall` state | 전체+4 컬렉션, 카드/필터 클릭 |
| 상세 모달 | `MVillageHall` state | 선택 Property |
| 예약 날짜·객실·인원·객실타입·결제·예약자 | `MVillageBooking` state | 날짜 초기값 useEffect(하이드레이션 안전), 금액 파생 |
| 제휴 유형·폼·완료 | `MVillagePartner` state | 필수 검증 |

**검증 규칙**
- 예약: 객실 선택 + 박수>0 + 이름·이메일 입력 시에만 [즉시 예약] 활성.
- 제휴: 회사·담당자·연락처 필수.

**가격 계산(프로토타입)**
- 객실 요율 = `round1000(property.fromKRW × ROOM_META.mult)` (스탠다드 1.0 / 디럭스 1.35 / 스위트 1.9).
- 소계 = `요율 × max(1, nights) × 객실수`; 세금 = `round(소계 × 0.1)`; 총액 = 소계 + 세금.
- 예약번호 = `MV{id 앞3대문자}{100000 + total%900000}`; 제휴 참조 = `MVP-{1000 + (회사길이×37+담당길이)%9000}`.
- **요율 배수·세율·잔여실은 프로토타입 가정값** — 실요율/재고/정산은 [03 문서].

**i18n 적용 범위**
- `t(key)`: UI 크롬(내비·버튼·라벨·섹션 헤더). 누락 시 ko 폴백 → key.
- `tc/tcArr(cat,key,field,ko)`: 콘텐츠(컬렉션·브랜드·목적지·시설·가치·지표)를 ko 원본 기준, en/ja/zh는 `CONTENT` 오버레이. ko거나 번역 없으면 ko 반환.
- `tcity/tbadge`: 도시명·배지 매핑. `tstory(brandKey)`: 브랜드 스토리. `rooms()`: 객실 라벨·퍽스.
- **고유명사(시설명·브랜드명)는 미번역**(원형 유지) — 글로벌 OTA 관례.

**표시 그리드**: 컬렉션 4열 / 시설·목적지 3열 / 브랜드 2열(데스크톱) → 반응형 2·1열. 브랜드 상세 스토리 그리드 = 본문 + 300px 사이드(900px↓ 1열).
