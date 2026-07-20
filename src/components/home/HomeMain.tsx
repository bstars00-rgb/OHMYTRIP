'use client';

/* eslint-disable @next/next/no-img-element -- 원본 srcset 마크업 미러링 */

import DesktopHeader from '@/components/layout/DesktopHeader';
import Footer from '@/components/layout/Footer';
import MainSearchPanel, { type ServiceKey } from '@/components/search/MainSearchPanel';
import BannerCarousel from '@/components/banner/BannerCarousel';
import SiteInfoSection from '@/components/home/SiteInfoSection';
import SearchRecentStrip from '@/components/search/SearchRecentStrip';
import AppDownloadSection from '@/components/home/AppDownloadSection';
import MobileHomeMain from '@/components/mobile/MobileHomeMain';
import { usePlatform } from '@/hooks/usePlatform';
import { LARGE_BANNERS, MAIN_BANNERS, MEDIUM_BANNERS } from '@/mocks/banners';

/**
 * 원본 메인 페이지(app-hotel > main#contents.category-main) 구조 미러링:
 * #wrap > header + .main-wrap > main#contents > #main-contents + #bottom-contents + footer
 * 원본은 UA 기준으로 www/m 별도 사이트 — 클론은 UA 판별로 트리를 전환한다.
 */
export default function HomeMain({ service }: { service: ServiceKey }) {
  const platform = usePlatform();
  if (platform === 'mobile') return <MobileHomeMain service={service} />;
  return (
    <div id="wrap">
      <DesktopHeader />
      <div className="main-wrap">
        <main id="contents" className="category-main">
          <section id="main-contents">
            <article id="main-title">
              <h2 className="title">
                {' '}
                오! 내가 찾는 모든 여행 <strong>오마이트립</strong>
              </h2>
              <p className="text">자유롭게 여행 계획하고, 가장 합리적인 가격으로 여행을 떠나세요.</p>
              <img
                srcSet="/assets/images/img/img-main-title.png 1x, /assets/images/img/img-main-title@2x.png 2x"
                src="/assets/images/img/img-main-title.png"
                alt="유럽 여행 예약즉시 출발 확정 출발 눈치 작전은 이제 그만! 예약 즉시 출발 확정으로 여행가세요."
              />
            </article>
            <section id="section-main">
              <MainSearchPanel service={service} />
              <BannerCarousel id="banner-extra" className="marginLeft extra" banners={MAIN_BANNERS} />
            </section>
            {service === 'hotel' && <SearchRecentStrip />}
          </section>
          <section id="bottom-contents">
            <section id="section-banner" className="omt-main-section">
              <BannerCarousel id="banner-large" banners={LARGE_BANNERS} />
              <BannerCarousel id="banner-medium" className="marginLeft" banners={MEDIUM_BANNERS} />
            </section>
            <SiteInfoSection />
            <AppDownloadSection />
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
