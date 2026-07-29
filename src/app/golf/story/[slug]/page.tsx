import { STORIES } from '@/mocks/golf/stories';
import StoryArticle from '@/components/golf/story/StoryArticle';

export function generateStaticParams() {
  return STORIES.map((s) => ({ slug: s.slug }));
}

export default async function GolfStoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <StoryArticle slug={slug} />;
}
