'use client';

/* eslint-disable @next/next/no-img-element -- 프로토타입 스톡 이미지(자사 실사진 교체 예정) */

import { useMemo, useState } from 'react';
import {
  Sunrise, Building2, BedDouble, Laptop, MapPin, Check, X,
  ArrowRight, Leaf, MessageCircle, Phone,
} from 'lucide-react';
import {
  COLLECTIONS, BRANDS, DESTINATIONS, PROPERTIES, STATS, VALUES,
  brandByKey, collectionByKey, wonKR, type Property,
} from '@/mocks/mvillage/data';
import { mvImg } from '@/features/mvillage/images';

const CICON = { sunrise: Sunrise, city: Building2, bed: BedDouble, laptop: Laptop } as const;

function badgeClass(b: string): string {
  if (/신규|오픈예정|직항/.test(b)) return 'mv-badge soon';
  if (/한국 인기|베스트셀러/.test(b)) return 'mv-badge hot';
  return 'mv-badge';
}

export default function MVillageHall() {
  const [filter, setFilter] = useState<string>('all');
  const [modal, setModal] = useState<Property | null>(null);

  const visible = useMemo(
    () => (filter === 'all' ? PROPERTIES : PROPERTIES.filter((p) => p.collectionKeys.includes(filter))),
    [filter],
  );

  const pickCollection = (key: string) => {
    setFilter(key);
    document.getElementById('stays')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="mv-hero">
        <div className="mv-hero-bg">
          <img src={mvImg('mvillage-hero', 'hero')} alt="M Village 베트남 라이프스타일 스테이" />
        </div>
        <div className="mv-hero-overlay" />
        <div className="mv-container mv-hero-inner">
          <div className="mv-hero-logo"><b>M</b> VILLAGE</div>
          <span className="mv-eyebrow"><Leaf size={14} /> A MORE MEANINGFUL STAY</span>
          <h1>호텔이 아니라,<br /><span className="accent">베트남을 사는 방식</span>으로<br />머무는 곳.</h1>
          <p className="mv-hero-sub">
            다낭·하노이·나트랑·달랏의 60개 시설, 6개 라이프스타일 브랜드.
            목적에 맞게 고르는 <b style={{ color: '#e7c9a6' }}>베트남 라이프스타일 컬렉션</b>을 오마이호텔에서 만나보세요.
          </p>
          <div className="mv-hero-cta">
            <button type="button" className="mv-btn mv-btn-light" onClick={() => pickCollection('all')}>
              컬렉션 둘러보기 <ArrowRight size={17} />
            </button>
            <a href="#brands" className="mv-btn mv-btn-ghost-light">브랜드 알아보기</a>
          </div>
          <div className="mv-hero-tags">
            <span>Local Living</span><span>Global Connections</span><span>Stay · Work · Explore · Belong</span>
          </div>
        </div>
        <div className="mv-hero-badge">Vietnam Lives Here</div>
      </section>

      {/* ============ STATS ============ */}
      <section className="mv-stats">
        <div className="mv-container">
          <div className="mv-stats-grid">
            {STATS.map((s) => (
              <div key={s.label} className="mv-stat">
                <b>{s.value}<span className="unit">{s.unit}</span></b>
                <p>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ COLLECTIONS ============ */}
      <section id="collections" className="mv-section mv-collections">
        <div className="mv-container">
          <div className="mv-sec-head">
            <span className="mv-eyebrow"><Leaf size={14} /> Vietnam Lifestyle Collection</span>
            <h2 className="mv-h2" style={{ marginTop: 12 }}>목적으로 고르는 <span className="accent">4가지 컬렉션</span></h2>
            <p className="mv-lead">개별 호텔이 아니라, 여행의 목적에 맞춰 고르세요. 허니문부터 워크케이션까지 — 브랜드별 선택이 쉬운 포트폴리오.</p>
          </div>
          <div className="mv-collection-grid">
            {COLLECTIONS.map((c) => {
              const Icon = CICON[c.icon];
              return (
                <button key={c.key} type="button" className="mv-collection-card" data-tone={c.tone} onClick={() => pickCollection(c.key)}>
                  <img src={mvImg(c.key, c.icon === 'sunrise' ? 'resort' : c.icon === 'city' ? 'city' : c.icon === 'bed' ? 'interior' : 'suite')} alt={c.name} />
                  <div className="mv-cc-body">
                    <span className="mv-cc-ic"><Icon size={24} color="#fff" /></span>
                    <div className="mv-cc-name">{c.name}</div>
                    <div className="mv-cc-nameko">{c.nameKo}</div>
                    <div className="mv-cc-purpose">{c.purpose}</div>
                    <span className="mv-cc-msg">{c.message}</span>
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

      {/* ============ STAYS (필터 + 그리드) ============ */}
      <section id="stays" className="mv-section mv-props">
        <div className="mv-container">
          <div className="mv-sec-head">
            <span className="mv-eyebrow"><Leaf size={14} /> Featured Stays</span>
            <h2 className="mv-h2" style={{ marginTop: 12 }}>M Village 대표 시설</h2>
          </div>
          <div className="mv-filter-row">
            <button type="button" className={`mv-filter${filter === 'all' ? ' is-active' : ''}`} onClick={() => setFilter('all')}>전체</button>
            {COLLECTIONS.map((c) => (
              <button key={c.key} type="button" className={`mv-filter${filter === c.key ? ' is-active' : ''}`} onClick={() => setFilter(c.key)}>{c.name}</button>
            ))}
          </div>
          <div className="mv-prop-grid">
            {visible.map((p) => {
              const brand = brandByKey(p.brandKey);
              return (
                <button key={p.id} type="button" className="mv-prop-card" onClick={() => setModal(p)}>
                  <div className="mv-prop-media">
                    <img src={mvImg(p.seed, p.imgKind)} alt={p.name} loading="lazy" />
                    {p.badges && (
                      <div className="mv-prop-badges">
                        {p.badges.map((b) => <span key={b} className={badgeClass(b)}>{b}</span>)}
                      </div>
                    )}
                    <span className="mv-prop-brandtag">{brand?.name}</span>
                  </div>
                  <div className="mv-prop-body">
                    <span className="mv-prop-city"><MapPin size={12} /> {p.city}</span>
                    <div className="mv-prop-name">{p.name}</div>
                    <p className="mv-prop-blurb">{p.blurb}</p>
                    <div className="mv-prop-foot">
                      <span className="mv-prop-price">
                        <small>1박 최저가 (지표)</small>
                        <b>{wonKR(p.fromKRW)}<span> ~</span></b>
                      </span>
                      <span className="mv-btn mv-btn-outline mv-btn-sm">자세히</span>
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
          <div className="mv-sec-head">
            <span className="mv-eyebrow"><Leaf size={14} /> Brand Portfolio</span>
            <h2 className="mv-h2" style={{ marginTop: 12 }}>하나의 이름, <span className="accent">6개의 라이프스타일</span></h2>
            <p className="mv-lead">2026년 멀티브랜드 체제로 전환한 Modern Village Lifestyle. 최상위 시그니처부터 실속·롱스테이까지, 목적에 맞는 브랜드를 선택하세요.</p>
          </div>
          <div className="mv-brand-grid">
            {BRANDS.map((b, i) => (
              <article key={b.key} className="mv-brand-card" data-tone={b.tone}>
                <div className="mv-brand-rank">{String(i + 1).padStart(2, '0')}</div>
                <div>
                  <div className="mv-brand-name">{b.name}</div>
                  <div className="mv-brand-tier">{b.tierLabel}</div>
                  <div className="mv-brand-target">{b.target}</div>
                  <p className="mv-brand-blurb">{b.blurb}</p>
                  <div className="mv-brand-meta">
                    <span>시설 <b>{b.facilities ?? '신규'}{b.facilities ? '개' : ''}</b></span>
                    <span>도시 <b>{b.cities.join(' · ')}</b></span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ DESTINATIONS ============ */}
      <section id="destinations" className="mv-section mv-dest">
        <div className="mv-container">
          <div className="mv-sec-head">
            <span className="mv-eyebrow"><Leaf size={14} /> Destinations</span>
            <h2 className="mv-h2" style={{ marginTop: 12 }}>한국에서 가장 가까운 <span className="accent">베트남</span></h2>
            <p className="mv-lead">한국인 수요가 이미 완성된 목적지들. 다낭·나트랑·달랏·푸꾸옥 — 직항과 함께 M Village가 먼저 켜져 있습니다.</p>
          </div>
          <div className="mv-dest-grid">
            {DESTINATIONS.map((d) => (
              <article key={d.key} className="mv-dest-card">
                <img src={mvImg(d.key, d.imgKind)} alt={d.city} loading="lazy" />
                {d.isNew && <span className="mv-dest-new">신규</span>}
                <div className="mv-dest-body">
                  <div className="mv-dest-en">{d.cityEn}</div>
                  <div className="mv-dest-city">{d.city}</div>
                  <p className="mv-dest-hook">{d.hook}</p>
                  <span className="mv-dest-fac">{d.facilities}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ VALUES ============ */}
      <section className="mv-section mv-values">
        <div className="mv-container">
          <div className="mv-sec-head">
            <span className="mv-eyebrow"><Leaf size={14} /> Our Philosophy</span>
            <h2 className="mv-h2" style={{ marginTop: 12 }}>더 의미 있는 머무름</h2>
          </div>
          <div className="mv-value-grid">
            {VALUES.map((v) => (
              <div key={v.en} className="mv-value-card">
                <div className="mv-value-en">{v.en}</div>
                <div className="mv-value-ko">{v.ko}</div>
                <p className="mv-value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section id="cta" className="mv-section mv-cta">
        <div className="mv-container">
          <div className="mv-cta-box">
            <span className="mv-eyebrow" style={{ justifyContent: 'center' }}><Leaf size={14} /> Contact</span>
            <h2 className="mv-h2" style={{ marginTop: 12 }}>M Village, 한국에서 만나보세요</h2>
            <p className="mv-lead" style={{ margin: '0 auto' }}>
              단체·허니문·워크케이션 등 목적에 맞는 브랜드와 시설을 오마이호텔이 한국어로 안내해 드립니다.
              제휴·단체 예약 문의를 남겨주세요.
            </p>
            <div className="mv-cta-actions">
              <button type="button" className="mv-btn mv-btn-primary"><MessageCircle size={17} /> 카카오톡 문의</button>
              <a href="tel:16700000" className="mv-btn mv-btn-outline"><Phone size={16} /> 전화 상담 1670-0000</a>
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
                <button type="button" className="mv-modal-close" onClick={() => setModal(null)} aria-label="닫기"><X size={18} /></button>
              </div>
              <div className="mv-modal-body">
                <span className="mv-modal-brandtag">{brand?.name}</span>
                <h3>{modal.name}</h3>
                <span className="mv-prop-city"><MapPin size={13} /> {modal.city}, Vietnam · {cols}</span>
                <p className="mv-prop-blurb" style={{ marginTop: 12, fontSize: 15 }}>{modal.blurb}</p>
                <p className="mv-brand-blurb" style={{ marginTop: 10 }}>{brand?.tagline} — {brand?.blurb}</p>
                <ul className="mv-modal-feats">
                  {modal.features.map((f) => (
                    <li key={f}><Check size={16} /> {f}</li>
                  ))}
                </ul>
                <div className="mv-modal-foot">
                  <span className="mv-prop-price">
                    <small>1박 최저가 (지표성 목값)</small>
                    <b style={{ fontSize: 24 }}>{wonKR(modal.fromKRW)}<span> ~</span></b>
                  </span>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <button type="button" className="mv-btn mv-btn-outline mv-btn-sm" onClick={() => setModal(null)}>닫기</button>
                    <button type="button" className="mv-btn mv-btn-primary mv-btn-sm" onClick={() => { setModal(null); document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' }); }}>
                      예약·제휴 문의 <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
                <p className="mv-modal-note">* 실판매·요율·재고 미연동 프로토타입입니다. 표기 가격은 브랜드 포지셔닝용 지표값이며 실제 요금과 다를 수 있습니다.</p>
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}
