'use client';

import { useEffect, useState } from 'react';

export type Platform = 'desktop' | 'mobile';

const MOBILE_UA = /Android|iPhone|iPad|iPod|Mobile|BlackBerry|Opera Mini/i;

/**
 * 원본 사이트는 CloudFront가 UA로 www(데스크톱)/m(모바일)을 분기한다.
 * 클론은 단일 배포이므로 클라이언트에서 UA를 판별해 트리를 전환한다.
 * SSR/정적 HTML은 데스크톱 기준 → 모바일 기기에서는 hydration 후 교체된다.
 */
export function usePlatform(): Platform {
  const [platform, setPlatform] = useState<Platform>('desktop');

  useEffect(() => {
    const isMobile =
      MOBILE_UA.test(navigator.userAgent) ||
      // iPadOS 13+는 데스크톱 UA를 쓰므로 터치 지원으로 보조 판별
      (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- UA는 마운트 후에만 알 수 있다
    setPlatform(isMobile ? 'mobile' : 'desktop');
  }, []);

  // 플랫폼 스코프 CSS 전환 (body.omt-desktop ↔ body.omt-mobile)
  useEffect(() => {
    document.body.classList.toggle('omt-mobile', platform === 'mobile');
    document.body.classList.toggle('omt-desktop', platform === 'desktop');
    return () => {
      document.body.classList.remove('omt-mobile');
      document.body.classList.add('omt-desktop');
    };
  }, [platform]);

  return platform;
}
