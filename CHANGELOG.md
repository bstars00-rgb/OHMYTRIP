# Changelog

## [Unreleased]

### Phase 4 + Phase 5 — 검색 마감 및 주요 페이지 (2026-07-20)

- 검색결과 페이지: 축약 검색바/4단계 진행/필터 사이드바(가격·성급·유형·식사·체인)/정렬 5종/호텔 카드(실측 10곳 Mock)/페이지네이션 — 원본 DOM 미러링, 정렬·필터·상세 이동 동작
- 호텔 상세: 갤러리(+28 오버레이)/객실요금·호텔정보 탭/룸타입 카드(취소정책·할인가)/호텔정보(지도 자리표시) — hotelCode 886479 실측 데이터
- 로그인/회원가입/비밀번호 찾기: 원본 폼·약관·SNS 버튼 미러링 (인증 Mock)
- 공지사항 목록(카테고리 탭/검색)+상세(SSG 10건)/기획전(카테고리 select)/마이페이지 셸
- Phase 4: 자동완성 키보드 내비게이션(↑↓/Enter/Escape), 최근 검색(recentSearchHotels) 저장·스트립 표시
- 테스트: Vitest 단위 18건(날짜/직렬화/자동완성/최근검색), 시각 회귀 pixelmatch 도입
  — **홈 1440: 0.02%, 1920: 0.01% 픽셀 차이** (기준 3%, 배너 회전 영역 마스킹)

### Phase 3(모바일) — 모바일 메인 페이지 클론 (2026-07-20)

- UA 기반 플랫폼 전환(body.omt-desktop ↔ body.omt-mobile) — 원본 CloudFront www/m 분기 재현
- 데스크톱 CSS도 스코프 처리(속성 누수 수정), m. 컴포넌트 스코프 스타일 포팅
- 모바일 메인: 54px 헤더, 스택 검색 패널(일정·인원 2열), 모바일 전용 와이드 배너, 공지, 파트너 카드, 모바일 푸터
- 전체 화면 모달 3종: 목적지 검색(도시 그룹+자동완성), 세로 스크롤 13개월 달력(일=빨강/토=파랑, 체크인·아웃 탭), 인원 선택
- 모바일 E2E 검증 완료 (검색 URL 원본 동일)

### Phase 1 + Phase 3(데스크톱) — 디자인 시스템 및 메인 페이지 클론 (2026-07-19)

- 원본 CSS 번들 포팅: `styles.css`(437KB) → `omt-desktop.css`, 모바일 번들 → `body.omt-mobile` 스코프의 `omt-mobile.css` (scripts/port-original-css.mjs)
- 원본 CSS가 참조하는 이미지 자산 560개를 `/public/omt-assets`로 미러링, 공용 이미지(`/assets/images/*`) 20종 수집
- Pretendard(오픈소스) npm 패키지로 self-host, 라이브 페이지에서 덤프한 Angular 컴포넌트 스코프 스타일 포팅(omt-components.css)
- 메인 페이지 데스크톱 클론: 헤더/메인 타이틀/검색 패널(5개 서비스 탭 마크업 전부 원본 DOM 미러링)/메인·와이드·프로모션 배너 캐러셀(slick DOM 재현)/공지/파트너/앱 다운로드/푸터/TOP 버튼
- 호텔 검색 인터랙션 완전 동작: 주요 도시 팝오버 → 자동완성(검색어 오렌지 강조, 도시/호텔 구분) → 달력(2개월, 13개월 창, 범위 선택) 자동 오픈 → 인원(객실 카드/아동 나이 select) → 검색 실행
- 원본과 동일한 URL 직렬화(`rooms-0-adultCount=…`) 및 sessionStorage `hotel-searchFormData` 상태 유지 재현 (E2E 검증 완료)
- 라우트: `/` → `/hotel` 리다이렉트, `/hotel` `/flight` `/activity` `/rentalcar` `/airtel`, `/hotel/search-result`(Phase 5 자리)

### Phase 0 — 사전 조사 (2026-07-19)

- Next.js 16 + TypeScript + Tailwind v4 프로젝트 초기화, 폴더 구조 생성
- 원본 사이트(www/m.ohmytrip.com) 구조·라우트·인터랙션 조사 → docs/current-site-audit.md
- 원본 CSS 변수 41종(색상/타이포/radius) + 버튼/그림자/레이아웃 실측 → docs/design-system.md
- 디자인 토큰 파일 생성: src/styles/tokens.css, src/config/design-tokens.ts
- Playwright 설치 및 참조 스크린샷 수집 스크립트(scripts/capture-reference.mjs)
- 문서: route-map, api-contract(역설계), implementation-plan, assets-inventory, upgrade-backlog
