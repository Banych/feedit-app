'use client';

import { ExtendedPost } from '@/types/db';
import { FC, useEffect, useRef } from 'react';
import { useIntersection } from '@mantine/hooks';
import { useInfiniteQuery } from '@tanstack/react-query';
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Post from '@/components/post';
import { Loader2 } from 'lucide-react';

type PostFeedProps = {
  initialPosts: ExtendedPost[];
  subredditName?: string;
};

const PostFeed: FC<PostFeedProps> = ({ initialPosts, subredditName }) => {
  const lastPostRef = useRef<HTMLElement | null>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });
  const { data: session } = useSession();

  const { data, fetchNextPage, isFetching } = useInfiniteQuery(
    ['infinite-query'],
    async ({ pageParam = 1 }) => {
      const query =
        `/api/posts?limit=${INFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}` +
        (!!subredditName ? `&subredditName=${subredditName}` : '');

      const { data } = await axios.get(query);

      return data as ExtendedPost[];
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: { pages: [initialPosts], pageParams: [1] },
    }
  );

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  const posts = data?.pages.flatMap((page) => page) ?? initialPosts;

  return (
    <ul className="col-span-2 flex flex-col space-y-6">
      {posts.map((post, index) => {
        const votesAmount = post.votes.reduce((acc, vote) => {
          if (vote.type === 'UP') {
            return acc + 1;
          }
          if (vote.type === 'DOWN') {
            return acc - 1;
          }
          return acc;
        }, 0);

        const currentVote = post.votes.find(
          (vote) => vote.userId === session?.user.id
        );

        if (index === posts.length - 1) {
          return (
            <li key={post.id} ref={ref}>
              <Post
                commentAmount={post.comments.length}
                subredditName={post.subreddit.name}
                post={post}
                votesAmount={votesAmount}
                currentVote={currentVote}
              />
            </li>
          );
        } else {
          return (
            <li key={post.id}>
              <Post
                subredditName={post.subreddit.name}
                post={post}
                votesAmount={votesAmount}
                currentVote={currentVote}
                commentAmount={post.comments.length}
              />
            </li>
          );
        }
      })}
      {isFetching && (
        <div className="flex items-center justify-center gap-x-4 text-sm text-zinc-500">
          <Loader2 className="size-4 animate-spin" />
          Loading more posts...
        </div>
      )}
    </ul>
  );
};

export default PostFeed;
