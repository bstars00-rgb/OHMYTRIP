'use client';

/* eslint-disable @next/next/no-img-element -- 프로토타입 스톡 이미지 */

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { mvImg } from '@/features/mvillage/images';
import '@/styles/mvillage-banner.css';

/**
 * 오마이트립 메인 홈 → M Village 브랜드관 진입 배너.
 * 롤백: HomeMain/MobileHomeMain 에서 이 컴포넌트 사용 한 줄만 삭제.
 */
export default function MVillageBanner() {
  return (
    <Link href="/mvillage" className="mv-banner" aria-label="M Village 브랜드관 바로가기">
      <span className="mv-banner-new">NEW</span>
      <div className="mv-banner-content">
        <span className="mv-banner-eyebrow">OHMYHOTEL × M VILLAGE</span>
        <span className="mv-banner-logo"><b>M</b> VILLAGE</span>
        <span className="mv-banner-title">
          호텔이 아니라 <span className="accent">베트남 라이프스타일 컬렉션</span>,<br />M Village 브랜드관 오픈
        </span>
        <span className="mv-banner-sub">다낭·하노이·나트랑·달랏 · 6개 라이프스타일 브랜드 · 목적으로 고르는 스테이</span>
        <span className="mv-banner-cta">브랜드관 둘러보기 <ArrowRight size={16} /></span>
      </div>
      <div className="mv-banner-media">
        <img src={mvImg('banner-omt', 'resort')} alt="M Village 베트남 리조트" />
      </div>
    </Link>
  );
}
