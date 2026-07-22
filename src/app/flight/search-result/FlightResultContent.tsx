'use client';

import { useSearchParams } from 'next/navigation';
import NonHotelResultShell from '@/components/common/NonHotelResultShell';

const TRIP: Record<string, string> = { RT: '왕복', OW: '편도', MC: '다구간' };

export default function FlightResultContent() {
  const p = useSearchParams();
  const dep = p.get('departDate');
  const ret = p.get('returnDate');
  const adult = Number(p.get('adultCount') ?? 1);
  const child = Number(p.get('childCount') ?? 0);
  const infant = Number(p.get('infantCount') ?? 0);
  const pax = [`성인 ${adult}명`];
  if (child) pax.push(`아동 ${child}명`);
  if (infant) pax.push(`유아 ${infant}명`);

  return (
    <NonHotelResultShell
      title="항공 검색 결과"
      rows={[
        { label: '여정', value: TRIP[p.get('tripType') ?? 'RT'] ?? '' },
        { label: '직항 여부', value: p.get('directOnly') === 'true' ? '직항만' : '전체' },
        {
          label: '구간',
          value: `${p.get('originName') ?? ''}(${p.get('origin') ?? ''}) → ${p.get('destinationName') ?? ''}(${p.get('destination') ?? ''})`,
        },
        { label: '여행일정', value: ret ? `${dep} ~ ${ret}` : (dep ?? '') },
        { label: '탑승인원', value: `${pax.join(', ')} / ${p.get('seatClass') ?? '일반석'}` },
      ]}
    />
  );
}
