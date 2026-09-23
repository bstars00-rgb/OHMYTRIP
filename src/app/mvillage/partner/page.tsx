import type { Metadata } from 'next';
import MVillagePartner from '@/components/mvillage/MVillagePartner';

export const metadata: Metadata = {
  title: 'M Village 제휴 문의 — 오마이호텔',
  description: '여행사·기업·MICE·단체 제휴 문의. 한국 브랜드 채널, 그룹 단위 요율, 시즌 공동 기획전을 오마이호텔이 안내합니다.',
};

export default function MVillagePartnerPage() {
  return <MVillagePartner />;
}
