import DesktopHeader from '@/components/layout/DesktopHeader';
import Footer from '@/components/layout/Footer';

/**
 * 비호텔(항공/액티비티/렌터카) 검색결과 자리 페이지 셸.
 * 원본 결과 리스트는 호텔 우선 정책에 따라 미클론(데이터 부재) — 검색 조건 수신을 확인한다.
 */
export default function NonHotelResultShell({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; value: string }[];
}) {
  return (
    <div id="wrap">
      <DesktopHeader />
      <div className="main-wrap">
        <main id="contents" className="bg">
          <section id="contents-area">
            <h2 className="contents-title-main mg-b20">{title}</h2>
            <div
              className="contents-item-box lg rounded-big"
              style={{ padding: 30, background: 'var(--c-white)', borderRadius: 'var(--radius-big)', boxShadow: 'var(--shadow-card)' }}
            >
              <p style={{ color: 'var(--c-gray-5)', marginBottom: 20 }}>
                검색이 실행되었습니다. (결과 리스트는 발주사 API 연동 시 제공)
              </p>
              <dl style={{ display: 'grid', gridTemplateColumns: '140px 1fr', rowGap: 12 }}>
                {rows.map((r) => (
                  <div key={r.label} style={{ display: 'contents' }}>
                    <dt style={{ color: 'var(--c-gray-4)' }}>{r.label}</dt>
                    <dd style={{ fontWeight: 'var(--f-weight-medium)' }}>{r.value || '-'}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
