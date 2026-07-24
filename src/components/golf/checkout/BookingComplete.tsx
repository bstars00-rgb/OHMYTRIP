'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Check, FileText, Flag, CalendarClock, MessageCircle } from 'lucide-react';
import { getPackage } from '@/mocks/golf/data';
import { usePrefs } from '@/features/golf/GolfProviders';

export default function BookingComplete() {
  const params = useSearchParams();
  const { fx } = usePrefs();
  const pkg = getPackage(params.get('pkg') ?? '');
  const total = Number(params.get('total') ?? 0);
  const ref = `OMG-${(params.get('pkg') ?? 'GOLF').slice(0, 4).toUpperCase()}-${String(1000 + (total % 9000))}`;

  return (
    <div className="g-container g-complete">
      <div className="g-complete-check"><Check size={40} strokeWidth={3} /></div>
      <h1>Your golf trip is confirmed!</h1>
      <p className="g-muted">
        {pkg ? <>We&apos;ve booked <b>{pkg.hotel}</b> in {pkg.destination}.</> : 'Your booking is confirmed.'}
        {' '}A confirmation email with vouchers is on its way.
      </p>
      <div className="g-complete-ref">Booking reference · {ref}</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, textAlign: 'left', marginBottom: 26 }}>
        {[
          { icon: FileText, label: 'Hotel voucher', text: 'Ready to download' },
          { icon: Flag, label: 'Golf voucher', text: `${pkg?.rounds ?? 2} rounds confirmed` },
          { icon: CalendarClock, label: 'Tee times', text: 'Confirmed with courses' },
          { icon: MessageCircle, label: '24/7 concierge', text: 'Chat anytime before you fly' },
        ].map((c) => (
          <div key={c.label} className="g-card" style={{ padding: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
            <span className="g-why-icon" style={{ width: 42, height: 42, margin: 0 }}><c.icon size={18} /></span>
            <div>
              <b style={{ fontSize: 14 }}>{c.label}</b>
              <div className="g-muted" style={{ fontSize: 13 }}>{c.text}</div>
            </div>
          </div>
        ))}
      </div>

      {total > 0 && <p style={{ marginBottom: 22 }}>Total paid: <b>{fx(total)}</b></p>}

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/golf/my-trips" className="g-btn g-btn-primary g-btn-lg">View my trips</Link>
        <Link href="/golf" className="g-btn g-btn-outline g-btn-lg">Back to home</Link>
      </div>
    </div>
  );
}
