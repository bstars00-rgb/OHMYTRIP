import type { Metadata } from 'next';
import 'pretendard/dist/web/static/pretendard.css';
import '@/styles/omt-desktop.css';
import '@/styles/omt-mobile.css';
import '@/styles/omt-components.css';
import '@/styles/omt-page-components.css';
import '@/styles/omt-mobile-components.css';
import '@/styles/app-overrides.css';

export const metadata: Metadata = {
  title: '오마이트립 – 오 내가 찾는 모든 여행',
  description:
    ' 오마이호텔, 오마이트립, 호텔예약, 항공권예약, 일본여행, 베트남여행, 국내여행 하나투어, 모두투어, 여행박사, 인터파크투어, 야놀자, 아고다, 익스피디아, 여기어때, 트립닷컴',
  openGraph: {
    type: 'website',
    siteName: '오마이트립 – 오 내가 찾는 모든 여행',
    title: '오마이트립 – 오 내가 찾는 모든 여행',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/brand/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/brand/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      {/* 기본은 데스크톱 스코프 — usePlatform이 UA 판별 후 omt-mobile로 교체 */}
      <body className="omt-desktop">{children}</body>
    </html>
  );
}
