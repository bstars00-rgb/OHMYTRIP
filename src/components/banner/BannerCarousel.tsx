'use client';

/* eslint-disable @next/next/no-img-element -- 원본 slick 마크업 미러링 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Banner } from '@/mocks/banners';

interface BannerCarouselProps {
  /** banner-extra(585×433) | banner-large(783×232) | banner-medium(387×232) */
  id: 'banner-extra' | 'banner-large' | 'banner-medium';
  banners: Banner[];
  className?: string;
  /** slick autoplaySpeed. 원본 실측 전 기본값 — TODO: 원본 자동재생 간격 실측 후 교체 */
  autoplayMs?: number;
}

const SLIDE_WIDTH: Record<BannerCarouselProps['id'], number> = {
  'banner-extra': 585,
  'banner-large': 783,
  'banner-medium': 387,
};

/**
 * 원본 ngx-slick-carousel 렌더 결과(.slick-list > .slick-track > li.slick-slide,
 * 앞뒤 clone 슬라이드, .banner-indicator 점)를 재현한 무한 루프 캐러셀.
 */
export default function BannerCarousel({ id, banners, className, autoplayMs = 4000 }: BannerCarouselProps) {
  const width = SLIDE_WIDTH[id];
  const n = banners.length;
  // index는 clone 포함 트랙 기준(1 = 첫 실제 슬라이드)
  const [index, setIndex] = useState(1);
  const [animate, setAnimate] = useState(true);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => {
    if (n <= 1) return;
    setAnimate(true);
    setIndex((i) => i + 1);
  }, [n]);

  useEffect(() => {
    if (n <= 1) return undefined;
    timer.current = setInterval(next, autoplayMs);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [next, autoplayMs, n]);

  // clone 구간 도달 시 애니메이션 없이 실제 위치로 점프 (slick 무한 루프 동작)
  const handleTransitionEnd = () => {
    if (index >= n + 1) {
      setAnimate(false);
      setIndex(1);
    } else if (index <= 0) {
      setAnimate(false);
      setIndex(n);
    }
  };

  const goTo = (realIdx: number) => {
    setAnimate(true);
    setIndex(realIdx + 1);
  };

  const current = ((index - 1) % n + n) % n;
  const track = n > 1 ? [banners[n - 1], ...banners, banners[0]] : banners;
  const offset = n > 1 ? index : 0;

  return (
    <div className={`banner-host ${className ?? ''}`.trim()}>
      <article id={id}>
        <div className="main-banner">
          <ul className="banner-list">
            <div className="carousel slick-initialized slick-slider slick-dotted">
              <div className="slick-list draggable">
                <div
                  className="slick-track"
                  style={{
                    width: track.length * width,
                    transform: `translate3d(${-offset * width}px, 0, 0)`,
                    transition: animate ? 'transform 500ms ease' : 'none',
                  }}
                  onTransitionEnd={handleTransitionEnd}
                >
                  {track.map((b, i) => {
                    const isClone = n > 1 && (i === 0 || i === track.length - 1);
                    const realIdx = n > 1 ? ((i - 1) % n + n) % n : i;
                    return (
                      <li
                        key={`${b.id}-${i}`}
                        className={`slide slick-slide${isClone ? ' slick-cloned' : ''}${!isClone && realIdx === current ? ' slick-current slick-active' : ''}`}
                        style={{ cursor: 'pointer', width }}
                        aria-hidden={isClone || realIdx !== current}
                      >
                        <img width="100%" src={b.imageUrl} alt={b.alt} />
                      </li>
                    );
                  })}
                </div>
              </div>
              {n > 1 && (
                <ul className="banner-indicator" role="tablist">
                  {banners.map((b, i) => (
                    <li key={b.id} className={i === current ? 'slick-active' : ''} role="presentation">
                      <button
                        type="button"
                        role="tab"
                        aria-label={`${i + 1} of ${n}`}
                        aria-selected={i === current}
                        onClick={() => goTo(i)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </ul>
        </div>
      </article>
    </div>
  );
}
