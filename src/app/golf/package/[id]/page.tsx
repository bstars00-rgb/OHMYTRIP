import { PACKAGES } from '@/mocks/golf/data';
import PackageDetail from '@/components/golf/detail/PackageDetail';

export function generateStaticParams() {
  return PACKAGES.map((p) => ({ id: p.id }));
}

export default async function GolfPackagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PackageDetail id={id} />;
}
