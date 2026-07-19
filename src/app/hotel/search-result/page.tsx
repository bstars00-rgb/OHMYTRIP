import DesktopHeader from '@/components/layout/DesktopHeader';
import Footer from '@/components/layout/Footer';

/**
 * 호텔 검색 결과 — Phase 5-1에서 구현 예정.
 * 현재는 검색 플로우(URL 직렬화 → 라우트 이동)를 검증하기 위한 자리 페이지.
 */
export default async function HotelSearchResultPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const destination = params['destination-regionNameLn'];
  const checkIn = params['checkInDate'];
  const checkOut = params['checkOutDate'];

  return (
    <div id="wrap">
      <DesktopHeader />
      <div className="main-wrap">
        <main id="contents">
          <section style={{ width: 1200, margin: '65px auto', minHeight: 320 }}>
            <h2 style={{ fontSize: 'var(--f-size-extra)', fontWeight: 600 }}>
              호텔 검색 결과 (Phase 5-1에서 구현)
            </h2>
            <p style={{ marginTop: 20, color: 'var(--c-gray-5)' }}>
              수신한 검색 조건: {String(destination ?? '-')} / {String(checkIn ?? '-')} ~{' '}
              {String(checkOut ?? '-')}
            </p>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
