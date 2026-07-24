'use client';

import Link from 'next/link';
import { Camera, Users, Play } from 'lucide-react';

const COLS = [
  { title: '골프텔 예약', links: ['골프 패키지', '여행지', '골프장', '특가', '맞춤 견적'] },
  { title: '회사', links: ['오마이트립 소개', '이용 방법', '제휴 문의', '채용', '보도자료'] },
  { title: '고객지원', links: ['고객센터', '예약 약관', '취소 규정', '문의하기', '24/7 컨시어지'] },
];

export default function GolfFooter() {
  return (
    <footer className="g-footer">
      <div className="g-container">
        <div className="g-footer-top">
          <div className="g-footer-brand">
            <span className="g-logo g-logo-light">
              <b style={{ color: 'var(--g-forest)', fontSize: 24 }}>OHMYTRIP</b>
              <span className="g-logo-badge">골프텔</span>
            </span>
            <p>오마이트립이 엄선한 골프텔 — 호텔과 라운드, 티타임을 한 번에 예약하세요.</p>
            <div className="g-footer-social">
              <a href="#" aria-label="Instagram"><Camera size={18} /></a>
              <a href="#" aria-label="Facebook"><Users size={18} /></a>
              <a href="#" aria-label="YouTube"><Play size={18} /></a>
            </div>
          </div>
          {COLS.map((c) => (
            <div key={c.title} className="g-footer-col">
              <h4>{c.title}</h4>
              <ul>
                {c.links.map((l) => (
                  <li key={l}>
                    <Link href="/golf">{l}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <hr className="g-hr" />
        <div className="g-footer-bottom">
          <span>© 2026 OHMYHOTEL &amp; CO. — 골프텔 프로토타입</span>
          <span className="g-muted">Stay. Play. Discover.</span>
        </div>
      </div>
    </footer>
  );
}
