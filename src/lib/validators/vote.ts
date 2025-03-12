import { z } from 'zod';

export const PostVoteValidator = z.object({
  postId: z.string(),
  voteType: z.enum(['UP', 'DOWN']),
});

export type PostVoteRequestPayload = z.infer<typeof PostVoteValidator>;

export const CommentVoteValidator = z.object({
  commentId: z.string(),
  voteType: z.enum(['UP', 'DOWN']),
});

export type CommentVoteRequestPayload = z.infer<typeof CommentVoteValidator>;
