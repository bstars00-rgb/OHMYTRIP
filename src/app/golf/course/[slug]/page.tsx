import { COURSES } from '@/mocks/golf/courses';
import CourseDetailView from '@/components/golf/course/CourseDetailView';

export function generateStaticParams() {
  return COURSES.map((c) => ({ slug: c.slug }));
}

export default async function GolfCoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CourseDetailView slug={slug} />;
}
