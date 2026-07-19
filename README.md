# ohmytrip-web-renewal

`https://www.ohmytrip.com` UI·UX 클론 및 단계적 고도화 프로젝트.

- 1단계 목표: 현행 사이트(데스크톱 www / 모바일 m.)의 시각 구성과 UX를 측정값 기반으로 동일하게 재현
- 데이터: Mock API (`NEXT_PUBLIC_USE_MOCK_API=true`) — 실제 예약/결제/개인정보 연동 없음
- 임의 디자인 변경 금지. 원본에서 확인 불가한 요소는 `UNKNOWN`으로 기록

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS + CSS Variables · Zustand · React Hook Form + Zod · date-fns · Playwright · Vitest

## 시작하기

```bash
npm install
npm run dev
```

## 문서

| 문서 | 내용 |
|---|---|
| [docs/current-site-audit.md](docs/current-site-audit.md) | 원본 사이트 조사(구조/인터랙션/상태) |
| [docs/design-system.md](docs/design-system.md) | 원본 CSS에서 추출한 디자인 토큰 |
| [docs/route-map.md](docs/route-map.md) | 라우트 매핑 |
| [docs/api-contract.md](docs/api-contract.md) | Mock API 계약(역설계) |
| [docs/implementation-plan.md](docs/implementation-plan.md) | Phase별 구현 계획 |
| [docs/assets-inventory.md](docs/assets-inventory.md) | 브랜드/이미지 자산 출처 |
| [docs/upgrade-backlog.md](docs/upgrade-backlog.md) | 향후 고도화 항목(현 단계 미구현) |

## 참조 스크린샷

`/reference/{desktop,tablet,mobile}` — Playwright로 수집한 원본 사이트 스크린샷 (`scripts/capture-reference.mjs`)

## 브랜치 전략

`main`(production) ← `develop`(staging) ← `feature/*`
커밋은 Conventional Commits 사용.
