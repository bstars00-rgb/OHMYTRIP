'use client';

import Link from 'next/link';
import { Clock, CalendarDays, ArrowRight } from 'lucide-react';
import { STORIES } from '@/mocks/golf/stories';
import { golfImg, golfHeroImg } from '@/features/golf/images';

export default function StoriesIndex() {
  const [featured, ...rest] = STORIES;

  return (
    <div className="g-container g-section">
      <div className="g-section-head" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
        <p className="g-eyebrow">인사이트</p>
        <h1 className="g-section-title">골프 여행 이야기</h1>
        <p className="g-muted">여행지 가이드부터 입문자 팁까지 — 더 나은 골프 여행을 위한 읽을거리.</p>
      </div>

      {/* 피처드 */}
      <Link href={`/golf/story/${featured.slug}`} className="g-card g-card-hover g-story-featured">
        <div className="g-story-featured-media">
          <img src={golfHeroImg(featured.heroSeed)} alt={featured.title} decoding="async" width={1600} height={720} />
        </div>
        <div className="g-story-featured-body">
          <span className="g-badge g-badge-soft">{featured.category}</span>
          <h2>{featured.title}</h2>
          <p className="g-muted">{featured.excerpt}</p>
          <div className="g-story-meta">
            <span><b>{featured.author}</b></span>
            <span className="g-muted"><CalendarDays size={14} /> {featured.date}</span>
            <span className="g-muted"><Clock size={14} /> 읽기 {featured.readMin}분</span>
          </div>
          <span className="g-link-arrow">이야기 읽기 <ArrowRight size={15} /></span>
        </div>
      </Link>

      {/* 나머지 */}
      <div className="g-story-grid">
        {rest.map((s) => (
          <Link key={s.slug} href={`/golf/story/${s.slug}`} className="g-card g-card-hover g-story-card">
            <div className="g-story-card-media">
              <img src={golfImg(s.heroSeed, 'course')} alt={s.title} loading="lazy" decoding="async" width={800} height={600} />
              <span className="g-story-card-cat">{s.category}</span>
            </div>
            <div className="g-story-card-body">
              <h3>{s.title}</h3>
              <p className="g-muted">{s.excerpt}</p>
              <div className="g-story-meta">
                <span className="g-muted"><CalendarDays size={13} /> {s.date}</span>
                <span className="g-muted"><Clock size={13} /> {s.readMin}분</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
