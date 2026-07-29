'use client';

import Link from 'next/link';
import { ChevronRight, Clock, CalendarDays, ArrowRight, ArrowLeft } from 'lucide-react';
import { getStory, STORIES } from '@/mocks/golf/stories';
import { PACKAGES } from '@/mocks/golf/data';
import type { GolfPackage } from '@/mocks/golf/types';
import { golfImg, golfHeroImg } from '@/features/golf/images';
import { EmptyState } from '@/components/golf/common/ui';
import PackageCard from '@/components/golf/PackageCard';

export default function StoryArticle({ slug }: { slug: string }) {
  const story = getStory(slug);

  if (!story) {
    return (
      <div className="g-container g-section">
        <EmptyState title="이야기를 찾을 수 없어요" subtitle="이동되었거나 없는 글일 수 있어요." action={<Link href="/golf/story" className="g-btn g-btn-primary" style={{ marginTop: 16 }}>이야기 전체 보기</Link>} />
      </div>
    );
  }

  const related: GolfPackage[] = (() => {
    let list = PACKAGES;
    if (story.relatedDestination) list = list.filter((p) => p.destination === story.relatedDestination);
    if (list.length < 3 && story.relatedTags?.length) {
      const extra = PACKAGES.filter((p) => p.tags.some((t) => story.relatedTags!.includes(t)) && !list.includes(p));
      list = [...list, ...extra];
    }
    // 같은 호텔 중복 제거 후 상위 3개
    const seen = new Set<string>();
    const dedup: GolfPackage[] = [];
    for (const p of list) {
      if (seen.has(p.hotel)) continue;
      seen.add(p.hotel);
      dedup.push(p);
    }
    return dedup.slice(0, 3);
  })();

  const more = STORIES.filter((s) => s.slug !== story.slug).slice(0, 3);

  return (
    <div className="g-container g-section g-story">
      <nav className="g-breadcrumb" aria-label="Breadcrumb">
        <Link href="/golf">홈</Link> <ChevronRight size={14} />
        <Link href="/golf/story">골프 여행 이야기</Link> <ChevronRight size={14} />
        <span className="g-muted">{story.title}</span>
      </nav>

      <article className="g-story-article">
        <header className="g-story-head">
          <span className="g-badge g-badge-soft">{story.category}</span>
          <h1 className="g-story-title">{story.title}</h1>
          <p className="g-story-excerpt">{story.excerpt}</p>
          <div className="g-story-meta">
            <span><b>{story.author}</b> · {story.authorRole}</span>
            <span className="g-muted"><CalendarDays size={14} /> {story.date}</span>
            <span className="g-muted"><Clock size={14} /> 읽기 {story.readMin}분</span>
          </div>
        </header>

        <div className="g-story-hero">
          <img src={golfHeroImg(story.heroSeed)} alt={story.title} decoding="async" width={1600} height={720} />
        </div>

        <div className="g-story-body">
          {story.sections.map((sec, i) => (
            <section key={i} className="g-story-section">
              {sec.heading && <h2>{sec.heading}</h2>}
              {sec.paragraphs.map((p, j) => <p key={j}>{p}</p>)}
              {sec.imageSeed && (
                <figure className="g-story-figure">
                  <img src={golfImg(sec.imageSeed, sec.imageKind ?? 'course')} alt={sec.caption ?? story.title} loading="lazy" decoding="async" width={800} height={600} />
                  {sec.caption && <figcaption>{sec.caption}</figcaption>}
                </figure>
              )}
            </section>
          ))}

          <div className="g-story-tags">
            {story.tags.map((t) => <span key={t} className="g-badge g-badge-soft">#{t}</span>)}
          </div>
        </div>
      </article>

      {/* 관련 패키지 CTA */}
      {related.length > 0 && (
        <section className="g-story-related">
          <div className="g-section-head">
            <div>
              <p className="g-eyebrow">이 이야기 속 여행</p>
              <h2 className="g-section-title">지금 예약 가능한 골프 패키지</h2>
            </div>
            <Link href={story.relatedDestination ? `/golf/search?destination=${story.relatedDestination}` : '/golf/search'} className="g-link-arrow">
              더 많은 패키지 <ArrowRight size={15} />
            </Link>
          </div>
          <div className="g-pkg-grid">
            {related.map((p) => <PackageCard key={p.id} pkg={p} />)}
          </div>
        </section>
      )}

      {/* 다른 이야기 */}
      {more.length > 0 && (
        <section className="g-story-more">
          <h2 className="g-section-title" style={{ marginBottom: 16 }}>다른 골프 여행 이야기</h2>
          <div className="g-editorial-grid">
            {more.map((s) => (
              <Link key={s.slug} href={`/golf/story/${s.slug}`} className="g-card g-card-hover g-editorial-card">
                <div className="g-editorial-media">
                  <img src={golfImg(s.heroSeed, 'course')} alt={s.title} loading="lazy" decoding="async" width={800} height={600} />
                </div>
                <div className="g-editorial-body">
                  <span className="g-eyebrow">{s.category}</span>
                  <h3>{s.title}</h3>
                  <span className="g-link-arrow">더 보기 <ArrowRight size={14} /></span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div style={{ marginTop: 30 }}>
        <Link href="/golf/story" className="g-btn g-btn-ghost"><ArrowLeft size={16} /> 이야기 전체 보기</Link>
      </div>
    </div>
  );
}
