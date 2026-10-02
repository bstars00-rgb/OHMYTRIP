import { BRANDS } from '@/mocks/mvillage/data';
import MVillageBrand from '@/components/mvillage/MVillageBrand';

export function generateStaticParams() {
  return BRANDS.map((b) => ({ key: b.key }));
}

export default async function MVillageBrandPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  return <MVillageBrand brandKey={key} />;
}
