'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Handshake, Check, Globe2, Layers, CalendarRange, MessageCircle, Phone } from 'lucide-react';
import { useMV } from '@/features/mvillage/i18n';

export default function MVillagePartner() {
  const { t } = useMV();
  const TYPES = [t('pt.type1'), t('pt.type2'), t('pt.type3'), t('pt.type4')];
  const WHY = [
    { icon: Globe2, title: t('pt.why1t'), desc: t('pt.why1d') },
    { icon: Layers, title: t('pt.why2t'), desc: t('pt.why2d') },
    { icon: CalendarRange, title: t('pt.why3t'), desc: t('pt.why3d') },
  ];
  const [type, setType] = useState(TYPES[0]);
  const [form, setForm] = useState({ company: '', name: '', phone: '', email: '', message: '' });
  const [done, setDone] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const valid = form.company.trim() && form.name.trim() && form.phone.trim();
  const ref = `MVP-${String(1000 + (form.company.length * 37 + form.name.length) % 9000)}`;

  return (
    <div className="mv-container mv-section mv-partner">
      <Link href="/mvillage" className="mv-back-omt" style={{ marginBottom: 20 }}><ArrowLeft size={15} /> {t('bk.toHall2')}</Link>
      <span className="mv-eyebrow"><Handshake size={14} /> Partnership Inquiry</span>
      <h1 className="mv-h2" style={{ margin: '10px 0 12px' }}>{t('pt.title')} <span className="accent">{t('pt.inquiry')}</span></h1>
      <p className="mv-lead">{t('pt.lead')}</p>

      <div className="mv-why3" style={{ margin: '36px 0 44px' }}>
        {WHY.map((w) => (
          <div key={w.title} className="mv-why3-card">
            <span className="mv-why3-ic"><w.icon size={22} /></span>
            <b>{w.title}</b>
            <p>{w.desc}</p>
          </div>
        ))}
      </div>

      {done ? (
        <div className="mv-book-done" style={{ background: 'var(--mv-cream)', border: '1px solid var(--mv-line)', borderRadius: 'var(--mv-radius-lg)', padding: '48px 24px' }}>
          <div className="mv-book-check"><Check size={38} strokeWidth={3} /></div>
          <h2 className="mv-h2" style={{ marginBottom: 10 }}>{t('pt.doneTitle')}</h2>
          <p className="mv-lead" style={{ margin: '0 auto 6px' }}><b>{form.company}</b> · {type}</p>
          <div className="mv-book-ref">{t('pt.ref')} · {ref}</div>
          <p className="mv-modal-note" style={{ maxWidth: 520, margin: '0 auto 24px' }}>{t('pt.doneNote')}</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/mvillage" className="mv-btn mv-btn-primary">{t('bk.toHall2')}</Link>
            <button type="button" className="mv-btn mv-btn-outline" onClick={() => setDone(false)}>{t('pt.newInquiry')}</button>
          </div>
        </div>
      ) : (
        <div className="mv-partner-grid">
          <form className="mv-form" onSubmit={(e) => { e.preventDefault(); if (valid) setDone(true); }}>
            <div className="mv-field">
              <label className="mv-label">{t('pt.type')}</label>
              <div className="mv-chips">
                {TYPES.map((tp) => (
                  <button key={tp} type="button" className={`mv-chip${type === tp ? ' is-active' : ''}`} onClick={() => setType(tp)}>{tp}</button>
                ))}
              </div>
            </div>
            <div className="mv-field-row">
              <div className="mv-field"><label className="mv-label">{t('pt.company')} *</label><input className="mv-input" value={form.company} onChange={set('company')} placeholder={t('pt.companyPh')} /></div>
              <div className="mv-field"><label className="mv-label">{t('pt.nameLabel')} *</label><input className="mv-input" value={form.name} onChange={set('name')} placeholder={t('pt.namePh')} /></div>
            </div>
            <div className="mv-field-row">
              <div className="mv-field"><label className="mv-label">{t('pt.phone')} *</label><input className="mv-input" value={form.phone} onChange={set('phone')} placeholder="010-0000-0000" /></div>
              <div className="mv-field"><label className="mv-label">{t('pt.email')}</label><input type="email" className="mv-input" value={form.email} onChange={set('email')} placeholder="name@company.com" /></div>
            </div>
            <div className="mv-field">
              <label className="mv-label">{t('pt.message')}</label>
              <textarea className="mv-input mv-textarea" rows={4} value={form.message} onChange={set('message')} placeholder={t('pt.msgPh')} />
            </div>
            <button type="submit" className="mv-btn mv-btn-primary mv-btn-block" disabled={!valid}>{t('pt.submit')}</button>
            <p className="mv-modal-note">{t('pt.note')}</p>
          </form>

          <aside className="mv-partner-aside">
            <h3>{t('pt.quick')}</h3>
            <p className="mv-muted" style={{ fontSize: 14, marginBottom: 18 }}>{t('pt.quickDesc')}</p>
            <button type="button" className="mv-btn mv-btn-primary mv-btn-block"><MessageCircle size={17} /> {t('pt.kakao')}</button>
            <a href="tel:16700000" className="mv-btn mv-btn-outline mv-btn-block" style={{ marginTop: 10 }}><Phone size={16} /> {t('pt.phoneBtn')}</a>
            <div className="mv-partner-note">
              <b>OhMyHotel × M Village</b>
              <p>{t('pt.trust')}</p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
