'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Zap, BadgeDollarSign, Headset, ArrowRight, MapPin, Star } from 'lucide-react';
import SearchBox from '@/components/golf/SearchBox';
import PackageCard from '@/components/golf/PackageCard';
import { CATEGORIES, DESTINATIONS, PACKAGES } from '@/mocks/golf/data';
import { golfScene, golfHero } from '@/features/golf/scenery';
import { usePrefs } from '@/features/golf/GolfProviders';
import CompareTray from '@/components/golf/CompareTray';

const WHY = [
  { icon: ShieldCheck, title: 'Handpicked Golf Resorts', text: 'Every resort and course is personally vetted for quality and condition.' },
  { icon: Zap, title: 'Instant Confirmation', text: 'Book stay, rounds and tee times together — confirmed in seconds.' },
  { icon: BadgeDollarSign, title: 'Transparent Package Pricing', text: 'One clear per-person price. Green fees, cart and transfers included.' },
  { icon: Headset, title: 'Golf Travel Expert Support', text: 'Real golf travel specialists on hand 24/7, from booking to the 18th hole.' },
];

const EDITORIAL = [
  { title: 'Best golf resorts in Vietnam', tag: 'Destination guide', seed: 'ed-vietnam' },
  { title: 'Weekend golf trips from Seoul', tag: 'Quick escapes', seed: 'ed-seoul' },
  { title: 'Beginner-friendly golf destinations', tag: 'For new golfers', seed: 'ed-beginner' },
  { title: 'Luxury golf resorts in Japan', tag: 'Premium stays', seed: 'ed-japan' },
];

const REVIEWS = [
  { name: 'Daniel R.', country: 'United Kingdom', text: 'Booked a 4-night Da Nang package for four of us. Everything from transfers to tee times just worked. Zero surprises at check-in.', score: 9.4 },
  { name: 'Yuna P.', country: 'South Korea', text: '제주 스테이앤플레이 패키지가 정말 편했어요. 라운드와 숙박이 한 번에 예약되고 가격도 투명했습니다.', score: 9.2 },
  { name: 'Kenji T.', country: 'Japan', text: 'The comparison view made it easy to pick between round options. Concierge answered within minutes.', score: 9.0 },
];

export default function GolfHome() {
  const router = useRouter();
  const { fx } = usePrefs();
  const best = PACKAGES.slice(0, 8);

  return (
    <>
      {/* A. Hero */}
      <section className="g-hero">
        <img className="g-hero-bg" src={golfHero('ohmygolf-hero')} alt="" aria-hidden />
        <div className="g-hero-overlay" />
        <div className="g-container g-hero-inner">
          <p className="g-eyebrow g-hero-eyebrow">OHMYGOLF · Golf Stay &amp; Play</p>
          <h1 className="g-display g-hero-title">Stay. Play. Discover.</h1>
          <p className="g-hero-sub">Handpicked golf resorts, hotels and tee times in one seamless trip.</p>
          <SearchBox variant="hero" />
        </div>
      </section>

      {/* B. Quick category chips */}
      <section className="g-container g-cat-section">
        <div className="g-cat-row">
          {CATEGORIES.map((c) => (
            <button key={c.key} type="button" className="g-chip" onClick={() => router.push(`/golf/search?category=${c.key}`)}>
              {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* C. Trending destinations */}
      <section id="destinations" className="g-section g-container">
        <div className="g-section-head">
          <div>
            <p className="g-eyebrow">Where to play</p>
            <h2 className="g-section-title">Trending golf destinations</h2>
          </div>
          <Link href="/golf/search" className="g-link-arrow">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        <div className="g-dest-grid">
          {DESTINATIONS.map((d) => (
            <Link key={d.slug} href={`/golf/search?destination=${d.city}`} className="g-card g-card-hover g-dest-card">
              <div className="g-dest-media">
                <img src={golfScene(`dest-${d.slug}`, { ratio: 1.35 })} alt={d.city} loading="lazy" />
                <div className="g-dest-overlay" />
                <div className="g-dest-caption">
                  <h3>{d.city}</h3>
                  <span><MapPin size={13} /> {d.country}</span>
                </div>
              </div>
              <div className="g-dest-meta">
                <div>
                  <span className="g-muted">Avg. package</span>
                  <b>{fx(d.avgPackageUSD)}</b>
                </div>
                <div>
                  <span className="g-muted">Best season</span>
                  <b>{d.season}</b>
                </div>
                <div>
                  <span className="g-muted">Courses</span>
                  <b>{d.courseCount}</b>
                </div>
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
              <p className="g-eyebrow">Curated for you</p>
              <h2 className="g-section-title">Best golf packages</h2>
            </div>
            <Link href="/golf/search" className="g-link-arrow">
              See all packages <ArrowRight size={16} />
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
          <p className="g-eyebrow">Why OHMYGOLF</p>
          <h2 className="g-section-title">Golf travel, done properly</h2>
        </div>
        <div className="g-why-grid">
          {WHY.map((w) => (
            <div key={w.title} className="g-card g-why-card">
              <span className="g-why-icon">
                <w.icon size={22} />
              </span>
              <h3>{w.title}</h3>
              <p className="g-muted">{w.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* F. Build your own trip */}
      <section className="g-container">
        <div className="g-build-cta">
          <img src={golfScene('build-cta', { ratio: 2.6, flag: true })} alt="" aria-hidden className="g-build-bg" />
          <div className="g-build-overlay" />
          <div className="g-build-content">
            <p className="g-eyebrow" style={{ color: '#cfe0cf' }}>Fully bespoke</p>
            <h2 className="g-display g-build-title">Build your own golf trip</h2>
            <p className="g-build-sub">Mix any hotel, courses and transport into one tailor-made itinerary. Tell us your dream trip and our specialists price it for you.</p>
            <Link href="/golf/build" className="g-btn g-btn-gold g-btn-lg">
              Build My Golf Trip <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* G. Editorial */}
      <section className="g-section g-container">
        <div className="g-section-head">
          <div>
            <p className="g-eyebrow">Inspiration</p>
            <h2 className="g-section-title">Golf travel stories</h2>
          </div>
        </div>
        <div className="g-editorial-grid">
          {EDITORIAL.map((e) => (
            <Link key={e.seed} href="/golf/search" className="g-card g-card-hover g-editorial-card">
              <div className="g-editorial-media">
                <img src={golfScene(e.seed, { ratio: 1.4 })} alt={e.title} loading="lazy" />
              </div>
              <div className="g-editorial-body">
                <span className="g-eyebrow">{e.tag}</span>
                <h3>{e.title}</h3>
                <span className="g-link-arrow">Read more <ArrowRight size={14} /></span>
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
              <span>golfers booked</span>
            </div>
            <div>
              <b>9.1 / 10</b>
              <span>average rating</span>
            </div>
            <div>
              <b>24/7</b>
              <span>travel support</span>
            </div>
            <div>
              <b>100%</b>
              <span>secure payment</span>
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
