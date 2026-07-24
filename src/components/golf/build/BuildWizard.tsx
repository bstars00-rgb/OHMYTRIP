'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { DESTINATIONS } from '@/mocks/golf/data';
import { Modal } from '@/components/golf/common/ui';

interface BuildState {
  destination: string;
  dates: string;
  flexible: boolean;
  golfers: number;
  nonGolfers: number;
  hotelPref: string;
  budget: string;
  rounds: number;
  teePref: string;
  extras: string[];
  name: string;
  email: string;
  phone: string;
  notes: string;
}

const STEPS = ['Destination', 'Dates', 'Travelers', 'Hotel & budget', 'Rounds & tee times', 'Extras', 'Contact'];
const HOTEL_PREFS = ['4-star comfort', '5-star luxury', 'Beachfront resort', 'Boutique / design'];
const BUDGETS = ['Under $700 pp', '$700 – $1,000 pp', '$1,000 – $1,500 pp', '$1,500+ pp'];
const TEE_PREFS = ['Early morning', 'Late morning', 'Afternoon', 'Flexible'];
const EXTRAS = ['Airport transfer', 'All meals', 'Rental clubs', 'Private caddie', 'Spa package', 'Non-golfer activities'];

function Counter({ label, value, min, onChange }: { label: string; value: number; min: number; onChange: (v: number) => void }) {
  return (
    <div className="g-counter-row" style={{ border: '1px solid var(--g-line)', borderRadius: 12, padding: '10px 16px' }}>
      <div className="g-counter-label">{label}</div>
      <div className="g-counter-ctrl">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} aria-label={`fewer ${label}`}>−</button>
        <span>{value}</span>
        <button type="button" onClick={() => onChange(value + 1)} aria-label={`more ${label}`}>+</button>
      </div>
    </div>
  );
}

export default function BuildWizard() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [s, setS] = useState<BuildState>({
    destination: '', dates: '', flexible: false, golfers: 2, nonGolfers: 0,
    hotelPref: '', budget: '', rounds: 2, teePref: '', extras: [], name: '', email: '', phone: '', notes: '',
  });

  const set = <K extends keyof BuildState>(k: K, v: BuildState[K]) => setS((prev) => ({ ...prev, [k]: v }));
  const toggleExtra = (e: string) => set('extras', s.extras.includes(e) ? s.extras.filter((x) => x !== e) : [...s.extras, e]);

  const canNext = () => {
    if (step === 0) return !!s.destination;
    if (step === 6) return s.name.trim() && s.email.trim();
    return true;
  };
  const isSummary = step === STEPS.length; // last screen = summary

  return (
    <div className="g-container g-section g-wizard">
      <div className="g-section-head" style={{ marginBottom: 22, flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
        <p className="g-eyebrow">Bespoke golf trip</p>
        <h1 className="g-section-title">Build my golf trip</h1>
      </div>

      <div className="g-wizard-steps">
        {STEPS.map((label, i) => (
          <div key={label} className={`g-wizard-step${i === step ? ' is-active' : ''}${i < step ? ' is-done' : ''}`}>
            <span className="num">{i < step ? <Check size={13} /> : i + 1}</span>
            {label}
          </div>
        ))}
      </div>

      {!isSummary ? (
        <div className="g-wizard-card">
          {step === 0 && (
            <>
              <h2>Where do you want to play?</h2>
              <p>Pick a destination — our specialists know every course.</p>
              <div className="g-optiongrid">
                {DESTINATIONS.map((d) => (
                  <button key={d.slug} type="button" className={`g-optionbtn${s.destination === d.city ? ' is-active' : ''}`} onClick={() => set('destination', d.city)}>
                    <b>{d.city}</b>
                    <span className="g-muted" style={{ fontSize: 13 }}>{d.country}</span>
                  </button>
                ))}
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <h2>When would you like to travel?</h2>
              <p>Approximate dates are fine — we&apos;ll find the best availability.</p>
              <div className="g-form-grid">
                <div className="g-field g-field-full">
                  <label className="g-label">Preferred dates</label>
                  <input className="g-input" type="text" placeholder="e.g. Mid-October 2026, 4 nights" value={s.dates} onChange={(e) => set('dates', e.target.value)} />
                </div>
              </div>
              <label className="g-check" style={{ marginTop: 14 }}>
                <input type="checkbox" checked={s.flexible} onChange={(e) => set('flexible', e.target.checked)} />
                My dates are flexible (±1 week)
              </label>
            </>
          )}
          {step === 2 && (
            <>
              <h2>Who&apos;s coming?</h2>
              <p>Golfers and non-golfers can share the same trip.</p>
              <div style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
                <Counter label="Golfers" value={s.golfers} min={1} onChange={(v) => set('golfers', v)} />
                <Counter label="Non-golfers" value={s.nonGolfers} min={0} onChange={(v) => set('nonGolfers', v)} />
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <h2>Hotel preference &amp; budget</h2>
              <p>Per person, including golf.</p>
              <label className="g-label">Hotel style</label>
              <div className="g-optiongrid" style={{ marginBottom: 22 }}>
                {HOTEL_PREFS.map((h) => (
                  <button key={h} type="button" className={`g-optionbtn${s.hotelPref === h ? ' is-active' : ''}`} onClick={() => set('hotelPref', h)}>{h}</button>
                ))}
              </div>
              <label className="g-label">Budget</label>
              <div className="g-optiongrid">
                {BUDGETS.map((b) => (
                  <button key={b} type="button" className={`g-optionbtn${s.budget === b ? ' is-active' : ''}`} onClick={() => set('budget', b)}>{b}</button>
                ))}
              </div>
            </>
          )}
          {step === 4 && (
            <>
              <h2>Rounds &amp; tee times</h2>
              <p>How much golf, and when do you like to play?</p>
              <div style={{ maxWidth: 420, marginBottom: 22 }}>
                <Counter label="Rounds of golf" value={s.rounds} min={1} onChange={(v) => set('rounds', v)} />
              </div>
              <label className="g-label">Preferred tee time</label>
              <div className="g-optiongrid">
                {TEE_PREFS.map((t) => (
                  <button key={t} type="button" className={`g-optionbtn${s.teePref === t ? ' is-active' : ''}`} onClick={() => set('teePref', t)}>{t}</button>
                ))}
              </div>
            </>
          )}
          {step === 5 && (
            <>
              <h2>Any extras?</h2>
              <p>Select everything you&apos;d like included.</p>
              <div className="g-optiongrid">
                {EXTRAS.map((e) => (
                  <button key={e} type="button" className={`g-optionbtn${s.extras.includes(e) ? ' is-active' : ''}`} onClick={() => toggleExtra(e)}>{e}</button>
                ))}
              </div>
              <div className="g-field g-field-full" style={{ marginTop: 20 }}>
                <label className="g-label">Additional requests</label>
                <textarea className="g-input" style={{ height: 90, padding: 12 }} placeholder="Group of friends celebrating a birthday, prefer links courses…" value={s.notes} onChange={(e) => set('notes', e.target.value)} />
              </div>
            </>
          )}
          {step === 6 && (
            <>
              <h2>Where should we send your plan?</h2>
              <p>A golf travel specialist will reply within 24 hours.</p>
              <div className="g-form-grid">
                <div className="g-field g-field-full">
                  <label className="g-label">Full name *</label>
                  <input className="g-input" value={s.name} onChange={(e) => set('name', e.target.value)} />
                </div>
                <div className="g-field">
                  <label className="g-label">Email *</label>
                  <input className="g-input" type="email" value={s.email} onChange={(e) => set('email', e.target.value)} />
                </div>
                <div className="g-field">
                  <label className="g-label">Phone</label>
                  <input className="g-input" type="tel" value={s.phone} onChange={(e) => set('phone', e.target.value)} />
                </div>
              </div>
            </>
          )}

          <div className="g-wizard-foot">
            <button type="button" className="g-btn g-btn-ghost" disabled={step === 0} onClick={() => setStep((v) => v - 1)}>
              <ArrowLeft size={16} /> Back
            </button>
            <button type="button" className="g-btn g-btn-primary" disabled={!canNext()} onClick={() => setStep((v) => v + 1)}>
              {step === STEPS.length - 1 ? 'Review' : 'Continue'} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="g-wizard-card">
          <h2>Review your golf trip</h2>
          <p>Here&apos;s what we&apos;ll build a custom plan around.</p>
          <div className="g-summary-card">
            <dl>
              <dt>Destination</dt><dd>{s.destination || '—'}</dd>
              <dt>Dates</dt><dd>{s.dates || '—'}{s.flexible ? ' (flexible)' : ''}</dd>
              <dt>Travelers</dt><dd>{s.golfers} golfers, {s.nonGolfers} non-golfers</dd>
              <dt>Hotel</dt><dd>{s.hotelPref || '—'}</dd>
              <dt>Budget</dt><dd>{s.budget || '—'}</dd>
              <dt>Rounds</dt><dd>{s.rounds} rounds · {s.teePref || 'flexible'} tee times</dd>
              <dt>Extras</dt><dd>{s.extras.length ? s.extras.join(', ') : '—'}</dd>
              <dt>Contact</dt><dd>{s.name} · {s.email}{s.phone ? ` · ${s.phone}` : ''}</dd>
              {s.notes && (<><dt>Notes</dt><dd>{s.notes}</dd></>)}
            </dl>
          </div>
          <div className="g-wizard-foot">
            <button type="button" className="g-btn g-btn-ghost" onClick={() => setStep(STEPS.length - 1)}>
              <ArrowLeft size={16} /> Edit
            </button>
            <button type="button" className="g-btn g-btn-gold g-btn-lg" onClick={() => setDone(true)}>
              Request My Golf Plan
            </button>
          </div>
        </div>
      )}

      <Modal open={done} onClose={() => setDone(false)} label="Request received">
        <div style={{ padding: 30, textAlign: 'center' }}>
          <div className="g-complete-check" style={{ width: 64, height: 64 }}><Check size={30} /></div>
          <h3 className="g-detail-h" style={{ fontSize: 24 }}>Request received!</h3>
          <p className="g-muted">A golf travel specialist will email <b>{s.email || 'you'}</b> a tailored plan within 24 hours.</p>
          <button type="button" className="g-btn g-btn-primary" style={{ marginTop: 18 }} onClick={() => setDone(false)}>Done</button>
        </div>
      </Modal>
    </div>
  );
}
