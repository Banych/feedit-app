import { Post, Prisma, Subreddit } from '@prisma/client';

export type SearchResults = {
  subreddits:
    | (Subreddit & {
        _count: Prisma.SubredditCountOutputType;
      })[]
    | undefined;
  posts:
    | (Post & {
        _count: Prisma.PostCountOutputType;
        subreddit: Subreddit;
      })[]
    | undefined;
};
