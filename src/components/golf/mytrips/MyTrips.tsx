'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileText, Flag, CalendarClock, MessageCircle, UserPlus, RefreshCw, XCircle, MapPin } from 'lucide-react';
import { PACKAGES, getPackage } from '@/mocks/golf/data';
import { useWishlist, usePrefs } from '@/features/golf/GolfProviders';
import { golfImg } from '@/features/golf/images';
import { EmptyState, StarRating } from '@/components/golf/common/ui';
import PackageCard from '@/components/golf/PackageCard';

type Tab = 'upcoming' | 'past' | 'saved' | 'quotes';
const TABS: { key: Tab; label: string }[] = [
  { key: 'upcoming', label: '예정된 여행' },
  { key: 'past', label: '지난 여행' },
  { key: 'saved', label: '저장한 패키지' },
  { key: 'quotes', label: '견적 요청' },
];

// 데모용 예약(프로토타입 고정)
const UPCOMING = [{ pkgId: PACKAGES[0].id, dates: '2026.10.12 – 10.16', status: '확정' }];
const PAST = [{ pkgId: PACKAGES[2].id, dates: '2026.03.03 – 03.07', status: '완료' }];
const QUOTES = [{ dest: '홋카이도, 일본', dates: '2026.07 (일정 조율)', status: '답변 대기' }];

function TripCard({ pkgId, dates, status }: { pkgId: string; dates: string; status: string }) {
  const pkg = getPackage(pkgId);
  const { fx } = usePrefs();
  if (!pkg) return null;
  return (
    <div className="g-trip-card">
      <img src={golfImg(pkg.id, 'resort')} alt={pkg.hotel} />
      <div className="g-trip-info">
        <StarRating rating={pkg.hotelRating} />
        <h3 style={{ fontFamily: 'var(--g-serif)', fontSize: 20, margin: '6px 0 4px' }}>{pkg.hotel}</h3>
        <p className="g-muted" style={{ fontSize: 14 }}><MapPin size={13} /> {pkg.destination}, {pkg.country}</p>
        <p style={{ fontSize: 14, marginTop: 8 }}><b>{dates}</b> · {pkg.nights}박 · {pkg.rounds}라운드</p>
        <span className="g-badge g-badge-instant" style={{ marginTop: 10 }}>{status}</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
          <span className="g-badge g-badge-soft"><FileText size={12} /> 호텔 바우처</span>
          <span className="g-badge g-badge-soft"><Flag size={12} /> 골프 바우처</span>
          <span className="g-badge g-badge-soft"><CalendarClock size={12} /> 티타임</span>
        </div>
      </div>
      <div className="g-trip-actions">
        <span className="g-price-now" style={{ fontSize: 18 }}>{fx(pkg.salePriceUSD)}<span className="g-price-unit"> /1인</span></span>
        <button type="button" className="g-btn g-btn-outline g-btn-sm"><UserPlus size={14} /> 동반자 추가</button>
        <button type="button" className="g-btn g-btn-ghost g-btn-sm"><RefreshCw size={14} /> 변경</button>
        <button type="button" className="g-btn g-btn-ghost g-btn-sm"><XCircle size={14} /> 취소</button>
        <button type="button" className="g-btn g-btn-primary g-btn-sm"><MessageCircle size={14} /> 컨시어지</button>
      </div>
    </div>
  );
}

export default function MyTrips() {
  const [tab, setTab] = useState<Tab>('upcoming');
  const wl = useWishlist();
  const saved = wl.ids.map(getPackage).filter(Boolean);

  return (
    <div className="g-container g-section">
      <div className="g-section-head" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
        <p className="g-eyebrow">내 계정</p>
        <h1 className="g-section-title">마이 트립</h1>
      </div>

      <div className="g-mytrips-tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t.key} type="button" role="tab" aria-selected={tab === t.key} className={`g-mytrips-tab${tab === t.key ? ' is-active' : ''}`} onClick={() => setTab(t.key)}>
            {t.label}
            {t.key === 'saved' && wl.ids.length > 0 ? ` (${wl.ids.length})` : ''}
          </button>
        ))}
      </div>

      {tab === 'upcoming' && (UPCOMING.length ? UPCOMING.map((t) => <TripCard key={t.pkgId} {...t} />) : <EmptyState title="예정된 여행이 없어요" />)}
      {tab === 'past' && (PAST.length ? PAST.map((t) => <TripCard key={t.pkgId} {...t} />) : <EmptyState title="지난 여행이 없어요" />)}

      {tab === 'saved' && (
        saved.length ? (
          <div className="g-pkg-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {saved.map((p) => p && <PackageCard key={p.id} pkg={p} />)}
          </div>
        ) : (
          <EmptyState
            title="저장한 패키지가 없어요"
            subtitle="마음에 드는 패키지의 하트를 눌러 여기에 저장하세요."
            action={<Link href="/golf/search" className="g-btn g-btn-primary" style={{ marginTop: 16 }}>패키지 둘러보기</Link>}
          />
        )
      )}

      {tab === 'quotes' && (
        QUOTES.length ? (
          QUOTES.map((q, i) => (
            <div key={i} className="g-card" style={{ padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <b style={{ fontSize: 16 }}>{q.dest}</b>
                <div className="g-muted" style={{ fontSize: 14 }}>{q.dates}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span className="g-badge g-badge-quote">{q.status}</span>
                <Link href="/golf/build" className="g-btn g-btn-outline g-btn-sm">요청 수정</Link>
              </div>
            </div>
          ))
        ) : (
          <EmptyState title="견적 요청이 없어요" action={<Link href="/golf/build" className="g-btn g-btn-primary" style={{ marginTop: 16 }}>맞춤 여행 만들기</Link>} />
        )
      )}
    </div>
  );
}
