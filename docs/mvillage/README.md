# M VILLAGE 브랜드관 — 기획 & 프로토타입 명세

> 작성: 2026-09-23 · 대상: 기획팀 / OhMyHotel × Modern Village Lifestyle GSA
> 성격: **프론트엔드 프로토타입** (실판매·요율·재고·예약 미연동). GSA 전략 제안서의 “브랜드 전용 존”을 화면으로 구현.
> 출처: 「Modern Village Group 전략 제안서 3rd Draft」 / 「OMH_MVillage_Korea_GSA_GTM_Client_Deck_v0.3」 (2026.09)

---

## 0. 한눈에 보기

| 항목 | 내용 |
|---|---|
| 무엇 | 오마이(호텔/트립) 안의 **M Village 브랜드 전용 랜딩(브랜드관)** |
| 라이브 | `/mvillage` (예: https://bstars00-rgb.github.io/OHMYTRIP/mvillage/) |
| 진입 | 오마이 메인 홈 **브랜드 배너**(호텔 하단, NEW · 중앙 정렬) → 클릭 → `/mvillage` |
| 컨셉 | “호텔이 아니라 **베트남 라이프스타일 컬렉션**” |
| 구성 | 히어로 · 지표(카운트업) · 4 목적별 컬렉션 · 대표 시설(필터+모달) · 브랜드 포트폴리오 · 목적지 · 브랜드 가치 · 제휴 문의 |
| **예약 / 제휴 분리** | 시설 예약 = **`/mvillage/book/[id]` 실시간(OTA) 부킹**(객실 선택→예약자·결제→즉시 확정) · 제휴 문의 = **`/mvillage/partner` 별도 페이지**(B2B 폼) |
| CI | modernvillagelifestyle.vn 반영 — **Be Vietnam Pro + Fraunces**, **오렌지 #e24d14/#f16a24** · near-black · 화이트 · 스크롤 리빌/켄번스 모션 |
| 데이터 | 목데이터 — 컬렉션 4 · 브랜드 7 · 시설 12(대표) · 목적지 6 · 객실 타입 3(예약) |
| 격리 | `.mvillage` 스코프 + `MVillageShell` body 클래스 스왑 → 클론/골프와 무간섭, **롤백 가능** |

---

## 1. 배경 · 목표 (전략 제안서 요약)

- 한국은 베트남 최대 송출국(2025년 430만 명). M Village 시설에 **한국 고객이 이미 묵고 있으나 “다낭 바다 앞 호텔”로만 기억** — 예약은 쌓여도 브랜드는 안 남는다.
- 원인: 공식 사이트는 영어·베트남어뿐, **브랜드의 한국어 접점이 없음**. OTA는 객실을 팔지 브랜드를 세우지 않음.
- GSA 제안의 핵심 실행 중 하나가 **“브랜드 전용 존”** — 오마이 플랫폼 안에서 시설이 흩어지지 않고 **브랜드/포트폴리오 단위로 보이게** 하는 것. 본 브랜드관이 그 화면 구현.

**목표**: 한국 고객이 “M Village”라는 이름과 6개 라이프스타일 브랜드를, **목적(허니문/도시/실속/워크케이션)** 기준으로 인지·탐색하게 만든다.

---

## 2. 타깃 · 포지셔닝

- **핵심 메시지**: 개별 호텔이 아니라 **목적으로 고르는 “베트남 라이프스타일 컬렉션”**.
- **타깃**: ① 2030 도시·감성 여행(어반) ② 허니문·기념일(프리미엄) ③ 실속 출장·단기(스마트) ④ 워크케이션·롱스테이(워크&리브).
- **판매 언어**: “머물고 싶은 베트남” · “도심 감성 스테이” · “출장과 휴식을 함께” · “브랜드별 선택이 쉬운 포트폴리오”.

---

## 3. 정보구조(IA) · 진입 동선

```
오마이 메인(/hotel) ── [M Village 브랜드 배너: NEW] ──▶ /mvillage (브랜드관)
                                                         │  헤더: ← 오마이트립 · M VILLAGE 로고 · 앵커 nav
/mvillage 앵커: #collections · #stays · #brands · #destinations · #cta
컬렉션 카드/필터 클릭 → 대표 시설 그리드 필터 → 시설 카드 → 상세 모달 → 예약·제휴 문의(#cta)
```

- 진입 배너는 **메인 홈 하단(호텔 검색 아래)** 에 삽입. 데스크톱·모바일 홈 모두 노출.
- 브랜드관은 **단일 랜딩(원페이지)** — 예약 기능은 클론/골프 도메인이 담당, 브랜드관은 인지·탐색·문의에 집중.

---

## 4. 페이지 구성 (`/mvillage`)

| # | 섹션 | 내용 |
|---|---|---|
| 1 | **히어로** | M VILLAGE 워드마크 · “A MORE MEANINGFUL STAY” · “호텔이 아니라, 베트남을 사는 방식으로” · CTA(컬렉션/브랜드) · 태그(Local Living · Global Connections · Stay·Work·Explore·Belong) · “Vietnam Lives Here” |
| 2 | **지표** | 60개 시설 · 2,584실 · 6개 브랜드 · 7개 도시 |
| 3 | **4 목적별 컬렉션** | Premium Escape / Urban Discovery / Smart City Stay / Work & Live — 아이콘·목적·판매 메시지·소속 브랜드. 클릭 시 대표 시설 필터 |
| 4 | **대표 시설** | 컬렉션 필터(전체+4) + 카드 그리드(브랜드 태그·배지·1박 지표가) → **상세 모달**(사진·특징·브랜드 소개·문의 CTA) |
| 5 | **브랜드 포트폴리오** | 7개 브랜드 카드(티어·타깃·소개·시설수·도시). 상위→하위 |
| 6 | **인기 목적지** | 다낭·하노이·나트랑·달랏·호치민·푸꾸옥 — **한국 시장 소구 훅**(한국인 1위/직항/신규) |
| 7 | **브랜드 가치** | Good People Better Stays · Local Living Global Connections · Stay·Work·Explore·Belong |
| 8 | **제휴 CTA** | 제휴 문의는 `/mvillage/partner`로 분리(개별 예약과 구분) |

### 4.1 예약 — 실시간(OTA) 부킹 `/mvillage/book/[id]`
시설 카드/모달 **예약하기** → 객실 타입 3종(스탠다드/디럭스/스위트, 실시간 요금·잔여실) 선택 → 예약자 정보 + 결제 수단(카드/카카오·네이버·토스페이 UI) → **즉시 예약 확정**(예약번호·바우처 안내). 요금 = 객실요율 × 박 × 객실 + 세금 10%. *실판매·PG 미연동(실서비스 시 오마이호텔 실시간 예약·결제로 확정).*

### 4.2 제휴 문의 — 별도 랜딩 `/mvillage/partner`
여행사·기업/MICE·단체 **B2B 전용 창구**. 제휴 가치(한국 브랜드 채널·그룹 요율·시즌 기획전) + 문의 폼(유형·회사·담당자·연락처·내용) → 접수 확인. 개별 예약과 완전 분리.

---

## 5. 데이터 모델 (`src/mocks/mvillage/data.ts`)

- **Collection**(4): key·name·icon·tone·purpose·message·brandKeys.
- **Brand**(7): Grand Signature · Signature · Savvy · M Village Hotel · Premier · Express · Harmony Living Suites — tier·target·blurb·facilities·cities.
- **Destination**(6): city·hook(한국 소구)·facilities·isNew.
- **Property**(12 대표): name·brandKey·collectionKeys·city·features·**fromKRW(지표성 목값)**·badges.
- **STATS / VALUES**: 그룹 지표 · 브랜드 가치.
- 헬퍼: `brandByKey · collectionByKey · propsByCollection · wonKR`.

> 시설/브랜드 구성·수치는 전략 제안서·GTM 기준. 가격은 **브랜드 포지셔닝용 지표값**으로 실요금과 무관.

---

## 6. 디자인 토큰 (`src/styles/mvillage.css`)

브랜드 GTM Deck 팔레트·타이포 반영. 모두 `.mvillage` 스코프.

> 2026-09 갱신: 발주자 요청으로 **modernvillagelifestyle.vn 실제 CI**에 맞춰 재스킨(오렌지·near-black·화이트, Be Vietnam Pro).

| 토큰 | 값 | 용도 |
|---|---|---|
| `--mv-orange` / `--mv-orange-2` | **#e24d14 / #f16a24** | Primary accent(악센트·아이콘·즉시예약·활성) |
| `--mv-forest` / `--mv-forest-700` | #16211b / #101512 | 헤딩·기본 버튼·푸터·오버레이(near-black) |
| `--mv-gold` / `--mv-sage` | #b0894e / #8b9d7e | 컬렉션 톤 |
| `--mv-ivory` / `--mv-cream` | #f6f3ec / #fbf9f4 | 배경/서페이스 |
| 서체 | **Be Vietnam Pro**(본문·한글 Pretendard 폴백) + **Fraunces**(워드마크·라틴 디스플레이 ≈ forma) | |
| 모션 | 스크롤 리빌(fade-up)·지표 카운트업·히어로 켄번스·카드 스태거 (`prefers-reduced-motion` 대응) | |

---

## 7. 격리 · 롤백

- `MVillageShell` 마운트 시 body `omt-desktop/omt-mobile` 제거 → `mvillage-body` 부여, 언마운트 복원.
- 모든 스타일 `.mvillage` 스코프. 진입 배너만 `.mv-banner` 스코프(호스트 전역 CSS 오버라이드는 배너에서 `!important`로 고정).
- **롤백 대상**: `app/mvillage` · `components/mvillage` · `mocks/mvillage` · `features/mvillage` · `styles/mvillage*.css` · `public/mvillage` · `docs/mvillage` + 홈의 `<MVillageBanner/>` 2곳(HomeMain·MobileHomeMain).

---

## 8. 실서비스화 시 교체 지점

| 현재(목) | 대체(실) |
|---|---|
| `public/mvillage/img` 스톡 | **M Village 자사 실사진**(브랜드·시설별) |
| Property `fromKRW` 지표값 | 실요율/재고 API (그룹 단위 요율·allotment) |
| 문의 CTA(목) | 카카오 채널·상담·견적 접수, 예약은 오마이 예약 플로우 연동 |
| 한국어 카피(브랜드관) | M Village 브랜드 자산 원본 기반 한국어 재작성(제작비 GSA 부담) |
| 브랜드/시설 구성 | ELLIS 골프텔형 스키마처럼 M Village 브랜드·시설 마스터 연동 |

---

## 9. 현황 (QA)

- tsc 0 · eslint 0 · build 성공(정적 export, `/mvillage` 포함 119 페이지).
- 라이브 실측(1440 / 375): 이미지 깨짐 0 · 콘솔 에러 0 · 가로 오버플로 0 · 컬렉션 필터/모달 동작 · 배너→브랜드관 진입 정상 · body 클래스 격리 정상.
- **미포함(범위 외)**: 실사진·실요율·실예약·다국어. 브랜드관은 인지/탐색/문의용 랜딩.
