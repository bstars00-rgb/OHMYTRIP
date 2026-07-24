'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Zap, BadgeDollarSign, Headset, ArrowRight, MapPin, Star } from 'lucide-react';
import SearchBox from '@/components/golf/SearchBox';
import PackageCard from '@/components/golf/PackageCard';
import { CATEGORIES, DESTINATIONS, PACKAGES } from '@/mocks/golf/data';
import { golfImg, golfHeroImg } from '@/features/golf/images';
import { usePrefs } from '@/features/golf/GolfProviders';
import CompareTray from '@/components/golf/CompareTray';

const WHY = [
  { icon: ShieldCheck, title: '엄선한 골프 리조트', text: '모든 리조트와 골프장을 직접 검증해 품질과 코스 상태를 보장합니다.' },
  { icon: Zap, title: '실시간 즉시 확정', text: '숙박·라운드·티타임을 한 번에 예약하고 즉시 확정받으세요.' },
  { icon: BadgeDollarSign, title: '투명한 패키지 가격', text: '1인당 명확한 가격. 그린피·카트·이동까지 모두 포함입니다.' },
  { icon: Headset, title: '골프 여행 전문가 지원', text: '예약부터 18홀까지, 골프 여행 전문가가 24시간 함께합니다.' },
];

const EDITORIAL = [
  { title: '베트남 베스트 골프 리조트', tag: '여행지 가이드', seed: 'ed-vietnam' },
  { title: '서울 출발 주말 골프 여행', tag: '짧은 일탈', seed: 'ed-seoul' },
  { title: '초보자 친화적인 골프 여행지', tag: '입문자 추천', seed: 'ed-beginner' },
  { title: '일본 럭셔리 골프 리조트', tag: '프리미엄 스테이', seed: 'ed-japan' },
];

const REVIEWS = [
  { name: 'Daniel R.', country: 'United Kingdom', text: '4명이서 다낭 4박 패키지를 예약했어요. 이동부터 티타임까지 완벽했고 체크인 때 추가 요금이 하나도 없었습니다.', score: 9.4 },
  { name: 'Yuna P.', country: 'South Korea', text: '제주 스테이앤플레이 패키지가 정말 편했어요. 라운드와 숙박이 한 번에 예약되고 가격도 투명했습니다.', score: 9.2 },
  { name: 'Kenji T.', country: 'Japan', text: '비교 화면 덕분에 라운드 옵션을 쉽게 고를 수 있었어요. 컨시어지도 몇 분 만에 답변해줬습니다.', score: 9.0 },
];

export default function GolfHome() {
  const router = useRouter();
  const { fx } = usePrefs();
  const best = PACKAGES.slice(0, 8);

  return (
    <>
      {/* A. Hero */}
      <section className="g-hero">
        <img className="g-hero-bg" src={golfHeroImg('ohmygolf-hero')} alt="" aria-hidden loading="eager" fetchPriority="high" decoding="async" width={1600} height={720} />
        <div className="g-hero-overlay" />
        <div className="g-container g-hero-inner">
          <p className="g-eyebrow g-hero-eyebrow">오마이트립 골프텔 · Stay &amp; Play</p>
          <h1 className="g-display g-hero-title">Stay. Play. Discover.</h1>
          <p className="g-hero-sub">엄선한 골프텔과 티타임을 한 번의 여행으로 — 숙박부터 라운드까지.</p>
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
            <p className="g-eyebrow">어디서 칠까요</p>
            <h2 className="g-section-title">인기 골프 여행지</h2>
          </div>
          <Link href="/golf/search" className="g-link-arrow">
            전체 보기 <ArrowRight size={16} />
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
                  <span className="g-muted">평균 패키지</span>
                  <b>{fx(d.avgPackageUSD)}</b>
                </div>
                <div>
                  <span className="g-muted">추천 시즌</span>
                  <b>{d.season}</b>
                </div>
                <div>
                  <span className="g-muted">골프장</span>
                  <b>{d.courseCount}개</b>
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
              <p className="g-eyebrow">당신을 위한 추천</p>
              <h2 className="g-section-title">베스트 골프 패키지</h2>
            </div>
            <Link href="/golf/search" className="g-link-arrow">
              패키지 전체 보기 <ArrowRight size={16} />
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
          <p className="g-eyebrow">왜 오마이트립 골프텔인가</p>
          <h2 className="g-section-title">제대로 만든 골프 여행</h2>
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
          <img src={golfHeroImg('build-cta')} alt="" aria-hidden className="g-build-bg" loading="lazy" decoding="async" width={1600} height={720} />
          <div className="g-build-overlay" />
          <div className="g-build-content">
            <p className="g-eyebrow" style={{ color: '#ffd8b8' }}>완전 맞춤</p>
            <h2 className="g-display g-build-title">나만의 골프 여행 만들기</h2>
            <p className="g-build-sub">호텔·골프장·교통을 자유롭게 조합해 맞춤 일정을 완성하세요. 꿈꾸던 여행을 알려주시면 전문가가 견적을 드립니다.</p>
            <Link href="/golf/build" className="g-btn g-btn-gold g-btn-lg">
              내 골프 여행 만들기 <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* G. Editorial */}
      <section className="g-section g-container">
        <div className="g-section-head">
          <div>
            <p className="g-eyebrow">인사이트</p>
            <h2 className="g-section-title">골프 여행 이야기</h2>
          </div>
        </div>
        <div className="g-editorial-grid">
          {EDITORIAL.map((e) => (
            <Link key={e.seed} href="/golf/search" className="g-card g-card-hover g-editorial-card">
              <div className="g-editorial-media">
                <img src={golfImg(e.seed, 'course')} alt={e.title} loading="lazy" decoding="async" width={800} height={600} />
              </div>
              <div className="g-editorial-body">
                <span className="g-eyebrow">{e.tag}</span>
                <h3>{e.title}</h3>
                <span className="g-link-arrow">더 보기 <ArrowRight size={14} /></span>
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
              <span>골퍼가 예약</span>
            </div>
            <div>
              <b>9.1 / 10</b>
              <span>평균 평점</span>
            </div>
            <div>
              <b>24/7</b>
              <span>여행 지원</span>
            </div>
            <div>
              <b>100%</b>
              <span>안전 결제</span>
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
