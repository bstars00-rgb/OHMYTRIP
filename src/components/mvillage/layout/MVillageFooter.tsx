'use client';

import Link from 'next/link';

export default function MVillageFooter() {
  return (
    <footer className="mv-footer">
      <div className="mv-container">
        <div className="mv-footer-top">
          <div>
            <span className="mv-logo">
              <span><b>M</b> VILLAGE</span>
              <span className="mv-logo-sub">A MORE MEANINGFUL STAY</span>
            </span>
            <p className="mv-footer-tag" style={{ marginTop: 16 }}>One Vietnam. Six lifestyles.</p>
          </div>
          <div className="mv-footer-cols">
            <div>
              <h4>Collections</h4>
              <ul>
                <li><a href="#collections">Premium Escape</a></li>
                <li><a href="#collections">Urban Discovery</a></li>
                <li><a href="#collections">Smart City Stay</a></li>
                <li><a href="#collections">Work &amp; Live</a></li>
              </ul>
            </div>
            <div>
              <h4>Discover</h4>
              <ul>
                <li><a href="#brands">브랜드 포트폴리오</a></li>
                <li><a href="#destinations">인기 목적지</a></li>
                <li><a href="#cta">제휴·단체 문의</a></li>
                <li><Link href="/">오마이트립으로</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mv-footer-bottom">
          <span>M Village 브랜드관은 오마이호텔이 운영하는 한국 공식 브랜드 접점입니다. (프로토타입 · 실판매·요율 미연동)</span>
          <span>© 2026 OHMYHOTEL &amp; CO. × Modern Village Lifestyle</span>
        </div>
      </div>
    </footer>
  );
}
