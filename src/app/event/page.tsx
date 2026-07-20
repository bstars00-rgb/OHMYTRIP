'use client';

/* eslint-disable @next/next/no-img-element -- 원본 마크업 미러링 */

import { useState } from 'react';
import DesktopHeader from '@/components/layout/DesktopHeader';
import Footer from '@/components/layout/Footer';
import { EVENTS, EVENT_CATEGORIES, type EventCategory } from '@/mocks/events';

/** 원본 /event(기획전) 미러링 */
export default function EventPage() {
  const [category, setCategory] = useState<EventCategory>('ALL');
  const list = EVENTS.filter((e) => category === 'ALL' || e.category === category);

  return (
    <div id="wrap">
      <DesktopHeader />
      <div className="main-wrap">
        <main id="contents" className="bg">
          <section id="contents-area">
            <h2 className="contents-title-main mg-b20">기획전</h2>
            <div className="list-summary mg-b10">
              <div className="select-box md line inline mg-l-auto">
                <div className="select-box md inline line">
                  <select required value={category} onChange={(e) => setCategory(e.target.value as EventCategory)}>
                    {EVENT_CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {' '}
                        {c.label}{' '}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="promotion-list">
              {list.map((e) => (
                <button key={e.id} className="promotion-list-item" tabIndex={0}>
                  <img className="promotion-img" alt={e.title} src={e.imageUrl} />
                  <p className="title" title={e.title}>
                    {' '}
                    {e.title}{' '}
                  </p>
                  <p className="text" title={e.text}>
                    {' '}
                    {e.text}{' '}
                  </p>
                  <p className="date"> {e.period} </p>
                </button>
              ))}
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
