'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const NAV = [
  { href: '/mvillage#collections', label: '라이프스타일 컬렉션' },
  { href: '/mvillage#brands', label: '브랜드' },
  { href: '/mvillage#destinations', label: '목적지' },
  { href: '/mvillage/partner', label: '제휴 문의' },
];

export default function MVillageHeader() {
  return (
    <header className="mv-header">
      <div className="mv-container mv-header-inner">
        <Link href="/" className="mv-back-omt" aria-label="오마이트립 홈으로">
          <ArrowLeft size={15} /> 오마이트립
        </Link>
        <span className="mv-header-divider" aria-hidden="true" />
        <Link href="/mvillage" className="mv-logo" aria-label="M Village 브랜드관 홈">
          <span><b>M</b> VILLAGE</span>
        </Link>
        <nav className="mv-nav" aria-label="M Village">
          {NAV.map((n) => (
            <a key={n.href} href={n.href}>{n.label}</a>
          ))}
        </nav>
      </div>
    </header>
  );
}
