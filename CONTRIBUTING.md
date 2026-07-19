# Contributing

## 브랜치

- `main`: Production (수동 배포 승인 후)
- `develop`: Staging
- `feature/*`: 작업 브랜치 — `feature/site-audit`, `feature/design-system`, `feature/home-clone`, `feature/hotel-search`, `feature/hotel-detail`, `feature/auth`, `feature/booking`

## 커밋 — Conventional Commits

```
feat: implement desktop hotel search panel
fix: align header spacing with reference
refactor: extract guest selector state
test: add hotel search e2e test
docs: add current website audit
```

## 원칙

1. 임의 디자인 변경 금지 — 원본과 다른 부분은 PR 설명의 Known Differences에 기록
2. 원본에서 확인 불가한 요소는 추측 구현 금지, `UNKNOWN` 기록
3. 하드코딩 색상/URL 금지 — 토큰(`src/styles/tokens.css`)과 env 사용
4. 컴포넌트 파일 250줄 이하 권장, UI와 로직(features/hooks) 분리
5. API 접근은 반드시 `src/services` 계층 경유 (Mock ↔ 실 API 교체 가능 구조)
6. 비밀정보(API Key/토큰/개인정보) 커밋 금지 — `.env.example`에는 키 이름만
