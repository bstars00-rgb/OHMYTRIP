'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Globe, Heart, Menu, User, X, ChevronDown, Flag } from 'lucide-react';
import {
  CURRENCIES,
  LANGUAGES,
  usePrefs,
  useWishlist,
  type CurrencyCode,
  type LanguageCode,
} from '@/features/golf/GolfProviders';

const NAV = [
  { label: 'Golf Packages', href: '/golf/search' },
  { label: 'Destinations', href: '/golf#destinations' },
  { label: 'Courses', href: '/golf#packages' },
  { label: 'Deals', href: '/golf/search?deals=1' },
  { label: 'Custom Trip', href: '/golf/build' },
];

export default function GolfHeader() {
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDrop, setOpenDrop] = useState<'lang' | 'curr' | null>(null);
  const { currency, setCurrency, language, setLanguage } = usePrefs();
  const wishlist = useWishlist();
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setOpenDrop(null);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  return (
    <header className={`g-header${compact ? ' is-compact' : ''}`}>
      <div className="g-container g-header-inner">
        <Link href="/golf" className="g-logo" aria-label="OHMYGOLF home">
          <Flag size={22} strokeWidth={2.4} />
          <span>
            OHMY<b>GOLF</b>
          </span>
        </Link>

        <nav className="g-nav" aria-label="Primary">
          {NAV.map((n) => (
            <Link key={n.label} href={n.href}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="g-header-actions" ref={dropRef}>
          <div className="g-drop-wrap">
            <button
              type="button"
              className="g-icon-btn"
              onClick={() => setOpenDrop((d) => (d === 'lang' ? null : 'lang'))}
              aria-haspopup="listbox"
              aria-expanded={openDrop === 'lang'}
            >
              <Globe size={17} />
              <span className="g-hide-sm">{LANGUAGES.find((l) => l.code === language)?.label}</span>
              <ChevronDown size={14} />
            </button>
            {openDrop === 'lang' && (
              <ul className="g-drop" role="listbox">
                {LANGUAGES.map((l) => (
                  <li key={l.code}>
                    <button
                      type="button"
                      className={l.code === language ? 'is-active' : ''}
                      onClick={() => {
                        setLanguage(l.code as LanguageCode);
                        setOpenDrop(null);
                      }}
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="g-drop-wrap">
            <button
              type="button"
              className="g-icon-btn"
              onClick={() => setOpenDrop((d) => (d === 'curr' ? null : 'curr'))}
              aria-haspopup="listbox"
              aria-expanded={openDrop === 'curr'}
            >
              <span className="g-hide-sm">{currency}</span>
              <span className="g-show-sm">{CURRENCIES[currency].symbol}</span>
              <ChevronDown size={14} />
            </button>
            {openDrop === 'curr' && (
              <ul className="g-drop" role="listbox">
                {Object.values(CURRENCIES).map((c) => (
                  <li key={c.code}>
                    <button
                      type="button"
                      className={c.code === currency ? 'is-active' : ''}
                      onClick={() => {
                        setCurrency(c.code as CurrencyCode);
                        setOpenDrop(null);
                      }}
                    >
                      {c.symbol} {c.code}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link href="/golf/my-trips" className="g-icon-btn g-wish-btn" aria-label="Wishlist">
            <Heart size={18} />
            {wishlist.ids.length > 0 && <span className="g-wish-count">{wishlist.ids.length}</span>}
          </Link>

          <button type="button" className="g-btn g-btn-outline g-btn-sm g-hide-sm">
            <User size={16} /> Login
          </button>

          <button
            type="button"
            className="g-icon-btn g-show-md"
            aria-label="Menu"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="g-mobile-menu" role="dialog" aria-label="Menu">
          <div className="g-mobile-menu-head">
            <span className="g-logo">
              OHMY<b>GOLF</b>
            </span>
            <button type="button" className="g-icon-btn" onClick={() => setMenuOpen(false)} aria-label="Close">
              <X size={22} />
            </button>
          </div>
          <nav>
            {NAV.map((n) => (
              <Link key={n.label} href={n.href} onClick={() => setMenuOpen(false)}>
                {n.label}
              </Link>
            ))}
            <Link href="/golf/my-trips" onClick={() => setMenuOpen(false)}>
              My Trips
            </Link>
          </nav>
          <button type="button" className="g-btn g-btn-primary g-btn-block">
            <User size={16} /> Login
          </button>
        </div>
      )}
    </header>
  );
}
