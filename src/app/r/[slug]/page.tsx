import MiniCreatePost from '@/components/mini-create-post';
import PostFeed from '@/components/post-feed';
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config';
import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';

type CommunityPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const CommunityPage = async (props: CommunityPageProps) => {
  const params = await props.params;
  const { slug } = params;

  const session = await getAuthSession();

  const subreddit = await db.subreddit.findFirst({
    where: {
      name: slug,
    },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true,
        },
        orderBy: {
          createdAt: 'desc',
        },

        take: INFINITE_SCROLLING_PAGINATION_RESULTS,
      },
    },
  });

  if (!subreddit) {
    return notFound();
  }

  return (
    <>
      <h1 className="h-1/4 text-3xl font-bold md:text-4xl">
        r/{subreddit.name}
      </h1>
      <MiniCreatePost session={session} />

      <PostFeed initialPosts={subreddit.posts} subredditName={subreddit.name} />
    </>
  );
};

export default CommunityPage;
