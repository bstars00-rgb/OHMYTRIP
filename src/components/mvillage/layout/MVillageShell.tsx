'use client';

import { useEffect } from 'react';
import MVillageHeader from '@/components/mvillage/layout/MVillageHeader';
import MVillageFooter from '@/components/mvillage/layout/MVillageFooter';

/**
 * M Village 브랜드관 격리 셸.
 * - body에서 omt-desktop/omt-mobile 클래스를 제거해 OHMYTRIP 전역 리셋 차단.
 * - 모든 UI를 .mvillage 스코프 안에 렌더 → OHMYTRIP 클론 / OHMYGOLF 와 무간섭.
 */
export default function MVillageShell({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const body = document.body;
    const prev = body.className;
    body.classList.remove('omt-desktop', 'omt-mobile');
    body.classList.add('mvillage-body');
    return () => {
      body.classList.remove('mvillage-body');
      body.className = prev;
    };
  }, []);

  return (
    <div className="mvillage">
      <MVillageHeader />
      <main>{children}</main>
      <MVillageFooter />
    </div>
  );
}
