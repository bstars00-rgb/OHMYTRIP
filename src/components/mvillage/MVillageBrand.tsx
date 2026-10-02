'use client';

/* eslint-disable @next/next/no-img-element -- 프로토타입 스톡 이미지(자사 실사진 교체 예정) */

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, MapPin, Building2, Layers, Sparkles } from 'lucide-react';
import {
  BRANDS, PROPERTIES, COLLECTIONS, brandByKey, wonKR, type ImgKind,
} from '@/mocks/mvillage/data';
import { mvImg } from '@/features/mvillage/images';
import { useMV } from '@/features/mvillage/i18n';

/** 브랜드별 히어로 이미지 톤(결정론적) — 실서비스화 시 자사 브랜드 키비주얼로 교체 */
const BRAND_KIND: Record<string, ImgKind> = {
  'grand-signature': 'resort',
  signature: 'resort',
  savvy: 'interior',
  'mvillage-hotel': 'city',
  premier: 'suite',
  express: 'city',
  harmony: 'suite',
};

function badgeClass(b: string): string {
  if (/신규|오픈예정|직항/.test(b)) return 'mv-badge soon';
  if (/한국 인기|베스트셀러/.test(b)) return 'mv-badge hot';
  return 'mv-badge';
}

export default function MVillageBrand({ brandKey }: { brandKey: string }) {
  const { t, tc, tcity, tbadge, tstory } = useMV();
  const router = useRouter();
  const brand = brandByKey(brandKey);

  if (!brand) {
    return (
      <div className="mv-container mv-section" style={{ textAlign: 'center' }}>
        <h1 className="mv-h2">{t('br.notFound')}</h1>
        <Link href="/mvillage#brands" className="mv-btn mv-btn-primary" style={{ marginTop: 20 }}>{t('br.backBrands')}</Link>
      </div>
    );
  }

  const rank = BRANDS.findIndex((b) => b.key === brand.key) + 1;
  const kind = BRAND_KIND[brand.key] ?? 'resort';
  const stays = PROPERTIES.filter((p) => p.brandKey === brand.key);
  const cols = COLLECTIONS.filter((c) => c.brandKeys.includes(brand.key));
  const firstStay = stays[0];

  return (
    <div className="mv-brand-page" data-tone={brand.tone}>
      {/* ============ HERO ============ */}
      <section className="mv-brand-hero">
        <div className="mv-brand-hero-bg"><img src={mvImg(`brand-${brand.key}`, kind)} alt={brand.name} /></div>
        <div className="mv-brand-hero-overlay" />
        <div className="mv-container mv-brand-hero-inner">
          <Link href="/mvillage#brands" className="mv-brand-back"><ArrowLeft size={15} /> {t('br.backBrands')}</Link>
          <div className="mv-brand-hero-rank">{String(rank).padStart(2, '0')} · M VILLAGE</div>
          <div className="mv-brand-hero-tier">{tc('brand', brand.key, 'tierLabel', brand.tierLabel)}</div>
          <h1 className="mv-brand-hero-name">{brand.name}</h1>
          <p className="mv-brand-hero-tagline">{tc('brand', brand.key, 'tagline', brand.tagline)}</p>
          <div className="mv-brand-hero-meta">
            <span><MapPin size={14} /> {brand.cities.map((c) => tcity(c)).join(' · ')}</span>
            <span><Building2 size={14} /> {t('meta.facilities')} {brand.facilities ?? t('badge.new')}</span>
            <span className="mv-brand-hero-target"><Sparkles size={13} /> {tc('brand', brand.key, 'target', brand.target)}</span>
          </div>
          {firstStay && (
            <div className="mv-brand-hero-cta">
              <button type="button" className="mv-btn mv-btn-light" onClick={() => router.push(`/mvillage/book/${firstStay.id}`)}>
                {t('br.explore')} <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ============ STORY ============ */}
      <section className="mv-section mv-brand-story">
        <div className="mv-container mv-brand-story-grid">
          <div>
            <span className="mv-eyebrow"><Layers size={14} /> {t('br.story')}</span>
            <h2 className="mv-h2" style={{ margin: '12px 0 18px' }}>{brand.name}</h2>
            <p className="mv-brand-story-text">{tstory(brand.key)}</p>
            <p className="mv-brand-story-text" style={{ marginTop: 14 }}>{tc('brand', brand.key, 'blurb', brand.blurb)}</p>
            {cols.length > 0 && (
              <div className="mv-brand-cols">
                {cols.map((c) => {
                  const sub = tc('collection', c.key, 'nameKo', c.nameKo);
                  return (
                    <Link key={c.key} href="/mvillage#collections" className="mv-brand-col-chip" data-tone={c.tone}>
                      {c.name}{sub && sub !== c.name ? ` · ${sub}` : ''}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
          <aside className="mv-brand-facts">
            <div className="mv-brand-fact"><span>{t('br.tier')}</span><b>{tc('brand', brand.key, 'tierLabel', brand.tierLabel)}</b></div>
            <div className="mv-brand-fact"><span>{t('br.target')}</span><b>{tc('brand', brand.key, 'target', brand.target)}</b></div>
            <div className="mv-brand-fact"><span>{t('meta.facilities')}</span><b>{brand.facilities ?? t('badge.new')}</b></div>
            <div className="mv-brand-fact"><span>{t('meta.city')}</span><b>{brand.cities.map((c) => tcity(c)).join(' · ')}</b></div>
          </aside>
        </div>
      </section>

      {/* ============ STAYS ============ */}
      {stays.length > 0 && (
        <section className="mv-section mv-props mv-brand-stays">
          <div className="mv-container">
            <div className="mv-sec-head left">
              <span className="mv-eyebrow"><Building2 size={14} /> {t('br.stays')}</span>
              <h2 className="mv-h2" style={{ marginTop: 12 }}>{brand.name} · {t('br.stays')}</h2>
            </div>
            <div className="mv-prop-grid">
              {stays.map((p) => (
                <Link key={p.id} href={`/mvillage/book/${p.id}`} className="mv-prop-card mv-card-in">
                  <div className="mv-prop-media">
                    <img src={mvImg(p.seed, p.imgKind)} alt={p.name} loading="lazy" />
                    {p.badges && (
                      <div className="mv-prop-badges">
                        {p.badges.map((b) => <span key={b} className={badgeClass(b)}>{tbadge(b)}</span>)}
                      </div>
                    )}
                    <span className="mv-prop-brandtag">{brand.name}</span>
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
                      <span className="mv-btn mv-btn-accent mv-btn-sm">{t('modal.book')} <ArrowRight size={14} /></span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ CTA ============ */}
      <section className="mv-section mv-cta">
        <div className="mv-container">
          <div className="mv-cta-box">
            <h2 className="mv-h2" style={{ marginBottom: 14 }}>{t('br.ctaTitle')}</h2>
            <p className="mv-lead" style={{ margin: '0 auto' }}>{t('br.ctaLead')}</p>
            <div className="mv-cta-actions">
              <Link href="/mvillage#brands" className="mv-btn mv-btn-outline">{t('br.backBrands')}</Link>
              <Link href="/mvillage/partner" className="mv-btn mv-btn-primary">{t('cta.btn1')}</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
