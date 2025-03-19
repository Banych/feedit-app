import { db } from '@/lib/db';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const searchQuery = url.searchParams.get('q');

  if (!searchQuery) {
    return new Response('Missing search query', {
      status: 400,
    });
  }

  const results = await db.subreddit.findMany({
    where: {
      name: {
        startsWith: searchQuery,
      },
    },
    include: {
      _count: true,
    },
    take: 5,
  });

  return new Response(JSON.stringify(results), { status: 200 });
}
