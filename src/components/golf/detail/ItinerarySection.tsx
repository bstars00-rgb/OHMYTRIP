'use client';

import { Utensils, Lightbulb, Plane, Flag, LogOut } from 'lucide-react';
import type { GolfPackage } from '@/mocks/golf/types';
import { golfImg } from '@/features/golf/images';

/** 사진이 들어간 상세페이지형 여행 일정 (일자별 매거진 카드) */
export default function ItinerarySection({ pkg }: { pkg: GolfPackage }) {
  const days = pkg.itinerary;

  const dayImage = (i: number): string => {
    if (i === 0) return golfImg(pkg.id, 'resort'); // 도착일 — 리조트
    if (i === days.length - 1) return golfImg(`${pkg.id}-depart`, 'course'); // 출발일
    const r = (i - 1) % pkg.golfCourses.length; // 라운드일 — 해당 코스
    return golfImg(`${pkg.id}-course-${r}`, r % 2 ? 'green' : 'course');
  };

  const DayIcon = (i: number) => (i === 0 ? Plane : i === days.length - 1 ? LogOut : Flag);

  return (
    <div className="g-itin">
      <p className="g-itin-lead">
        총 <b>{pkg.nights}박 {pkg.nights + 1}일</b> · {pkg.rounds}라운드 · 전용 차량 이동 · 매일 조식 포함. 아래 일정은 예시이며 항공편·티타임에 따라 조정됩니다.
      </p>

      {days.map((d, i) => {
        const Icon = DayIcon(i);
        return (
          <article key={d.day} className="g-itin-day">
            <div className="g-itin-photo">
              <img src={dayImage(i)} alt={d.title} loading="lazy" decoding="async" width={800} height={600} />
              <span className="g-itin-daybadge"><Icon size={13} /> Day {d.day}</span>
            </div>

            <div className="g-itin-content">
              <div className="g-itin-head">
                <h3>{d.title}</h3>
                {d.meals && d.meals.length > 0 && (
                  <span className="g-itin-meals">
                    {d.meals.map((m) => (
                      <span key={m} className="g-meal-chip"><Utensils size={11} /> {m}</span>
                    ))}
                  </span>
                )}
              </div>

              {d.description && <p className="g-itin-desc">{d.description}</p>}

              <div className="g-itin-schedule">
                {d.items.map((it, idx) => (
                  <div key={idx} className="g-itin-step">
                    <span className="g-itin-time">{it.time || '·'}</span>
                    <span className="g-itin-text">
                      {it.text}
                      {it.tag && <span className="g-timeline-tag">{it.tag}</span>}
                    </span>
                  </div>
                ))}
              </div>

              {d.highlight && (
                <div className="g-itin-tip"><Lightbulb size={15} /> {d.highlight}</div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
