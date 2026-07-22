'use client';

import { useSearchParams } from 'next/navigation';
import NonHotelResultShell from '@/components/common/NonHotelResultShell';

export default function ActivityResultContent() {
  const p = useSearchParams();
  return (
    <NonHotelResultShell
      title="액티비티 검색 결과"
      rows={[
        { label: '검색어', value: p.get('keyword') ?? '' },
        { label: '카테고리', value: p.get('category') ?? '전체' },
      ]}
    />
  );
}
