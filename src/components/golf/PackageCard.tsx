'use client';

import Link from 'next/link';
import { MapPin, Coffee, Flag, CheckCircle2, Timer, Zap } from 'lucide-react';
import type { GolfPackage } from '@/mocks/golf/types';
import { discountPct, golfPoints, golfTags, feeBadges } from '@/mocks/golf/data';
import { golfImg } from '@/features/golf/images';
import { usePrefs } from '@/features/golf/GolfProviders';
import { StarRating, ReviewScore, WishlistButton, CompareButton } from '@/components/golf/common/ui';

export default function PackageCard({ pkg, dateQuery }: { pkg: GolfPackage; dateQuery?: string }) {
  const { fx } = usePrefs();
  const pct = discountPct(pkg);
  const courses = pkg.golfCourses.map((c) => c.name).join(' · ');
  const href = `/golf/package/${pkg.id}${dateQuery ? `?${dateQuery}` : ''}`;

  return (
    <article className="g-card g-card-hover g-pkgcard">
      <Link href={href} className="g-pkgcard-media" aria-label={pkg.hotel}>
        <img src={golfImg(pkg.id, 'resort')} alt={`${pkg.hotel}, ${pkg.destination}`} loading="lazy" decoding="async" width={800} height={600} />
        <div className="g-pkgcard-badges">
          {pkg.bestSeller && <span className="g-badge g-badge-best">베스트</span>}
          {pkg.lastMinute && <span className="g-badge g-badge-deal">임박특가</span>}
          {pkg.allInclusive && <span className="g-badge g-badge-soft">올인클루시브</span>}
        </div>
        <WishlistButton id={pkg.id} className="g-pkgcard-wish" />
      </Link>

      <div className="g-pkgcard-body">
        <div className="g-between">
          <StarRating rating={pkg.hotelRating} />
          <span className="g-pkgcard-score">
            <ReviewScore score={pkg.reviewScore} count={pkg.reviewCount} />
          </span>
        </div>

        <h3 className="g-pkgcard-title">
          <Link href={href}>{pkg.hotel}</Link>
        </h3>
        <p className="g-pkgcard-loc">
          <MapPin size={14} /> {pkg.destination}, {pkg.country}
        </p>

        <div className="g-pkgcard-pkg">
          <Flag size={14} /> {pkg.nights}박 · {pkg.rounds}라운드
        </div>
        <p className="g-pkgcard-courses" title={courses}>
          {courses}
        </p>

        <div className="g-gtag-row">
          {golfTags(pkg).map((t) => (
            <span key={t.label} className={`g-gtag g-gtag-${t.tone}`}>{t.label}</span>
          ))}
        </div>

        <ul className="g-pkgcard-incl">
          {pkg.breakfast && (
            <li>
              <Coffee size={13} /> 조식
            </li>
          )}
          <li>
            <Timer size={13} /> 골프장 {pkg.transferTimeMin}분
          </li>
        </ul>

        <div className="g-fee-badges">
          {feeBadges(pkg).map((f) => (
            <span key={f.label} className={`g-fee-badge ${f.included ? 'is-inc' : 'is-local'}`}>
              {f.label} {f.included ? '포함' : '현지'}
            </span>
          ))}
        </div>

        <div className="g-pkgcard-status">
          {pkg.freeCancellation && (
            <span className="g-inc g-pkgcard-flag">
              <CheckCircle2 size={13} /> 무료 취소
            </span>
          )}
          {pkg.instantConfirmation ? (
            <span className="g-badge g-badge-instant">
              <Zap size={12} /> 즉시 확정
            </span>
          ) : (
            <span className="g-badge g-badge-quote">견적 요청</span>
          )}
        </div>

        <div className="g-hr" style={{ margin: '4px 0 12px' }} />

        <div className="g-pkgcard-foot">
          <div className="g-pkgcard-price">
            <div>
              <span className="g-price-strike">{fx(pkg.originalPriceUSD)}</span>
              {pct > 0 && <span className="g-discount"> −{pct}%</span>}
            </div>
            <div className="g-price-line">
              <span className="g-price-now">{fx(pkg.salePriceUSD)}</span>
              <span className="g-price-unit">/ 1인</span>
            </div>
            <span className="g-point-earn">적립 {golfPoints(pkg.salePriceUSD).toLocaleString()}P</span>
          </div>
          <div className="g-pkgcard-actions">
            <CompareButton id={pkg.id} />
            <Link href={href} className="g-btn g-btn-primary g-btn-sm">
              패키지 보기
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
