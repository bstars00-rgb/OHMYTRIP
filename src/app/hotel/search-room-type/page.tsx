import { Suspense } from 'react';
import DesktopHeader from '@/components/layout/DesktopHeader';
import Footer from '@/components/layout/Footer';
import RoomTypeContent from './RoomTypeContent';

/** 호텔 상세(룸타입 선택) — 원본 /hotel/search-room-type 미러링 */
export default function SearchRoomTypePage() {
  return (
    <div id="wrap">
      <DesktopHeader />
      <div className="main-wrap">
        <main id="contents">
          <Suspense fallback={null}>
            <RoomTypeContent />
          </Suspense>
        </main>
      </div>
      <Footer />
    </div>
  );
}
