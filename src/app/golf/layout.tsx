import type { Metadata } from 'next';
import { Playfair_Display } from 'next/font/google';
import '@/styles/ohmygolf.css';
import '@/styles/ohmygolf-pages.css';
import GolfShell from '@/components/golf/layout/GolfShell';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'OHMYGOLF — Stay. Play. Discover.',
  description: 'Handpicked golf resorts, hotels and tee times in one seamless trip.',
};

export default function GolfLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={playfair.variable} style={{ ['--g-serif' as string]: `var(--font-playfair), 'Noto Serif KR', Georgia, serif` }}>
      <GolfShell>{children}</GolfShell>
    </div>
  );
}
