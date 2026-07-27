'use client';

import Link from 'next/link';
import { MapPin, Flag, Ruler, PenTool, ArrowRight } from 'lucide-react';
import { coursesByDestination } from '@/mocks/golf/courses';

const DIFF_KO: Record<string, string> = { Beginner: '입문자 친화', Intermediate: '중급자 적합', Championship: '챔피언십' };

export default function CoursesIndex() {
  const groups = coursesByDestination();
  const total = groups.reduce((s, g) => s + g.courses.length, 0);

  return (
    <div className="g-container g-section">
      <div className="g-section-head" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
        <p className="g-eyebrow">골프장</p>
        <h1 className="g-section-title">골프장 정보</h1>
        <p className="g-muted">오마이트립 골프텔이 엄선한 {total}개 골프장의 코스 정보·스코어카드·이용 안내를 확인하세요.</p>
      </div>

      {groups.map((g) => (
        <section key={g.destination} style={{ marginTop: 28 }}>
          <div className="g-between" style={{ marginBottom: 14 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700 }}>
              <MapPin size={17} style={{ verticalAlign: -2, color: 'var(--g-forest)' }} /> {g.destination}
              <span className="g-muted" style={{ fontSize: 14, fontWeight: 400 }}> · {g.country}</span>
            </h2>
            <Link href={`/golf/search?destination=${g.destination}`} className="g-link-arrow">
              패키지 보기 <ArrowRight size={15} />
            </Link>
          </div>
          <div className="g-course-index-grid">
            {g.courses.map((c) => (
              <Link key={c.slug} href={`/golf/course/${c.slug}`} className="g-card g-card-hover g-course-index-card">
                <div className="g-course-index-body">
                  <div className="g-between">
                    <span className="g-badge g-badge-soft">{c.holes}홀 · 파 {c.par}</span>
                    <span className="g-badge g-badge-instant">{DIFF_KO[c.difficulty]}</span>
                  </div>
                  <h3 className="g-pkgcard-title" style={{ marginTop: 10 }}>{c.name}</h3>
                  <p className="g-pkgcard-loc"><PenTool size={14} /> 설계 {c.designer}</p>
                  <ul className="g-pkgcard-incl" style={{ marginTop: 8 }}>
                    <li><Ruler size={13} /> {c.yardage.toLocaleString()} yd</li>
                    <li><Flag size={13} /> 코스레이팅 {c.courseRating.toFixed(1)}</li>
                    <li><MapPin size={13} /> {c.transferMin}분</li>
                  </ul>
                  <span className="g-link-arrow" style={{ marginTop: 12 }}>코스 상세 <ArrowRight size={14} /></span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
