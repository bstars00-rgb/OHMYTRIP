import { Suspense } from 'react';
import GolfCheckout from '@/components/golf/checkout/GolfCheckout';

export default function GolfCheckoutPage() {
  return (
    <Suspense fallback={<div className="g-container g-section">Loading checkout…</div>}>
      <GolfCheckout />
    </Suspense>
  );
}
