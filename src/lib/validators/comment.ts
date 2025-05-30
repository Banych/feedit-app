import { z } from 'zod';

export const PostCommentValidator = z.object({
  postId: z.string(),
  text: z.string(),
  replyToId: z.string().optional(),
});

export type PostCommentPayload = z.infer<typeof PostCommentValidator>;
