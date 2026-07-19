# UI 컴포넌트 목록 (Phase 0 조사 기반)

원본 클래스명 → 클론 컴포넌트 매핑. (D)=데스크톱, (M)=모바일, 공통=양쪽.

## Layout

| 컴포넌트 | 원본 근거 | 비고 |
|---|---|---|
| DesktopHeader | header 74px, bg #f3f3f3, 로고+유틸메뉴(로그인/예약확인/기획전/고객센터) | sticky 아님 |
| MobileHeader | `.header-inner` 54px, 햄버거 "메뉴" + 로고, bg #fff + 1px #eee | 메뉴 드로어 구조 UNKNOWN |
| Footer | 링크 5종 + 회사정보 2단 + SNS 5종 + 면책 | 로그인 페이지에서 전체 텍스트 확보 |
| TopButton | 우하단 원형 TOP 버튼 | 데스크톱/모바일 공통 |
| ProgressSteps | 01 호텔 선택 ~ 04 결제하기 | 검색결과/상세/예약 플로우 상단 |

## Search (메인 검색 패널)

| 컴포넌트 | 원본 근거 |
|---|---|
| MainSearchPanel | `app-main-search` 585×433(D), 흰 라운드 카드+그림자 |
| ServiceTabs | `.btn-main-category`(×5) + active 아이콘 스왑, 탭 전환 = 라우트 전환 |
| SearchConditionList | `.search-condition` — [라벨+값] 라운드 박스 리스트 |
| DestinationInput | input placeholder "도시명 또는 호텔명 입력" (M: 버튼 → 전체화면 모달) |
| MajorCityQuickSelect | `.major-city-list-wrap.modal-wrap` 910px, 8개 지역 그룹 |
| DestinationAutocomplete | `.search-result-wrap` 525×300, `.destination-item.city/hotel` 62px, `.name`/`.name2` |
| DateRangeSelector | 버튼 "날짜 선택" → 요약 "26.07.25(토) ~ 26.07.27(월)" |
| GuestRoomSelector | 버튼 "객실 1개 / 성인 2명, 아동 1명" |
| SearchButton | `.btn.primary.lg` (52px) disabled↔active |

## Calendar

| 컴포넌트 | 원본 근거 |
|---|---|
| CalendarPopover (D) | `.calendar-wrap.modal-wrap` 768×467, 2개월 나란히 |
| CalendarFullModal (M) | `.modal.md.type1` 전체화면 "일정 선택", 세로 스크롤 월 리스트(8개월+) |
| CalendarHeader | `.itinerary` 체크인/체크아웃 칩, `btn-prev/next-month` |
| CalendarMonth / CalendarDay | `td.passday/.today`, `button.day` + `first-selected/middle/last-selected/holiday` |
| CalendarFooter | `.btn-calendar-reset`(초기화) + `.btn.primary.lg.inline`(적용하기) |

## Guest

| 컴포넌트 | 원본 근거 |
|---|---|
| GuestRoomPopover | `.hotel-room-wrap.modal-wrap` 525×301(D) |
| RoomOptionItem | `.room-option-item` — "객실 N" 카드 |
| GuestCounter | `.user-count` + `.btn-counter.down/.up` + `.counter-num` |
| ChildAgeSelector | 네이티브 select, 만1세 미만(0)~만11세(11) |
| AddRoomButton | "객실 추가" + ico-add-rounded |

## Hotel (검색결과/상세)

| 컴포넌트 | 원본 근거 |
|---|---|
| HotelCard | `.hotel-list-item` 850×170 가로형 |
| HotelBadge | `.comm-label.rounded.primary` "추천" |
| StarRating | `.comm-rating` `.rate-star.sm.s1~s5` + `.rate-text` |
| HotelPrice | `.price` — 정가 취소선 + 판매가 |
| WishButton | `.btn-list-wish` |
| CompareCheck | "비교하기" + ico-compare |
| FilterSidebar | `.filter` — 아코디언(`.accordion.filter`), 지도 배너, 결과 내 검색, 가격대, 성급, 숙소유형, 식사, 체인 |
| SortTabs | 추천순/높은 등급 순/낮은 등급 순/높은 가격 순/낮은 가격 순 |
| Pagination | btn-pagination-{first,prev,next,last} + 1~10 |
| RoomTypeCard | 룸명/조식/WIFI/어메니티/취소정책/가격/장바구니/예약 |
| RoomTypeGallery | `.roomtype-thumb-gallery` |
| HotelInfoSection | 체크인·아웃/주소/전화/인근명소/소개 |

## Common

| 컴포넌트 | 원본 근거 |
|---|---|
| Button | `.btn` + sm(36)/md(40)/lg(52) × primary/line.default × hover-primary/hover-secondary + :disabled |
| Input | 라운드 보더, ico-input-search 등 |
| Select | 네이티브 select + ico-selectbox-arrow 커스텀 화살표 |
| Checkbox | ico-checkbox-default (이미지 기반) |
| Tabs | 서비스탭/서브탭(왕복·편도·다구간)/카테고리탭(기획전) |
| Modal/Popover | `.modal-wrap`(D 팝오버), `.modal.md.type1`(M 전체화면), z-100 |
| Carousel | slick — 메인(5), 와이드(1), 프로모션(4), 점 인디케이터 |
| Badge/Label | `.comm-label.rounded.primary` |
| LoadingSpinner | ajax-loader.gif |
| Accordion | ico-accordion-default/active |
| NoticeTable | 상시 라벨 + 제목 + 날짜 행 |
| EmptyState | ico-nodata-image@2x 확인 |
