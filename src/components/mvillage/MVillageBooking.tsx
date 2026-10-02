'use client';

/* eslint-disable @next/next/no-img-element -- 프로토타입 스톡 이미지 */

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Check, MapPin, Minus, Plus, ShieldCheck, Zap, Coffee, Users,
  CreditCard, Wallet, BadgeCheck, CalendarCheck,
} from 'lucide-react';
import { PROPERTIES, brandByKey, wonKR } from '@/mocks/mvillage/data';
import { mvImg } from '@/features/mvillage/images';
import MVillageDateBox from '@/components/mvillage/MVillageDateBox';
import { useMV } from '@/features/mvillage/i18n';

const iso = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (base: string, n: number) => { const d = new Date(base); d.setDate(d.getDate() + n); return iso(d); };
const nightsBetween = (a: string, b: string) => (a && b ? Math.max(0, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000)) : 0);
const round1000 = (n: number) => Math.round(n / 1000) * 1000;

const ROOM_META = [
  { key: 'standard', occ: 2, mult: 1.0, left: 6, breakfast: false },
  { key: 'deluxe', occ: 2, mult: 1.35, left: 3, breakfast: true },
  { key: 'suite', occ: 3, mult: 1.9, left: 1, breakfast: true },
];

export default function MVillageBooking({ id }: { id: string }) {
  const { t, tcity, rooms } = useMV();
  const property = PROPERTIES.find((p) => p.id === id);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [roomCount, setRoomCount] = useState(1);
  const [guests, setGuests] = useState(2);
  const [roomKey, setRoomKey] = useState<string | null>(null);
  const [pay, setPay] = useState('card');
  const [traveler, setTraveler] = useState({ name: '', email: '', phone: '' });
  const [done, setDone] = useState(false);

  useEffect(() => {
    const d = iso(new Date());
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 마운트 후 날짜 초기화
    setCheckIn(addDays(d, 14)); setCheckOut(addDays(d, 16));
  }, []);

  const roomLabels = rooms();
  const PAYMENTS = [
    { key: 'card', label: t('bk.payCard'), icon: CreditCard },
    { key: 'kakao', label: 'KakaoPay', icon: Wallet },
    { key: 'naver', label: 'NaverPay', icon: Wallet },
    { key: 'toss', label: 'Toss', icon: Wallet },
  ];

  const brand = property ? brandByKey(property.brandKey) : undefined;
  const nights = useMemo(() => nightsBetween(checkIn, checkOut), [checkIn, checkOut]);
  const roomList = useMemo(
    () => (property ? ROOM_META.map((m, i) => ({ ...m, rate: round1000(property.fromKRW * m.mult), name: roomLabels[i].name, perks: roomLabels[i].perks })) : []),
    [property, roomLabels],
  );
  const room = roomList.find((r) => r.key === roomKey);
  const subtotal = room ? room.rate * Math.max(1, nights) * roomCount : 0;
  const taxes = Math.round(subtotal * 0.1);
  const total = subtotal + taxes;
  const canBook = !!room && nights > 0 && traveler.name.trim() && traveler.email.trim();
  const ref = property ? `MV${property.id.slice(0, 3).toUpperCase()}${String(100000 + (total % 900000))}` : '';

  if (!property) {
    return (
      <div className="mv-container mv-section" style={{ textAlign: 'center' }}>
        <h1 className="mv-h2">{t('bk.notFound')}</h1>
        <p className="mv-lead" style={{ margin: '14px auto 24px' }}>{t('bk.notFoundSub')}</p>
        <Link href="/mvillage" className="mv-btn mv-btn-primary">{t('bk.toHall')}</Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mv-container mv-section mv-book">
        <div className="mv-book-done">
          <div className="mv-book-check"><Check size={38} strokeWidth={3} /></div>
          <span className="mv-badge hot" style={{ marginBottom: 12, display: 'inline-flex', gap: 4, alignItems: 'center' }}><Zap size={12} /> {t('bk.instant')}</span>
          <h1 className="mv-h2" style={{ marginBottom: 10 }}>{t('bk.doneTitle')}</h1>
          <p className="mv-lead" style={{ margin: '0 auto 6px' }}>
            <b>{property.name}</b> · {room?.name}<br />{checkIn} ~ {checkOut} ({nights}{t('bk.night')}) · {t('bk.rooms')} {roomCount} · {t('bk.guests')} {guests}
          </p>
          <div className="mv-book-ref">{t('bk.ref')} · {ref}</div>
          <p style={{ marginBottom: 18 }}>{t('bk.paid')} <b style={{ color: 'var(--mv-forest)' }}>{wonKR(total)}</b> · {t('bk.voucher')}</p>
          <p className="mv-modal-note" style={{ maxWidth: 520, margin: '0 auto 24px' }}>{t('bk.doneNote')}</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/mvillage" className="mv-btn mv-btn-primary">{t('bk.toHall2')}</Link>
            <button type="button" className="mv-btn mv-btn-outline" onClick={() => { setDone(false); setRoomKey(null); }}>{t('bk.again')}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mv-container mv-section mv-book">
      <Link href="/mvillage#stays" className="mv-back-omt" style={{ marginBottom: 20 }}><ArrowLeft size={15} /> {t('bk.backList')}</Link>
      <span className="mv-eyebrow"><CalendarCheck size={14} /> Real-time Booking</span>
      <h1 className="mv-h2" style={{ margin: '10px 0 4px' }}>{property.name}</h1>
      <p className="mv-prop-city" style={{ marginBottom: 26 }}><MapPin size={13} /> {tcity(property.city)}, Vietnam · {brand?.name} · <span style={{ color: 'var(--mv-orange)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 3 }}><Zap size={12} /> {t('bk.instant')}</span></p>

      <div className="mv-book-grid">
        <div>
          <div className="mv-book-search">
            <div className="mv-field mv-book-dates">
              <label className="mv-label">{t('bk.dates')}</label>
              <MVillageDateBox checkIn={checkIn} checkOut={checkOut} onChange={(a, b) => { setCheckIn(a); setCheckOut(b); }} />
            </div>
            <div className="mv-stepper"><span>{t('bk.rooms')}</span>
              <div className="mv-stepper-ctrl">
                <button type="button" onClick={() => setRoomCount((r) => Math.max(1, r - 1))} aria-label="-"><Minus size={15} /></button><b>{roomCount}</b>
                <button type="button" onClick={() => setRoomCount((r) => Math.min(9, r + 1))} aria-label="+"><Plus size={15} /></button>
              </div></div>
            <div className="mv-stepper"><span>{t('bk.guests')}</span>
              <div className="mv-stepper-ctrl">
                <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} aria-label="-"><Minus size={15} /></button><b>{guests}</b>
                <button type="button" onClick={() => setGuests((g) => Math.min(20, g + 1))} aria-label="+"><Plus size={15} /></button>
              </div></div>
          </div>

          <h3 className="mv-book-h3">{t('bk.roomSelect')} <span className="mv-muted" style={{ fontWeight: 400, fontSize: 13 }}>· {nights}{t('bk.night')} {t('bk.realtimeRate')}</span></h3>
          <div className="mv-room-list">
            {roomList.map((r) => (
              <button type="button" key={r.key} className={`mv-room-card${roomKey === r.key ? ' is-sel' : ''}`} onClick={() => setRoomKey(r.key)}>
                <div className="mv-room-media"><img src={mvImg(property.seed + r.key, r.key === 'suite' ? 'suite' : 'interior')} alt={r.name} loading="lazy" /></div>
                <div className="mv-room-body">
                  <div className="mv-room-top">
                    <b className="mv-room-name">{r.name}</b>
                    <span className={`mv-room-left${r.left <= 1 ? ' urgent' : ''}`}>{t('bk.left')} {r.left}{t('bk.leftUnit')}</span>
                  </div>
                  <div className="mv-room-perks">
                    <span><Users size={13} /> {t('bk.maxOcc')} {r.occ}{t('bk.occUnit')}</span>
                    {r.breakfast && <span><Coffee size={13} /> {t('bk.breakfast')}</span>}
                    {r.perks.map((p) => <span key={p}>{p}</span>)}
                  </div>
                  <div className="mv-room-foot">
                    <div className="mv-room-price"><small>{t('bk.perNight')}</small><b>{wonKR(r.rate)}</b></div>
                    <span className={`mv-room-pick${roomKey === r.key ? ' is-sel' : ''}`}>{roomKey === r.key ? <><Check size={15} /> {t('bk.picked')}</> : t('bk.pick')}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <h3 className="mv-book-h3">{t('bk.guestInfo')}</h3>
          <div className="mv-field-row">
            <div className="mv-field"><label className="mv-label">{t('bk.name')} *</label><input className="mv-input" value={traveler.name} onChange={(e) => setTraveler((tv) => ({ ...tv, name: e.target.value }))} placeholder={t('bk.namePh')} /></div>
            <div className="mv-field"><label className="mv-label">{t('bk.phone')}</label><input className="mv-input" value={traveler.phone} onChange={(e) => setTraveler((tv) => ({ ...tv, phone: e.target.value }))} placeholder="010-0000-0000" /></div>
          </div>
          <div className="mv-field"><label className="mv-label">{t('bk.email')} *</label><input type="email" className="mv-input" value={traveler.email} onChange={(e) => setTraveler((tv) => ({ ...tv, email: e.target.value }))} placeholder="name@email.com" /></div>

          <h3 className="mv-book-h3">{t('bk.payment')}</h3>
          <div className="mv-chips">
            {PAYMENTS.map((p) => (
              <button type="button" key={p.key} className={`mv-chip${pay === p.key ? ' is-active' : ''}`} onClick={() => setPay(p.key)}><p.icon size={14} style={{ marginRight: 6, verticalAlign: '-2px' }} />{p.label}</button>
            ))}
          </div>
        </div>

        <aside className="mv-book-form">
          <div className="mv-book-media" style={{ borderRadius: 'var(--mv-radius-sm)', overflow: 'hidden', marginBottom: 14 }}>
            <img src={mvImg(property.seed, property.imgKind)} alt={property.name} style={{ aspectRatio: '16/9', width: '100%', objectFit: 'cover' }} />
          </div>
          <b style={{ fontFamily: 'var(--mv-serif-ko)', fontSize: 18, color: 'var(--mv-forest)' }}>{property.name}</b>
          <div className="mv-muted" style={{ fontSize: 13, marginBottom: 12 }}>{brand?.name} · {tcity(property.city)}</div>
          <div className="mv-book-rows">
            <div className="mv-book-row"><span>{t('bk.rowSchedule')}</span><b>{checkIn} ~ {checkOut}</b></div>
            <div className="mv-book-row"><span>{t('bk.rowRoomGuest')}</span><b>{roomCount}{t('bk.roomUnit')} · {guests}{t('bk.guestUnit')}</b></div>
            <div className="mv-book-row"><span>{t('bk.rowRoomType')}</span><b>{room ? room.name : t('bk.notSelected')}</b></div>
            {room && <div className="mv-book-row"><span>{wonKR(room.rate)} × {Math.max(1, nights)}{t('bk.night')} × {roomCount}</span><b>{wonKR(subtotal)}</b></div>}
            {room && <div className="mv-book-row mv-muted"><span>{t('bk.tax')}</span><span>{wonKR(taxes)}</span></div>}
          </div>
          <div className="mv-book-total"><span>{t('bk.grandTotal')}</span><b>{room ? wonKR(total) : '—'}</b></div>
          <button type="button" className="mv-btn mv-btn-accent mv-btn-block" disabled={!canBook} onClick={() => setDone(true)}>
            <Zap size={16} /> {room ? `${wonKR(total)} ${t('bk.instantBook')}` : t('bk.selectRoomFirst')}
          </button>
          {!canBook && room && <p className="mv-book-safe" style={{ color: 'var(--mv-orange)' }}>{t('bk.needGuest')}</p>}
          <p className="mv-book-safe"><BadgeCheck size={14} /> {t('bk.instant')} · <ShieldCheck size={14} /> {t('bk.safe')}</p>
          <p className="mv-modal-note">{t('bk.note')}</p>
        </aside>
      </div>
    </div>
  );
}
