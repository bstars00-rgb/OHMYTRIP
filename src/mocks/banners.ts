/**
 * 배너 Mock — 원본 사이트 2026-07 운영 배너를 자리표시 콘텐츠로 사용.
 * 실제 운영 시 CMS(/data/share/...) 연동으로 교체.
 */
export interface Banner {
  id: string;
  imageUrl: string;
  alt: string;
  linkUrl?: string;
}

/** 메인 비주얼 585×433, 5장 */
export const MAIN_BANNERS: Banner[] = [
  { id: 'main-1', imageUrl: '/banners/main-1.png', alt: '메인 배너 1' },
  { id: 'main-2', imageUrl: '/banners/main-2.png', alt: '메인 배너 2' },
  { id: 'main-3', imageUrl: '/banners/main-3.png', alt: '메인 배너 3' },
  { id: 'main-4', imageUrl: '/banners/main-4.png', alt: '메인 배너 4' },
  { id: 'main-5', imageUrl: '/banners/main-5.png', alt: '메인 배너 5' },
];

/** 와이드 배너 783×232 */
export const LARGE_BANNERS: Banner[] = [
  { id: 'wide-1', imageUrl: '/banners/wide-1.jpg', alt: '와이드 배너 1' },
];

/** 프로모션 배너 387×232, 4장 */
export const MEDIUM_BANNERS: Banner[] = [
  { id: 'promo-1', imageUrl: '/banners/promo-1.png', alt: '프로모션 배너 1' },
  { id: 'promo-2', imageUrl: '/banners/promo-2.png', alt: '프로모션 배너 2' },
  { id: 'promo-3', imageUrl: '/banners/promo-3.png', alt: '프로모션 배너 3' },
  { id: 'promo-4', imageUrl: '/banners/promo-4.png', alt: '프로모션 배너 4' },
];
