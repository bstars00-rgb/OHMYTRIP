# Changelog

## [Unreleased]

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
