import { Suspense } from 'react';
import RentalcarResultContent from './RentalcarResultContent';

export default function RentalcarSearchResultPage() {
  return (
    <Suspense fallback={null}>
      <RentalcarResultContent />
    </Suspense>
  );
}
