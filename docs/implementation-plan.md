# 구현 계획 (Phase 0 산출물)

> **진행 현황 (2026-07-20)**: Phase 0·1·2·3(데스크톱+모바일)·4(호텔 탭)·5(1,2,3,4,9,10) 완료.
> 미완: 예약자 확인·결제·예약완료(5-5~5-8, 원본 테스트 계정 필요), 비호텔 탭 검색 동작,
> FAQ/고객문의 콘텐츠, 법적 고지 원문. 시각 회귀: 홈 1440 0.02% / 1920 0.01% (기준 3%).
> 배포: https://bstars00-rgb.github.io/OHMYTRIP/ (main 푸시 시 자동)

## 전제

- 원본: Angular 15 SPA 2벌(데스크톱 고정 1200px / 모바일 320~768px 별도 빌드)
- 클론: Next.js(App Router) 1개 코드베이스에서 Desktop/Mobile **컴포넌트 트리 분리** + 공통 로직은 hooks/features 계층 공유
- 데이터: 전부 Mock (services 계층으로 격리, `NEXT_PUBLIC_USE_MOCK_API=true`)

## Phase별 계획

### Phase 1 — 디자인 시스템 (feature/design-system)
- [x] 원본 CSS 변수 41종 추출 완료 (docs/design-system.md)
- [ ] `src/styles/tokens.css` — 원본 변수명 유지, 모바일 오버라이드 포함
- [ ] `src/config/design-tokens.ts`
- [ ] Pretendard 로컬 폰트 적용 (오픈소스 SIL OFL — next/font/local, subset)
- [ ] 공통 컴포넌트: Button(sm/md/lg, primary/line, hover-primary/secondary, disabled), Input, Popover, Modal, Tabs, Badge, Skeleton, LoadingSpinner(ajax-loader 대응), EmptyState
- 완료 조건: Storybook 또는 데모 페이지에서 원본과 상태별 픽셀 비교

### Phase 2 — 프로젝트 구조 (완료: 스캐폴딩+폴더)
- [x] Next.js 16 + TS + Tailwind v4 + ESLint
- [x] 폴더 구조 생성 (마스터 프롬프트 §Phase 2 구조)
- [ ] 나머지 스택 설치: zustand, react-hook-form, zod, date-fns, vitest, storybook, lucide-react(공통 UI 한정 — 원본 아이콘 대체 금지)
- [ ] URL을 원본과 동일하게 유지하는 라우팅 결정(rewrites vs 폴더명)

### Phase 3 — 메인 페이지 클론 (feature/home-clone)
- 데스크톱: 헤더(74px/#f3f3f3) → 검색 패널(585×433, 5탭) → 메인 배너 캐러셀(585×433×5) → 와이드 배너(783×232) → 프로모션(387×232×4) → 공지 → 파트너 배너 → 앱 다운로드 → 푸터
- 모바일: 햄버거 헤더(54px) → 세로 스택 검색 패널 → 배너 → 공지 → 푸터 → TOP 버튼
- 캐러셀: slick 동작 재현(자동재생/인디케이터/이전다음) — 라이브러리 선택 시 원본과 시각 동일성 우선
- 완료 조건: reference 스크린샷과 시각적 회귀 3% 이하

### Phase 4 — 검색 컴포넌트
- 목적지: 주요 도시 바로 선택 팝오버(8개 지역 그룹) → 2자 이상 입력 시 자동완성(도시/공항/호텔 구분, name/name2) — Mock destinations
- 달력: 데스크톱 2개월 팝오버 / 모바일 세로 스크롤 전체화면. 상태 클래스 체계(passday/today/first-selected/middle/last-selected/holiday) 재현. date-fns 기반 로직 분리
- 인원: 객실 카드 반복 + 성인/아동 카운터 + 아동 나이 select(만1세 미만~만11세) + 객실 추가 + 적용하기
- URL 직렬화: 원본 쿼리 스킴 그대로 (`rooms-0-adultCount` 등, docs/api-contract.md)
- 상태 유지: sessionStorage `hotel-searchFormData`, localStorage `recentSearchHotels` 동일 키 구조

### Phase 5 — 주요 페이지
1. 호텔 검색 결과(필터 사이드바/정렬/카드/페이지네이션/비교하기 UI)
2. 호텔 상세(객실요금·호텔정보 탭, 룸타입 카드, 갤러리)
3. 로그인 4. 회원가입 5. 예약 정보 입력(UNKNOWN 영역 — 원본 자료 필요) 6. 결제 직전(Mock) 7. 예약 완료(Mock) 8. 예약 내역 9. 공지 10. 기획전

### 테스트/CI (병행)
- Vitest: 날짜 계산, 박수 계산, 인원 로직, 쿼리 직렬화, 가격 포맷
- Playwright E2E: 시나리오 1(데스크톱 검색 플로우), 시나리오 2(모바일 검색 플로우)
- 시각적 회귀: `/tests/visual` (reference = /reference 스크린샷)
- GitHub Actions: install → lint → typecheck → unit → build → e2e → visual

## 리스크

1. **브랜드 자산**: 로고/아이콘 PNG는 사이트에서 추출 가능하나 공식 원본(SVG) 미보유 → 발주사에 요청 필요
2. **로그인 이후 화면**: 예약/결제/마이페이지 원본 확인 불가 → 테스트 계정 필요
3. **Pretendard**: 오픈소스(SIL OFL)로 라이선스 문제 없음
4. **API 스킴**: 실제 API 응답 구조 미확인(같은 오리진 XHR 캡처 안 됨) → Mock 스키마는 UI 기준 역설계, ELLIS 연동 시 재검증
5. **캐러셀/애니메이션 타이밍**: 자동재생 간격 등 미실측 → Phase 3에서 실측 후 반영
