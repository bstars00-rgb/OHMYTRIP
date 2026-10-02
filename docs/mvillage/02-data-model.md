# 02. 데이터 모델 (Data Model)

> `src/mocks/mvillage/data.ts` + `src/features/mvillage/*` 기준. 실서비스화 시 이 스키마가 API 응답 계약의 출발점. · 갱신 2026-10-02
> 목데이터: `mocks/mvillage/data.ts`(컬렉션·브랜드·목적지·시설·지표·가치·헬퍼) · `features/mvillage/images.ts`(이미지 리졸버) · `features/mvillage/translations.ts`(다국어 사전) · `features/mvillage/i18n.tsx`(Provider/Hook).

---

## 1. 핵심 엔티티 관계

```
Collection(목적별 컬렉션) ──(brandKeys)──> Brand(브랜드)
Brand ──(brandKey)──< Property(시설) >──(collectionKeys)── Collection
Destination(목적지)  ── city 매칭 ──  Property.city
Property ──(ROOM_META × fromKRW)──> RoomPlan(객실타입, 예약 파생)
STATS / VALUES  ── 그룹 지표 · 브랜드 가치(독립)
[다국어] translations.ts(UI/CONTENT/CITY/BADGE/ROOMS/BRAND_STORY) ──(key)── 위 전 엔티티
```

- 브랜드관 홈/브랜드 상세/예약/제휴 4개 화면이 모두 이 목데이터를 직접 import. 실연동 시 서비스 레이어로 교체([03 문서]).

---

## 2. Collection (목적별 컬렉션) — “호텔이 아니라 라이프스타일 컬렉션으로 판매”

| 필드 | 타입 | 설명 |
|---|---|---|
| `key` | string | 식별자(premium-escape 등) · 필터 키 |
| `name` / `nameKo` | string | 영문명 / 한글 서브명 |
| `icon` | 'sunrise'·'city'·'bed'·'laptop' | 카드 아이콘 |
| `tone` | Tone | forest·terracotta·gold·sage(색 토큰 매핑) |
| `purpose` | string | 허니문·2030 자유여행·실속 출장·장기투숙 등 |
| `message` | string | 한국 판매 메시지 |
| `blurb` | string | 설명 |
| `brandKeys` | string[] | 소속 브랜드 key |

현재 **4개**: Premium Escape(허니문/기념일) · Urban Discovery(2030 도시) · Smart City Stay(실속/단기) · Work & Live(워크케이션/롱스테이).

---

## 3. Brand (브랜드 포트폴리오) — 멀티브랜드 피라미드

| 필드 | 타입 | 설명 | 실연동 시 소스 |
|---|---|---|---|
| `key` | string | 식별자(brand/[key] 라우트) | 브랜드 마스터 |
| `name` | string | 브랜드명(미번역 고유명사) | 브랜드 |
| `tierLabel` / `tierRank` | string / 1~5 | 등급 라벨 / 피라미드 순위 | 브랜드 |
| `tone` | Tone | 색 토큰 | 브랜드 CI |
| `target` | string | 타깃 세그먼트 | 마케팅 |
| `tagline` / `blurb` | string | 태그라인 / 소개 | 브랜드 자산 |
| `facilities` | number\|null | 전체 시설 수(null=신규 준비) | 재고/운영 |
| `omhOpen` | number\|null | 오마이호텔 채널 개방 시설 수 | 채널/allotment |
| `cities` | string[] | 전개 도시 | 운영 |

현재 **7개**(tierRank 순): Grand Signature(1) · Signature(2) · Savvy(3) · M Village Hotel(3) · Premier(3) · Express(4) · Harmony Living Suites(5).

> 브랜드 **스토리 콘텐츠**는 데이터가 아니라 `translations.ts`의 `BRAND_STORY`(4개 언어 × 7브랜드)로 분리 관리 → `tstory(brandKey)`.

---

## 4. Property (시설) — 예약 단위

| 필드 | 타입 | 설명 | 실연동 시 소스 |
|---|---|---|---|
| `id` | string | 시설 식별자(book/[id] 라우트) | ELLIS 상품/시설 |
| `name` | string | 시설명(미번역) | 상품 |
| `brandKey` | string | 소속 브랜드 | 상품↔브랜드 |
| `collectionKeys` | string[] | 소속 컬렉션(필터 키) | 분류 |
| `city` / `cityEn` | string | 도시(한/영) | 상품 |
| `blurb` | string | 소개 | 상품 |
| `features` | string[] | 특징(모달 리스트) | 상품 |
| `fromKRW` | number | **1박 최저가(지표성 목값)** · 객실 요율 베이스 | **가격 API** |
| `imgKind` | ImgKind | 이미지 풀 종류 | 이미지 CMS |
| `badges` | string[]? | 신규/베스트셀러/한국 인기/오픈예정 | 머천다이징 |
| `seed` | string | 이미지 결정용 시드 | 이미지 CMS |

현재 **12개(대표)**. `ImgKind = 'resort'·'city'·'beach'·'nature'·'interior'·'suite'`.

### 4.1 RoomPlan (객실 타입) — 예약 파생 (`MVillageBooking` `ROOM_META`)
`{ key, occ(최대투숙), mult(요율배수), left(잔여실), breakfast }` — 3종:

| key | 최대투숙 | 요율 배수 | 잔여실 | 조식 |
|---|--:|--:|--:|:--:|
| standard | 2 | ×1.0 | 6 | ✘ |
| deluxe | 2 | ×1.35 | 3 | ✔ |
| suite | 3 | ×1.9 | 1 | ✔ |

- 객실 요율 = `round1000(property.fromKRW × mult)`. 라벨·퍽스(`name`, `perks[]`)는 `ROOMS`(4개 언어)에서 인덱스로 매핑.
- **요율 배수·잔여실·세율(10%)은 프로토타입 가정값** → 실요율/재고/세금은 [03 문서].

---

## 5. Destination · STATS · VALUES

**Destination**(6): `{ key, city, cityEn, hook(한국 소구), facilities, isNew?, imgKind }` — 다낭·호이안 / 하노이 / 나트랑 / 달랏 / 호치민 / 푸꾸옥.

**STATS**(4): `{ value, unit, label }` — 60개 시설 · 2,584실 · 6개 브랜드 · 7개 도시. 홈에서 카운트업.

**VALUES**(3): `{ en, ko, desc }` — Good People Better Stays · Local Living Global Connections · Stay·Work·Explore·Belong.

**헬퍼**(`data.ts`): `brandByKey(k)` · `collectionByKey(k)` · `propsByCollection(k)` · `wonKR(n)`(₩ 한국 통화 포맷).

---

## 6. 다국어 데이터 모델 (`features/mvillage/translations.ts` + `i18n.tsx`)

> 한국어를 **원본(source of truth)** 으로 두고, en/ja/zh를 오버레이로 얹는 구조. `data.ts`는 한국어 그대로 유지 → 번역은 translations에만 추가(데이터·번역 분리).

| 구조 | 내용 | 접근 헬퍼 |
|---|---|---|
| `UI: Record<Lang, Dict>` | 화면 크롬 문자열(내비·버튼·라벨·섹션 헤더·예약/제휴/캘린더/브랜드 접두사 `nav.`/`hero.`/`col.`/`stays.`/`brands.`/`dest.`/`values.`/`cta.`/`card.`/`modal.`/`meta.`/`foot.`/`bk.`/`pt.`/`db.`/`br.`) | `t(key)` → `UI[lang] ?? UI.ko ?? key` |
| `CONTENT: Record<'en'\|'ja'\|'zh', {collection,brand,destination,property,value,stat}>` | 콘텐츠 번역 오버레이(ko는 data.ts 원본) | `tc(cat,key,field,ko)` / `tcArr(...)` |
| `CITY: Record<koCity, {en,ja,zh}>` | 도시명 번역 | `tcity(ko)` |
| `BADGE: Record<koBadge, {en,ja,zh}>` | 배지 번역 | `tbadge(ko)` |
| `ROOMS: Record<Lang, {name,perks[]}[]>` | 객실 타입 라벨·퍽스(3종) | `rooms()` |
| `BRAND_STORY: Record<Lang, Record<brandKey, string>>` | 브랜드 스토리(7브랜드 × 4언어) | `tstory(brandKey)` |
| `LANGS` | `[{code,label}]` — ko 한국어 / en English / ja 日本語 / zh 中文 | 언어 스위처 |

- `type Lang = 'ko' | 'en' | 'ja' | 'zh'`.
- **Provider**: `MVillageI18nProvider`(lang state, `localStorage(mv-lang)` 복원·저장, `<html lang>` 설정) → `MVillageShell`에서 래핑.
- **Hook**: `useMV()` → `{ lang, setLang, t, tc, tcArr, tcity, tbadge, tstory, rooms }`.
- 폴백 체인: 모든 헬퍼가 번역 누락 시 **ko 원본**으로 안전 폴백(화면 공백 없음).

---

## 7. 이미지 리졸버 (`features/mvillage/images.ts`)

- `mvImg(seed, kind)`: seed를 해시 → `kind`별 풀에서 결정론적 선택 → `/public/mvillage/img/{file}.jpg`. `asset(path)`가 GitHub Pages `basePath`(`NEXT_PUBLIC_BASE_PATH`) 자동 반영.
- 풀 종류: resort·beach·city·nature·interior·suite·hero. 브랜드 상세 히어로는 `brand-{key}` 시드 + 브랜드별 kind 매핑.
- ⚠️ 현재 CC 스톡 풀 — 실서비스화 시 **M Village 자사 실사진**으로 교체([03·04 문서]).

---

## 8. 목데이터 현황 (2026-10-02)

| 데이터 | 수량 | 비고 |
|---|---|---|
| 컬렉션 | **4** | 목적별(프리미엄/어반/스마트/워크&리브) |
| 브랜드 | **7** | 멀티브랜드 피라미드 |
| 시설(Property) | **12** | 대표 시설, 브랜드·컬렉션·도시 조합 커버 |
| 객실 타입 | **3** | 스탠다드/디럭스/스위트(예약 파생) |
| 목적지 | **6** | 한국 소구 훅 포함 |
| 지표 / 가치 | 4 / 3 | 그룹 지표 카운트업 · 브랜드 가치 |
| 언어 | **4** | ko/en/ja/zh — **UI + 콘텐츠 + 브랜드 스토리 전부 번역** |
| 브랜드 스토리 | 7 × 4 | `BRAND_STORY`(브랜드 상세 전용) |
| 이미지 | `/public/mvillage/img` 풀 | CC 스톡 — **실사진 교체 필요** |

**주의**: 가격은 **브랜드 포지셔닝용 지표값**(fromKRW)으로 실요율과 무관. 요율 배수·세율·잔여실은 프로토타입 가정값. → 실요율/재고/정산/환율은 [03 문서].
