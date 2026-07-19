'use client';

import { useSearchParams } from 'next/navigation';

/** 정적 export 호환을 위해 쿼리는 클라이언트에서 읽는다 (Suspense 하위). */
export default function SearchResultContent() {
  const params = useSearchParams();
  const destination = params.get('destination-regionNameLn');
  const checkIn = params.get('checkInDate');
  const checkOut = params.get('checkOutDate');

  return (
    <section style={{ width: 1200, margin: '65px auto', minHeight: 320 }}>
      <h2 style={{ fontSize: 'var(--f-size-extra)', fontWeight: 600 }}>
        호텔 검색 결과 (Phase 5-1에서 구현)
      </h2>
      <p style={{ marginTop: 20, color: 'var(--c-gray-5)' }}>
        수신한 검색 조건: {destination ?? '-'} / {checkIn ?? '-'} ~ {checkOut ?? '-'}
      </p>
    </section>
  );
}
