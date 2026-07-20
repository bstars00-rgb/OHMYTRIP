'use client';

/* eslint-disable @next/next/no-img-element -- 원본 마크업 미러링 */

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MobileHeader from '@/components/mobile/MobileHeader';
import MobileFooter from '@/components/mobile/MobileFooter';
import MobileHotelSearchPanel from '@/components/mobile/MobileHotelSearchPanel';
import { SERVICES, type ServiceKey } from '@/components/search/MainSearchPanel';
import {
  ActivitySearchPanel,
  AirtelSearchPanel,
  FlightSearchPanel,
  RentalcarSearchPanel,
} from '@/components/search/StaticServicePanels';
import { RECENT_NOTICES } from '@/mocks/notices';

/** 모바일 하단 와이드 배너 — 원본 m. 전용 이미지(단일 슬라이드) */
const MOBILE_LARGE_BANNER = { imageUrl: '/banners/wide-1-mobile.jpg', alt: '와이드 배너' };

const PANELS: Record<ServiceKey, React.ComponentType> = {
  hotel: MobileHotelSearchPanel,
  flight: FlightSearchPanel,
  activity: ActivitySearchPanel,
  rentalcar: RentalcarSearchPanel,
  airtel: AirtelSearchPanel,
};

/**
 * 원본 m.ohmytrip.com 메인 미러링:
 * #wrap > header + main#container.bg > #section-main-contents + #section-bottom-contents + footer
 * (모바일 메인에는 히어로 배너·프로모션·앱 다운로드 섹션이 없음 — 실측)
 */
export default function MobileHomeMain({ service }: { service: ServiceKey }) {
  const router = useRouter();
  const Panel = PANELS[service];

  return (
    <div id="wrap">
      <MobileHeader />
      <main id="container" className="bg">
        <section id="section-main-contents">
          <article id="main-title">
            <h2 className="title">
              {' '}
              오! 내가 찾는 모든 여행 <strong>오마이트립</strong>
            </h2>
            <img
              srcSet="/assets/images/img/img-main-title.png 1x, /assets/images/img/img-main-title@2x.png 2x"
              src="/assets/images/img/img-main-title.png"
              alt=""
            />
          </article>
          <div className="main-search-host">
            <article id="main-search">
              <ul className="main-search-header">
                {SERVICES.map((s) => (
                  <li key={s.key}>
                    <button
                      type="button"
                      className={`btn-main-category${s.key === service ? ' active' : ''}`}
                      onClick={() => router.push(s.route)}
                    >
                      <span className={`icon-${s.key}`} />
                      <span className="name">{s.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="main-search-body">
                <Panel />
              </div>
            </article>
          </div>
        </section>
        <section id="section-bottom-contents">
          <section id="section-banner">
            <div className="banner-host large">
              <article id="banner-large">
                <div className="main-banner">
                  <ul className="banner-list">
                    <div className="carousel slick-initialized slick-slider slick-dotted">
                      <div className="slick-list">
                        <div className="slick-track" style={{ width: '100%' }}>
                          <li className="slide rounded slick-slide slick-current slick-active" style={{ width: '100%' }}>
                            <img width="100%" src={MOBILE_LARGE_BANNER.imageUrl} alt={MOBILE_LARGE_BANNER.alt} />
                          </li>
                        </div>
                      </div>
                      <ul className="banner-indicator" role="tablist">
                        <li className="slick-active" role="presentation">
                          <button type="button" role="tab" aria-label="1 of 1" aria-selected>
                            1
                          </button>
                        </li>
                      </ul>
                    </div>
                  </ul>
                </div>
              </article>
            </div>
          </section>
          <section id="section-site-info">
            <article className="notice-recent">
              <div className="notice-title">
                <h3 className="title">공지사항</h3>
                <Link className="btn-list-anchor" href="/my-page/notice">
                  전체보기
                </Link>
              </div>
              <table className="table-recent-list">
                <caption> 공지사항 목록 </caption>
                <colgroup>
                  <col width="35px" />
                  <col />
                  <col width="70px" />
                </colgroup>
                <tbody>
                  {RECENT_NOTICES.map((n) => (
                    <tr key={n.id}>
                      <th className="label">
                        <span className="list-label type1">{n.label}</span>
                      </th>
                      <td className="subject">
                        <Link href={`/my-page/notice/${n.id}`}>{n.title}</Link>
                      </td>
                      <td className="date"> {n.date} </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
            <article className="seller-link">
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="partner1"
                href="https://ohmyhotel.biz/landing?type=hotel&lang=KO"
              >
                <p className="title">숙박 시설 등록</p>
                <p className="text">호텔, 모텔, B&amp;B</p>
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                className="partner2"
                href="https://ohmyhotel.biz/landing-mkt?type=seller&lang=KO"
              >
                <p className="title">여행사 회원 등록</p>
                <p className="text">지금 등록 가능</p>
              </a>
            </article>
          </section>
        </section>
      </main>
      <MobileFooter />
    </div>
  );
}
