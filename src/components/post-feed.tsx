'use client';

import Post from '@/components/post';
import { INFINITE_SCROLLING_PAGINATION_RESULTS } from '@/config';
import { ExtendedPost } from '@/types/db';
import { useIntersection } from '@mantine/hooks';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ArrowDown, BookCheck, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { FC, useEffect, useRef } from 'react';

type PostFeedProps = {
  initialPosts: ExtendedPost[];
  subredditName?: string;
  userId?: string;
};

const PostFeed: FC<PostFeedProps> = ({
  initialPosts,
  subredditName,
  userId,
}) => {
  const lastPostRef = useRef<HTMLElement | null>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });
  const { data: session } = useSession();

  const { data, fetchNextPage, isFetching, hasNextPage } = useInfiniteQuery({
    queryKey: ['posts-infinite-query', subredditName, userId],
    queryFn: async ({ pageParam = 1 }) => {
      const newQueryParams = new URLSearchParams();
      newQueryParams.append(
        'limit',
        INFINITE_SCROLLING_PAGINATION_RESULTS.toString()
      );
      newQueryParams.append('page', pageParam.toString());
      if (subredditName) {
        newQueryParams.append('subredditName', subredditName);
      }
      if (userId) {
        newQueryParams.append('userId', userId);
      }
      const query = `/api/posts?${newQueryParams.toString()}`;

      const { data } = await axios.get(query);

      return data as ExtendedPost[];
    },
    getNextPageParam: (lastPage, pages, lastPageParams) => {
      if (lastPage.length < INFINITE_SCROLLING_PAGINATION_RESULTS) {
        return undefined;
      }
      return lastPageParams + 1;
    },
    initialPageParam: 1,
    initialData: { pages: [initialPosts], pageParams: [1] },
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage, hasNextPage]);

  const posts = data?.pages.flatMap((page) => page) ?? initialPosts;

  return (
    <ul className="col-span-2 flex flex-col space-y-3 md:space-y-6">
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
      <li className="flex items-center justify-center gap-x-4 text-sm text-zinc-500">
        {isFetching ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Loading more posts...
          </>
        ) : hasNextPage ? (
          <>
            <ArrowDown className="size-4" />
            Scroll down to load more posts
          </>
        ) : (
          <>
            <BookCheck className="size-4" />
            No more posts to load
          </>
        )}
      </li>
    </ul>
  );
};

export default PostFeed;
