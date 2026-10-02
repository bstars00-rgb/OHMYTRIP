# 04. 디자인 시스템 · QA/접근성 · 로드맵/리스크

> M VILLAGE 브랜드관 · 갱신 2026-10-02

---

## 1. 디자인 시스템 (CI)

발주자 요청으로 **modernvillagelifestyle.vn 실제 CI**에 맞춰 재스킨. 토큰: `src/styles/mvillage.css`(`.mvillage` 스코프, 변수·버튼·톤) + 레이아웃 `mvillage-pages.css` + 진입 배너 `mvillage-banner.css`(`.mv-banner`).

### 1.1 컬러
| 토큰 | 값 | 용도 |
|---|---|---|
| `--mv-orange` / `--mv-orange-2` | **#e24d14 / #f16a24** | Primary accent — 악센트·아이콘·즉시예약·활성·캘린더 선택 |
| `--mv-forest` / `--mv-forest-700` | #16211b / #101512 | near-black — 헤딩·기본 버튼·푸터·오버레이 |
| `--mv-terracotta` | = 오렌지 | 배지(hot)·브랜드 타깃 강조 |
| `--mv-gold` / `--mv-sage` | #b0894e / #8b9d7e | 컬렉션/브랜드 톤 |
| `--mv-ivory` / `--mv-cream` | #f6f3ec / #fbf9f4 | 배경/서페이스(섹션 교차) |
| 톤 매핑 | `[data-tone=forest/terracotta/gold/sage]` → `--tone`/`--tone-soft` | 컬렉션·브랜드 카드·칩 |

### 1.2 타이포 / 형태
- 서체: **Be Vietnam Pro**(`--mv-sans` 본문) + **Fraunces**(`--mv-serif` 워드마크·디스플레이 ≈ 실사이트 forma) + **Pretendard**(`--mv-serif-ko` 한글 헤딩·폴백).
- radius: sm / (기본) / lg / pill. 그림자: sm~lg. 컨테이너 max: `--mv-max`.
- 모션: 스크롤 리빌(fade-up)·지표 카운트업(`setInterval`)·히어로/브랜드 켄번스·카드 스태거·악센트 바 `scaleX`. 모두 `prefers-reduced-motion` 대응.

### 1.3 주요 컴포넌트 (재사용)
`MVillageShell(격리+i18n Provider) · MVillageHeader(앵커 nav + 언어 스위처) · MVillageFooter · MVillageHall(홈 원페이지) · MVillageBrand(브랜드 상세) · MVillageBooking(실시간 OTA) · MVillageDateBox(오마이트립식 2개월 범위 캘린더) · MVillagePartner(B2B 폼) · MVillageBanner(진입 배너)`.

### 1.4 격리 & 오마이 통합
- `MVillageShell`이 마운트 시 body `omt-desktop/omt-mobile` 제거 → `mvillage-body` 부여, 언마운트 복원. 모든 스타일 `.mvillage` 스코프 → **OMT 클론 / OHMYGOLF 와 상호 무간섭**(검증됨).
- **진입/복귀**: 오마이 메인 홈 하단 M Village 배너(NEW) → `/mvillage`; 헤더 `← 오마이트립` → 메인 복귀. 배너는 `.mv-banner` 스코프 + 호스트 전역 CSS 오버라이드를 `!important`로 고정(중앙 정렬·로고 화이트/serif 강제).
- **다국어**: `MVillageI18nProvider`가 셸을 감싸 전 페이지에 `useMV()` 공급. 언어 스위처 → 즉시 전환 + `localStorage(mv-lang)` + `<html lang>`.

---

## 2. QA / 접근성 현황

### 2.1 이번 갱신(2026-10-02) 확인 — 빌드/정적 게이트
| 항목 | 명령 | 결과 |
|---|---|---|
| TypeScript | `tsc --noEmit` | **0 error** ✅ |
| ESLint | `eslint src/{components,features,app}/mvillage` | **0 error / 0 warning** ✅ |
| Build | `npm run build` | **성공 · 정적 139페이지**(브랜드 상세 7 + 예약 12 포함) ✅ |

### 2.2 실동작 점검(로컬 dev 3007, DOM/텍스트 실측)
| 영역 | 테스트 | 결과 |
|---|---|---|
| 브랜드 상세 | `/brand/[key]` 7개 정적 생성·렌더 | 히어로·스토리·팩트·대표시설·CTA ✅ |
| 브랜드→예약 | 브랜드 카드/시설 카드 → `/book/[id]` | 라우팅·필터(브랜드별 시설) 정확 ✅ |
| **다국어** | 언어 스위처 ko/en/ja/zh | UI·콘텐츠·**브랜드 스토리**·도시·배지 전부 전환(브랜드 상세 en/ja 실측) ✅ |
| i18n 폴백 | 번역 누락 | ko 원본 폴백(공백 없음) ✅ |
| 칩 중복 | 영문=번역명일 때(예: en Premium Escape) | 중복 라벨 억제(“X · X” 방지) ✅ |
| 예약(OTA) | 객실·게스트·결제수단·즉시예약 | 요율×박×객실+세금10% 합산·예약번호 ✅ |
| 콘솔 에러 | 브랜드 상세 | **0** ✅ |

### 2.3 점수 (증거 기반, 정직 — 2026-10-02 갱신)
| 구분 | 점수 | 변동 | 캡 요인 |
|---|---|---|---|
| **기획(제품)** | **8.8 / 10** | ▲ 8.4 | 세분화 명세서(4종)·**다국어 4개 언어**·**브랜드별 상세/스토리** 완료로 이전 캡 3건 해소. 잔여: 실데이터·요율·재고·PG 미연동(의도된 프로토타입 범위) |
| **QA(품질·구현)** | **8.6 / 10** | = | 스톡 이미지(시각 완성도)·CI 실사이트 **근사**(forma→Fraunces, 레이아웃 자체설계)·E2E 자동화 없음·Lighthouse/픽셀diff 미실측·접근성 전수 미검증 |
| **종합** | **8.7 / 10** | ▲ 8.5 | |

> 이전(2026-10-02 1차 QA) 대비 **명세서 세분화·다국어·브랜드 상세**가 해소되어 기획 점수 상향. 품질 캡(실사진·CI 근사·자동화)은 유지. **여전히 “완료/100%”로 선언하지 않음**(실데이터·실사진·E2E 미검증).

**접근성**: 시맨틱 h1/section, aria-label, 키보드(캘린더·드롭다운), `<html lang>` 언어 동기화. 미검증: 스크린리더 전수, 색대비 전수, 다크모드 미지원.

---

## 3. 로드맵

### 완료(이번까지)
- [x] 브랜드관 홈(원페이지) · 진입 배너(홈 2곳) · 격리/롤백
- [x] 실사이트 CI 재스킨(오렌지·near-black·Be Vietnam Pro·Fraunces) · 모션(리빌/카운트업/켄번스)
- [x] 예약(실시간 OTA) ↔ 제휴(B2B) **페이지 분리** · 오마이트립식 체크인 박스 통일
- [x] **브랜드별 상세·스토리 페이지**(`/brand/[key]` 7개)
- [x] **다국어 4개 언어**(ko/zh/ja/en) — UI·콘텐츠·브랜드 스토리·도시·배지·객실
- [x] **세분화 명세서 4종**(기능/데이터/연동/디자인·QA)

### 지금(코드로 가능, 자료 불필요)
- [ ] 콘텐츠 카피 다듬기(브랜드 스토리 번역 품질 검수 — 현재 목번역)
- [ ] 전환 퍼널 분석 이벤트 설계(배너→브랜드관→상세→예약)
- [ ] (범위 허용 시) E2E·Lighthouse·실사이트 CI 근접도 측정

### 실데이터·시스템 필요 ([03 문서])
- [ ] 브랜드·컬렉션·시설 마스터 실데이터(ELLIS/OMH) · 실시간 요율/재고
- [ ] 결제(PG) + 예약 생성·바우처 + 마이페이지 연동
- [ ] 제휴(B2B) 리드 CRM/카카오 채널
- [ ] 번역 CMS 이관 · 자사 실사진 · 실시간 환율

---

## 4. 리스크 / 이슈

| 리스크 | 영향 | 대응 |
|---|---|---|
| 스톡 이미지(브랜드/시설 무관) | 신뢰도·시연 인상 | 자사 실사진 확보 전까지 큐레이션, 브랜드 키비주얼 우선 교체 |
| 정적 export vs 실시간 재고·요율 | 예약 최신성 | 예약 라우트 CSR fetch 또는 SSR/ISR 전환 |
| 재고 트랜잭션(홀드/확정) | 오버부킹 | allotment API + 홀드/확정 로직 |
| 요율 배수·세율·잔여실 가정값 | 가격 정확성 | 실시간 요율/세금/재고 정책 확정 |
| CI 실사이트 근사(픽셀 불일치) | 브랜드 정합 | 실 폰트(forma)·키비주얼 반입 시 재조정 |
| 번역 목번역 품질 | 글로벌 사용성 | 원어민/운영 검수 후 CMS 이관 |
| 콘텐츠(브랜드 스토리) 깊이 | 브랜드 설득력 | M Village 브랜드 자산 원본 기반 재작성(GSA) |

---

## 5. 기획팀 의사결정 필요 (요약)

1. **브랜드관 정식 채택 여부** 및 오마이 메인 배너 노출 범위(호텔/트립 공통?)
2. **소싱/채널 모델**: 그룹 단위 요율·allotment, 실시간 OTA vs 요청형
3. **가격 정책**: 객실 플랜·요율·세금·잔여실 표기, KRW 단일 vs 다통화
4. **다국어 운영**: 번역 주체·CMS·신규 시설 번역 워크플로(현재 4개 언어 목번역 완료)
5. **ELLIS/OMH 스키마 신설 범위**([03 §3]) — 브랜드/컬렉션/시설/요율·재고
6. **콘텐츠 전략**: 브랜드 스토리 원본·이미지 자산(GSA 제작비 분담)
7. **제휴(B2B) 리드 라우팅**: CRM·카카오 채널·담당 영업

---

## 6. 참고 링크

- 라이브: https://bstars00-rgb.github.io/OHMYTRIP/mvillage/ · 진입: 오마이 메인 홈 M Village 배너(NEW)
- 코드: `src/{app,components,features,mocks}/mvillage`, `src/styles/mvillage*.css`, `public/mvillage`
- 진입점: `src/components/home/HomeMain.tsx` · `MobileHomeMain.tsx`의 `<MVillageBanner/>`
- 롤백/구조: `docs/mvillage/README.md` · `memory/mvillage-brand-hall.md`
- 명세서: `docs/mvillage/01~04` · QA: `docs/mvillage/QA-FUNCTIONAL-2026-10-02.md`
