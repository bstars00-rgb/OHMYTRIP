'use client';

import Link from 'next/link';
import { X, Check, Minus } from 'lucide-react';
import { useCompare, usePrefs } from '@/features/golf/GolfProviders';
import { getPackage, discountPct } from '@/mocks/golf/data';
import type { GolfPackage } from '@/mocks/golf/types';
import { golfScene } from '@/features/golf/scenery';
import { EmptyState, StarRating } from '@/components/golf/common/ui';

type RowDef = { label: string; get: (p: GolfPackage) => string | number | boolean; highlight?: boolean };

export default function GolfCompare() {
  const cmp = useCompare();
  const { fx } = usePrefs();
  const pkgs = cmp.ids.map(getPackage).filter(Boolean) as GolfPackage[];

  if (pkgs.length === 0) {
    return (
      <div className="g-container g-section">
        <EmptyState
          title="Nothing to compare yet"
          subtitle="Add up to 3 packages from search or the home page to compare them side by side."
          action={<Link href="/golf/search" className="g-btn g-btn-primary" style={{ marginTop: 16 }}>Browse packages</Link>}
        />
      </div>
    );
  }

  const yn = (b: boolean) => (b ? <Check size={16} className="g-inc" /> : <Minus size={16} className="g-exc" />);

  const rows: RowDef[] = [
    { label: 'Total (per person)', get: (p) => fx(p.salePriceUSD), highlight: true },
    { label: 'Original price', get: (p) => fx(p.originalPriceUSD) },
    { label: 'Discount', get: (p) => `−${discountPct(p)}%` },
    { label: 'Nights', get: (p) => p.nights, highlight: true },
    { label: 'Rounds', get: (p) => p.rounds, highlight: true },
    { label: 'Room type', get: (p) => p.roomType },
    { label: 'Golf courses', get: (p) => p.golfCourses.map((c) => c.name).join(', ') },
    { label: 'Breakfast', get: (p) => p.breakfast },
    { label: 'Cart included', get: (p) => p.cartIncluded },
    { label: 'Caddie included', get: (p) => p.caddieIncluded, highlight: true },
    { label: 'Airport transfer', get: (p) => p.airportTransfer },
    { label: 'All inclusive', get: (p) => p.allInclusive },
    { label: 'Free cancellation', get: (p) => p.freeCancellation, highlight: true },
    { label: 'Instant confirmation', get: (p) => p.instantConfirmation },
    { label: 'Guest rating', get: (p) => p.reviewScore.toFixed(1), highlight: true },
    { label: 'Drive to course', get: (p) => `${p.transferTimeMin} min`, highlight: true },
  ];

  const isDiff = (row: RowDef) => new Set(pkgs.map((p) => String(row.get(p)))).size > 1;

  return (
    <div className="g-container g-section">
      <div className="g-section-head">
        <div>
          <p className="g-eyebrow">Side by side</p>
          <h1 className="g-section-title">Compare packages</h1>
        </div>
        <button type="button" className="g-btn g-btn-ghost g-btn-sm" onClick={cmp.clear}>Clear all</button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="g-compare-table">
          <thead>
            <tr>
              <th className="g-compare-rowlabel" />
              {pkgs.map((p) => (
                <th key={p.id} style={{ minWidth: 220 }}>
                  <div style={{ position: 'relative' }}>
                    <button type="button" className="g-modal-close" style={{ position: 'absolute', right: 0, top: 0, width: 26, height: 26 }} onClick={() => cmp.toggle(p.id)} aria-label="Remove">
                      <X size={14} />
                    </button>
                    <Link href={`/golf/package/${p.id}`}>
                      <img src={golfScene(p.images[0], { ratio: 1.6 })} alt={p.hotel} style={{ borderRadius: 10, marginBottom: 8 }} />
                      <StarRating rating={p.hotelRating} />
                      <div className="g-compare-hotel">{p.hotel}</div>
                      <div className="g-muted" style={{ fontSize: 13 }}>{p.destination}, {p.country}</div>
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const diff = row.highlight && isDiff(row);
              return (
                <tr key={row.label}>
                  <td className="g-compare-rowlabel">{row.label}</td>
                  {pkgs.map((p) => {
                    const v = row.get(p);
                    return (
                      <td key={p.id} className={diff ? 'g-compare-diff' : ''}>
                        {typeof v === 'boolean' ? yn(v) : <b>{v}</b>}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            <tr>
              <td className="g-compare-rowlabel" />
              {pkgs.map((p) => (
                <td key={p.id}>
                  <Link href={`/golf/package/${p.id}`} className="g-btn g-btn-primary g-btn-sm g-btn-block">View package</Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="g-muted" style={{ marginTop: 14, fontSize: 13 }}>
        Highlighted cells show where the packages differ.
      </p>
    </div>
  );
}
