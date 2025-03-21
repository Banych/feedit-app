import { db } from '@/lib/db';
import { z } from 'zod';

export async function GET(req: Request) {
  const url = new URL(req.url);

  try {
    const { limit, page, userId, postId } = z
      .object({
        limit: z.string(),
        page: z.string(),
        userId: z.string().nullish().optional(),
        postId: z.string().nullish().optional(),
      })
      .parse({
        userId: url.searchParams.get('userId'),
        postId: url.searchParams.get('postId'),
        limit: url.searchParams.get('limit'),
        page: url.searchParams.get('page'),
      });

    let whereClause = {};

    if (userId) {
      whereClause = {
        authorId: userId,
      };
    } else if (postId) {
      whereClause = {
        postId,
      };
    }

    const comments = await db.comment.findMany({
      where: whereClause,
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: true,
        Post: {
          include: {
            subreddit: true,
          },
        },
        votes: {
          include: {
            user: true,
          },
        },
        replies: true,
      },
    });

    return new Response(JSON.stringify(comments), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 200,
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid request data passed', { status: 422 });
    }
    console.log(error);
    return new Response('Could not fetch more comments', {
      status: 500,
    });
  }
}
