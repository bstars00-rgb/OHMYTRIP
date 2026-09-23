'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Handshake, Check, Globe2, Layers, CalendarRange, MessageCircle, Phone } from 'lucide-react';

const TYPES = ['여행사 · 도매', '기업 · 법인 · MICE', '단체 · 모임', '기타'];

const WHY = [
  { icon: Globe2, title: '한국 공식 브랜드 채널', desc: '오마이호텔이 M Village를 한국어로 소개하고 판매사 네트워크에 연결합니다.' },
  { icon: Layers, title: '그룹 단위 요율 · 60개 포트폴리오', desc: '흩어진 시설이 아니라 브랜드 포트폴리오로. 하나의 요율과 하나의 창구.' },
  { icon: CalendarRange, title: '시즌 공동 기획전 · MICE', desc: '설·여름휴가·추석 등 한국 시즌에 맞춘 캠페인과 법인·단체 수요 개발.' },
];

export default function MVillagePartner() {
  const [type, setType] = useState(TYPES[0]);
  const [form, setForm] = useState({ company: '', name: '', phone: '', email: '', message: '' });
  const [done, setDone] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const valid = form.company.trim() && form.name.trim() && form.phone.trim();
  const ref = `MVP-${String(1000 + (form.company.length * 37 + form.name.length) % 9000)}`;

  return (
    <div className="mv-container mv-section mv-partner">
      <Link href="/mvillage" className="mv-back-omt" style={{ marginBottom: 20 }}><ArrowLeft size={15} /> 브랜드관으로</Link>
      <span className="mv-eyebrow"><Handshake size={14} /> Partnership Inquiry</span>
      <h1 className="mv-h2" style={{ margin: '10px 0 12px' }}>여행사 · 기업 · 단체 <span className="accent">제휴 문의</span></h1>
      <p className="mv-lead">
        개별 예약이 아닌 <b>B2B 제휴</b> 전용 창구입니다. 공동 기획전, 그룹 단위 요율, 법인·MICE·단체 수요를
        오마이호텔이 한국어로 안내해 드립니다. (개별 예약은 각 시설의 ‘예약하기’를 이용하세요.)
      </p>

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
          <h2 className="mv-h2" style={{ marginBottom: 10 }}>문의가 접수됐어요</h2>
          <p className="mv-lead" style={{ margin: '0 auto 6px' }}><b>{form.company}</b> · {type}</p>
          <div className="mv-book-ref">접수 번호 · {ref}</div>
          <p className="mv-modal-note" style={{ maxWidth: 520, margin: '0 auto 24px' }}>* 프로토타입 — 실제 서비스에서는 담당자가 영업일 기준 1~2일 내 회신합니다.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/mvillage" className="mv-btn mv-btn-primary">브랜드관으로</Link>
            <button type="button" className="mv-btn mv-btn-outline" onClick={() => setDone(false)}>새 문의 작성</button>
          </div>
        </div>
      ) : (
        <div className="mv-partner-grid">
          <form className="mv-form" onSubmit={(e) => { e.preventDefault(); if (valid) setDone(true); }}>
            <div className="mv-field">
              <label className="mv-label">문의 유형</label>
              <div className="mv-chips">
                {TYPES.map((t) => (
                  <button key={t} type="button" className={`mv-chip${type === t ? ' is-active' : ''}`} onClick={() => setType(t)}>{t}</button>
                ))}
              </div>
            </div>
            <div className="mv-field-row">
              <div className="mv-field"><label className="mv-label">회사 · 기관명 *</label><input className="mv-input" value={form.company} onChange={set('company')} placeholder="예) 오마이투어" /></div>
              <div className="mv-field"><label className="mv-label">담당자명 *</label><input className="mv-input" value={form.name} onChange={set('name')} placeholder="이름" /></div>
            </div>
            <div className="mv-field-row">
              <div className="mv-field"><label className="mv-label">연락처 *</label><input className="mv-input" value={form.phone} onChange={set('phone')} placeholder="010-0000-0000" /></div>
              <div className="mv-field"><label className="mv-label">이메일</label><input type="email" className="mv-input" value={form.email} onChange={set('email')} placeholder="name@company.com" /></div>
            </div>
            <div className="mv-field">
              <label className="mv-label">문의 내용</label>
              <textarea className="mv-input mv-textarea" rows={4} value={form.message} onChange={set('message')} placeholder="희망 목적지·시기·인원·제휴 형태 등을 적어주세요." />
            </div>
            <button type="submit" className="mv-btn mv-btn-primary mv-btn-block" disabled={!valid}>제휴 문의 보내기</button>
            <p className="mv-modal-note">* 프로토타입 — 실제 데이터는 전송되지 않습니다.</p>
          </form>

          <aside className="mv-partner-aside">
            <h3>바로 상담</h3>
            <p className="mv-muted" style={{ fontSize: 14, marginBottom: 18 }}>급한 제휴·단체 건은 아래로 문의해 주세요.</p>
            <button type="button" className="mv-btn mv-btn-primary mv-btn-block"><MessageCircle size={17} /> 카카오톡 상담</button>
            <a href="tel:16700000" className="mv-btn mv-btn-outline mv-btn-block" style={{ marginTop: 10 }}><Phone size={16} /> 전화 상담 1670-0000</a>
            <div className="mv-partner-note">
              <b>OhMyHotel × M Village</b>
              <p>한국 공식 브랜드 접점 · 관광사업자 등록 · IATA 인증 여행사</p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
