'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Check, FileText, Flag, CalendarClock, MessageCircle, QrCode } from 'lucide-react';
import { getPackage, golfPoints } from '@/mocks/golf/data';
import { usePrefs } from '@/features/golf/GolfProviders';

export default function BookingComplete() {
  const params = useSearchParams();
  const { fx } = usePrefs();
  const pkg = getPackage(params.get('pkg') ?? '');
  const total = Number(params.get('total') ?? 0);
  const earn = Number(params.get('earn') ?? golfPoints(total));
  const ref = `OMG-${(params.get('pkg') ?? 'GOLF').slice(0, 4).toUpperCase()}-${String(1000 + (total % 9000))}`;

  return (
    <div className="g-container g-complete">
      <div className="g-complete-check"><Check size={40} strokeWidth={3} /></div>
      <h1>골프 여행이 확정됐어요!</h1>
      <p className="g-muted">
        {pkg ? <><b>{pkg.hotel}</b>({pkg.destination}) 예약이 완료됐습니다.</> : '예약이 확정됐습니다.'}
        {' '}바우처가 포함된 확정 이메일을 곧 보내드립니다.
      </p>
      <div className="g-complete-ref">예약 번호 · {ref}</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, textAlign: 'left', marginBottom: 26 }}>
        {[
          { icon: FileText, label: '호텔 바우처', text: '다운로드 준비 완료' },
          { icon: Flag, label: '골프 바우처', text: `${pkg?.rounds ?? 2}라운드 확정` },
          { icon: CalendarClock, label: '티타임', text: '골프장 예약 확정' },
          { icon: MessageCircle, label: '24/7 컨시어지', text: '출발 전 언제든 문의하세요' },
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

      {total > 0 && (
        <p style={{ marginBottom: 14 }}>결제 총액: <b>{fx(total)}</b> · <span className="g-point-earn">{earn.toLocaleString()}P 적립</span></p>
      )}

      <div className="g-checkin-note">
        <QrCode size={18} /> <span>골프장 도착 시 <b>체크인</b>하면 추가 포인트가 적립됩니다.</span>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/golf/my-trips" className="g-btn g-btn-primary g-btn-lg">마이 트립 보기</Link>
        <Link href="/golf" className="g-btn g-btn-outline g-btn-lg">홈으로</Link>
      </div>
    </div>
  );
}
