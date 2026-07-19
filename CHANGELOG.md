# Changelog

## [Unreleased]

### Phase 0 — 사전 조사 (2026-07-19)

- Next.js 16 + TypeScript + Tailwind v4 프로젝트 초기화, 폴더 구조 생성
- 원본 사이트(www/m.ohmytrip.com) 구조·라우트·인터랙션 조사 → docs/current-site-audit.md
- 원본 CSS 변수 41종(색상/타이포/radius) + 버튼/그림자/레이아웃 실측 → docs/design-system.md
- 디자인 토큰 파일 생성: src/styles/tokens.css, src/config/design-tokens.ts
- Playwright 설치 및 참조 스크린샷 수집 스크립트(scripts/capture-reference.mjs)
- 문서: route-map, api-contract(역설계), implementation-plan, assets-inventory, upgrade-backlog
