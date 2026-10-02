'use client';

/* eslint-disable @next/next/no-img-element -- 프로토타입 스톡 이미지(자사 실사진 교체 예정) */

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sunrise, Building2, BedDouble, Laptop, MapPin, Check, X,
  ArrowRight, Leaf, Handshake, CalendarCheck,
} from 'lucide-react';
import {
  COLLECTIONS, BRANDS, DESTINATIONS, PROPERTIES, STATS, VALUES,
  brandByKey, collectionByKey, wonKR, type Property,
} from '@/mocks/mvillage/data';
import { mvImg } from '@/features/mvillage/images';
import { useMV } from '@/features/mvillage/i18n';

const CICON = { sunrise: Sunrise, city: Building2, bed: BedDouble, laptop: Laptop } as const;

function badgeClass(b: string): string {
  if (/신규|오픈예정|직항/.test(b)) return 'mv-badge soon';
  if (/한국 인기|베스트셀러/.test(b)) return 'mv-badge hot';
  return 'mv-badge';
}

export default function MVillageHall() {
  const { t, tc, tcArr, tcity, tbadge } = useMV();
  const [filter, setFilter] = useState<string>('all');
  const [modal, setModal] = useState<Property | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const visible = useMemo(
    () => (filter === 'all' ? PROPERTIES : PROPERTIES.filter((p) => p.collectionKeys.includes(filter))),
    [filter],
  );

  // 스크롤 리빌 + 지표 카운트업 (scroll+rect 방식 — IntersectionObserver/rAF 미동작 환경에서도 안전)
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const runCount = (el: HTMLElement) => {
      const target = Number(el.dataset.target || '0');
      const comma = el.dataset.comma === '1';
      const fmt = (v: number) => (comma ? Math.round(v).toLocaleString('en-US') : String(Math.round(v)));
      if (reduce) { el.textContent = fmt(target); return; }
      const steps = 45; let i = 0;
      const id = setInterval(() => {
        i += 1; const p = i / steps; const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(target * eased);
        if (i >= steps) { el.textContent = fmt(target); clearInterval(id); }
      }, 24);
    };
    const reveal = () => {
      const vh = window.innerHeight;
      root.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in), .mv-stat:not(.is-in)').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > 0) {
          el.classList.add('is-in');
          el.querySelectorAll<HTMLElement>('.mv-count').forEach((c) => runCount(c));
        }
      });
    };
    reveal();
    window.addEventListener('scroll', reveal, { passive: true });
    window.addEventListener('resize', reveal);
    return () => { window.removeEventListener('scroll', reveal); window.removeEventListener('resize', reveal); };
  }, []);

  const pickCollection = (key: string) => {
    setFilter(key);
    document.getElementById('stays')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const heroLines = t('hero.title').split('|');

  return (
    <div ref={rootRef}>
      {/* ============ HERO ============ */}
      <section className="mv-hero">
        <div className="mv-hero-bg">
          <img src={mvImg('mvillage-hero', 'hero')} alt="M Village Vietnam lifestyle stay" />
        </div>
        <div className="mv-hero-overlay" />
        <div className="mv-container mv-hero-inner">
          <div className="mv-hero-logo mv-anim mv-anim-1"><b>M</b> VILLAGE</div>
          <span className="mv-eyebrow mv-anim mv-anim-2"><Leaf size={14} /> A MORE MEANINGFUL STAY</span>
          <h1 className="mv-anim mv-anim-3">
            {heroLines.map((ln, i) => (
              <span key={i}>{i === 1 ? <span className="accent">{ln}</span> : ln}{i < heroLines.length - 1 && <br />}</span>
            ))}
          </h1>
          <p className="mv-hero-sub mv-anim mv-anim-4">
            {t('hero.sub')} {t('hero.sub2')} <b style={{ color: 'var(--mv-orange-2)' }}>{t('hero.subAccent')}</b>{t('hero.sub3')}
          </p>
          <div className="mv-hero-cta mv-anim mv-anim-5">
            <button type="button" className="mv-btn mv-btn-light" onClick={() => pickCollection('all')}>
              {t('hero.cta1')} <ArrowRight size={17} />
            </button>
            <a href="#brands" className="mv-btn mv-btn-ghost-light">{t('hero.cta2')}</a>
          </div>
          <div className="mv-hero-tags mv-anim mv-anim-6">
            <span>Local Living</span><span>Global Connections</span><span>Stay · Work · Explore · Belong</span>
          </div>
        </div>
        <div className="mv-hero-badge">Vietnam Lives Here</div>
      </section>

      {/* ============ STATS ============ */}
      <section className="mv-stats">
        <div className="mv-container">
          <div className="mv-stats-grid">
            {STATS.map((s, i) => {
              const num = Number(s.value.replace(/,/g, ''));
              return (
                <div key={i} className="mv-stat">
                  <b>
                    <span className="mv-count" data-target={num} data-comma={s.value.includes(',') ? '1' : '0'}>0</span>
                    <span className="unit">{tc('stat', `s${i}`, 'unit', s.unit)}</span>
                  </b>
                  <span className="mv-stat-bar" />
                  <p>{tc('stat', `s${i}`, 'label', s.label)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ COLLECTIONS ============ */}
      <section id="collections" className="mv-section mv-collections">
        <div className="mv-container">
          <div className="mv-sec-head" data-reveal>
            <span className="mv-eyebrow"><Leaf size={14} /> Vietnam Lifestyle Collection</span>
            <h2 className="mv-h2" style={{ marginTop: 12 }}>{t('col.title')} <span className="accent">{t('col.titleAccent')}</span></h2>
            <p className="mv-lead">{t('col.lead')}</p>
          </div>
          <div className="mv-collection-grid">
            {COLLECTIONS.map((c, i) => {
              const Icon = CICON[c.icon];
              return (
                <button key={c.key} type="button" className="mv-collection-card" data-tone={c.tone} data-reveal data-delay={i + 1} onClick={() => pickCollection(c.key)}>
                  <img src={mvImg(c.key, c.icon === 'sunrise' ? 'resort' : c.icon === 'city' ? 'city' : c.icon === 'bed' ? 'interior' : 'suite')} alt={c.name} />
                  <span className="mv-cc-ic"><Icon size={22} color="#fff" /></span>
                  <div className="mv-cc-body">
                    <div className="mv-cc-name">{c.name}</div>
                    <div className="mv-cc-nameko">{tc('collection', c.key, 'nameKo', c.nameKo)}</div>
                    <div className="mv-cc-purpose">{tc('collection', c.key, 'purpose', c.purpose)}</div>
                    <span className="mv-cc-msg">{tc('collection', c.key, 'message', c.message)}</span>
                    <div className="mv-cc-brands">
                      {c.brandKeys.map((bk) => <span key={bk}>{brandByKey(bk)?.name}</span>)}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ STAYS ============ */}
      <section id="stays" className="mv-section mv-props">
        <div className="mv-container">
          <div className="mv-sec-head" data-reveal>
            <span className="mv-eyebrow"><Leaf size={14} /> Featured Stays</span>
            <h2 className="mv-h2" style={{ marginTop: 12 }}>{t('stays.title')}</h2>
          </div>
          <div className="mv-filter-row">
            <button type="button" className={`mv-filter${filter === 'all' ? ' is-active' : ''}`} onClick={() => setFilter('all')}>{t('filter.all')}</button>
            {COLLECTIONS.map((c) => (
              <button key={c.key} type="button" className={`mv-filter${filter === c.key ? ' is-active' : ''}`} onClick={() => setFilter(c.key)}>{c.name}</button>
            ))}
          </div>
          <div className="mv-prop-grid">
            {visible.map((p) => {
              const brand = brandByKey(p.brandKey);
              return (
                <button key={`${filter}-${p.id}`} type="button" className="mv-prop-card mv-card-in" onClick={() => setModal(p)}>
                  <div className="mv-prop-media">
                    <img src={mvImg(p.seed, p.imgKind)} alt={p.name} loading="lazy" />
                    {p.badges && (
                      <div className="mv-prop-badges">
                        {p.badges.map((b) => <span key={b} className={badgeClass(b)}>{tbadge(b)}</span>)}
                      </div>
                    )}
                    <span className="mv-prop-brandtag">{brand?.name}</span>
                  </div>
                  <div className="mv-prop-body">
                    <span className="mv-prop-city"><MapPin size={12} /> {tcity(p.city)}</span>
                    <div className="mv-prop-name">{p.name}</div>
                    <p className="mv-prop-blurb">{tc('property', p.id, 'blurb', p.blurb)}</p>
                    <div className="mv-prop-foot">
                      <span className="mv-prop-price">
                        <small>{t('card.from')}</small>
                        <b>{wonKR(p.fromKRW)}<span> ~</span></b>
                      </span>
                      <span className="mv-btn mv-btn-outline mv-btn-sm">{t('card.detail')}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ BRANDS ============ */}
      <section id="brands" className="mv-section mv-brands">
        <div className="mv-container">
          <div className="mv-sec-head" data-reveal>
            <span className="mv-eyebrow"><Leaf size={14} /> Brand Portfolio</span>
            <h2 className="mv-h2" style={{ marginTop: 12 }}>{t('brands.title')} <span className="accent">{t('brands.titleAccent')}</span></h2>
            <p className="mv-lead">{t('brands.lead')}</p>
          </div>
          <div className="mv-brand-grid">
            {BRANDS.map((b, i) => (
              <Link key={b.key} href={`/mvillage/brand/${b.key}`} className="mv-brand-card" data-tone={b.tone} data-reveal data-delay={(i % 2) + 1}>
                <div className="mv-brand-rank">{String(i + 1).padStart(2, '0')}</div>
                <div>
                  <div className="mv-brand-name">{b.name}</div>
                  <div className="mv-brand-tier">{tc('brand', b.key, 'tierLabel', b.tierLabel)}</div>
                  <div className="mv-brand-target">{tc('brand', b.key, 'target', b.target)}</div>
                  <p className="mv-brand-blurb">{tc('brand', b.key, 'blurb', b.blurb)}</p>
                  <div className="mv-brand-meta">
                    <span>{t('meta.facilities')} <b>{b.facilities ?? t('badge.new')}</b></span>
                    <span>{t('meta.city')} <b>{b.cities.map((c) => tcity(c)).join(' · ')}</b></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ DESTINATIONS ============ */}
      <section id="destinations" className="mv-section mv-dest">
        <div className="mv-container">
          <div className="mv-sec-head" data-reveal>
            <span className="mv-eyebrow"><Leaf size={14} /> Destinations</span>
            <h2 className="mv-h2" style={{ marginTop: 12 }}>{t('dest.title')} <span className="accent">{t('dest.titleAccent')}</span></h2>
            <p className="mv-lead">{t('dest.lead')}</p>
          </div>
          <div className="mv-dest-grid">
            {DESTINATIONS.map((d, i) => (
              <article key={d.key} className="mv-dest-card" data-reveal data-delay={(i % 3) + 1}>
                <img src={mvImg(d.key, d.imgKind)} alt={d.cityEn} loading="lazy" />
                {d.isNew && <span className="mv-dest-new">{t('badge.new')}</span>}
                <div className="mv-dest-body">
                  <div className="mv-dest-en">{d.cityEn}</div>
                  <div className="mv-dest-city">{tcity(d.city)}</div>
                  <p className="mv-dest-hook">{tc('destination', d.key, 'hook', d.hook)}</p>
                  <span className="mv-dest-fac">{tc('destination', d.key, 'facilities', d.facilities)}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ VALUES ============ */}
      <section className="mv-section mv-values">
        <div className="mv-container">
          <div className="mv-sec-head" data-reveal>
            <span className="mv-eyebrow"><Leaf size={14} /> Our Philosophy</span>
            <h2 className="mv-h2" style={{ marginTop: 12 }}>{t('values.title')}</h2>
          </div>
          <div className="mv-value-grid">
            {VALUES.map((v, i) => (
              <div key={v.en} className="mv-value-card" data-reveal data-delay={i + 1}>
                <div className="mv-value-en">{v.en}</div>
                <div className="mv-value-ko">{tc('value', `v${i}`, 'ko', v.ko)}</div>
                <p className="mv-value-desc">{tc('value', `v${i}`, 'desc', v.desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA — 제휴 문의(별도 페이지로 분리) ============ */}
      <section id="cta" className="mv-section mv-cta">
        <div className="mv-container">
          <div className="mv-cta-box" data-reveal>
            <span className="mv-eyebrow" style={{ justifyContent: 'center' }}><Handshake size={14} /> Partnership</span>
            <h2 className="mv-h2" style={{ marginTop: 12 }}>{t('cta.title')} <span className="accent">{t('cta.titleAccent')}</span></h2>
            <p className="mv-lead" style={{ margin: '0 auto' }}>{t('cta.lead')}</p>
            <div className="mv-cta-actions">
              <Link href="/mvillage/partner" className="mv-btn mv-btn-primary"><Handshake size={17} /> {t('cta.btn1')}</Link>
              <button type="button" className="mv-btn mv-btn-outline" onClick={() => pickCollection('all')}><CalendarCheck size={16} /> {t('cta.btn2')}</button>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 상품 상세 모달 ============ */}
      {modal && (() => {
        const brand = brandByKey(modal.brandKey);
        const cols = modal.collectionKeys.map((k) => collectionByKey(k)?.name).filter(Boolean).join(' · ');
        return (
          <div className="mv-modal-scrim" role="dialog" aria-modal="true" onClick={() => setModal(null)}>
            <div className="mv-modal" onClick={(e) => e.stopPropagation()}>
              <div className="mv-modal-media">
                <img src={mvImg(modal.seed, modal.imgKind)} alt={modal.name} />
                <button type="button" className="mv-modal-close" onClick={() => setModal(null)} aria-label={t('modal.close')}><X size={18} /></button>
              </div>
              <div className="mv-modal-body">
                <span className="mv-modal-brandtag">{brand?.name}</span>
                <h3>{modal.name}</h3>
                <span className="mv-prop-city"><MapPin size={13} /> {tcity(modal.city)}, Vietnam · {cols}</span>
                <p className="mv-prop-blurb" style={{ marginTop: 12, fontSize: 15 }}>{tc('property', modal.id, 'blurb', modal.blurb)}</p>
                <p className="mv-brand-blurb" style={{ marginTop: 10 }}>{brand && `${tc('brand', brand.key, 'tagline', brand.tagline)} — ${tc('brand', brand.key, 'blurb', brand.blurb)}`}</p>
                <ul className="mv-modal-feats">
                  {tcArr('property', modal.id, 'features', modal.features).map((f) => (
                    <li key={f}><Check size={16} /> {f}</li>
                  ))}
                </ul>
                <div className="mv-modal-foot">
                  <span className="mv-prop-price">
                    <small>{t('card.from')}</small>
                    <b style={{ fontSize: 24 }}>{wonKR(modal.fromKRW)}<span> ~</span></b>
                  </span>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <button type="button" className="mv-btn mv-btn-outline mv-btn-sm" onClick={() => setModal(null)}>{t('modal.close')}</button>
                    <button type="button" className="mv-btn mv-btn-accent mv-btn-sm" onClick={() => router.push(`/mvillage/book/${modal.id}`)}>
                      {t('modal.book')} <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
                <p className="mv-modal-note">{t('modal.note')}</p>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
