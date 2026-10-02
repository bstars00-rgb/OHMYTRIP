'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Globe, ChevronDown } from 'lucide-react';
import { useMV, LANGS } from '@/features/mvillage/i18n';

export default function MVillageHeader() {
  const { lang, setLang, t } = useMV();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const NAV = [
    { href: '/mvillage#collections', label: t('nav.collections') },
    { href: '/mvillage#brands', label: t('nav.brands') },
    { href: '/mvillage#destinations', label: t('nav.destinations') },
    { href: '/mvillage/partner', label: t('nav.partner') },
  ];
  const current = LANGS.find((l) => l.code === lang)?.label ?? '한국어';

  return (
    <header className="mv-header">
      <div className="mv-container mv-header-inner">
        <Link href="/" className="mv-back-omt" aria-label={`${t('nav.back')} home`}>
          <ArrowLeft size={15} /> {t('nav.back')}
        </Link>
        <span className="mv-header-divider" aria-hidden="true" />
        <Link href="/mvillage" className="mv-logo" aria-label="M Village home">
          <span><b>M</b> VILLAGE</span>
        </Link>
        <nav className="mv-nav" aria-label="M Village">
          {NAV.map((n) => (<a key={n.href} href={n.href}>{n.label}</a>))}
        </nav>
        <div className="mv-lang" ref={ref}>
          <button type="button" className="mv-lang-btn" onClick={() => setOpen((o) => !o)} aria-haspopup="listbox" aria-expanded={open}>
            <Globe size={16} /> <span className="mv-lang-cur">{current}</span> <ChevronDown size={14} />
          </button>
          {open && (
            <ul className="mv-lang-menu" role="listbox">
              {LANGS.map((l) => (
                <li key={l.code}>
                  <button type="button" className={l.code === lang ? 'is-active' : ''} onClick={() => { setLang(l.code); setOpen(false); }}>
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </header>
  );
}
