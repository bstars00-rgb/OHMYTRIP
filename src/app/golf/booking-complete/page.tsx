import { Suspense } from 'react';
import BookingComplete from '@/components/golf/checkout/BookingComplete';

export default function GolfBookingCompletePage() {
  return (
    <Suspense fallback={<div className="g-container g-section">Loading…</div>}>
      <BookingComplete />
    </Suspense>
  );
}
