'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * 예약확인 — 원본은 로그인 필요 영역(비로그인 접근 시 로그인 유도로 추정 — 미검증 UNKNOWN).
 * Mock 단계에서는 로그인 페이지로 이동한다.
 */
export default function BookingHistoryPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/login');
  }, [router]);
  return null;
}
