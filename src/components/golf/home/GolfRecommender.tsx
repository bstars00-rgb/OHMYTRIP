'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { PACKAGES } from '@/mocks/golf/data';
import type { GolfPackage } from '@/mocks/golf/types';
import PackageCard from '@/components/golf/PackageCard';

const PREFS: { key: string; label: string; test: (p: GolfPackage) => boolean }[] = [
  { key: 'beginner', label: '초보자 친화', test: (p) => p.beginnerFriendly },
  { key: 'luxury', label: '럭셔리', test: (p) => p.tags.includes('luxury') },
  { key: 'family', label: '가족', test: (p) => p.tags.includes('family') },
  { key: 'weekend', label: '주말 · 짧게', test: (p) => p.tags.includes('weekend') },
  { key: 'all-inclusive', label: '올인클루시브', test: (p) => p.allInclusive },
  { key: 'group', label: '단체', test: (p) => p.tags.includes('group') },
];

/** 리뷰·조건 기반 취향 추천 (GORA AI 어시스턴트 벤치마크, 클라이언트 매칭) */
export default function GolfRecommender() {
  const [sel, setSel] = useState<string[]>(['beginner']);
  const toggle = (k: string) => setSel((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));

  const results: GolfPackage[] = (() => {
    const scored = PACKAGES.map((p) => {
      const match = PREFS.filter((pr) => sel.includes(pr.key) && pr.test(p)).length;
      return { p, match, score: p.reviewScore + match * 1.5 };
    });
    const pool = sel.length ? scored.filter((x) => x.match > 0) : scored;
    pool.sort((a, b) => b.score - a.score || b.p.reviewScore - a.p.reviewScore);
    const seen = new Set<string>();
    const out: GolfPackage[] = [];
    for (const x of pool) {
      if (seen.has(x.p.hotel)) continue;
      seen.add(x.p.hotel);
      out.push(x.p);
      if (out.length === 3) break;
    }
    return out;
  })();

  return (
    <section className="g-section g-container">
      <div className="g-section-head" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
        <p className="g-eyebrow"><Sparkles size={13} style={{ verticalAlign: -1 }} /> AI 추천</p>
        <h2 className="g-section-title">취향 맞춤 골프텔</h2>
        <p className="g-muted">원하는 스타일을 고르면 후기·조건을 분석해 딱 맞는 골프텔을 추천해 드려요.</p>
      </div>

      <div className="g-reco-chips">
        {PREFS.map((pr) => (
          <button key={pr.key} type="button" className={`g-chip${sel.includes(pr.key) ? ' is-active' : ''}`} onClick={() => toggle(pr.key)}>
            {pr.label}
          </button>
        ))}
      </div>

      {results.length ? (
        <div className="g-pkg-grid g-reco-grid">
          {results.map((p) => <PackageCard key={p.id} pkg={p} />)}
        </div>
      ) : (
        <p className="g-muted" style={{ marginTop: 20 }}>선택한 조건에 맞는 추천이 없어요. 다른 스타일을 골라보세요.</p>
      )}
    </section>
  );
}
