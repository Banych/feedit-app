import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { PostValidator } from '@/lib/validators/post';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const body = await req.json();

    const { subredditId, title, content, postId } = PostValidator.parse(body);

    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id,
      },
    });

    if (!subscriptionExists) {
      return new Response('You are not subscribed to this subreddit.', {
        status: 400,
      });
    }

    if (postId) {
      const existingPost = await db.post.findFirst({
        where: {
          id: postId,
        },
        select: {
          id: true,
          authorId: true,
          subredditId: true,
        },
      });

      if (!existingPost) {
        return new Response('Post does not exist', { status: 404 });
      }

      if (existingPost.authorId !== session.user.id) {
        return new Response('You are not the author of this post', {
          status: 403,
        });
      }

      if (existingPost.subredditId !== subredditId) {
        return new Response('Post does not belong to this subreddit', {
          status: 400,
        });
      }

      await db.post.update({
        where: {
          id: postId,
        },
        data: {
          content,
        },
      });
    } else {
      await db.post.create({
        data: {
          title,
          content,
          authorId: session.user.id,
          subredditId,
        },
      });
    }

    return new Response('OK', { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid request data passed', { status: 422 });
    }

    return new Response(
      'Could not post to subreddit at this time, please try again later.',
      { status: 500 }
    );
  }
}
