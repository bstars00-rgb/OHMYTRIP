import DesktopHeader from '@/components/layout/DesktopHeader';
import Footer from '@/components/layout/Footer';

/** 개인정보처리방침 — 법적 고지 원문은 발주사 제공 필요(임의 작성 금지). 구조 자리표시 */
export default function PrivacyPage() {
  return (
    <div id="wrap">
      <DesktopHeader />
      <div className="main-wrap">
        <main id="contents" className="bg">
          <section id="contents-area">
            <h2 className="contents-title-main mg-b20">개인정보처리방침</h2>
            <div className="list-summary">
              <div className="total">원문 콘텐츠는 발주사 제공 후 반영합니다. (법적 고지문 임의 작성 금지)</div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
