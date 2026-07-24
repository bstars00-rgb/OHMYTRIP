'use client';

import Link from 'next/link';
import { MapPin, Coffee, Car, Plane, Flag, CheckCircle2, Timer, Zap } from 'lucide-react';
import type { GolfPackage } from '@/mocks/golf/types';
import { discountPct } from '@/mocks/golf/data';
import { golfScene } from '@/features/golf/scenery';
import { usePrefs } from '@/features/golf/GolfProviders';
import { StarRating, ReviewScore, WishlistButton, CompareButton } from '@/components/golf/common/ui';

export default function PackageCard({ pkg }: { pkg: GolfPackage }) {
  const { fx } = usePrefs();
  const pct = discountPct(pkg);
  const courses = pkg.golfCourses.map((c) => c.name).join(' · ');

  return (
    <article className="g-card g-card-hover g-pkgcard">
      <Link href={`/golf/package/${pkg.id}`} className="g-pkgcard-media" aria-label={pkg.hotel}>
        <img src={golfScene(pkg.images[0], { ratio: 1.5 })} alt={`${pkg.hotel}, ${pkg.destination}`} loading="lazy" />
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
          <Flag size={14} /> {pkg.nights} Nights · {pkg.rounds} Rounds
        </div>
        <p className="g-pkgcard-courses" title={courses}>
          {courses}
        </p>

        <ul className="g-pkgcard-incl">
          {pkg.breakfast && (
            <li>
              <Coffee size={13} /> Breakfast
            </li>
          )}
          {pkg.cartIncluded && (
            <li>
              <Car size={13} /> Cart
            </li>
          )}
          {pkg.airportTransfer && (
            <li>
              <Plane size={13} /> Transfer
            </li>
          )}
          <li>
            <Timer size={13} /> {pkg.transferTimeMin} min to course
          </li>
        </ul>

        <div className="g-pkgcard-status">
          {pkg.freeCancellation && (
            <span className="g-inc g-pkgcard-flag">
              <CheckCircle2 size={13} /> Free cancellation
            </span>
          )}
          {pkg.instantConfirmation ? (
            <span className="g-badge g-badge-instant">
              <Zap size={12} /> Instant confirmation
            </span>
          ) : (
            <span className="g-badge g-badge-quote">Request quote</span>
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
              <span className="g-price-unit">/ person</span>
            </div>
          </div>
          <div className="g-pkgcard-actions">
            <CompareButton id={pkg.id} />
            <Link href={`/golf/package/${pkg.id}`} className="g-btn g-btn-primary g-btn-sm">
              View package
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
