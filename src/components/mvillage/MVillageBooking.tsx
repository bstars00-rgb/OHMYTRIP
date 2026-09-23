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

const iso = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (base: string, n: number) => { const d = new Date(base); d.setDate(d.getDate() + n); return iso(d); };
const nightsBetween = (a: string, b: string) => (a && b ? Math.max(0, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000)) : 0);
const round1000 = (n: number) => Math.round(n / 1000) * 1000;

interface RoomType { key: string; name: string; occ: number; mult: number; left: number; breakfast: boolean; perks: string[]; }
const ROOM_TYPES: RoomType[] = [
  { key: 'standard', name: '스탠다드 룸', occ: 2, mult: 1.0, left: 6, breakfast: false, perks: ['시티/가든뷰', '무료 Wi-Fi'] },
  { key: 'deluxe', name: '디럭스 룸', occ: 2, mult: 1.35, left: 3, breakfast: true, perks: ['조식 포함', '넓은 창·업무 데스크'] },
  { key: 'suite', name: '프리미엄 스위트', occ: 3, mult: 1.9, left: 1, breakfast: true, perks: ['조식 포함', '라운지 이용', '최상층 전망'] },
];

const PAYMENTS = [
  { key: 'card', label: '신용·체크카드', icon: CreditCard },
  { key: 'kakao', label: '카카오페이', icon: Wallet },
  { key: 'naver', label: '네이버페이', icon: Wallet },
  { key: 'toss', label: '토스', icon: Wallet },
];

export default function MVillageBooking({ id }: { id: string }) {
  const property = PROPERTIES.find((p) => p.id === id);
  const [today, setToday] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(2);
  const [roomKey, setRoomKey] = useState<string | null>(null);
  const [pay, setPay] = useState('card');
  const [traveler, setTraveler] = useState({ name: '', email: '', phone: '' });
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = iso(new Date());
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 마운트 후 날짜 초기화
    setToday(t); setCheckIn(addDays(t, 14)); setCheckOut(addDays(t, 16));
  }, []);

  const brand = property ? brandByKey(property.brandKey) : undefined;
  const nights = useMemo(() => nightsBetween(checkIn, checkOut), [checkIn, checkOut]);
  const roomList = useMemo(() => (property ? ROOM_TYPES.map((r) => ({ ...r, rate: round1000(property.fromKRW * r.mult) })) : []), [property]);
  const room = roomList.find((r) => r.key === roomKey);
  const subtotal = room ? room.rate * Math.max(1, nights) * rooms : 0;
  const taxes = Math.round(subtotal * 0.1);
  const total = subtotal + taxes;
  const canBook = !!room && nights > 0 && traveler.name.trim() && traveler.email.trim();
  const ref = property ? `MV${property.id.slice(0, 3).toUpperCase()}${String(100000 + (total % 900000))}` : '';

  if (!property) {
    return (
      <div className="mv-container mv-section" style={{ textAlign: 'center' }}>
        <h1 className="mv-h2">시설을 찾을 수 없어요</h1>
        <p className="mv-lead" style={{ margin: '14px auto 24px' }}>요청하신 시설 정보가 없습니다.</p>
        <Link href="/mvillage" className="mv-btn mv-btn-primary">브랜드관으로 돌아가기</Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mv-container mv-section mv-book">
        <div className="mv-book-done">
          <div className="mv-book-check"><Check size={38} strokeWidth={3} /></div>
          <span className="mv-badge hot" style={{ marginBottom: 12, display: 'inline-flex', gap: 4, alignItems: 'center' }}><Zap size={12} /> 즉시 확정</span>
          <h1 className="mv-h2" style={{ marginBottom: 10 }}>예약이 확정됐어요</h1>
          <p className="mv-lead" style={{ margin: '0 auto 6px' }}>
            <b>{property.name}</b> · {room?.name}<br />{checkIn} ~ {checkOut} ({nights}박) · 객실 {rooms} · 투숙객 {guests}명
          </p>
          <div className="mv-book-ref">예약 번호 · {ref}</div>
          <p style={{ marginBottom: 18 }}>결제 금액 <b style={{ color: 'var(--mv-forest)' }}>{wonKR(total)}</b> · 확정 바우처를 이메일로 보내드렸어요.</p>
          <p className="mv-modal-note" style={{ maxWidth: 520, margin: '0 auto 24px' }}>* 실판매·결제 미연동 프로토타입입니다. 실제 서비스에서는 오마이호텔 실시간 예약·결제(PG)로 확정됩니다.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/mvillage" className="mv-btn mv-btn-primary">브랜드관으로</Link>
            <button type="button" className="mv-btn mv-btn-outline" onClick={() => { setDone(false); setRoomKey(null); }}>다시 예약</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mv-container mv-section mv-book">
      <Link href="/mvillage#stays" className="mv-back-omt" style={{ marginBottom: 20 }}><ArrowLeft size={15} /> 시설 목록으로</Link>
      <span className="mv-eyebrow"><CalendarCheck size={14} /> Real-time Booking</span>
      <h1 className="mv-h2" style={{ margin: '10px 0 4px' }}>{property.name}</h1>
      <p className="mv-prop-city" style={{ marginBottom: 26 }}><MapPin size={13} /> {property.city}, Vietnam · {brand?.name} · <span style={{ color: 'var(--mv-orange)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 3 }}><Zap size={12} /> 즉시 확정</span></p>

      <div className="mv-book-grid">
        <div>
          {/* 검색 조건 */}
          <div className="mv-book-search">
            <div className="mv-field"><label className="mv-label">체크인</label>
              <input type="date" className="mv-input" value={checkIn} min={today || undefined}
                onChange={(e) => { const v = e.target.value; setCheckIn(v); if (nightsBetween(v, checkOut) < 1) setCheckOut(addDays(v, 2)); }} /></div>
            <div className="mv-field"><label className="mv-label">체크아웃</label>
              <input type="date" className="mv-input" value={checkOut} min={checkIn ? addDays(checkIn, 1) : undefined}
                onChange={(e) => setCheckOut(e.target.value)} /></div>
            <div className="mv-stepper"><span>객실</span>
              <div className="mv-stepper-ctrl">
                <button type="button" onClick={() => setRooms((r) => Math.max(1, r - 1))} aria-label="객실 감소"><Minus size={15} /></button><b>{rooms}</b>
                <button type="button" onClick={() => setRooms((r) => Math.min(9, r + 1))} aria-label="객실 증가"><Plus size={15} /></button>
              </div></div>
            <div className="mv-stepper"><span>투숙객</span>
              <div className="mv-stepper-ctrl">
                <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} aria-label="투숙객 감소"><Minus size={15} /></button><b>{guests}</b>
                <button type="button" onClick={() => setGuests((g) => Math.min(20, g + 1))} aria-label="투숙객 증가"><Plus size={15} /></button>
              </div></div>
          </div>

          {/* 실시간 객실 선택 */}
          <h3 className="mv-book-h3">객실 선택 <span className="mv-muted" style={{ fontWeight: 400, fontSize: 13 }}>· {nights}박 실시간 요금</span></h3>
          <div className="mv-room-list">
            {roomList.map((r) => (
              <button type="button" key={r.key} className={`mv-room-card${roomKey === r.key ? ' is-sel' : ''}`} onClick={() => setRoomKey(r.key)}>
                <div className="mv-room-media"><img src={mvImg(property.seed + r.key, r.key === 'suite' ? 'suite' : 'interior')} alt={r.name} loading="lazy" /></div>
                <div className="mv-room-body">
                  <div className="mv-room-top">
                    <b className="mv-room-name">{r.name}</b>
                    <span className={`mv-room-left${r.left <= 1 ? ' urgent' : ''}`}>잔여 {r.left}실</span>
                  </div>
                  <div className="mv-room-perks">
                    <span><Users size={13} /> 최대 {r.occ}인</span>
                    {r.breakfast && <span><Coffee size={13} /> 조식 포함</span>}
                    {r.perks.map((p) => <span key={p}>{p}</span>)}
                  </div>
                  <div className="mv-room-foot">
                    <div className="mv-room-price"><small>1박</small><b>{wonKR(r.rate)}</b></div>
                    <span className={`mv-room-pick${roomKey === r.key ? ' is-sel' : ''}`}>{roomKey === r.key ? <><Check size={15} /> 선택됨</> : '선택'}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* 예약자 정보 */}
          <h3 className="mv-book-h3">예약자 정보</h3>
          <div className="mv-field-row">
            <div className="mv-field"><label className="mv-label">이름 *</label><input className="mv-input" value={traveler.name} onChange={(e) => setTraveler((t) => ({ ...t, name: e.target.value }))} placeholder="예약자 이름" /></div>
            <div className="mv-field"><label className="mv-label">연락처</label><input className="mv-input" value={traveler.phone} onChange={(e) => setTraveler((t) => ({ ...t, phone: e.target.value }))} placeholder="010-0000-0000" /></div>
          </div>
          <div className="mv-field"><label className="mv-label">이메일 *</label><input type="email" className="mv-input" value={traveler.email} onChange={(e) => setTraveler((t) => ({ ...t, email: e.target.value }))} placeholder="name@email.com" /></div>

          {/* 결제 수단 */}
          <h3 className="mv-book-h3">결제 수단</h3>
          <div className="mv-chips">
            {PAYMENTS.map((p) => (
              <button type="button" key={p.key} className={`mv-chip${pay === p.key ? ' is-active' : ''}`} onClick={() => setPay(p.key)}><p.icon size={14} style={{ marginRight: 6, verticalAlign: '-2px' }} />{p.label}</button>
            ))}
          </div>
        </div>

        {/* 예약 요약 (sticky) */}
        <aside className="mv-book-form">
          <div className="mv-book-media" style={{ borderRadius: 'var(--mv-radius-sm)', overflow: 'hidden', marginBottom: 14 }}>
            <img src={mvImg(property.seed, property.imgKind)} alt={property.name} style={{ aspectRatio: '16/9', width: '100%', objectFit: 'cover' }} />
          </div>
          <b style={{ fontFamily: 'var(--mv-serif-ko)', fontSize: 18, color: 'var(--mv-forest)' }}>{property.name}</b>
          <div className="mv-muted" style={{ fontSize: 13, marginBottom: 12 }}>{brand?.name} · {property.city}</div>
          <div className="mv-book-rows">
            <div className="mv-book-row"><span>일정</span><b>{checkIn} ~ {checkOut}</b></div>
            <div className="mv-book-row"><span>객실 · 인원</span><b>{rooms}실 · {guests}명</b></div>
            <div className="mv-book-row"><span>객실 타입</span><b>{room ? room.name : '미선택'}</b></div>
            {room && <div className="mv-book-row"><span>{wonKR(room.rate)} × {Math.max(1, nights)}박 × {rooms}</span><b>{wonKR(subtotal)}</b></div>}
            {room && <div className="mv-book-row mv-muted"><span>세금·수수료(10%)</span><span>{wonKR(taxes)}</span></div>}
          </div>
          <div className="mv-book-total"><span>총 결제금액</span><b>{room ? wonKR(total) : '—'}</b></div>
          <button type="button" className="mv-btn mv-btn-accent mv-btn-block" disabled={!canBook} onClick={() => setDone(true)}>
            <Zap size={16} /> {room ? `${wonKR(total)} 즉시 예약` : '객실을 선택하세요'}
          </button>
          {!canBook && room && <p className="mv-book-safe" style={{ color: 'var(--mv-orange)' }}>이름·이메일을 입력해 주세요</p>}
          <p className="mv-book-safe"><BadgeCheck size={14} /> 즉시 확정 · <ShieldCheck size={14} /> 안전 결제</p>
          <p className="mv-modal-note">* 실판매·결제 미연동 프로토타입 — 실서비스는 실시간 예약·PG로 확정됩니다.</p>
        </aside>
      </div>
    </div>
  );
}
