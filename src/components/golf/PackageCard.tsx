'use client';

import Link from 'next/link';
import { MapPin, Coffee, Car, Plane, Flag, CheckCircle2, Timer, Zap } from 'lucide-react';
import type { GolfPackage } from '@/mocks/golf/types';
import { discountPct } from '@/mocks/golf/data';
import { golfImg } from '@/features/golf/images';
import { usePrefs } from '@/features/golf/GolfProviders';
import { StarRating, ReviewScore, WishlistButton, CompareButton } from '@/components/golf/common/ui';

export default function PackageCard({ pkg }: { pkg: GolfPackage }) {
  const { fx } = usePrefs();
  const pct = discountPct(pkg);
  const courses = pkg.golfCourses.map((c) => c.name).join(' · ');

  return (
    <article className="g-card g-card-hover g-pkgcard">
      <Link href={`/golf/package/${pkg.id}`} className="g-pkgcard-media" aria-label={pkg.hotel}>
        <img src={golfImg(pkg.id, 'resort')} alt={`${pkg.hotel}, ${pkg.destination}`} loading="lazy" />
        <div className="g-pkgcard-badges">
          {pkg.bestSeller && <span className="g-badge g-badge-best">Best Seller</span>}
          {pkg.lastMinute && <span className="g-badge g-badge-deal">Last Minute</span>}
          {pkg.allInclusive && <span className="g-badge g-badge-soft">All Inclusive</span>}
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
          <Link href={`/golf/package/${pkg.id}`}>{pkg.hotel}</Link>
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

        <ul className="g-pkgcard-incl">
          {pkg.breakfast && (
            <li>
              <Coffee size={13} /> 조식
            </li>
          )}
          {pkg.cartIncluded && (
            <li>
              <Car size={13} /> 카트
            </li>
          )}
          {pkg.airportTransfer && (
            <li>
              <Plane size={13} /> 픽업
            </li>
          )}
          <li>
            <Timer size={13} /> 골프장 {pkg.transferTimeMin}분
          </li>
        </ul>

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
            <div>
              <span className="g-price-now" style={{ fontSize: 22 }}>
                {fx(pkg.salePriceUSD)}
              </span>{' '}
              <span className="g-price-unit">/ 1인</span>
            </div>
          </div>
          <div className="g-pkgcard-actions">
            <CompareButton id={pkg.id} />
            <Link href={`/golf/package/${pkg.id}`} className="g-btn g-btn-primary g-btn-sm">
              패키지 보기
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
