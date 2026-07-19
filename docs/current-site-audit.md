# OHMYTRIP.COM 현행 사이트 조사 (Phase 0)

조사일: 2026-07-19
조사 방법: 실 브라우저 탐색 + DOM/Computed Style 분석 + 원본 CSS 번들 분석 + Playwright 스크린샷

## 1. 아키텍처 개요

| 항목 | 데스크톱 | 모바일 |
|---|---|---|
| URL | `https://www.ohmytrip.com` | `https://m.ohmytrip.com` |
| 분기 방식 | CloudFront Function이 모바일 UA 감지 시 `m.`으로 301 리다이렉트 | 동일 (별도 빌드) |
| 프레임워크 | Angular 15.0.4 (SPA, SSR 흔적: `serverapp` 컨텍스트) | Angular 15.0.4 (별도 앱) |
| 레이아웃 | **고정폭 1200px** (min-width 1200/1260) | 유동폭 320~768px (`--body-max-width: 768px`, 태블릿 미디어쿼리에서 1024/1366px) |
| 스타일 | 단일 styles.css + 컴포넌트 스코프 CSS. 전역 반응형 미디어쿼리 없음(print만) | 소폭 미디어쿼리 (365/370/389/390/512/576/768/1024/1366) |
| 캐러셀 | slick carousel (slick 폰트 확인) | 동일 추정 |

**클론 전략 시사점**: 데스크톱/모바일은 반응형 1벌이 아니라 **별도 UX 2벌**이다. Next.js에서는 라우트는 통합하되 Desktop/Mobile 컴포넌트 트리를 분리하고, 뷰포트(또는 UA) 기준으로 전환해야 한다.

## 2. 확인한 페이지 (라우트)

`/docs/route-map.md` 참조. 핵심:

- `/` → `/hotel` 리다이렉트 (메인 = 호텔 탭)
- `/hotel`, `/flight`, `/activity`, `/rentalcar`, `/airtel` — 메인 검색 패널의 5개 서비스 탭이 **각각 라우트**
- `/hotel/search-result?...` — 호텔 검색 결과
- `/hotel/search-room-type?hotelCode=...` — 호텔 상세(룸타입 선택)
- `/login?returnUrl=...`, `/join?returnUrl=...`, `/find-password`
- `/my-page/booking-history`, `/my-page/notice`, `/my-page/notice/:id`
- `/event` — 기획전
- `/privacy`, `/common-agreement`

## 3. 메인 페이지 구성 (데스크톱, 위→아래)

1. **헤더** (74px, bg `#f3f3f3`, z-index 20, position relative — sticky 아님)
   - 좌측: 로고 `ico-header-logo.png` (116×40, alt "OHMYTRIP by OHMYHOTEL")
   - 우측 유틸 메뉴: 로그인 / 예약확인(`/my-page/booking-history`) / 기획전(`/event`) / 고객센터(`/my-page/notice`)
2. **메인 비주얼 영역**: 좌측 검색 패널(`app-main-search`, 585×433) + 우측 메인 배너 캐러셀(이미지 585×433, 5장, slick, 페이지 인디케이터 1~5)
   - 타이틀 카피: "오! 내가 찾는 모든 여행 오마이트립" + 서브카피
3. **검색 패널**
   - 서비스 탭 5개: 호텔/항공/액티비티/렌터카/항공+호텔 (`.btn-main-category`, active 상태 아이콘 교체: `ico-main-category-*-active/default.png`)
   - 호텔 탭 필드: 목적지(input) / 여행일정(버튼) / 여행인원(버튼) / 호텔 검색(submit, `.btn.primary.lg`)
4. **와이드 배너** (783×232, 1장 캐러셀)
5. **프로모션 배너 그리드** (387×232, 4장 캐러셀)
6. **공지사항** 섹션: "공지사항" + 전체보기 링크, 행 = [상시 라벨 | 제목 | 날짜]
7. **파트너 배너 2종**: 숙박 시설 등록(→ ohmyhotel.biz), 여행사 회원 등록(→ ohmyhotel.biz)
8. **앱 다운로드 섹션**: 앱 아이콘(80×80), 국가번호 select(+82 기본) + 휴대폰 입력 + SMS 발송, QR코드(base64, 80×80)
9. **푸터**: 회사소개/개인정보처리방침/서비스이용약관/제휴문의(mailto)/입점문의, 회사 정보(OHMYHOTEL GLOBAL PTE. LTD. / (주)오마이호텔앤코), SNS 링크(인스타/페북/네이버블로그/카카오/링크드인), 면책 문구
10. 모바일 하단 내비게이션: **없음** (모바일에는 TOP 플로팅 버튼 존재)
11. TOP 플로팅 버튼: **데스크톱에도 존재** (우하단 흰 원형 + 위 화살표 — 1920 스크린샷 확인)

시각 특징(스크린샷 실측): 검색 패널은 흰색 라운드 카드(+그림자), 탭 스트립은 패널 상단 부착형(활성 탭 = 흰 배경 + 오렌지 아이콘/글자, 비활성 = 연회색 배경 + 회색 아이콘), 필드는 [라벨 + placeholder] 인라인 구조의 라운드 보더 박스, 캐러셀 인디케이터는 이미지 우상단 흰 점, 메인 타이틀 "오마이트립"만 오렌지 강조.

## 4. 인터랙션 기록

## Destination input focus (desktop)

- Trigger: 목적지 input 클릭/포커스
- Initial state: placeholder "도시명 또는 호텔명 입력"
- Action: focus
- Result: "주요 도시 바로 선택" 팝오버(910px, z-100) 열림. 지역 그룹: 국내/일본/베트남/아시아/미주·중남미/유럽/중동/대양주. 안내문 "다른 도시를 찾는다면 검색창에 입력해 보세요"
- Animation: 즉시 (UNKNOWN: fade 여부 — 시각 확인 필요)
- URL change: 없음
- Mobile difference: 모바일은 목적지가 input이 아닌 **버튼**이며 클릭 시 전체 화면 모달("목적지 검색", 닫기/입력값삭제 포함)

## Destination autocomplete (desktop)

- Trigger: 2글자 이상 입력 (예: "서울")
- Result: 팝오버가 검색 결과 리스트(`.search-result-wrap`, 525×300)로 전환. 항목 62px 높이, `.destination-item.city` / `.destination-item.hotel` 구분(아이콘: ico-destination-city/hotel/landmark). 각 항목: `.name`(한글) + `.name2`(영문, 국가). 도시(공항 포함) 우선, 호텔 후순.
- 선택 시: input 값 = "서울(Seoul)" 형태로 채워지고 **달력이 자동으로 열림**
- 키보드 위/아래/Enter/Escape: UNKNOWN (미검증 — Phase 4 전 확인 필요)

## Calendar (desktop)

- Trigger: 여행일정 버튼 클릭 또는 목적지 선택 직후 자동
- Result: 팝오버(768×467, z-100)에 **2개월 나란히** 표시. 상단에 체크인/체크아웃 칩(`.itinerary`), 이전달/다음달 화살표(이미지 버튼), 하단 좌측 초기화(`.btn-calendar-reset` 아이콘 버튼), 우측 "적용하기"(`.btn.primary.lg.inline`)
- 요일: 일~토 (일요일 첫 번째), **일요일 헤더 색 = 오렌지 #ef7f29**, 토요일 = 검정
- 상태 클래스: `passday`(지난날, 비활성) / `today`(오늘) / `day-selected`(선택 가능일 표시) / `first-selected`(체크인) / `middle`·`middle-selected`(범위 내) / `last-selected`(체크아웃) / `holiday`
- 선택일 스타일: 흰 글자 + 오렌지 원형 배경(span), 범위는 ::before/::after 배경띠
- 체크인 → 체크아웃 순서로 2회 클릭, "적용하기" 클릭 시 닫히며 요약 갱신
- 날짜 요약 형식: `26.07.25(토) ~ 26.07.27(월)` (검색 결과 페이지 헤더에서는 `..., 2박`으로 박수 표시)
- 이동 가능 개월 수: UNKNOWN (미검증)
- Mobile difference: 전체 화면 모달 "일정 선택". 상단 초기화/닫기, 체크인/체크아웃 칩 + 요일 헤더 고정, **월 리스트 세로 스크롤(8개월 이상)**

## Guest/Room selector (desktop)

- Trigger: 여행인원 버튼 클릭
- Result: 팝오버(525×301) — 객실 카드 단위 반복: "객실 N" + 성인(만12세 이상) 카운터, 아동(만12세 미만) 카운터. `.btn-counter.down/.up` + `.counter-num`. 하단 "객실 추가" (ico-add-rounded), "적용하기"
- 아동 수 증가 시: "아동 N 나이 선택" **네이티브 select** 노출. 옵션: 만 1세 미만(0), 만 1세(1) ~ 만 11세(11)
- 적용 시 요약: "객실 1개 / 성인 2명, 아동 1명"
- 기본값: 객실 1 / 성인 2 / 아동 0
- 최솟값/최댓값: UNKNOWN (미검증 — 성인 min 1, max 및 객실 max 확인 필요)

## Hotel search submit

- Trigger: "호텔 검색" 클릭
- 비활성 상태: 목적지 미선택 시 bg `#ebebeb`, 글자 `#888` (`.btn:disabled`)
- 활성 상태: bg `#ef7f29`, 글자 `#fff`
- Result: `/hotel/search-result`로 이동. 쿼리 직렬화:
  `checkInDate=2026-07-25&checkOutDate=2026-07-27&rooms-0-adultCount=2&rooms-0-childCount=1&rooms-0-childAges-0=5&dynamicRateYn=true&sortOrder=Recommend&limits-0=0&limits-1=10&destination-type=region&destination-iconType=city&destination-regionNameLn=서울&destination-regionNameEn=Seoul&destination-regionCode=102514&destination-countryNameEn=Korea&regionCode=102514&page=1`
- State persistence: sessionStorage `hotel-searchFormData`(폼 상태), localStorage `recentSearchHotels`(최근 검색). 메인 재방문 시 날짜/인원 유지 확인됨.

## Search result page (`/hotel/search-result`)

- 상단: 축약 검색바(목적지/여행일정+박수/여행인원) + "검색 변경" 버튼
- 안내 타이틀: "서울에서 묵을 호텔을 선택해 주세요." + 날짜
- 진행 단계 표시: 01 호텔 선택 → 02 룸타입 선택 → 03 여행자 확인 → 04 결제하기
- 좌측 필터 사이드바: 지도에서 보기(bg-map-view 배너) / 결과 내 검색(input+초기화) / 가격대(min~max, 적용) / 호텔 성급(체크박스+최저가, 더보기) / 숙소 유형 / 식사(조식 포함/미포함+건수) / 호텔 체인(브랜드+최저가, 더보기) — 아코디언(ico-accordion-default/active)
- 정렬: 추천순 / 높은 등급 순 / 낮은 등급 순 / 높은 가격 순 / 낮은 가격 순
- "총 278건의 검색 결과", "비교하기" 기능(ico-compare)
- 호텔 카드(`.hotel-list-item`, 850×170 가로형): `.hotel-image`(+ `.comm-label.rounded.primary` "추천" 배지) / `.hotel-information`(호텔명 한글 `.hotel-name`, 영문 `.hotel-name2`, `.comm-rating` 별점 스프라이트 `.rate-star.sm.s{1-5}` + `.rate-text` "4성급") / `.control`(`.price` 가격, "선택" 버튼 `.btn.md.line.default.hover-secondary`, 관심상품 `.btn-list-wish`)
- 페이지네이션: 맨처음/이전/1~10/다음/맨끝 (이미지 버튼 btn-pagination-*)

## Hotel detail (`/hotel/search-room-type?hotelCode=...`)

- 헤더: 성급 배지 + 호텔명(한/영) + 진행 단계
- 탭: 객실요금 / 호텔정보
- 검색 조건 요약 + "객실 검색" 버튼
- 룸타입 카드: 썸네일 갤러리(`.roomtype-thumb-gallery`), 룸 코드, 룸명, 조식 여부, 무료 WIFI, 어메니티 목록, 취소 정책(무료취소 기한 표시 "2026.07.21(화) 17:00까지" 또는 환불불가), 가격(정가 취소선 + 할인가), 장바구니 / 예약 버튼
- 호텔정보 섹션: 체크인/체크아웃 시간, 주소, 지역, 전화, 인근명소(거리 km), 일반사항, 호텔 소개, 추가 인원 요금 안내

## Login (`/login?returnUrl=...`)

- 전용 페이지(모달 아님). 이메일 input(placeholder "아이디(이메일 주소) 입력"), 비밀번호 input(placeholder "비밀번호 입력", 안내문 "8~16자 영문 대/소문자, 숫자, 특수문자를 입력하세요."), 로그인 상태 유지 체크박스
- 로그인 버튼: 52px/radius 15px — 미입력 시 disabled 스타일
- 회원가입(`/join?returnUrl=...`) / 비밀번호 찾기(`/find-password`)
- SNS 간편 로그인: 카카오 / 네이버 / 구글 / 애플
- returnUrl 파라미터로 이전 페이지 복귀

## Category tabs (main)

- 각 탭이 라우트 전환: /hotel, /flight, /activity, /rentalcar, /airtel (뒤로 가기로 탭 상태 복원 가능)
- 항공 패널: 왕복/편도/다구간 서브탭, 직항 항공 체크, 출발지/도착지(도시명 또는 공항명 입력) + 출/도착지 변경(swap), 여행일정, 여행인원 "성인 1명 / 일반석", 항공 검색
- 액티비티 패널: 여행지/상품명 입력 + 카테고리 칩(WIFI&SIM카드, 티켓/패스, 맛집, 여행서비스, 투어, 픽업/샌딩, 체험, 골프)
- 렌터카 패널: 반납장소 같음/다름, 인수·반납 도시, 운전자 생년월일, 인수/반납 일시, 차량 보험 선택(보험 미포함/일반자차/고급자차/프리미엄자차)
- 항공+호텔 패널: 직항 항공 체크, "숙박할 도시, 일정이 다름" 체크, 출발지/도착지, 여행일정, 여행인원 "성인 2, 객실 1, 일반석"

## Event (`/event`)

- 타이틀 "기획전" + 카테고리 탭: 전체/항공/호텔/액티비티/렌터카/기타
- 카드 리스트: 배너 이미지 + 제목 + 기간(YYYY.MM.DD ~ YYYY.MM.DD)

## 5. 서드파티 통합 (원본 기준 — 클론에서는 Mock/보류)

- 결제: NicePay (nicepay-3.0.js)
- 소셜 로그인: Google GSI, Apple ID JS, Kakao(kp.js), Naver OAuth(state token 확인)
- 주소: Daum postcode
- 분석/마케팅: GA4(G-CLSZJN0P57), Facebook Pixel, Criteo, Naver wcslog, Dable
- 지도: 검색결과 "지도에서 보기" 존재 (지도 벤더 UNKNOWN — 상세 미확인)

## 6. UNKNOWN / 추가 확인 필요

- 자동완성 키보드 내비게이션(위/아래/Enter/Escape) 동작
- 달력 이동 가능 개월 수 제한, 최대 숙박일 제한
- 인원/객실 min/max 값
- 팝오버 열림/닫힘 애니메이션(fade/slide, duration)
- 모바일 햄버거 메뉴 내부 구조 (레이어 확인 실패 — 스크린샷으로 재확인)
- Hover 상태 세부(카드, 배너) — CSS상 `.btn.hover-primary/hover-secondary` 확인, 실제 카드 hover 시각 확인 필요
- 예약 정보 입력(03 여행자 확인) / 결제 직전 화면 — 로그인 필요로 미확인
- 지도 보기 상세, 관심상품(위시리스트) 동작 — 로그인 필요 추정
- 앱 다운로드 SMS 실제 동작 (클론에서는 Mock)
