'use client';

import Link from 'next/link';
import { useMV } from '@/features/mvillage/i18n';

export default function MVillageFooter() {
  const { t } = useMV();
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
              <h4>{t('foot.collections')}</h4>
              <ul>
                <li><Link href="/mvillage#collections">Premium Escape</Link></li>
                <li><Link href="/mvillage#collections">Urban Discovery</Link></li>
                <li><Link href="/mvillage#collections">Smart City Stay</Link></li>
                <li><Link href="/mvillage#collections">Work &amp; Live</Link></li>
              </ul>
            </div>
            <div>
              <h4>{t('foot.discover')}</h4>
              <ul>
                <li><Link href="/mvillage#brands">{t('foot.brandPortfolio')}</Link></li>
                <li><Link href="/mvillage#destinations">{t('foot.popDest')}</Link></li>
                <li><Link href="/mvillage/partner">{t('foot.partnerInq')}</Link></li>
                <li><Link href="/">{t('foot.toOmt')}</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mv-footer-bottom">
          <span>{t('foot.disclaimer')}</span>
          <span>© 2026 OHMYHOTEL &amp; CO. × Modern Village Lifestyle</span>
        </div>
      </div>
    </footer>
  );
}
