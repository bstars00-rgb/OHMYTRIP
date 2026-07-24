'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, CreditCard, Apple, Wallet, Landmark, ShieldCheck, ArrowLeft } from 'lucide-react';
import { getPackage } from '@/mocks/golf/data';
import { usePrefs } from '@/features/golf/GolfProviders';
import { golfScene } from '@/features/golf/scenery';
import { EmptyState } from '@/components/golf/common/ui';

const PAYMENTS = [
  { key: 'card', label: 'Credit / Debit Card', icon: CreditCard },
  { key: 'apple', label: 'Apple Pay', icon: Apple },
  { key: 'google', label: 'Google Pay', icon: Wallet },
  { key: 'bank', label: 'Bank Transfer', icon: Landmark },
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
        <EmptyState title="No package selected" subtitle="Choose a package to start your booking." action={<Link href="/golf/search" className="g-btn g-btn-primary" style={{ marginTop: 16 }}>Browse packages</Link>} />
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
        {['Review package', 'Traveler details', 'Payment'].map((label, i) => (
          <div key={label} className={`g-checkout-step${i + 1 === step ? ' is-active' : ''}${i + 1 < step ? ' is-done' : ''}`}>
            <span className="num">{i + 1 < step ? <Check size={13} /> : i + 1}</span> {label}
          </div>
        ))}
      </div>

      <div className="g-checkout-layout">
        <div>
          {step === 1 && (
            <div className="g-wizard-card">
              <h2 style={{ fontFamily: 'var(--g-serif)', fontSize: 24, marginBottom: 16 }}>Review your package</h2>
              <div className="g-course-card" style={{ marginBottom: 20 }}>
                <img src={golfScene(pkg.images[0], { ratio: 1.1 })} alt={pkg.hotel} />
                <div className="g-course-info">
                  <h4>{pkg.hotel}</h4>
                  <p className="g-muted" style={{ fontSize: 13 }}>{pkg.destination}, {pkg.country}</p>
                  <div className="g-course-stats"><span><b>{option.label}</b></span><span>{pkg.roomType}</span></div>
                  <div className="g-course-stats" style={{ margin: 0 }}>
                    <span>{golfers} golfers</span>{nonGolfers > 0 && <span>{nonGolfers} non-golfers</span>}
                  </div>
                </div>
              </div>
              <h4 style={{ marginBottom: 10 }}>Included</h4>
              <div className="g-incl-grid">
                {pkg.inclusions.slice(0, 6).map((i) => (<div key={i} className="g-incl-item inc"><Check size={15} /> {i}</div>))}
              </div>
              <div className="g-no-hidden" style={{ marginTop: 16 }}><ShieldCheck size={15} /> No hidden fees — the price you see is the price you pay.</div>
              <div className="g-wizard-foot">
                <Link href={`/golf/package/${pkg.id}`} className="g-btn g-btn-ghost"><ArrowLeft size={16} /> Back to package</Link>
                <button type="button" className="g-btn g-btn-primary" onClick={() => setStep(2)}>Continue</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="g-wizard-card">
              <h2 style={{ fontFamily: 'var(--g-serif)', fontSize: 24, marginBottom: 16 }}>Lead traveler</h2>
              <div className="g-form-grid">
                <div className="g-field g-field-full">
                  <label className="g-label">Full name *</label>
                  <input className="g-input" value={traveler.name} onChange={(e) => setTraveler((t) => ({ ...t, name: e.target.value }))} />
                </div>
                <div className="g-field">
                  <label className="g-label">Email *</label>
                  <input className="g-input" type="email" value={traveler.email} onChange={(e) => setTraveler((t) => ({ ...t, email: e.target.value }))} />
                </div>
                <div className="g-field">
                  <label className="g-label">Phone</label>
                  <input className="g-input" type="tel" value={traveler.phone} onChange={(e) => setTraveler((t) => ({ ...t, phone: e.target.value }))} />
                </div>
                <div className="g-field g-field-full">
                  <label className="g-label">Country of residence</label>
                  <input className="g-input" value={traveler.country} onChange={(e) => setTraveler((t) => ({ ...t, country: e.target.value }))} />
                </div>
              </div>
              <div className="g-wizard-foot">
                <button type="button" className="g-btn g-btn-ghost" onClick={() => setStep(1)}><ArrowLeft size={16} /> Back</button>
                <button type="button" className="g-btn g-btn-primary" disabled={!canPay} onClick={() => setStep(3)}>Continue to payment</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="g-wizard-card">
              <h2 style={{ fontFamily: 'var(--g-serif)', fontSize: 24, marginBottom: 16 }}>Payment</h2>
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
                  <div className="g-field g-field-full"><label className="g-label">Card number</label><input className="g-input" placeholder="4242 4242 4242 4242" /></div>
                  <div className="g-field"><label className="g-label">Expiry</label><input className="g-input" placeholder="MM / YY" /></div>
                  <div className="g-field"><label className="g-label">CVC</label><input className="g-input" placeholder="123" /></div>
                </div>
              )}
              <div className="g-no-hidden" style={{ marginTop: 16 }}><ShieldCheck size={15} /> Secure payment · No hidden fees at check-in.</div>
              <div className="g-wizard-foot">
                <button type="button" className="g-btn g-btn-ghost" onClick={() => setStep(2)}><ArrowLeft size={16} /> Back</button>
                <button type="button" className="g-btn g-btn-primary g-btn-lg" onClick={confirm}>Pay {fx(total)}</button>
              </div>
            </div>
          )}
        </div>

        <aside>
          <div className="g-booking-card">
            <img src={golfScene(pkg.images[0], { ratio: 1.7 })} alt={pkg.hotel} style={{ borderRadius: 10, marginBottom: 14 }} />
            <b style={{ fontFamily: 'var(--g-serif)', fontSize: 18 }}>{pkg.hotel}</b>
            <div className="g-muted" style={{ fontSize: 13, marginBottom: 12 }}>{pkg.destination}, {pkg.country}</div>
            <div className="g-booking-rows">
              <div className="g-booking-row"><span>Package</span><b>{option.label}</b></div>
              <div className="g-booking-row"><span>Room</span><b>{pkg.roomType}</b></div>
              <div className="g-booking-row"><span>Golfers · Non-golfers</span><b>{golfers} · {nonGolfers}</b></div>
              <div className="g-booking-row"><span>Per person</span><b>{fx(option.pricePerPersonUSD)}</b></div>
              <div className="g-booking-row"><span>Subtotal</span><b>{fx(subtotal)}</b></div>
              <div className="g-booking-row"><span>Taxes &amp; fees</span><b>{fx(taxes)}</b></div>
            </div>
            <div className="g-booking-total"><span>Total</span><b>{fx(total)}</b></div>
            <p className="g-muted" style={{ fontSize: 12, marginTop: 10 }}>{pkg.cancellationPolicy}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
