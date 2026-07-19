'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * 원본: / 접속 시 /hotel(메인)로 이동.
 * GitHub Pages 정적 배포(output: export)에서는 서버 redirect를 쓸 수 없어
 * 클라이언트 리다이렉트로 구현.
 */
export default function RootPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/hotel');
  }, [router]);
  return null;
}
