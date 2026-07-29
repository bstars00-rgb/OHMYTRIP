'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Zap, BadgeDollarSign, Headset, ArrowRight, MapPin, Star, CalendarDays } from 'lucide-react';
import SearchBox from '@/components/golf/SearchBox';
import PackageCard from '@/components/golf/PackageCard';
import { CATEGORIES, DESTINATIONS, PACKAGES } from '@/mocks/golf/data';
import { STORIES } from '@/mocks/golf/stories';
import { golfImg, golfHeroImg } from '@/features/golf/images';
import { usePrefs } from '@/features/golf/GolfProviders';
import CompareTray from '@/components/golf/CompareTray';

const WHY = [
  { icon: ShieldCheck, t: 'home.why1t', x: 'home.why1x' },
  { icon: Zap, t: 'home.why2t', x: 'home.why2x' },
  { icon: BadgeDollarSign, t: 'home.why3t', x: 'home.why3x' },
  { icon: Headset, t: 'home.why4t', x: 'home.why4x' },
];

const REVIEWS = [
  { name: 'Daniel R.', country: 'United Kingdom', text: '4명이서 다낭 4박 패키지를 예약했어요. 이동부터 티타임까지 완벽했고 체크인 때 추가 요금이 하나도 없었습니다.', score: 9.4 },
  { name: 'Yuna P.', country: 'South Korea', text: '제주 스테이앤플레이 패키지가 정말 편했어요. 라운드와 숙박이 한 번에 예약되고 가격도 투명했습니다.', score: 9.2 },
  { name: 'Kenji T.', country: 'Japan', text: '비교 화면 덕분에 라운드 옵션을 쉽게 고를 수 있었어요. 컨시어지도 몇 분 만에 답변해줬습니다.', score: 9.0 },
];

export default function GolfHome() {
  const router = useRouter();
  const { fx, t } = usePrefs();
  const best = PACKAGES.slice(0, 8);

  return (
    <>
      {/* A. Hero */}
      <section className="g-hero">
        <img className="g-hero-bg" src={golfHeroImg('ohmygolf-hero')} alt="" aria-hidden loading="eager" fetchPriority="high" decoding="async" width={1600} height={720} />
        <div className="g-hero-overlay" />
        <div className="g-container g-hero-inner">
          <p className="g-eyebrow g-hero-eyebrow">{t('hero.eyebrow')}</p>
          <h1 className="g-display g-hero-title">{t('hero.title')}</h1>
          <p className="g-hero-sub">{t('hero.sub')}</p>
          <SearchBox variant="hero" />
        </div>
      </section>

      {/* B. Quick category chips */}
      <section className="g-container g-cat-section">
        <div className="g-cat-row">
          {CATEGORIES.map((c) => (
            <button key={c.key} type="button" className="g-chip" onClick={() => router.push(`/golf/search?category=${c.key}`)}>
              {t(`cat.${c.key}`)}
            </button>
          ))}
        </div>
      </section>

      {/* C. Trending destinations */}
      <section id="destinations" className="g-section g-container">
        <div className="g-section-head">
          <div>
            <p className="g-eyebrow">{t('home.destEyebrow')}</p>
            <h2 className="g-section-title">{t('home.destTitle')}</h2>
          </div>
          <Link href="/golf/search" className="g-link-arrow">
            {t('home.viewAll')} <ArrowRight size={16} />
          </Link>
        </div>
        <div className="g-dest-grid">
          {DESTINATIONS.map((d) => (
            <Link key={d.slug} href={`/golf/search?destination=${d.city}`} className="g-card g-card-hover g-dest-card">
              <div className="g-dest-media">
                <img src={golfImg(d.slug, 'course')} alt={d.city} loading="lazy" decoding="async" width={800} height={600} />
                <div className="g-dest-overlay" />
                <div className="g-dest-caption">
                  <h3>{d.city}</h3>
                  <span><MapPin size={13} /> {d.country}</span>
                </div>
              </div>
              <div className="g-dest-meta">
                <div>
                  <span className="g-muted">{t('home.avgPackage')}</span>
                  <b>{fx(d.avgPackageUSD)}</b>
                </div>
                <div>
                  <span className="g-muted">{t('home.courseCount')}</span>
                  <b>{d.courseCount}개</b>
                </div>
              </div>
              <div className="g-dest-season" title={`${t('home.season')} ${d.season}`}>
                <CalendarDays size={14} />
                <span className="g-dest-season-label">{t('home.season')}</span>
                <b>{d.season}</b>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* D. Best packages */}
      <section id="packages" className="g-section g-section-ivory">
        <div className="g-container">
          <div className="g-section-head">
            <div>
              <p className="g-eyebrow">{t('home.pkgEyebrow')}</p>
              <h2 className="g-section-title">{t('home.pkgTitle')}</h2>
            </div>
            <Link href="/golf/search" className="g-link-arrow">
              {t('home.viewAllPkg')} <ArrowRight size={16} />
            </Link>
          </div>
          <div className="g-pkg-grid">
            {best.map((p) => (
              <PackageCard key={p.id} pkg={p} />
            ))}
          </div>
        </div>
      </section>

      {/* E. Why book with us */}
      <section className="g-section g-container">
        <div className="g-section-head" style={{ justifyContent: 'center', textAlign: 'center', flexDirection: 'column', gap: 6 }}>
          <p className="g-eyebrow">{t('home.whyEyebrow')}</p>
          <h2 className="g-section-title">{t('home.whyTitle')}</h2>
        </div>
        <div className="g-why-grid">
          {WHY.map((w) => (
            <div key={w.t} className="g-card g-why-card">
              <span className="g-why-icon">
                <w.icon size={22} />
              </span>
              <h3>{t(w.t)}</h3>
              <p className="g-muted">{t(w.x)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* F. Build your own trip */}
      <section className="g-container">
        <div className="g-build-cta">
          <img src={golfHeroImg('build-cta')} alt="" aria-hidden className="g-build-bg" loading="lazy" decoding="async" width={1600} height={720} />
          <div className="g-build-overlay" />
          <div className="g-build-content">
            <p className="g-eyebrow" style={{ color: '#ffd8b8' }}>{t('home.buildEyebrow')}</p>
            <h2 className="g-display g-build-title">{t('home.buildTitle')}</h2>
            <p className="g-build-sub">{t('home.buildSub')}</p>
            <Link href="/golf/build" className="g-btn g-btn-gold g-btn-lg">
              {t('home.buildCta')} <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* G. Editorial — 골프 여행 이야기 (블로그) */}
      <section className="g-section g-container">
        <div className="g-section-head">
          <div>
            <p className="g-eyebrow">{t('home.edEyebrow')}</p>
            <h2 className="g-section-title">{t('home.edTitle')}</h2>
          </div>
          <Link href="/golf/story" className="g-link-arrow">
            이야기 전체 보기 <ArrowRight size={16} />
          </Link>
        </div>
        <div className="g-editorial-grid">
          {STORIES.map((s) => (
            <Link key={s.slug} href={`/golf/story/${s.slug}`} className="g-card g-card-hover g-editorial-card">
              <div className="g-editorial-media">
                <img src={golfImg(s.heroSeed, 'course')} alt={s.title} loading="lazy" decoding="async" width={800} height={600} />
              </div>
              <div className="g-editorial-body">
                <span className="g-eyebrow">{s.category}</span>
                <h3>{s.title}</h3>
                <span className="g-link-arrow">{t('home.more')} <ArrowRight size={14} /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* H. Trust / reviews */}
      <section className="g-section g-section-forest">
        <div className="g-container">
          <div className="g-trust-stats">
            <div>
              <b>120,000+</b>
              <span>{t('home.trust1')}</span>
            </div>
            <div>
              <b>9.1 / 10</b>
              <span>{t('home.trust2')}</span>
            </div>
            <div>
              <b>24/7</b>
              <span>{t('home.trust3')}</span>
            </div>
            <div>
              <b>100%</b>
              <span>{t('home.trust4')}</span>
            </div>
          </div>
          <div className="g-review-grid">
            {REVIEWS.map((r) => (
              <figure key={r.name} className="g-review-card">
                <div className="g-review-score">
                  <Star size={14} fill="currentColor" strokeWidth={0} /> {r.score.toFixed(1)}
                </div>
                <blockquote>{r.text}</blockquote>
                <figcaption>
                  <b>{r.name}</b> · <span className="g-muted">{r.country}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="g-partner-row">
            {['GreenLink', 'FairwayStay', 'ProTee', 'Albatross Resorts', 'CaddieOne', 'LinksGroup'].map((p) => (
              <span key={p} className="g-partner-logo">{p}</span>
            ))}
          </div>
        </div>
      </section>

      <CompareTray />
    </>
  );
}
