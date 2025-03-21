import {
  Comment,
  CommentVote,
  Post,
  Subreddit,
  User,
  Vote,
} from '@prisma/client';

export type ExtendedPost = Post & {
  subreddit: Subreddit;
  votes: Vote[];
  author: User;
  comments: Comment[];
};

export type ExtendedComment = Comment & {
  Post: Post & { subreddit: Subreddit };
  votes: CommentVote[];
  replies: Comment[];
  author: User;
};
