import { Vote } from '@prisma/client';

export type CachedPost = {
  id: string;
  title: string;
  createdAt: Date;
  authorUsername: string;
  content: string;
  currentVote: Vote['type'] | null;
};
