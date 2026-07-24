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
  { key: 'upcoming', label: 'Upcoming Trips' },
  { key: 'past', label: 'Past Trips' },
  { key: 'saved', label: 'Saved Packages' },
  { key: 'quotes', label: 'Quotes' },
];

// 데모용 예약(프로토타입 고정)
const UPCOMING = [{ pkgId: PACKAGES[0].id, dates: '12 – 16 Oct 2026', status: 'Confirmed' }];
const PAST = [{ pkgId: PACKAGES[2].id, dates: '3 – 7 Mar 2026', status: 'Completed' }];
const QUOTES = [{ dest: 'Hokkaido, Japan', dates: 'Jul 2026 (flexible)', status: 'Awaiting reply' }];

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
        <p style={{ fontSize: 14, marginTop: 8 }}><b>{dates}</b> · {pkg.nights} Nights · {pkg.rounds} Rounds</p>
        <span className="g-badge g-badge-instant" style={{ marginTop: 10 }}>{status}</span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
          <span className="g-badge g-badge-soft"><FileText size={12} /> Hotel voucher</span>
          <span className="g-badge g-badge-soft"><Flag size={12} /> Golf voucher</span>
          <span className="g-badge g-badge-soft"><CalendarClock size={12} /> Tee times</span>
        </div>
      </div>
      <div className="g-trip-actions">
        <span className="g-price-now" style={{ fontSize: 18 }}>{fx(pkg.salePriceUSD)}<span className="g-price-unit"> /pp</span></span>
        <button type="button" className="g-btn g-btn-outline g-btn-sm"><UserPlus size={14} /> Add companion</button>
        <button type="button" className="g-btn g-btn-ghost g-btn-sm"><RefreshCw size={14} /> Change</button>
        <button type="button" className="g-btn g-btn-ghost g-btn-sm"><XCircle size={14} /> Cancel</button>
        <button type="button" className="g-btn g-btn-primary g-btn-sm"><MessageCircle size={14} /> Concierge</button>
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
        <p className="g-eyebrow">Your account</p>
        <h1 className="g-section-title">My Trips</h1>
      </div>

      <div className="g-mytrips-tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t.key} type="button" role="tab" aria-selected={tab === t.key} className={`g-mytrips-tab${tab === t.key ? ' is-active' : ''}`} onClick={() => setTab(t.key)}>
            {t.label}
            {t.key === 'saved' && wl.ids.length > 0 ? ` (${wl.ids.length})` : ''}
          </button>
        ))}
      </div>

      {tab === 'upcoming' && (UPCOMING.length ? UPCOMING.map((t) => <TripCard key={t.pkgId} {...t} />) : <EmptyState title="No upcoming trips" />)}
      {tab === 'past' && (PAST.length ? PAST.map((t) => <TripCard key={t.pkgId} {...t} />) : <EmptyState title="No past trips" />)}

      {tab === 'saved' && (
        saved.length ? (
          <div className="g-pkg-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            {saved.map((p) => p && <PackageCard key={p.id} pkg={p} />)}
          </div>
        ) : (
          <EmptyState
            title="No saved packages yet"
            subtitle="Tap the heart on any package to save it here."
            action={<Link href="/golf/search" className="g-btn g-btn-primary" style={{ marginTop: 16 }}>Browse packages</Link>}
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
                <Link href="/golf/build" className="g-btn g-btn-outline g-btn-sm">Edit request</Link>
              </div>
            </div>
          ))
        ) : (
          <EmptyState title="No quotes yet" action={<Link href="/golf/build" className="g-btn g-btn-primary" style={{ marginTop: 16 }}>Build a custom trip</Link>} />
        )
      )}
    </div>
  );
}
