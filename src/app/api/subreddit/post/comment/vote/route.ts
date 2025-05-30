import { getAuthSession } from '@/lib/auth';
import { db } from '@/lib/db';
import { CommentVoteValidator } from '@/lib/validators/vote';
import { z } from 'zod';

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { commentId, voteType } = CommentVoteValidator.parse(body);

    const session = await getAuthSession();

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 });
    }

    const existingVote = await db.commentVote.findFirst({
      where: {
        commentId,
        userId: session.user.id,
      },
    });

    if (existingVote) {
      if (existingVote.type === voteType) {
        await db.commentVote.delete({
          where: {
            userId_commentId: {
              commentId,
              userId: session.user.id,
            },
          },
        });

        return new Response('Vote removed', { status: 200 });
      }

      await db.commentVote.update({
        where: {
          userId_commentId: {
            commentId,
            userId: session.user.id,
          },
        },
        data: {
          type: voteType,
        },
      });

      return new Response('Ok', { status: 200 });
    }

    await db.commentVote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        commentId,
      },
    });

    return new Response('Ok', { status: 200 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid request data passed', { status: 422 });
    }

    return new Response(
      'Could not register your vote, please try again later.',
      { status: 500 }
    );
  }
}
