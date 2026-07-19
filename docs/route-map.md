# Route Map (원본 → 클론)

조사일: 2026-07-19

## 데스크톱 (www.ohmytrip.com)

| 원본 라우트 | 설명 | 클론(App Router) | Phase |
|---|---|---|---|
| `/` | `/hotel`로 이동(메인) | `app/page.tsx` → redirect `/hotel` | 3 |
| `/hotel` | 메인(호텔 탭) | `app/hotel/page.tsx` | 3 |
| `/flight` | 메인(항공 탭) | `app/flights/page.tsx`* | 3 |
| `/activity` | 메인(액티비티 탭) | `app/activities/page.tsx`* | 3 |
| `/rentalcar` | 메인(렌터카 탭) | `app/cars/page.tsx`* | 3 |
| `/airtel` | 메인(항공+호텔 탭) | `app/packages/page.tsx`* | 3 |
| `/hotel/search-result?…` | 호텔 검색 결과 | `app/hotels/search/page.tsx` | 5-1 |
| `/hotel/search-room-type?hotelCode=…` | 호텔 상세(룸타입) | `app/hotels/[hotelId]/page.tsx` | 5-2 |
| `/login?returnUrl=…` | 로그인 | `app/login/page.tsx` | 5-3 |
| `/join?returnUrl=…` | 회원가입 | `app/signup/page.tsx` | 5-4 |
| `/find-password` | 비밀번호 찾기 | `app/find-password/page.tsx` | 5-4 |
| `/my-page/booking-history` | 예약 내역 | `app/my-page/booking-history/page.tsx` | 5-8 |
| `/my-page/notice` | 공지사항 목록 | `app/notices/page.tsx` | 5-9 |
| `/my-page/notice/:id` | 공지 상세 | `app/notices/[id]/page.tsx` | 5-9 |
| `/event` | 기획전 목록 | `app/events/page.tsx` | 5-10 |
| `/privacy` | 개인정보처리방침 | `app/privacy/page.tsx` | 5-9 |
| `/common-agreement` | 이용약관 | `app/terms/page.tsx` | 5-9 |

\* 참고: 마스터 프롬프트의 폴더 구조(`hotels/flights/activities/cars/packages`)를 따르되, **URL 경로는 원본과 동일하게** `/hotel`, `/flight`, `/activity`, `/rentalcar`, `/airtel`로 노출한다(리라이트 또는 폴더명 원본 맞춤 — Phase 2에서 확정. 페이지 전환 흐름 동일성이 우선).

## 모바일 (m.ohmytrip.com)

동일 라우트 구조 확인(`/hotel`, `/flight`, `/event`, `/my-page/notice` 등). 별도 빌드이며 UI 구조가 다름:
- 목적지: 전체 화면 모달
- 달력: 전체 화면 모달 + 세로 스크롤 월 리스트
- 헤더: 햄버거 메뉴 + 로고 (54px)
- 하단 내비게이션 없음, TOP 플로팅 버튼

## 미확인(로그인 필요/미탐색)

- 예약 정보 입력(여행자 확인) 단계 URL — UNKNOWN
- 결제 직전 화면 URL — UNKNOWN
- 예약 완료 화면 URL — UNKNOWN
- 마이페이지 상세(회원정보 수정 등) — UNKNOWN
- 항공/액티비티/렌터카/에어텔 검색 결과 페이지 — 미탐색 (호텔 우선 정책)
