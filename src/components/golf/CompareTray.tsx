'use client';

import Link from 'next/link';
import { GitCompareArrows, X } from 'lucide-react';
import { useCompare } from '@/features/golf/GolfProviders';
import { getPackage } from '@/mocks/golf/data';

/** 하단 고정 비교 트레이 — compare에 1개 이상 담기면 노출 */
export default function CompareTray() {
  const cmp = useCompare();
  if (cmp.ids.length === 0) return null;
  return (
    <div className="g-compare-tray" role="region" aria-label="Compare packages">
      <div className="g-container g-compare-tray-inner">
        <div className="g-compare-tray-items">
          <GitCompareArrows size={18} />
          <span className="g-compare-tray-count">{cmp.ids.length} / 3 선택</span>
          <div className="g-compare-tray-chips">
            {cmp.ids.map((id) => {
              const p = getPackage(id);
              return (
                <span key={id} className="g-compare-chip">
                  {p?.hotel ?? id}
                  <button type="button" aria-label="Remove" onClick={() => cmp.toggle(id)}>
                    <X size={13} />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
        <div className="g-compare-tray-actions">
          <button type="button" className="g-btn g-btn-ghost g-btn-sm" onClick={cmp.clear}>
            비우기
          </button>
          <Link href="/golf/compare" className="g-btn g-btn-primary g-btn-sm" aria-disabled={cmp.ids.length < 2}>
            비교 {cmp.ids.length >= 2 ? `(${cmp.ids.length})` : ''}
          </Link>
        </div>
      </div>
    </div>
  );
}
