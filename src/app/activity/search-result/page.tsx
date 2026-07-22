import { Suspense } from 'react';
import ActivityResultContent from './ActivityResultContent';

export default function ActivitySearchResultPage() {
  return (
    <Suspense fallback={null}>
      <ActivityResultContent />
    </Suspense>
  );
}
