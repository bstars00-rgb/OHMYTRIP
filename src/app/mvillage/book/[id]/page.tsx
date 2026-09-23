import { PROPERTIES } from '@/mocks/mvillage/data';
import MVillageBooking from '@/components/mvillage/MVillageBooking';

export function generateStaticParams() {
  return PROPERTIES.map((p) => ({ id: p.id }));
}

export default async function MVillageBookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MVillageBooking id={id} />;
}
