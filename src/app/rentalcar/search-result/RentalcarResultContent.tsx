'use client';

import { useSearchParams } from 'next/navigation';
import NonHotelResultShell from '@/components/common/NonHotelResultShell';

const INS: Record<string, string> = {
  NO: '보험 미포함',
  GN: '일반자차 포함',
  LX: '고급자차 포함',
  PR: '프리미엄자차 포함',
};

export default function RentalcarResultContent() {
  const p = useSearchParams();
  const bday = p.get('driverBirthday');
  return (
    <NonHotelResultShell
      title="렌터카 검색 결과"
      rows={[
        { label: '반납장소', value: p.get('sameReturn') === 'false' ? '반납장소 다름' : '반납장소 같음' },
        { label: '인수/반납 도시', value: `${p.get('pickupName') ?? ''}(${p.get('pickup') ?? ''})` },
        { label: '운전자 생년월일', value: bday ?? '' },
        { label: '인수 일시', value: p.get('pickupDateTime') ?? '' },
        { label: '반납 일시', value: p.get('returnDateTime') ?? '' },
        { label: '차량 보험', value: INS[p.get('insurance') ?? 'NO'] ?? '' },
      ]}
    />
  );
}
