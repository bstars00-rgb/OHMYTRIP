import { Suspense } from 'react';
import GolfSearch from '@/components/golf/search/GolfSearch';

export default function GolfSearchPage() {
  return (
    <Suspense fallback={<div className="g-container g-section">Loading golf packages…</div>}>
      <GolfSearch />
    </Suspense>
  );
}
