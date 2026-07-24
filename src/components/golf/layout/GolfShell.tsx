'use client';

import { useEffect } from 'react';
import GolfHeader from '@/components/golf/layout/GolfHeader';
import GolfFooter from '@/components/golf/layout/GolfFooter';
import { GolfProviders } from '@/features/golf/GolfProviders';

/**
 * OHMYGOLF 격리 셸.
 * - body에서 omt-desktop/omt-mobile 클래스를 제거해 OHMYTRIP 전역 리셋 차단.
 * - 모든 골프 UI를 .ohmygolf 스코프 안에 렌더.
 */
export default function GolfShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const body = document.body;
    const prev = body.className;
    body.classList.remove('omt-desktop', 'omt-mobile');
    body.classList.add('ohmygolf-body');
    return () => {
      body.classList.remove('ohmygolf-body');
      body.className = prev;
    };
  }, []);

  return (
    <GolfProviders>
      <div className="ohmygolf">
        <GolfHeader />
        <main>{children}</main>
        <GolfFooter />
      </div>
    </GolfProviders>
  );
}
