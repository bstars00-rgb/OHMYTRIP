'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Phone, FileText, X, Headset } from 'lucide-react';

/** 카카오톡·전화·견적 상담 플로팅 위젯 (한국 골프여행사 벤치마크 · mock) */
export default function GolfConsultFab() {
  const [open, setOpen] = useState(false);

  return (
    <div className={`g-fab${open ? ' is-open' : ''}`}>
      {open && (
        <div className="g-fab-menu" role="menu">
          <button type="button" className="g-fab-item g-fab-kakao" onClick={() => setOpen(false)}>
            <MessageCircle size={17} /> 카카오톡 상담
          </button>
          <a href="tel:16700000" className="g-fab-item">
            <Phone size={16} /> 전화 상담 <b>1670-0000</b>
          </a>
          <Link href="/golf/build" className="g-fab-item" onClick={() => setOpen(false)}>
            <FileText size={16} /> 맞춤 견적 요청
          </Link>
        </div>
      )}
      <button type="button" className="g-fab-btn" onClick={() => setOpen((o) => !o)} aria-label="상담 열기" aria-expanded={open}>
        {open ? <X size={22} /> : <Headset size={22} />}
        {!open && <span className="g-fab-label">상담</span>}
      </button>
    </div>
  );
}
