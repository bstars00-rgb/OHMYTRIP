import { Suspense } from 'react';
import DesktopHeader from '@/components/layout/DesktopHeader';
import Footer from '@/components/layout/Footer';
import SearchResultContent from './SearchResultContent';

/**
 * 호텔 검색 결과 — Phase 5-1에서 구현 예정.
 * 현재는 검색 플로우(URL 직렬화 → 라우트 이동)를 검증하기 위한 자리 페이지.
 */
export default function HotelSearchResultPage() {
  return (
    <div id="wrap">
      <DesktopHeader />
      <div className="main-wrap">
        <main id="contents">
          <Suspense fallback={null}>
            <SearchResultContent />
          </Suspense>
        </main>
      </div>
      <Footer />
    </div>
  );
}
