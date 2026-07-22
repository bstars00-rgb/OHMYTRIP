import { Suspense } from 'react';
import FlightResultContent from './FlightResultContent';

export default function FlightSearchResultPage() {
  return (
    <Suspense fallback={null}>
      <FlightResultContent />
    </Suspense>
  );
}
