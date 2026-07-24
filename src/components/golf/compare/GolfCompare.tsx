'use client';

import Link from 'next/link';
import { X, Check, Minus } from 'lucide-react';
import { useCompare, usePrefs } from '@/features/golf/GolfProviders';
import { getPackage, discountPct } from '@/mocks/golf/data';
import type { GolfPackage } from '@/mocks/golf/types';
import { golfImg } from '@/features/golf/images';
import { EmptyState, StarRating } from '@/components/golf/common/ui';

type RowDef = { label: string; get: (p: GolfPackage) => string | number | boolean; highlight?: boolean };

export default function GolfCompare() {
  const cmp = useCompare();
  const { fx } = usePrefs();
  const pkgs = cmp.ids.map(getPackage).filter(Boolean) as GolfPackage[];

  if (pkgs.length === 0) {
    return (
      <div className="g-container g-section">
        <h1 className="g-sr-only">패키지 비교</h1>
        <EmptyState
          title="아직 비교할 패키지가 없어요"
          subtitle="검색이나 홈에서 최대 3개까지 담아 나란히 비교하세요."
          action={<Link href="/golf/search" className="g-btn g-btn-primary" style={{ marginTop: 16 }}>패키지 둘러보기</Link>}
        />
      </div>
    );
  }

  const yn = (b: boolean) => (b ? <Check size={16} className="g-inc" /> : <Minus size={16} className="g-exc" />);

  const rows: RowDef[] = [
    { label: '총액 (1인)', get: (p) => fx(p.salePriceUSD), highlight: true },
    { label: '정가', get: (p) => fx(p.originalPriceUSD) },
    { label: '할인', get: (p) => `−${discountPct(p)}%` },
    { label: '숙박', get: (p) => p.nights, highlight: true },
    { label: '라운드', get: (p) => p.rounds, highlight: true },
    { label: '객실 타입', get: (p) => p.roomType },
    { label: '골프장', get: (p) => p.golfCourses.map((c) => c.name).join(', ') },
    { label: '조식', get: (p) => p.breakfast },
    { label: '카트 포함', get: (p) => p.cartIncluded },
    { label: '캐디 포함', get: (p) => p.caddieIncluded, highlight: true },
    { label: '공항 픽업', get: (p) => p.airportTransfer },
    { label: '올인클루시브', get: (p) => p.allInclusive },
    { label: '무료 취소', get: (p) => p.freeCancellation, highlight: true },
    { label: '즉시 확정', get: (p) => p.instantConfirmation },
    { label: '고객 평점', get: (p) => p.reviewScore.toFixed(1), highlight: true },
    { label: '골프장 거리', get: (p) => `${p.transferTimeMin} min`, highlight: true },
  ];

  const isDiff = (row: RowDef) => new Set(pkgs.map((p) => String(row.get(p)))).size > 1;

  return (
    <div className="g-container g-section">
      <div className="g-section-head">
        <div>
          <p className="g-eyebrow">한눈에 비교</p>
          <h1 className="g-section-title">패키지 비교</h1>
        </div>
        <button type="button" className="g-btn g-btn-ghost g-btn-sm" onClick={cmp.clear}>전체 비우기</button>
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
                      <img src={golfImg(p.id, 'resort')} alt={p.hotel} style={{ borderRadius: 10, marginBottom: 8 }} />
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
                  <Link href={`/golf/package/${p.id}`} className="g-btn g-btn-primary g-btn-sm g-btn-block">패키지 보기</Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <p className="g-muted" style={{ marginTop: 14, fontSize: 13 }}>
        강조된 셀은 패키지 간 차이가 있는 항목입니다.
      </p>
    </div>
  );
}
