'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, CreditCard, Apple, Wallet, Landmark, ShieldCheck, ArrowLeft } from 'lucide-react';
import { getPackage } from '@/mocks/golf/data';
import { usePrefs } from '@/features/golf/GolfProviders';
import { golfImg } from '@/features/golf/images';
import { EmptyState } from '@/components/golf/common/ui';

const PAYMENTS = [
  { key: 'card', label: '신용/체크카드', icon: CreditCard },
  { key: 'apple', label: 'Apple Pay', icon: Apple },
  { key: 'google', label: 'Google Pay', icon: Wallet },
  { key: 'bank', label: '계좌 이체', icon: Landmark },
];

export default function GolfCheckout() {
  const router = useRouter();
  const params = useSearchParams();
  const { fx } = usePrefs();
  const pkg = getPackage(params.get('pkg') ?? '');
  const optionId = params.get('option');
  const golfers = Number(params.get('golfers') ?? 2);
  const nonGolfers = Number(params.get('nonGolfers') ?? 0);
  const [step, setStep] = useState(1);
  const [pay, setPay] = useState('card');
  const [traveler, setTraveler] = useState({ name: '', email: '', phone: '', country: '' });

  const option = useMemo(() => pkg?.options.find((o) => o.id === optionId) ?? pkg?.options[0], [pkg, optionId]);

  if (!pkg || !option) {
    return (
      <div className="g-container g-section">
        <EmptyState title="선택된 패키지가 없어요" subtitle="예약을 시작할 패키지를 선택하세요." action={<Link href="/golf/search" className="g-btn g-btn-primary" style={{ marginTop: 16 }}>Browse packages</Link>} />
      </div>
    );
  }

  const subtotal = option.pricePerPersonUSD * (golfers + nonGolfers * 0.6);
  const taxes = Math.round(subtotal * 0.1);
  const total = subtotal + taxes;
  const canPay = traveler.name.trim() && traveler.email.trim();

  const confirm = () => {
    const p = new URLSearchParams({ pkg: pkg.id, total: String(Math.round(total)) });
    router.push(`/golf/booking-complete?${p.toString()}`);
  };

  return (
    <div className="g-container g-section">
      <div className="g-checkout-steps">
        {['패키지 확인', '예약자 정보', '결제'].map((label, i) => (
          <div key={label} className={`g-checkout-step${i + 1 === step ? ' is-active' : ''}${i + 1 < step ? ' is-done' : ''}`}>
            <span className="num">{i + 1 < step ? <Check size={13} /> : i + 1}</span> {label}
          </div>
        ))}
      </div>

      <div className="g-checkout-layout">
        <div>
          {step === 1 && (
            <div className="g-wizard-card">
              <h2 style={{ fontFamily: 'var(--g-serif)', fontSize: 24, marginBottom: 16 }}>패키지 확인</h2>
              <div className="g-course-card" style={{ marginBottom: 20 }}>
                <img src={golfImg(pkg.id, 'resort')} alt={pkg.hotel} />
                <div className="g-course-info">
                  <h4>{pkg.hotel}</h4>
                  <p className="g-muted" style={{ fontSize: 13 }}>{pkg.destination}, {pkg.country}</p>
                  <div className="g-course-stats"><span><b>{option.label}</b></span><span>{pkg.roomType}</span></div>
                  <div className="g-course-stats" style={{ margin: 0 }}>
                    <span>{golfers}명 골퍼</span>{nonGolfers > 0 && <span>{nonGolfers}명 비골퍼</span>}
                  </div>
                </div>
              </div>
              <h4 style={{ marginBottom: 10 }}>포함 사항</h4>
              <div className="g-incl-grid">
                {pkg.inclusions.slice(0, 6).map((i) => (<div key={i} className="g-incl-item inc"><Check size={15} /> {i}</div>))}
              </div>
              <div className="g-no-hidden" style={{ marginTop: 16 }}><ShieldCheck size={15} /> 숨은 비용 없음 — 보이는 가격 그대로 결제됩니다.</div>
              <div className="g-wizard-foot">
                <Link href={`/golf/package/${pkg.id}`} className="g-btn g-btn-ghost"><ArrowLeft size={16} /> 패키지로 돌아가기</Link>
                <button type="button" className="g-btn g-btn-primary" onClick={() => setStep(2)}>계속</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="g-wizard-card">
              <h2 style={{ fontFamily: 'var(--g-serif)', fontSize: 24, marginBottom: 16 }}>대표 예약자</h2>
              <div className="g-form-grid">
                <div className="g-field g-field-full">
                  <label className="g-label">이름 *</label>
                  <input className="g-input" value={traveler.name} onChange={(e) => setTraveler((t) => ({ ...t, name: e.target.value }))} />
                </div>
                <div className="g-field">
                  <label className="g-label">이메일 *</label>
                  <input className="g-input" type="email" value={traveler.email} onChange={(e) => setTraveler((t) => ({ ...t, email: e.target.value }))} />
                </div>
                <div className="g-field">
                  <label className="g-label">연락처</label>
                  <input className="g-input" type="tel" value={traveler.phone} onChange={(e) => setTraveler((t) => ({ ...t, phone: e.target.value }))} />
                </div>
                <div className="g-field g-field-full">
                  <label className="g-label">거주 국가</label>
                  <input className="g-input" value={traveler.country} onChange={(e) => setTraveler((t) => ({ ...t, country: e.target.value }))} />
                </div>
              </div>
              <div className="g-wizard-foot">
                <button type="button" className="g-btn g-btn-ghost" onClick={() => setStep(1)}><ArrowLeft size={16} /> 이전</button>
                <button type="button" className="g-btn g-btn-primary" disabled={!canPay} onClick={() => setStep(3)}>결제로 이동</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="g-wizard-card">
              <h2 style={{ fontFamily: 'var(--g-serif)', fontSize: 24, marginBottom: 16 }}>결제</h2>
              <div className="g-pay-methods">
                {PAYMENTS.map((m) => (
                  <label key={m.key} className={`g-pay-method${pay === m.key ? ' is-active' : ''}`}>
                    <input type="radio" name="pay" checked={pay === m.key} onChange={() => setPay(m.key)} />
                    <m.icon size={20} /> <b>{m.label}</b>
                  </label>
                ))}
              </div>
              {pay === 'card' && (
                <div className="g-form-grid" style={{ marginTop: 18 }}>
                  <div className="g-field g-field-full"><label className="g-label">카드 번호</label><input className="g-input" placeholder="4242 4242 4242 4242" /></div>
                  <div className="g-field"><label className="g-label">유효기간</label><input className="g-input" placeholder="MM / YY" /></div>
                  <div className="g-field"><label className="g-label">CVC</label><input className="g-input" placeholder="123" /></div>
                </div>
              )}
              <div className="g-no-hidden" style={{ marginTop: 16 }}><ShieldCheck size={15} /> 안전 결제 · 체크인 시 추가 비용 없음.</div>
              <div className="g-wizard-foot">
                <button type="button" className="g-btn g-btn-ghost" onClick={() => setStep(2)}><ArrowLeft size={16} /> 이전</button>
                <button type="button" className="g-btn g-btn-primary g-btn-lg" onClick={confirm}>{fx(total)} 결제</button>
              </div>
            </div>
          )}
        </div>

        <aside>
          <div className="g-booking-card">
            <img src={golfImg(pkg.id, 'resort')} alt={pkg.hotel} style={{ borderRadius: 10, marginBottom: 14 }} />
            <b style={{ fontFamily: 'var(--g-serif)', fontSize: 18 }}>{pkg.hotel}</b>
            <div className="g-muted" style={{ fontSize: 13, marginBottom: 12 }}>{pkg.destination}, {pkg.country}</div>
            <div className="g-booking-rows">
              <div className="g-booking-row"><span>패키지</span><b>{option.label}</b></div>
              <div className="g-booking-row"><span>객실</span><b>{pkg.roomType}</b></div>
              <div className="g-booking-row"><span>골퍼 · 비골퍼</span><b>{golfers} · {nonGolfers}</b></div>
              <div className="g-booking-row"><span>1인당</span><b>{fx(option.pricePerPersonUSD)}</b></div>
              <div className="g-booking-row"><span>소계</span><b>{fx(subtotal)}</b></div>
              <div className="g-booking-row"><span>세금·수수료</span><b>{fx(taxes)}</b></div>
            </div>
            <div className="g-booking-total"><span>총액</span><b>{fx(total)}</b></div>
            <p className="g-muted" style={{ fontSize: 12, marginTop: 10 }}>{pkg.cancellationPolicy}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
