import { db } from '@/lib/db';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const searchQuery = url.searchParams.get('q');

  if (!searchQuery) {
    return new Response('Missing search query', {
      status: 400,
    });
  }

  const subreddits = await db.subreddit.findMany({
    where: {
      name: {
        contains: searchQuery,
      },
    },
    include: {
      _count: true,
    },
    take: 5,
  });

  const posts = await db.post.findMany({
    where: {
      title: {
        contains: searchQuery,
      },
    },
    include: {
      _count: true,
      subreddit: true,
    },
    take: 5,
  });

  const results = {
    subreddits,
    posts,
  };

  return new Response(JSON.stringify(results), { status: 200 });
}
