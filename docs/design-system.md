# OHMYTRIP 디자인 시스템 (원본 추출 — Phase 1 초안)

출처: `www.ohmytrip.com/styles.d628958f24c14c02.css` 및 `m.ohmytrip.com/styles.254151b6cefe398c.css`의 `:root` CSS 변수 + computed style 실측.
**아래 값은 추정이 아니라 원본 CSS에서 그대로 추출한 값이다.**

## 1. Color

| 토큰(원본 변수명) | 값 | 용도 |
|---|---|---|
| `--c-black` | `#000` | 기본 텍스트 |
| `--c-white` | `#fff` | 반전 텍스트/배경 |
| `--c-gray-1` | `#f5f5f5` | 배경(연회색) |
| `--c-gray-2` | `#e0e0e0` | 보더 |
| `--c-gray-3` | `#ccc` | 보더/비활성 |
| `--c-gray-4` | `#888` | 보조 텍스트 |
| `--c-gray-5` | `#666` | 보조 텍스트 |
| `--c-gray-6` | `#333` | 본문 강조 |
| `--c-orange` | `#ef7f29` | **Primary(브랜드)** — CTA, 선택 상태, 일요일 |
| `--c-green` | `#008f42` | Secondary — hover-secondary 버튼 |
| `--c-red` | `#ff0000` | 오류/경고 |
| `--c-blue` | `#005eff` | (모바일 전용 추가) 링크/정보 |
| `--c-disabled` | `#ebebeb` | 비활성 배경 |
| `--c-orange-rgba` | `239, 127, 41` | rgba 조합용 |
| 헤더 배경(데스크톱) | `#f3f3f3` | computed 실측 (변수 아님) |
| 모바일 헤더 | `#fff` + `1px solid #eee` 하단 보더 | m-styles 실측 |

Overlay: `rgba(var(--c-black-rgba), .1/.25)` 패턴 사용.

## 2. Typography

- **폰트: Pretendard** (self-hosted, subset woff2, weight 100~900 전체 9종 + local() 폴백)
- Fallback 체인: `Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif`
- body 기본: 데스크톱 14px / letter-spacing **-0.5px** / color #000
- 한/영/숫자 동일 폰트(별도 숫자 폰트 없음). slick 아이콘 폰트(캐러셀) 별도.

| 토큰 | Desktop | Mobile |
|---|---|---|
| `--f-size-small` | 12px | 10px |
| `--f-size-base` | 14px | 12px |
| `--f-size-medium` | 16px | 14px |
| `--f-size-large` | 18px | 16px |
| `--f-size-extra` | 22px | 18px |
| `--f-size-big` | 26px | 26px |
| `--f-size-black` | 32px | 32px |

Weight 토큰: thin 100 / extlight 200 / light 300 / base 400 / medium 500 / semi 600 / bold 700 / extra 800 / black 900
Line-height 토큰: `--l-height-140: 140%`, `--l-height-150: 150%`, `--l-height-160: 160%`

## 3. Radius

| 토큰 | 값 | 용도 |
|---|---|---|
| `--radius-thin` | 5px | 작은 요소 |
| `--radius-light` | 10px | 버튼 sm |
| `--radius-small` | 15px | 버튼 md/lg, 입력류 |
| `--radius-medium` | 20px | 카드류 |
| `--radius-big` | 25px | 큰 카드/패널 |
| `--radius-half` / `--radius-full` | 50% / 100% | 원형 |

## 4. Shadow (원본 사용 빈도순)

| 값 | 용도(빈도) |
|---|---|
| `5px 5px 10px 0 rgba(0,0,0,.1)` | 카드/패널 기본 (7회) |
| `5px 5px 15px 0 rgba(0,0,0,.1)` | 큰 패널 (2회) |
| `0 8px 4px 0 rgba(0,0,0,.1)` / `0 4px 8px 0` / `0 3px 6px 0` | 드롭다운/팝오버 (각 2회) |
| `0 1px 3px 0 rgba(0,0,0,.1)`, `0 1px 0 rgba(0,0,0,.25)`, `0 0 5px 3px rgba(0,0,0,.25)` | 기타 |

헤더 그림자: 없음 (box-shadow: none, 배경색으로만 구분)

## 5. Buttons (원본 클래스 체계)

- 베이스 `.btn`: border 1px solid transparent
- `.btn.sm`: h 36px, padding 0 20px, font 14px/500, radius 10px
- `.btn.md`: h 40px, padding 0 20px, font 14px/600, radius 15px
- `.btn.lg`: h 52px, padding 0 20px, font 16px/600, radius 15px
- `.btn.primary`: 흰 글자 + 오렌지 배경
- `.btn.line.default`: 라인 버튼 (호텔 카드 "선택")
- `.btn.hover-primary:hover/:focus`: 오렌지 배경 전환
- `.btn.hover-secondary:hover/:focus`: **그린(#008f42)** 배경 전환
- `.btn:disabled`: 글자 `--c-gray-4`(#888), 배경 `--c-disabled`(#ebebeb), cursor not-allowed

## 6. Layout

| 항목 | 값 |
|---|---|
| 데스크톱 콘텐츠 폭 | **1200px 고정** (min-width 1200, 일부 1260) |
| 데스크톱 헤더 높이 | 74px |
| 모바일 헤더 높이 | 54px (`.header-inner`) |
| 모바일 body 폭 | min 320px ~ max 768px (태블릿: max-width 1024 → `--body-max-width:1024px`, 1366 → 1366px) |
| z-index | 콘텐츠 0~15, 헤더 20, 팝오버/모달 레이어 100, 최상위(로더 등) 2100 |
| 검색 패널(메인) | 585×433 |
| 메인 배너 이미지 | 585×433 |
| 와이드 배너 | 783×232 |
| 프로모션 배너 | 387×232 |
| 호텔 리스트 카드 | 850×170 |

Breakpoints(실측): 데스크톱 사이트는 반응형 없음. 모바일 사이트 내부: 365 / 370 / 389 / 390 / 512 / 576 / 768 / 1024 / 1366px + `(hover: hover)`.

## 7. 상태별 스타일 요약

- 입력 placeholder 상태: `.text.placeholder` (회색 글자)
- 검색 버튼 비활성: #ebebeb bg / #888 text → 활성: #ef7f29 bg / #fff text
- 달력: `passday`(지난날) 회색 비활성, `today` 표시, 선택일 = 오렌지 원 + 흰 글자, 범위 = ::before/::after 띠, `holiday` 별도 클래스, 일요일 헤더 오렌지
- 카운터: `.btn-counter.down/.up` 이미지 버튼(default/active 에셋 구분) — min 도달 시 down 비활성 에셋
- 로딩: `ajax-loader.gif` 사용 확인 (스피너 이미지)
- 별점: `.rate-star.sm.s1~s5` 스프라이트(ico-rating-sm-star)

## 8. Iconography (원본 에셋 파일명 인벤토리 일부)

`ico-header-logo`, `ico-main-category-{hotel,flight,activity,rentalcar,airtel}-{active,default}(@2x)`,
`ico-destination-{city,hotel,landmark}`, `btn-{prev,next}-month`, `btn-calendar-reset`,
`btn-counter-{up,down}-{default,active}`, `ico-add-rounded`, `ico-selectbox-arrow`,
`ico-accordion-{default,active}`, `ico-filter-reset`, `ico-filter-extend`, `ico-input-search`,
`ico-compare-default`, `ico-checkbox-default`, `ico-rating-sm-star`, `ico-list-wish-default`,
`btn-pagination-{first,prev,next,last}`, `bg-map-view`, `ico-toggle-active`, `ajax-loader.gif`,
`ico-list-anchor`, `ico-bottom-partner{1,3}`, `img-main-title.png`, `img-app-icon.png`

→ 클론에서는 Lucide 대체 금지. 원본 에셋을 `/public/icons`에 수집하거나 동일 형태로 재제작. `/docs/assets-inventory.md`에 기록.

## 9. 클론 구현용 토큰 파일

- `src/styles/tokens.css` — 원본 변수명 그대로 CSS Variables 정의 (데스크톱 값 기준 + `[data-platform="mobile"]` 오버라이드)
- `src/config/design-tokens.ts` — TS 상수 export
