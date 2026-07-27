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

const STEPS = ['여행지', '날짜', '인원', '호텔 & 예산', '라운드 & 티타임', '추가 옵션', '연락처'];
const HOTEL_PREFS = ['4성급 편안함', '5성급 럭셔리', '비치프론트 리조트', '부티크 / 디자인'];
const BUDGETS = ['1인 $700 미만', '1인 $700 – $1,000', '1인 $1,000 – $1,500', '1인 $1,500 이상'];
const TEE_PREFS = ['이른 아침', '늦은 아침', '오후', '상관없음'];
const EXTRAS = ['공항 픽업', '전 식사 포함', '클럽 렌탈', '전담 캐디', '스파 패키지', '비골퍼 액티비티'];

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
        <p className="g-eyebrow">맞춤 골프 여행</p>
        <h1 className="g-section-title">내 골프 여행 만들기</h1>
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
              <h2>어디서 플레이할까요?</h2>
              <p>여행지를 선택하세요 — 전문가가 모든 코스를 꿰고 있습니다.</p>
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
              <h2>언제 여행하시나요?</h2>
              <p>대략적인 날짜도 괜찮아요 — 최적의 예약 가능일을 찾아드립니다.</p>
              <div className="g-form-grid">
                <div className="g-field g-field-full">
                  <label className="g-label">희망 날짜</label>
                  <input className="g-input" type="text" placeholder="예: 2026년 10월 중순, 4박" value={s.dates} onChange={(e) => set('dates', e.target.value)} />
                </div>
              </div>
              <label className="g-check" style={{ marginTop: 14 }}>
                <input type="checkbox" checked={s.flexible} onChange={(e) => set('flexible', e.target.checked)} />
                날짜 조율 가능 (±1주)
              </label>
            </>
          )}
          {step === 2 && (
            <>
              <h2>몇 분이 함께하나요?</h2>
              <p>골퍼와 비골퍼가 같은 여행을 함께할 수 있어요.</p>
              <div style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
                <Counter label="골퍼" value={s.golfers} min={1} onChange={(v) => set('golfers', v)} />
                <Counter label="비골퍼" value={s.nonGolfers} min={0} onChange={(v) => set('nonGolfers', v)} />
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <h2>호텔 선호 & 예산</h2>
              <p>골프 포함, 1인 기준입니다.</p>
              <label className="g-label">호텔 스타일</label>
              <div className="g-optiongrid" style={{ marginBottom: 22 }}>
                {HOTEL_PREFS.map((h) => (
                  <button key={h} type="button" className={`g-optionbtn${s.hotelPref === h ? ' is-active' : ''}`} onClick={() => set('hotelPref', h)}>{h}</button>
                ))}
              </div>
              <label className="g-label">예산</label>
              <div className="g-optiongrid">
                {BUDGETS.map((b) => (
                  <button key={b} type="button" className={`g-optionbtn${s.budget === b ? ' is-active' : ''}`} onClick={() => set('budget', b)}>{b}</button>
                ))}
              </div>
            </>
          )}
          {step === 4 && (
            <>
              <h2>라운드 & 티타임</h2>
              <p>라운드 수와 선호 티타임을 알려주세요.</p>
              <div style={{ maxWidth: 420, marginBottom: 22 }}>
                <Counter label="라운드 수" value={s.rounds} min={1} onChange={(v) => set('rounds', v)} />
              </div>
              <label className="g-label">선호 티타임</label>
              <div className="g-optiongrid">
                {TEE_PREFS.map((t) => (
                  <button key={t} type="button" className={`g-optionbtn${s.teePref === t ? ' is-active' : ''}`} onClick={() => set('teePref', t)}>{t}</button>
                ))}
              </div>
            </>
          )}
          {step === 5 && (
            <>
              <h2>추가 옵션이 있나요?</h2>
              <p>포함하고 싶은 항목을 모두 선택하세요.</p>
              <div className="g-optiongrid">
                {EXTRAS.map((e) => (
                  <button key={e} type="button" className={`g-optionbtn${s.extras.includes(e) ? ' is-active' : ''}`} onClick={() => toggleExtra(e)}>{e}</button>
                ))}
              </div>
              <div className="g-field g-field-full" style={{ marginTop: 20 }}>
                <label className="g-label">추가 요청 사항</label>
                <textarea className="g-input" style={{ height: 90, padding: 12 }} placeholder="예: 친구들과 생일 기념 여행, 링크스 코스 선호…" value={s.notes} onChange={(e) => set('notes', e.target.value)} />
              </div>
            </>
          )}
          {step === 6 && (
            <>
              <h2>맞춤 플랜을 어디로 보내드릴까요?</h2>
              <p>골프 여행 전문가가 24시간 이내에 답변드립니다.</p>
              <div className="g-form-grid">
                <div className="g-field g-field-full">
                  <label className="g-label">이름 *</label>
                  <input className="g-input" value={s.name} onChange={(e) => set('name', e.target.value)} />
                </div>
                <div className="g-field">
                  <label className="g-label">이메일 *</label>
                  <input className="g-input" type="email" value={s.email} onChange={(e) => set('email', e.target.value)} />
                </div>
                <div className="g-field">
                  <label className="g-label">연락처</label>
                  <input className="g-input" type="tel" value={s.phone} onChange={(e) => set('phone', e.target.value)} />
                </div>
              </div>
            </>
          )}

          <div className="g-wizard-foot">
            <button type="button" className="g-btn g-btn-ghost" disabled={step === 0} onClick={() => setStep((v) => v - 1)}>
              <ArrowLeft size={16} /> 이전
            </button>
            <button type="button" className="g-btn g-btn-primary" disabled={!canNext()} onClick={() => setStep((v) => v + 1)}>
              {step === STEPS.length - 1 ? '검토' : '계속'} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="g-wizard-card">
          <h2>골프 여행 검토</h2>
          <p>아래 내용을 바탕으로 맞춤 플랜을 준비합니다.</p>
          <div className="g-summary-card">
            <dl>
              <dt>여행지</dt><dd>{s.destination || '—'}</dd>
              <dt>날짜</dt><dd>{s.dates || '—'}{s.flexible ? ' (조율 가능)' : ''}</dd>
              <dt>인원</dt><dd>골퍼 {s.golfers}명, 비골퍼 {s.nonGolfers}명</dd>
              <dt>호텔</dt><dd>{s.hotelPref || '—'}</dd>
              <dt>예산</dt><dd>{s.budget || '—'}</dd>
              <dt>라운드</dt><dd>{s.rounds}라운드 · 티타임 {s.teePref || '상관없음'}</dd>
              <dt>추가 옵션</dt><dd>{s.extras.length ? s.extras.join(', ') : '—'}</dd>
              <dt>연락처</dt><dd>{s.name} · {s.email}{s.phone ? ` · ${s.phone}` : ''}</dd>
              {s.notes && (<><dt>메모</dt><dd>{s.notes}</dd></>)}
            </dl>
          </div>
          <div className="g-wizard-foot">
            <button type="button" className="g-btn g-btn-ghost" onClick={() => setStep(STEPS.length - 1)}>
              <ArrowLeft size={16} /> 수정
            </button>
            <button type="button" className="g-btn g-btn-gold g-btn-lg" onClick={() => setDone(true)}>
              맞춤 플랜 요청하기
            </button>
          </div>
        </div>
      )}

      <Modal open={done} onClose={() => setDone(false)} label="요청 완료">
        <div style={{ padding: 30, textAlign: 'center' }}>
          <div className="g-complete-check" style={{ width: 64, height: 64 }}><Check size={30} /></div>
          <h3 className="g-detail-h" style={{ fontSize: 24 }}>요청이 접수됐어요!</h3>
          <p className="g-muted">골프 여행 전문가가 <b>{s.email || '입력하신 이메일'}</b>로 24시간 이내에 맞춤 플랜을 보내드립니다.</p>
          <button type="button" className="g-btn g-btn-primary" style={{ marginTop: 18 }} onClick={() => setDone(false)}>완료</button>
        </div>
      </Modal>
    </div>
  );
}
