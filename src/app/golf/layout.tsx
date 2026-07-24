import type { Metadata } from 'next';
import 'pretendard/dist/web/static/pretendard.css';
import '@/styles/ohmygolf.css';
import '@/styles/ohmygolf-pages.css';
import GolfShell from '@/components/golf/layout/GolfShell';

export const metadata: Metadata = {
  title: '오마이트립 골프텔 — Stay. Play. Discover.',
  description: '오마이트립이 엄선한 골프텔 — 호텔과 라운드를 한 번에 예약하세요.',
};

export default function GolfLayout({ children }: { children: React.ReactNode }) {
  return <GolfShell>{children}</GolfShell>;
}
