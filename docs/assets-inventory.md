# Assets Inventory

원본 사이트에서 수집한 자산 기록. 발주사가 사용 권한을 보유한다는 전제.
공식 원본(SVG/AI) 파일은 아직 미보유 — 아래 항목은 사이트에서 추출한 **임시 자산**이다.

## /public/brand

- File name: logo-header.png
- Original URL: https://www.ohmytrip.com/assets/images/common/ico-header-logo.png
- Usage: 데스크톱 헤더 로고 (표시 크기 116×40)
- Dimensions: PNG 래스터 (원본 픽셀 확인 필요)
- Format: PNG
- License or ownership status: 발주사 소유 (TEMPORARY — 공식 SVG 원본 요청 필요)

- File name: favicon.ico / favicon-32x32.png / apple-touch-icon.png / safari-pinned-tab.svg
- Original URL: https://www.ohmytrip.com/favicon.ico 외 /assets/images/common/*
- Usage: 파비콘/터치 아이콘/마스크 아이콘
- Format: ICO/PNG/SVG
- License or ownership status: 발주사 소유 (safari-pinned-tab.svg는 벡터 심볼 — symbol.svg 후보)

## 미수집 (Phase 3 전 수집 예정)

- `ico-main-category-{hotel,flight,activity,rentalcar,airtel}-{active,default}(@2x).png` — 서비스 탭 아이콘 10종(+@2x)
- `ico-destination-{city,hotel,landmark}.png` — 자동완성 아이콘
- `btn-{prev,next}-month`, `btn-calendar-reset`, `btn-counter-*`, `ico-add-rounded` — 달력/카운터
- `ico-accordion-*`, `ico-filter-*`, `ico-input-search`, `ico-compare-default`, `ico-checkbox-default`, `ico-rating-sm-star`, `ico-list-wish-default`, `btn-pagination-*`, `bg-map-view` — 검색결과 페이지
- `img-main-title.png`(106×97), `img-app-icon.png`(80×80), `ico-bottom-partner{1,3}` — 메인
- `ajax-loader.gif` — 로딩
- 배너 이미지: CMS 업로드 경로 `/data/share/YYYYMMDD/AV/I/{hash}.png` — 운영 콘텐츠이므로 클론에서는 자리표시 Mock 배너 사용

주의: 해시가 붙은 파일명(`ico-*.{hash}.png`)은 Angular 빌드 산출물이므로 배포마다 변한다. 수집 시점 URL을 기록할 것.

## 폰트

- Pretendard subset woff2 (weight 100~900) — 원본은 self-hosted subset 사용
- Pretendard는 SIL OFL 오픈소스 → 공식 배포본으로 자체 수급 가능 (라이선스 문제 없음)
