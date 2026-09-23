import type { Metadata } from 'next';
import 'pretendard/dist/web/static/pretendard.css';
import '@/styles/mvillage.css';
import '@/styles/mvillage-pages.css';
import MVillageShell from '@/components/mvillage/layout/MVillageShell';

export const metadata: Metadata = {
  title: 'M Village 브랜드관 — 오마이호텔 | A More Meaningful Stay',
  description: '호텔이 아니라 베트남 라이프스타일 컬렉션. 다낭·하노이·나트랑·달랏의 M Village 6개 브랜드를 오마이호텔에서 만나보세요.',
};

export default function MVillageLayout({ children }: { children: React.ReactNode }) {
  return <MVillageShell>{children}</MVillageShell>;
}
